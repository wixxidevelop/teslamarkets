import axios from 'axios';

// ImgBB API configuration
// IMPORTANT: Replace this with your actual ImgBB API key from https://imgbb.com/
// This is a placeholder key - you need to:
// 1. Go to https://imgbb.com/
// 2. Sign up for a free account
// 3. Get your API key from your profile
// 4. Replace the key below
const IMGBB_API_KEY = '96d8b70f68d3ca4bdcf805f188695b6b'; // Get your free API key from imgbb.com
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

/**
 * Upload image to ImgBB and return the URL
 * @param {File} imageFile - The image file to upload
 * @param {string} imageName - Optional name for the image
 * @returns {Promise<string>} - Promise that resolves to the image URL
 */
export const uploadImageToImgBB = async (imageFile, imageName = 'tesla-product') => {
  try {
    // Check if API key is configured
    if (!IMGBB_API_KEY || IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
      return {
        success: false,
        error: 'ImgBB API key not configured. Please get your free API key from imgbb.com and update utils/imgbbUpload.js'
      };
    }
    
    // Convert file to base64
    const base64 = await convertFileToBase64(imageFile);
    
    // Create form data
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64);
    formData.append('name', imageName);
    
    // Upload to ImgBB
    const response = await axios.post(IMGBB_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data && response.data.success) {
      return {
        success: true,
        url: response.data.data.display_url,
        deleteUrl: response.data.data.delete_url,
        data: response.data.data
      };
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    };
  }
};

/**
 * Convert File object to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Promise that resolves to base64 string
 */
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the data:image/jpeg;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Get placeholder image URL based on product type
 * @param {string} type - Product type (car, home, etc.)
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (type) => {
  const placeholders = {
    car: '/model3/model3-1.jpg',
    home: '/solarroof/solarroof-1.jpg',
    default: '/model3/model3-1.jpg'
  };
  
  return placeholders[type] || placeholders.default;
};