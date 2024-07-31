const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'A Thread Title',
      // body is missing
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 100 characters', () => {
    // Arrange
    const payload = {
      title: 'a'.repeat(101),
      body: 'This is the body of the thread',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should throw error when title contains restricted characters', () => {
    // Arrange
    const payload = {
      title: 'Thread Title!@#$%',
      body: 'This is the body of the thread',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'A Valid Thread Title',
      body: 'This is the body of the thread',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
  });
});