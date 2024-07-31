const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'A comment',
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    const addedComment = await addCommentUseCase.execute('thread-123', 'user-123', useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    }));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
      threadId: 'thread-123',
      owner: 'user-123',
    }));
  });
});

describe('AddComment entities', () => {
  describe('AddComment entity', () => {
    it('should throw error when payload does not contain needed property', () => {
      // Arrange
      const payload = {
        content: 'A comment',
        threadId: 'thread-123',
      };

      // Act & Assert
      expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        content: 123,
        threadId: 'thread-123',
        owner: 'user-123',
      };

      // Act & Assert
      expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when content contains more than 1000 characters', () => {
      // Arrange
      const payload = {
        content: 'a'.repeat(1001),
        threadId: 'thread-123',
        owner: 'user-123',
      };

      // Act & Assert
      expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.CONTENT_LIMIT_CHAR');
    });

    it('should create AddComment entities correctly', () => {
      // Arrange
      const payload = {
        content: 'A comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      // Act
      const addComment = new AddComment(payload);

      // Assert
      expect(addComment).toBeInstanceOf(AddComment);
      expect(addComment.content).toEqual(payload.content);
      expect(addComment.threadId).toEqual(payload.threadId);
      expect(addComment.owner).toEqual(payload.owner);
    });
  });

  describe('AddedComment entity', () => {
    it('should throw error when payload does not contain needed property', () => {
      // Arrange
      const payload = {
        content: 'A comment',
        owner: 'user-123',
      };

      // Act & Assert
      expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 123,
        content: 'A comment',
        owner: 'user-123',
      };

      // Act & Assert
      expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedComment entities correctly', () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        content: 'A comment',
        owner: 'user-123',
      };

      // Act
      const addedComment = new AddedComment(payload);

      // Assert
      expect(addedComment).toBeInstanceOf(AddedComment);
      expect(addedComment.id).toEqual(payload.id);
      expect(addedComment.content).toEqual(payload.content);
      expect(addedComment.owner).toEqual(payload.owner);
    });
  });
});