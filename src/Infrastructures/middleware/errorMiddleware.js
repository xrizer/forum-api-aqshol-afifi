const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

const errorMiddleware = (request, h) => {
  const { response } = request;
  if (response instanceof Error) {
    const translatedError = DomainErrorTranslator.translate(response);

    if (translatedError instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: translatedError.message,
      });
      newResponse.code(translatedError.statusCode);
      return newResponse;
    }

    if (translatedError instanceof AuthorizationError) {
      const newResponse = h.response({
        status: 'fail',
        message: translatedError.message,
      });
      newResponse.code(403);
      return newResponse;
    }

    if (translatedError instanceof NotFoundError) {
      const newResponse = h.response({
        status: 'fail',
        message: translatedError.message,
      });
      newResponse.code(404);
      return newResponse;
    }

    if (!translatedError.isServer) {
      return h.continue;
    }

    const newResponse = h.response({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
    newResponse.code(500);
    return newResponse;
  }

  return h.continue;
};

module.exports = errorMiddleware;