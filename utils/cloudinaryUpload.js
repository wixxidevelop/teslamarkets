// Cloudinary image upload utility
// Free tier: 25 credits/month, 25GB storage, 25GB bandwidth

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/demo/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Using demo preset for testing

/**
 * Upload image to Cloudinary
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} - Promise that resolves to the image URL
 */
export const uploadImageToCloudinary = async (imageFile) => {
  try {
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Please upload a valid image file.');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (imageFile.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 10MB.');
    }

    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'tesla-shop'); // Organize uploads in a folder
    
    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error('No image URL returned from Cloudinary');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Get placeholder image URL
 * @param {string} type - Product type ('car' or 'house')
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (type = 'car') => {
  const placeholders = {
    car: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    house: 'https://res.cloudinary.com/demo/image/upload/v1652366604/samples/house-sample.jpg'
  };
  
  return placeholders[type] || placeholders.car;
};

/**
 * Alternative upload using uploadcare.com (no API key required)
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} - Promise that resolves to the image URL
 */
export const uploadImageToUploadcare = async (imageFile) => {
  try {
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Please upload a valid image file.');
    }

    // Validate file size (max 100MB for Uploadcare)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (imageFile.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 100MB.');
    }

    // Create FormData for upload
    const formData = new FormData();
    formData.append('UPLOADCARE_PUB_KEY', 'demopublickey'); // Demo public key
    formData.append('file', imageFile);
    
    // Upload to Uploadcare
    const response = await fetch('https://upload.uploadcare.com/base/', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    if (!data.file) {
      throw new Error('No file ID returned from Uploadcare');
    }

    // Return the CDN URL
    return `https://ucarecdn.com/${data.file}/`;
  } catch (error) {
    console.error('Uploadcare upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Default export uses Uploadcare as it's more reliable without API keys
export default uploadImageToUploadcare;