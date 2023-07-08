const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id: albumId } = request.params;

      this.validator.validateImageHeaders(cover.hapi.headers);

      const filename = await this.service.writeFile(cover, cover.hapi);
      const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/${filename}`;

      await this.service.addCover(albumId, coverUrl);

      console.log(coverUrl);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UploadsHandler;
