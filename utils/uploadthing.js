import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

// Upload utility class for UploadThing integration
class UploadThingService {
  static async uploadImage(file) {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (4MB max)
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 4MB');
      }

      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/uploadthing', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      if (result && result[0] && result[0].url) {
        return {
          success: true,
          url: result[0].url,
          key: result[0].key,
          name: result[0].name,
          size: result[0].size
        };
      } else {
        throw new Error('Invalid response format from UploadThing');
      }
    } catch (error) {
      console.error('UploadThing upload error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }

  static async deleteImage(key) {
    try {
      if (!key) {
        throw new Error('No file key provided');
      }

      const response = await fetch('/api/uploadthing', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      console.error('UploadThing delete error:', error);
      return {
        success: false,
        error: error.message || 'Delete failed'
      };
    }
  }

  // Utility method to validate image files
  static validateImageFile(file) {
    const errors = [];

    if (!file) {
      errors.push('No file selected');
      return errors;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image');
    }

    // Check file size (4MB max)
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File size must be less than 4MB');
    }

    // Check supported formats
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      errors.push('Supported formats: JPEG, PNG, WebP');
    }

    return errors;
  }
}

// Generate UploadThing components
export const UploadButton = generateUploadButton({
  endpoint: "productImageUploader",
});

export const UploadDropzone = generateUploadDropzone({
  endpoint: "productImageUploader",
});

export default UploadThingService;