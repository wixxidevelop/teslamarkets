import { createUploadthing } from "uploadthing/next-legacy";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);
    
    return { message: err.message };
  },
});

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  productImageUploader: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1,
      minFileCount: 1
    } 
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
      // This code runs on your server before upload
      // Add any authentication logic here if needed
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { 
        uploadedBy: "admin",
        timestamp: new Date().toISOString()
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for user:", metadata.uploadedBy);
      console.log("File URL:", file.url);
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("Upload timestamp:", metadata.timestamp);
      
      // Return data to the client
      return { 
        uploadedBy: metadata.uploadedBy, 
        url: file.url,
        name: file.name,
        size: file.size,
        key: file.key
      };
    }),
};

export default ourFileRouter;