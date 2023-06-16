/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name }) {
    const id = `playlist-${nanoid(16)}`;
    const owner = 'test';

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists() {
    const query = {
      text: 'SELECT * FROM playlists',
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getPlaylistById(id) {

  }
}

module.exports = PlaylistsService;
