const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  //   Playlist Handler
  async postPlaylistHandler(request, h) {
    try {
      this.validator.validatePlaylistPayload(request.payload);

      const { name } = request.payload;

      // tambahan dari authorziation
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this.service.addPlaylist({
        name, owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
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

  async getPlaylistsHandler(request) {
    try {
      // tambahan
      const { id: credentialId } = request.auth.credentials;

      const playlists = await this.service.getPlaylists(credentialId);

      return {
        status: 'success',
        data: {
          playlists: playlists.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            username: playlist.owner,
          })),
        },
      };
    } catch (error) {
      console.log(error);
      return console.log(error);
    }
  }

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const { id: credentialId } = request.auth.credentials;
      const playlistId = request.params.id;

      await this.service.verifyPlaylistOwner(playlistId, credentialId);

      await this.service.deletePlaylistById(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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

module.exports = PlaylistsHandler;
