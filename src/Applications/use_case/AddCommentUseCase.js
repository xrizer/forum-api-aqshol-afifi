  const AddComment = require('../../Domains/comments/entities/AddComment');

  class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
      this._commentRepository = commentRepository;
      this._threadRepository = threadRepository;
    }

    async execute(threadId, userId, useCasePayload) {
      await this._threadRepository.verifyThreadAvailability(threadId);
      const newComment = new AddComment({
        ...useCasePayload,
        threadId,
        owner: userId,
      });
      return this._commentRepository.addComment(newComment);
    }
  }

  module.exports = AddCommentUseCase;