import { useState } from 'react'
import { motion } from 'framer-motion'
import { uploadImageToImgBB } from '../utils/imgbbUpload'
import { UploadButton } from '@uploadthing/react'

export default function ProductUploadForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'car',
    price: '',
    description: '',
    image: '',
    specs: {
      range: '',
      acceleration: '',
      topSpeed: '',
      bedrooms: '',
      bathrooms: '',
      sqft: ''
    },
    features: []
  })
  const [imagePreview, setImagePreview] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = (res) => {
    if (res && res[0]) {
      const uploadedFile = res[0]
      setImagePreview(uploadedFile.url)
      setFormData(prev => ({ ...prev, image: uploadedFile.url }))
      setUploadSuccess(true)
      setErrors(prev => ({ ...prev, image: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Basic file validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPEG, PNG, WebP)' }))
        return
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 10MB' }))
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setImagePreview(imageUrl)
        setFormData(prev => ({ ...prev, image: file }))
        setErrors(prev => ({ ...prev, image: '' }))
      }
      reader.readAsDataURL(file)
      setUploadSuccess(false) // Reset upload success when new image is selected
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    // Image is now optional - will use placeholder if not provided
    
    if (formData.type === 'car') {
      if (!formData.specs.range) newErrors['specs.range'] = 'Range is required for vehicles'
      if (!formData.specs.acceleration) newErrors['specs.acceleration'] = 'Acceleration is required for vehicles'
    } else {
      if (!formData.specs.bedrooms) newErrors['specs.bedrooms'] = 'Bedrooms is required for homes'
      if (!formData.specs.sqft) newErrors['specs.sqft'] = 'Square footage is required for homes'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setUploading(true)
    
    try {
      // Generate a unique ID and set placeholder image if none provided
      const placeholderImage = formData.type === 'car' 
        ? '/model3/model3-hero-desktop.jpg' 
        : '/solarroof/roof-hero-desktop.jpg'
      
      let imageUrl = placeholderImage
      
      // Use uploaded image URL if available
      if (formData.image && typeof formData.image === 'string' && formData.image.startsWith('http')) {
        imageUrl = formData.image
      } else if (formData.image && typeof formData.image !== 'string') {
        // Upload image using ImgBB
        const uploadResult = await uploadImageToImgBB(formData.image, `tesla-${formData.title.replace(/\s+/g, '-').toLowerCase()}`)
        if (uploadResult.success) {
          imageUrl = uploadResult.url
          setUploadSuccess(true)
        } else {
          setErrors(prev => ({ ...prev, image: uploadResult.error }))
          setIsLoading(false)
          setUploading(false)
          return
        }
      }
      
      const newProduct = {
        ...formData,
        id: Date.now().toString(),
        price: parseFloat(formData.price),
        image: imageUrl // This should override formData.image
      }
      
      // Remove the File object from the product data to avoid serialization issues
      delete newProduct.image
      newProduct.image = imageUrl
      
      await onSubmit(newProduct)
      
      // Reset form
      setFormData({
        title: '',
        type: 'car',
        price: '',
        description: '',
        image: '',
        specs: {
          range: '',
          acceleration: '',
          topSpeed: '',
          bedrooms: '',
          bathrooms: '',
          sqft: ''
        },
        features: []
      })
      setImagePreview('')
      setNewFeature('')
      setUploadSuccess(false)
      
    } catch (error) {
      console.error('Error submitting product:', error)
      setErrors(prev => ({ ...prev, submit: 'Failed to create product. Please try again.' }))
    } finally {
      setIsLoading(false)
      setUploading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white ${
                errors.title ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter product title"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white"
            >
              <option value="car">Vehicle</option>
              <option value="house">Home</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white ${
              errors.price ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter price"
            min="0"
            step="0.01"
          />
          {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter product description"
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Product Image (Optional)
          </label>
          <div className="space-y-4">
            {/* UploadThing Upload Button */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <UploadButton
                endpoint="productImageUploader"
                onClientUploadComplete={handleImageUpload}
                onUploadError={(error) => {
                  setErrors(prev => ({ ...prev, image: `Upload failed: ${error.message}` }))
                }}
                appearance={{
                  button: "bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors duration-300",
                  container: "w-full flex justify-center",
                  allowedContent: "text-gray-400 text-sm mt-2"
                }}
              />
            </div>
            
            {/* Fallback file input */}
            <div className="text-center text-gray-400 text-sm">
              <span>Or use traditional upload:</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.image ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            <div className={`relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed transition-all duration-300 ${
              uploading 
                ? 'border-blue-500 bg-blue-900/20' 
                : errors.image 
                  ? 'border-red-500 bg-red-900/20'
                  : uploadSuccess
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-gray-600 bg-gray-800'
            }`}>
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-sm font-semibold text-blue-400">Uploading to UploadThing...</p>
                    <p className="text-xs text-gray-400 mt-1">Please wait</p>
                  </div>
                </div>
              ) : imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setFormData(prev => ({ ...prev, image: '' }))
                      setUploadSuccess(false)
                    }}
                    disabled={uploading}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs flex items-center ${
                    uploadSuccess ? 'bg-green-600/90 text-white' : 'bg-black/70 text-white'
                  }`}>
                    {uploadSuccess && (
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {uploadSuccess ? 'Uploaded to UploadThing' : 'Custom Image'}
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={formData.type === 'car' ? '/model3/model3-hero-desktop.jpg' : '/solarroof/roof-hero-desktop.jpg'}
                    alt="Default placeholder"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-center text-white">
                      <svg className={`w-12 h-12 mx-auto mb-2 opacity-60 ${
                        errors.image ? 'text-red-400' : 'text-white'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm opacity-80">Default placeholder will be used</p>
                      <p className="text-xs opacity-60 mt-1">Upload an image to customize (MAX. 4MB)</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {errors.image && (
              <div className="flex items-center text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.image}
              </div>
            )}
            {uploadSuccess && !errors.image && (
              <div className="flex items-center text-green-400 text-sm bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Image uploaded successfully! Ready to add product.
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.type === 'car' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Range *
                  </label>
                  <input
                    type="text"
                    name="specs.range"
                    value={formData.specs.range}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white ${
                      errors['specs.range'] ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="e.g., 405 miles"
                  />
                  {errors['specs.range'] && <p className="text-red-400 text-sm mt-1">{errors['specs.range']}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    0-60 mph *
                  </label>
                  <input
                    type="text"
                    name="specs.acceleration"
                    value={formData.specs.acceleration}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white ${
                      errors['specs.acceleration'] ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="e.g., 3.1s"
                  />
                  {errors['specs.acceleration'] && <p className="text-red-400 text-sm mt-1">{errors['specs.acceleration']}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Top Speed
                  </label>
                  <input
                    type="text"
                    name="specs.topSpeed"
                    value={formData.specs.topSpeed}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white"
                    placeholder="e.g., 200 mph"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    name="specs.bedrooms"
                    value={formData.specs.bedrooms}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white ${
                      errors['specs.bedrooms'] ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Number of bedrooms"
                    min="0"
                  />
                  {errors['specs.bedrooms'] && <p className="text-red-400 text-sm mt-1">{errors['specs.bedrooms']}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="specs.bathrooms"
                    value={formData.specs.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white"
                    placeholder="Number of bathrooms"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Square Footage *
                  </label>
                  <input
                    type="text"
                    name="specs.sqft"
                    value={formData.specs.sqft}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white ${
                      errors['specs.sqft'] ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="e.g., 2,500 sq ft"
                  />
                  {errors['specs.sqft'] && <p className="text-red-400 text-sm mt-1">{errors['specs.sqft']}</p>}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white"
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
              >
                Add
              </button>
            </div>
            
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <motion.button
            type="submit"
            disabled={isLoading || uploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Uploading Image...
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Adding Product...
              </div>
            ) : (
              'Add Product'
            )}
          </motion.button>
          
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-semibold border border-gray-700"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}