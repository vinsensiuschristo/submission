/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newSong = {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      id,
      createdAt,
      updatedAt,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return id;
  }

  getSongs() {
    return this._songs;
  }

  getSongById(id) {
    const song = this._songs.filter((song1) => song1.id === id)[0];
    if (!song) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const song = this._songs.findIndex((song1) => song1.id === id);

    if (song === -1) {
      throw new NotFoundError(
        'Gagal memperbarui lagu. Id tidak ditemukan',
      );
    }

    const updatedAt = new Date().toISOString();

    this._songs[song] = {
      ...this._songs[song],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      updatedAt,
    };
  }

  deleteSongById(id) {
    const song = this._songs.findIndex((song1) => song1.id === id);
    if (song === -1) {
      throw new NotFoundError(
        'Catatan gagal dihapus. Id tidak ditemukan',
      );
    }
    this._songs.splice(song, 1);
  }
}

module.exports = SongsService;
