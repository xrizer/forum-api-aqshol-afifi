const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entitites/AddThread');
const AddedThread = require('../../../Domains/threads/entitites/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const newThread = new AddThread({
        title: 'A Thread',
        body: 'A Thread Body',
      });
      const owner = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread, owner);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'A Thread',
        owner: 'user-123'
      }));
      expect(threads).toHaveLength(1);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects.toThrowError(NotFoundError);
    });
    
    it('should return thread correctly', async () => {
      // Arrange
      const testDate = new Date();
      await UsersTableTestHelper.addUser({ id: 'user-569', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-569',
        title: 'A Thread',
        body: 'A Thread Body',
        owner: 'user-569',
        date: testDate,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-569');

      // Assert
      expect(thread.id).toEqual('thread-569');
      expect(thread.title).toEqual('A Thread');
      expect(thread.body).toEqual('A Thread Body');
      expect(thread.username).toEqual('dicoding');
      expect(new Date(thread.date)).toEqual(expect.any(Date));
      expect(new Date(thread.date).getTime()).toBeCloseTo(testDate.getTime(), -3); // Tolerance of 1 second
    });
  });
});