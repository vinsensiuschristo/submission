const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, playlistService, validator) {
    this.service = service;
    this.validator = validator;
    this.playlistService = playlistService;

    autoBind(this);
  }

  async postExportMusicsHandler(request, h) {
    try {
      this.validator.validateExportMusicsPayload(request.payload);

      const userId = request.auth.credentials.id;
      const { id: playlistId } = request.params;

      await this.playlistService.verifyPlaylistOwner(playlistId, userId);

      const message = {
        userId: request.auth.credentials.id,
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      await this.service.sendMessage('export:musics', JSON.stringify(message));

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
