'use strict';

const cloudinary = require('../configs/cloudinary.config');

// 1. Upload from url image
const uploadImagesFromUrl = async () => {
  try {
    const urlImage =
      'https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/59c7ff505a11392c57392835f42d8425?_a=AQAEufR';
    const folderName = 'product/shopId';
    const newFileName = 'test-file-name';

    const res = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });

    console.log(res);

    return res;
  } catch (error) {
    console.log('ERROR::', error);
  }
};

// 2. Upload image from local
const uploadImagesFromLocal = async ({
  filePath,
  folderName = 'product/8049',
}) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      public_id: 'thumb',
      folder: folderName,
    });

    console.log(res);

    return {
      image_url: res.secure_url,
      shopId: 8049,
      thumb_url: cloudinary.url(res.public_id, {
        width: 100,
        height: 100,
        format: 'jpg',
      }),
    };
  } catch (error) {
    console.log('ERROR::', error);
  }
};

// 3.

module.exports = {
  uploadImagesFromUrl,
  uploadImagesFromLocal,
};
