# Forum API

Hello! I'm Aqshol Afifi, and this is my Forum API project.

## Description

A RESTful API for a discussion forum, built with Node.js and PostgreSQL. It supports user authentication, thread creation, and commenting.

## Features

- User registration and authentication (JWT)
- CRUD operations for threads and comments
- Secure password hashing (bcrypt)
- Database migrations

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Jest (testing)
- bcrypt
- node-pg-migrate

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Set up .env file (copy from .env.example)
4. Run migrations: `npm run migrate up`
5. Start server: `npm start`

## Testing

Run `npm test` to execute the test suite.

## API Endpoints

- POST `/users`: Register user
- POST `/authentications`: Login
- POST `/threads`: Create thread
- GET `/threads/{threadId}`: Get thread
- POST `/threads/{threadId}/comments`: Add comment

For full API documentation, see [API_DOC.md](API_DOC.md).

## Contributing

Contributions are welcome. Please open an issue first to discuss proposed changes.

## License

[MIT](LICENSE)

## Contact

Aqshol Afifi - aqsholafifi@example.com

Project Link: https://github.com/aqshol/forum-api