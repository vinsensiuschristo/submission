/* eslint-disable camelcase */
const mapDBToModelAlbum = ({
  id, name, year, cover,
}) => ({
  id,
  name,
  year,
  cover,
});

const mapSongDB = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModelAlbum, mapSongDB };
