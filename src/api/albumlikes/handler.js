/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class AlbumLikesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const albumId = request.params.id;

      await this._service.addAlbumLike(credentialId, albumId);

      const response = h.response({
        status: 'success',
        message: 'Like pada Album berhasil ditambahkan',
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

  async deleteAlbumLikeByIdHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const albumId = request.params.id;

      await this._service.deleteAlbumLike(credentialId, albumId);

      return {
        status: 'success',
        message: 'Like pada Album berhasil dihapus',
      };
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

  async getAlbumLikeByIdHandler(request, h) {
    try {
      const albumId = request.params.id;
      // const likeCount = await this._service.getAlbumLikeById(albumId);
      const likesData = await this._service.getAlbumLikeById(albumId);

      // console.log('console log handler', likeCount);

      const { likesCount, source } = likesData;

      // console.log('likecount', likesCount);
      // console.log('source', source);

      const tempLikeCount = JSON.parse(likesCount);
      console.log(tempLikeCount);

      const response = h.response({
        status: 'success',
        data: {
          likes: tempLikeCount,
        },
      });

      response.header('X-Data-Source', source);

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

module.exports = AlbumLikesHandler;
