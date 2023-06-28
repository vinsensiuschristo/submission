/* eslint-disable no-underscore-dangle */

const fs = require('fs');
const { Pool } = require('pg');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async addCover(albumId, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $2 WHERE id = $1',
      values: [albumId, cover],
    };

    const result = this._pool.query(query);

    return result;
  }
}

module.exports = StorageService;
