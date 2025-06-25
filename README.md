# Typescript Node/Nest.js API

A scalable REST API built with TypeScript, Express, and MongoDB following clean architecture principles and test-driven development (TDD).

## Architecture

The project follows Clean Architecture principles with the following layers:

### Domain Layer (`src/domain`)
- Business entities and rules
- Use case interfaces
- Pure TypeScript interfaces and types

### Data Layer (`src/data`)
- Use case implementations
- Repository interfaces (contracts)
- No direct database implementations (follows Dependency Inversion Principle)

### Presentation Layer (`src/presentation`)
- Controllers
- Validation
- HTTP request/response handling
- Error handling

### Infrastructure Layer (`src/infra`)
- External dependencies implementations
- Database implementations (MongoDB)
- Cryptography implementations
- Repository implementations

### Main Layer (`src/main`)
- Application composition
- Dependency injection
- Routes configuration
- Server setup
- Environment configuration

## Key Design Patterns
- Clean Architecture
- Factory Pattern
- Repository Pattern
- Decorator Pattern
- Composite Pattern

## Main Features

### Authentication
- User signup with password encryption using `BcryptAdapter`
- Login with JWT token generation
- Access token management with MongoDB

### Validation
- Input validation using `ValidationComposite`
- Email format validation
- Required fields validation
- Password confirmation validation

### Error Handling
- Centralized error handling
- Error logging to MongoDB
- HTTP response helpers

### Database
- MongoDB integration
- Repository pattern implementation
- Database connection management

## Testing

### Test Configuration Files
- `jest-unit.config.js`: Unit test configuration
- `jest-integration.config.js`: Integration test configuration
- `jest-mongo-config.js`: MongoDB test configuration

### Test Types
- Unit tests (Jest)
- Integration tests
- MongoDB in-memory database for tests

## API Routes

### Authentication
```typescript
POST /api/signup - Create new account
POST /api/login  - Authenticate user
```

## Environment Configuration

```typescript
{
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/scale-node-api',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? ''
}
```

## Middleware
- Body Parser
- CORS
- Content Type

## Project Setup

### Prerequisites
- Node.js
- MongoDB
- TypeScript

### Installation
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run the application in development mode
npm run dev

# Build the application
npm run build

# Start the production server
npm start
```

## Development Tools
- ESLint for code linting
- Husky for pre-commit hooks
- Lint-staged
- TypeScript
- Jest for testing

## Repository Structure

```
src/
├── domain/         # Business entities and use case interfaces
├── data/           # Use case implementations, repository interfaces, and any necessary interface to keep the Dependence Inversion Principle
├── infra/          # External dependencies implementations, normaly used to implement the Adapter design pattern to communicate with external libraries
├── main/           # Application composition and configuration
├── presentation/   # Controllers and HTTP handling
├── utils/          # Utility functions
└── validation/     # Validation logic Layer
```

## License

This project is licensed under the MIT License.
