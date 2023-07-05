/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlist-songs-${nanoid(16)}`;

    // check song table, ada idSong yang di input ga
    const checkSongQuery = {
      text: 'SELECT id from songs WHERE id = $1',
      values: [songId],
    };

    const resultSongQuery = await this._pool.query(checkSongQuery);

    if (!resultSongQuery.rows.length) {
      throw new NotFoundError('Playlist Song gagal ditambahkan, Song tidak ditemukan');
    }

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Songs gagal ditambahkan');
    }
    return result.rows[0].id;
  }

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

  async addPlaylistActivities(playlistId, songId, userId, action, time) {
    const id = `activities-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistActivities(credentialId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time 
      FROM playlist_song_activities 
      INNER JOIN songs ON playlist_song_activities.song_id = songs.id
      INNER JOIN users ON playlist_song_activities.user_id = users.id
      WHERE user_id = $1`,
      values: [credentialId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongsService;
