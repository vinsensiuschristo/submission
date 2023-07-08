const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    try {
      this.validator.validateUserPayload(request.payload);

      const { username, password, fullname } = request.payload;

      const userId = await this.service.addUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
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

module.exports = UsersHandler;
