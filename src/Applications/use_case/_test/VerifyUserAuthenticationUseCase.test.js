const VerifyUserAuthenticationUseCase = require('../VerifyUserAuthenticationUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('VerifyUserAuthenticationUseCase', () => {
  it('should orchestrate the verify user authentication action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const mockUserRepository = new UserRepository();
    mockUserRepository.verifyUserExistence = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const verifyUserAuthenticationUseCase = new VerifyUserAuthenticationUseCase({
      userRepository: mockUserRepository,
    });

    // Act
    await verifyUserAuthenticationUseCase.execute(userId);

    // Assert
    expect(mockUserRepository.verifyUserExistence).toHaveBeenCalledWith(userId);
  });

  it('should throw error when user is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const mockUserRepository = new UserRepository();
    mockUserRepository.verifyUserExistence = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('User not found')));

    const verifyUserAuthenticationUseCase = new VerifyUserAuthenticationUseCase({
      userRepository: mockUserRepository,
    });

    // Act & Assert
    await expect(verifyUserAuthenticationUseCase.execute(userId))
      .rejects
      .toThrow('username tidak ditemukan');
  });
});