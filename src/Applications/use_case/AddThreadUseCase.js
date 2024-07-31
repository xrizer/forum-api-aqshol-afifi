const AddThread = require('../../Domains/threads/entitites/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const newThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(newThread, owner);
  }
}

module.exports = AddThreadUseCase;