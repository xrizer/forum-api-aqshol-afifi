const registerPlugins = require('../registerPlugins');

// Mock the plugins
jest.mock('../../../Interfaces/http/api/users', () => jest.fn());
jest.mock('../../../Interfaces/http/api/authentications', () => jest.fn());
jest.mock('../../../Interfaces/http/api/threads', () => jest.fn());
jest.mock('../../../Interfaces/http/api/comments', () => jest.fn());

describe('registerPlugins function', () => {
  let mockServer;
  let mockContainer;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();

    // Create mock server and container
    mockServer = {
      register: jest.fn().mockResolvedValue(),
    };
    mockContainer = {};
  });

  it('should register all plugins with the server', async () => {
    // Act
    await registerPlugins(mockServer, mockContainer);

    // Assert
    expect(mockServer.register).toHaveBeenCalledTimes(1);
    expect(mockServer.register).toHaveBeenCalledWith([
      { plugin: expect.any(Function), options: { container: mockContainer } },
      { plugin: expect.any(Function), options: { container: mockContainer } },
      { plugin: expect.any(Function), options: { container: mockContainer } },
      { plugin: expect.any(Function), options: { container: mockContainer } },
    ]);
  });

  it('should pass the container to each plugin', async () => {
    // Act
    await registerPlugins(mockServer, mockContainer);

    // Assert
    const registeredPlugins = mockServer.register.mock.calls[0][0];
    registeredPlugins.forEach(plugin => {
      expect(plugin.options.container).toBe(mockContainer);
    });
  });

  it('should register users, authentications, threads, and comments plugins', async () => {
    // Arrange
    const users = require('../../../Interfaces/http/api/users');
    const authentications = require('../../../Interfaces/http/api/authentications');
    const threads = require('../../../Interfaces/http/api/threads');
    const comments = require('../../../Interfaces/http/api/comments');

    // Act
    await registerPlugins(mockServer, mockContainer);

    // Assert
    const registeredPlugins = mockServer.register.mock.calls[0][0];
    const pluginFunctions = registeredPlugins.map(plugin => plugin.plugin);

    expect(pluginFunctions).toContain(users);
    expect(pluginFunctions).toContain(authentications);
    expect(pluginFunctions).toContain(threads);
    expect(pluginFunctions).toContain(comments);
  });
});