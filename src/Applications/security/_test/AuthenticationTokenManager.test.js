const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke createAccessToken behavior', async () => {
    // Arrange
    const authenticationTokenManager = new AuthenticationTokenManager();

    // Action & Assert
    await expect(authenticationTokenManager.createAccessToken({})).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke verifyAccessToken behavior', async () => {
    // Arrange
    const authenticationTokenManager = new AuthenticationTokenManager();

    // Action & Assert
    await expect(authenticationTokenManager.verifyAccessToken('dummy_token')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke decodePayload behavior', async () => {
    // Arrange
    const authenticationTokenManager = new AuthenticationTokenManager();

    // Action & Assert
    await expect(authenticationTokenManager.decodePayload('dummy_token')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});