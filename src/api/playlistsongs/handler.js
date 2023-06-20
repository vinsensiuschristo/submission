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

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      const playlistId = request.params.id;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      const playlistSongId = await this._playlistSongsService.addPlaylistSong(playlistId, songId);

      // add to playlist_song_activities
      const action = 'add';
      const time = new Date();

      await this._playlistSongsService.addPlaylistActivities(
        playlistId, songId, credentialId, action, time,
      );

      const response = h.response({
        status: 'success',
        message: 'Playlist Song berhasil ditambahkan',
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

  async getPlaylistSongsHandler(request, h) {
    try {
      // tambahan
      const { id: credentialId } = request.auth.credentials;
      const playlistId = request.params.id;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      const playlists = await this._playlistSongsService.getPlaylistSong(playlistId, credentialId);
      const songs = await this._playlistSongsService.getSongs(playlistId);

      return {
        status: 'success',
        data: {
          playlist: {
            id: playlists.id,
            name: playlists.name,
            username: playlists.username,
            songs,
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

  async deletePlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      const playlistId = request.params.id;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._playlistSongsService.deletePlaylistSongById(playlistId, songId);

      // add to playlist_song_activities
      const action = 'delete';
      const time = new Date();

      await this._playlistSongsService.addPlaylistActivities(
        playlistId, songId, credentialId, action, time,
      );

      return {
        status: 'success',
        message: 'Playlist Song berhasil dihapus',
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

  async getPlaylistActivitiesSongHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlistId = request.params.id;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      const activities = await this._playlistSongsService.getPlaylistActivities(credentialId);

      return {
        status: 'success',
        data: {
          playlistId,
          activities,
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
}

module.exports = PlaylistSongsHandler;
