const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);

      const songId = await this.service.addSong(request.payload);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
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

  async getSongsHandler(request) {
    // bagian query param
    try {
      const { title, performer } = request.query;
      const songs = await this.service.getSongs({ title, performer });

      return {
        status: 'success',
        data: {
          songs: songs.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
          })),
        },
      };
    } catch (error) {
      console.log(error);
      return console.log(error);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const song = await this.service.getSongById(id);

      return {
        status: 'success',
        data: {
          song: {
            id: song.id,
            title: song.title,
            year: song.year,
            performer: song.performer,
            genre: song.genre,
            duration: song.duration,
            albumId: song.albumId,
          },
        },
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

  async putSongByIdHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);

      const { id } = request.params;

      await this.service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
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

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this.service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
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
}

module.exports = SongsHandler;
