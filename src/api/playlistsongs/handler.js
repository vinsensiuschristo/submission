/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  // PlaylistSongs Handler
  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      const playlistId = request.params.id;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      const playlistSongId = await this._playlistSongsService.addPlaylistSong(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          playlistSongId,
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

  async getPlaylistSongsHandler(request) {
    try {
      // tambahan
      const { id: credentialId } = request.auth.credentials;

      const playlists = await this._playlistsService.getPlaylistSong(credentialId);

      console.log(credentialId);

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

  async deletePlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      const { playlistId } = request.params;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._playlistSongsService.deletePlaylistSongHandler(playlistId, songId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
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

module.exports = PlaylistSongsHandler;
