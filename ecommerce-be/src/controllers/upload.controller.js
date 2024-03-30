'use strict';

const {
  uploadImagesFromUrl,
  uploadImagesFromLocal,
} = require('../services/upload.service');
const catchAsync = require('../utils/catchAsync');
const {
  OkResponse,
  CreatedResponse,
  SuccessReponse,
} = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');

class UploadController {
  uploadFile = catchAsync(async (req, res, next) => {
    new SuccessReponse({
      message: 'Upload successfully',
      data: await uploadImagesFromUrl(),
    }).send(res);
  });

  uploadFileThumb = catchAsync(async (req, res, next) => {
    const { file } = req;

    if (!file) throw new BadRequestError('File missing!');

    new SuccessReponse({
      message: 'Upload successfully',
      data: await uploadImagesFromLocal({
        filePath: file.path,
      }),
    }).send(res);
  });
}

module.exports = new UploadController();
