jest.mock('../../services/cloudinaryService', () => ({
    uploadImage: jest.fn().mockImplementation((file) => {
      if (!file) return null;
      return 'https://res.cloudinary.com/mock/image/upload/test.jpg';
    }),
    deleteImage: jest.fn().mockResolvedValue(true),
  }));