/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  // Service For PlaylistSong
  async addPlaylistSong(playlistId, songId) {
    const id = `playlist-songs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs  VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Songs gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // Playlist songs
  // try
  async getPlaylistSong(playlistId) {
    const query = {
      text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Songs gagal dihapus');
    }
  }

  // fungsi ini sama denga verifyCollaborator
  async verifyPlaylistSongOwner(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Songs gagal diverifikasi');
    }
  }
}

module.exports = PlaylistSongsService;
