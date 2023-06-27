/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postExportMusicsHandler(request, h) {
    try {
      this._validator.validateExportMusicsPayload(request.payload);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      // const userId = request.auth.credentials.id;

      // await this._service.getPlaylistsHandler(userId);

      await this._service.sendMessage('export:musics', JSON.stringify(message));
      // await this._service.sendMessage('export:notes', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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

module.exports = ExportsHandler;
