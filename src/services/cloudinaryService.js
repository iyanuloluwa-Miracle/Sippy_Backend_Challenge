const cloudinary = require('cloudinary').v2;

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
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'task-management',
                use_filename: true
            });
            return result;
        } catch (error) {
            throw new Error('Error uploading image to Cloudinary');
        }
    }

    async deleteImage(imageUrl) {
        try {
            const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(`task-management/${publicId}`);
        } catch (error) {
            throw new Error('Error deleting image from Cloudinary');
        }
    }
}

module.exports = new CloudinaryService();
