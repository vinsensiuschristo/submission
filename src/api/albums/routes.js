const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler,
  },
  // {
  //   method: 'POST',
  //   path: '/albums/{id}/covers',
  //   handler: handler.postUploadImageHandler,
  //   options: {
  //     payload: {
  //       allow: 'multipart/form-data',
  //       multipart: true,
  //       output: 'stream',
  //     },
  //   },
  // },

];

module.exports = routes;
