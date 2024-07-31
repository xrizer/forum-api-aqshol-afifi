class VerifyUserAuthenticationUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(userId) {
    try {
      await this._userRepository.verifyUserExistence(userId);
    } catch (error) {
      throw new Error('username tidak ditemukan');
    }
  }
}

module.exports = VerifyUserAuthenticationUseCase;