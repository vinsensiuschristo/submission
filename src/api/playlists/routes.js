const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'musicapi_jwt',
    },
  },
  // {
  //   method: 'POST',
  //   path: '/playlists/{id}/songs',
  //   handler: handler.postPlaylistSongHandler,

  // },
  // {
  //   method: 'GET',
  //   path: '/playlists/{id}/songs',
  //   handler: handler.postPlaylistSongHandler,
  // },
  // {
  //   method: 'DELETE',
  //   path: '/playlists/{id}/songs',
  //   handler: handler.deletePlaylistSongHandler,
  // },
];

module.exports = routes;
