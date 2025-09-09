import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { uploadImageToImgBB } from '../utils/imgbbUpload'

export default function ProductEditForm({ product, onSubmit, onCancel }) {
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

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        type: product.type || 'car',
        price: product.price || '',
        description: product.description || '',
        image: product.image || '',
        specs: {
          range: product.specs?.range || '',
          acceleration: product.specs?.acceleration || '',
          topSpeed: product.specs?.topSpeed || '',
          bedrooms: product.specs?.bedrooms || '',
          bathrooms: product.specs?.bathrooms || '',
          sqft: product.specs?.sqft || ''
        },
        features: product.features || []
      })
      setImagePreview(product.image || '')
    }
  }, [product])

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
        setFormData(prev => ({ ...prev, image: file })) // Store file object for upload
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
    
    try {
      setUploading(true)
      let imageUrl = formData.image
      
      // Upload new image to ImgBB if user selected one
      if (formData.image && typeof formData.image !== 'string') {
        const uploadResult = await uploadImageToImgBB(formData.image, `tesla-${formData.title.replace(/\s+/g, '-').toLowerCase()}`)
        if (uploadResult.success) {
          imageUrl = uploadResult.url
          setUploadSuccess(true)
        } else {
          setErrors({ image: uploadResult.error })
          setUploading(false)
          setIsLoading(false)
          return
        }
      } else if (!imageUrl) {
        // Use placeholder if no image
        imageUrl = getPlaceholderImage(formData.type)
      }
      
      const updatedProduct = {
        ...product,
        ...formData,
        price: parseFloat(formData.price),
        image: imageUrl
      }
      
      // Remove the File object from the product data to avoid serialization issues
      if (typeof updatedProduct.image !== 'string') {
        delete updatedProduct.image
        updatedProduct.image = imageUrl
      }
      
      await onSubmit(updatedProduct)
      setUploading(false)
      
    } catch (error) {
      console.error('Error updating product:', error)
      setErrors({ submit: 'Failed to update product. Please try again.' })
      setUploading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Edit Product</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-sm">Uploading to Uploadcare...</p>
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
                  <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs ${
                    uploadSuccess ? 'bg-green-600/90 text-white' : 'bg-black/70 text-white'
                  }`}>
                    {uploadSuccess ? '✓ Uploaded to Uploadcare' : (imagePreview === product?.image ? 'Original Image' : 'New Image')}
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
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm opacity-80">Default placeholder will be used</p>
                      <p className="text-xs opacity-60 mt-1">Upload an image to customize</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}
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
                Updating Product...
              </div>
            ) : (
              'Update Product'
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