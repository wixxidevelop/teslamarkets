# ImgBB Image Upload Setup

This Tesla admin panel uses ImgBB API for cloud image storage. Follow these steps to set it up:

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Your Free ImgBB API Key
1. Go to [https://imgbb.com/](https://imgbb.com/)
2. Click "Sign Up" (it's completely free)
3. After signing up, go to your profile/settings
4. Find your API key in the dashboard

### Step 2: Configure the API Key
1. Open `utils/imgbbUpload.js`
2. Replace `YOUR_IMGBB_API_KEY_HERE` with your actual API key
3. Save the file

```javascript
// Before
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY_HERE';

// After (example)
const IMGBB_API_KEY = 'abc123def456ghi789';
```

## ✨ Features

- **Free Cloud Storage**: Images are stored on ImgBB's servers
- **Automatic Upload**: Images are uploaded when creating/editing products
- **Success Notifications**: Visual feedback when images are uploaded
- **Fallback Support**: Uses placeholder images if no custom image is uploaded
- **Progress Indicators**: Shows upload progress with loading animations

## 🔧 How It Works

1. **Upload Process**: When you select an image in the admin panel, it gets uploaded to ImgBB
2. **URL Storage**: The returned ImgBB URL is saved with your product
3. **Display**: Images are served from ImgBB's CDN for fast loading
4. **Backup**: If upload fails, the system falls back to placeholder images

## 🛠️ Troubleshooting

**"ImgBB API key not configured" error?**
- Make sure you've replaced `YOUR_IMGBB_API_KEY_HERE` with your actual API key
- Check that there are no extra spaces or quotes around the key

**Upload failing?**
- Verify your API key is correct
- Check your internet connection
- Ensure image file is under 32MB

**Need help?**
- ImgBB is free and supports up to 32MB images
- No daily upload limits on free accounts
- Images are permanently stored (unless you delete them)

## 📝 Notes

- Images are uploaded with names like `product-title-timestamp`
- The system handles both new uploads and existing images
- All image formats supported by ImgBB work (.jpg, .png, .gif, .bmp)
- Upload progress is shown with loading animations
- Success confirmation appears when upload completes