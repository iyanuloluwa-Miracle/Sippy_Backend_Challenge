const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Add this to ensure env vars are loaded


class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    async uploadImage(file) {
        try {
            if (!file) {
                return null;
            }
            
            // If we have a file path (from multer disk storage)
            if (file.path) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'task-management',
                    use_filename: true
                });
                return result.secure_url;
            } 
            // If we have a buffer (from multer memory storage)
            else if (file.buffer) {
                // Convert buffer to base64
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;
                
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'task-management',
                    resource_type: 'auto'
                });
                return result.secure_url;
            }
            
            throw new Error('Invalid file format');
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
        }
    }

    async deleteImage(imageUrl) {
        try {
            if (!imageUrl) return;
            
            // Extract the public ID from the URL
            // Format: https://res.cloudinary.com/cloud_name/image/upload/folder/public_id.extension
            const splitUrl = imageUrl.split('/');
            const filename = splitUrl[splitUrl.length - 1];
            // Remove extension
            const publicId = filename.substring(0, filename.lastIndexOf('.'));
            
            // Include folder in public ID
            const folder = splitUrl[splitUrl.length - 2];
            const fullPublicId = `${folder}/${publicId}`;
            
            const result = await cloudinary.uploader.destroy(fullPublicId);
            return result;
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
        }
    }
}

module.exports = new CloudinaryService();