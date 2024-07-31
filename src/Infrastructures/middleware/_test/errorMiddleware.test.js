const ClientError = require('../../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../../Commons/exceptions/DomainErrorTranslator');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const errorMiddleware = require('../errorMiddleware');

describe('errorMiddleware', () => {
  it('should respond with 400 status code when error is InvariantError', () => {
    // Arrange
    const clientError = new InvariantError('invariant error!');
    const request = {
      response: clientError,
    };
    const h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
    
    // Mock DomainErrorTranslator
    jest.spyOn(DomainErrorTranslator, 'translate').mockReturnValue(clientError);

    // Act
    const result = errorMiddleware(request, h);

    // Assert
    expect(h.response).toHaveBeenCalledWith({
      status: 'fail',
      message: 'invariant error!',
    });
    expect(h.code).toHaveBeenCalledWith(400);
    expect(result.code).toHaveBeenCalledWith(400);
  });

  it('should respond with 401 status code when error is AuthenticationError', () => {
    // Arrange
    const authError = new AuthenticationError('authentication error!');
    const request = {
      response: authError,
    };
    const h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
    
    // Mock DomainErrorTranslator
    jest.spyOn(DomainErrorTranslator, 'translate').mockReturnValue(authError);

    // Act
    const result = errorMiddleware(request, h);

    // Assert
    expect(h.response).toHaveBeenCalledWith({
      status: 'fail',
      message: 'authentication error!',
    });
    expect(h.code).toHaveBeenCalledWith(401);
    expect(result.code).toHaveBeenCalledWith(401);
  });

  it('should respond with 403 status code when error is AuthorizationError', () => {
    // Arrange
    const authError = new AuthorizationError('authorization error!');
    const request = {
      response: authError,
    };
    const h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
    
    // Mock DomainErrorTranslator
    jest.spyOn(DomainErrorTranslator, 'translate').mockReturnValue(authError);

    // Act
    const result = errorMiddleware(request, h);

    // Assert
    expect(h.response).toHaveBeenCalledWith({
      status: 'fail',
      message: 'authorization error!',
    });
    expect(h.code).toHaveBeenCalledWith(403);
    expect(result.code).toHaveBeenCalledWith(403);
  });

  it('should respond with 404 status code when error is NotFoundError', () => {
    // Arrange
    const notFoundError = new NotFoundError('not found!');
    const request = {
      response: notFoundError,
    };
    const h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
    
    // Mock DomainErrorTranslator
    jest.spyOn(DomainErrorTranslator, 'translate').mockReturnValue(notFoundError);

    // Act
    const result = errorMiddleware(request, h);

    // Assert
    expect(h.response).toHaveBeenCalledWith({
      status: 'fail',
      message: 'not found!',
    });
    expect(h.code).toHaveBeenCalledWith(404);
    expect(result.code).toHaveBeenCalledWith(404);
  });

  it('should respond with 500 status code when error is server error', () => {
    // Arrange
    const serverError = new Error('server error!');
    serverError.isServer = true;
    const request = {
      response: serverError,
    };
    const h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
    
    // Mock DomainErrorTranslator
    jest.spyOn(DomainErrorTranslator, 'translate').mockReturnValue(serverError);

    // Act
    const result = errorMiddleware(request, h);

    // Assert
    expect(h.response).toHaveBeenCalledWith({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
    expect(h.code).toHaveBeenCalledWith(500);
    expect(result.code).toHaveBeenCalledWith(500);
  });

  it('should continue when error is not recognized', () => {
    // Arrange
    const unknownError = new Error('unknown error');
    const request = {
      response: unknownError,
    };
    const h = {
      continue: 'continue',
    };
    
    // Mock DomainErrorTranslator
    jest.spyOn(DomainErrorTranslator, 'translate').mockReturnValue(unknownError);

    // Act
    const result = errorMiddleware(request, h);

    // Assert
    expect(result).toBe('continue');
  });

  it('should continue when response is not an error', () => {
    // Arrange
    const request = {
      response: 'not an error',
    };
    const h = {
      continue: 'continue',
    };

    // Act
    const result = errorMiddleware(request, h);

    // Assert
    expect(result).toBe('continue');
  });
});