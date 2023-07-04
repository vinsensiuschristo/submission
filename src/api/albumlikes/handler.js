/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
// const ClientError = require('../../exceptions/ClientError');

class AlbumLikesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumLikeHandler() {
    return {
      status: 'success',
      messag: 'postAlbumLikeHandler 123',
    };
  }

  async deleteAlbumLikeByIdHandler() {
    return {
      status: 'success',
      messag: 'deleteAlbumLikeByIdHandler',
    };
  }

  async getAlbumLikeByIdHandler() {
    return {
      status: 'success',
      messag: 'getAlbumLikeByIdHandler',
    };
  }
}

module.exports = AlbumLikesHandler;
