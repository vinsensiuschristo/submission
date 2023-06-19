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
  async getPlaylistSong(playlistId, credentialId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      INNER JOIN users
      ON users.id = playlists.owner
      WHERE playlists.id = $1 AND playlists.owner = $2`,
      values: [playlistId, credentialId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  // inner join playlist_songs sama song

  async getSongs(id) {
    const queryGetSongs = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      INNER JOIN playlist_songs 
      ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };
    const songsResult = await this._pool.query(queryGetSongs);

    return songsResult.rows;
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
