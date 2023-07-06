/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(userId, albumId) {
    const id = `album-likes-${nanoid(16)}`;

    // check album
    const checkAlbumQuery = {
      text: 'SELECT id from albums WHERE id = $1',
      values: [albumId],
    };

    const resultAlbumQuery = await this._pool.query(checkAlbumQuery);

    if (!resultAlbumQuery.rows.length) {
      throw new NotFoundError('Album Likes gagal ditambahkan, Album tidak ditemukan');
    }

    // check albumLikes
    const checkAlbumLikes = {
      text: 'SELECT * from user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const resultCheckAlbumLikes = await this._pool.query(checkAlbumLikes);
    // console.log(resultCheckAlbumLikes.rowCount);

    if (resultCheckAlbumLikes.rowCount >= 1) {
      throw new InvariantError('Album Likes gagal ditambahkan, Album sudah di-Like');
    }

    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album Likes gagal ditambahkan');
    }

    // console.log('addAlbum', `album:${albumId}`);

    // cache
    await this._cacheService.delete(`album:${albumId}`);
    console.log('delete cahce addAlbum', `album:${albumId}`);

    return result.rows[0].id;
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album Likes gagal dihapus');
    }

    // cache
    await this._cacheService.delete(`album:${albumId}`);
  }

  async getAlbumLikeById(albumId) {
    try {
      // cache
      const result = await this._cacheService.get(`album:${albumId}`);
      console.log('getAlbum with Cache', result);

      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT COUNT(id)
        FROM user_album_likes
        WHERE album_id = $1`,
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const mapAlbumId = result.rowCount;
      console.log('map album', mapAlbumId);

      // catatan akan disimpan pada cache sebelum fungsi getNotes dikembalikan
      // await this._cacheService.set(`notes:${owner}`, JSON.stringify(mappedResult));

      await this._cacheService.set(`album:${albumId}`, JSON.stringify(mapAlbumId));

      console.log('getAlbumNoCache', `album:${albumId}`);

      return result.rowCount;
    }
  }
}

module.exports = AlbumLikesService;
