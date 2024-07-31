const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';
    const mockUserId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    await deleteCommentUseCase.execute(mockThreadId, mockCommentId, mockUserId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(mockCommentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(mockCommentId, mockUserId);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(mockCommentId);
  });

  it('should throw error when thread is not found', async () => {
    // Arrange
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';
    const mockUserId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('Thread not found')));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act & Assert
    await expect(deleteCommentUseCase.execute(mockThreadId, mockCommentId, mockUserId))
      .rejects
      .toThrow('Thread not found');
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(mockThreadId);
  });

  it('should throw error when comment is not found', async () => {
    // Arrange
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';
    const mockUserId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('Comment not found')));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act & Assert
    await expect(deleteCommentUseCase.execute(mockThreadId, mockCommentId, mockUserId))
      .rejects
      .toThrow('Comment not found');
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(mockCommentId);
  });

  it('should throw error when user is not the comment owner', async () => {
    // Arrange
    const mockThreadId = 'thread-123';
    const mockCommentId = 'comment-123';
    const mockUserId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('User is not comment owner')));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act & Assert
    await expect(deleteCommentUseCase.execute(mockThreadId, mockCommentId, mockUserId))
      .rejects
      .toThrow('User is not comment owner');
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(mockCommentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(mockCommentId, mockUserId);
  });
});