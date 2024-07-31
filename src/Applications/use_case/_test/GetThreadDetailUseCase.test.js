const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // Arrange
    const mockThreadId = 'thread-123';
    const mockThread = {
      id: 'thread-123',
      title: 'A Thread',
      body: 'A thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };
    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'A comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'janedoe',
        date: '2021-08-08T07:26:21.338Z',
        content: 'Another comment',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    const threadDetail = await getThreadDetailUseCase.execute(mockThreadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockThreadId);
    expect(threadDetail).toStrictEqual({
      id: 'thread-123',
      title: 'A Thread',
      body: 'A thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'A comment',
        },
        {
          id: 'comment-456',
          username: 'janedoe',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });

  it('should handle thread with no comments', async () => {
    // Arrange
    const mockThreadId = 'thread-123';
    const mockThread = {
      id: 'thread-123',
      title: 'A Thread',
      body: 'A thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };
    const mockComments = [];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    const threadDetail = await getThreadDetailUseCase.execute(mockThreadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockThreadId);
    expect(threadDetail).toStrictEqual({
      ...mockThread,
      comments: [],
    });
  });

  it('should throw error when thread is not found', async () => {
    // Arrange
    const mockThreadId = 'thread-123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('Thread not found')));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(getThreadDetailUseCase.execute(mockThreadId))
      .rejects
      .toThrow('Thread not found');
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadId);
  });

  it('should handle error when fetching comments fails', async () => {
    // Arrange
    const mockThreadId = 'thread-123';
    const mockThread = {
      id: 'thread-123',
      title: 'A Thread',
      body: 'A thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('Failed to fetch comments')));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(getThreadDetailUseCase.execute(mockThreadId))
      .rejects
      .toThrow('Failed to fetch comments');
    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThreadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockThreadId);
  });
});