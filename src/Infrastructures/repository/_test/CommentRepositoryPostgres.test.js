const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const newComment = new AddComment({
        content: 'A Comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'A Comment',
        owner: 'user-123',
      }));
      expect(comment).toHaveLength(1);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when comment not owned by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment is owned by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should update is_delete to true in database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return all comments from a thread correctly', async () => {
        // Arrange
        const threadId = 'thread-123';
        const userId = 'user-123';
        const testDate1 = new Date();
        const testDate2 = new Date(testDate1.getTime() + 1000); // 1 second later
        await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
        // Add comments
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          content: 'comment 1',
          thread_id: threadId,
          owner: userId,
          is_delete: false,
          date: testDate1,
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-456',
          content: 'comment 2',
          thread_id: threadId,
          owner: userId,
          is_delete: true,
          date: testDate2,
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        
        // Action
        const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);
        
        // Assert
        expect(comments).toHaveLength(2);
        expect(comments[0].id).toEqual('comment-123');
        expect(comments[0].username).toEqual('dicoding');
        expect(comments[0].content).toEqual('comment 1');
        expect(comments[0].is_delete).toEqual(false);
        expect(new Date(comments[0].date)).toEqual(expect.any(Date));
        expect(Math.abs(new Date(comments[0].date).getTime() - testDate1.getTime())).toBeLessThan(5000);
        expect(comments[1].id).toEqual('comment-456');
        expect(comments[1].username).toEqual('dicoding');
        expect(comments[1].content).toEqual('comment 2');
        expect(comments[1].is_delete).toEqual(true);
        expect(new Date(comments[1].date)).toEqual(expect.any(Date));
        expect(Math.abs(new Date(comments[1].date).getTime() - testDate2.getTime())).toBeLessThan(5000);
    });

    it('should return empty array when no comments exist for the thread', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123'
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        // Action
        const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
        // Assert
        expect(comments).toHaveLength(0);
    });
  });
});