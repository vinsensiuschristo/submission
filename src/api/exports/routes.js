const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: handler.postExportMusicsHandler,
    options: {
      auth: 'musicapi_jwt',
    },
  },
];

module.exports = routes;
