# CurioSights-Backend

Welcome to the CurioSights-Backend repository! This repository contains the backend code for the CurioSights application, a platform that provides a curated collection of interesting sights and places. The backend is built using Node.js, Express.js, and MongoDB, along with several other dependencies to ensure a smooth and secure user experience.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with CurioSights-Backend, follow these steps:

1. Clone the repository: `git clone https://github.com/mrinmoy32/CurioSights-Backend.git`
2. Navigate to the project directory: `cd CurioSights-Backend`
3. Install the required dependencies: `npm install`

## Usage

To run the CurioSights-Backend server, execute the following command:

```
npm start
```

This will start the server using `nodemon`, which allows automatic restarting of the server during development whenever changes are detected.

## Endpoints

CurioSights-Backend provides the following API endpoints:

- **GET /api/places**: Fetch a list of all curated places.
- **GET /api/places/:id**: Fetch details of a specific place by its ID.
- **POST /api/places**: Create a new place (authentication required).
- **PUT /api/places/:id**: Update details of a specific place (authentication required).
- **DELETE /api/places/:id**: Delete a place (authentication required).
- **POST /api/users/signup**: Register a new user.
- **POST /api/users/login**: Authenticate and log in a user.
- **GET /api/users/:id**: Fetch user profile information (authentication required).

Make sure to refer to the API documentation or codebase for detailed information about request and response structures.

## Configuration

CurioSights-Backend uses the following environment variables for configuration:

- **PORT**: The port on which the server will run (default: 3000).
- **MONGODB_URI**: The URI for connecting to the MongoDB database.
- **JWT_SECRET**: Secret key used for JWT token generation.
- (Add any other relevant configuration details here)

Before starting the server, ensure that you have these environment variables configured.

## Contributing

We welcome contributions to CurioSights-Backend! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature-name`.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork: `git push origin feature-name`.
5. Open a pull request detailing your changes and the problem they solve.

## License

CurioSights-Backend is licensed under the ISC License. For more details, see the [LICENSE](LICENSE) file.

## Contact

If you have any questions or concerns, feel free to open an issue on the [GitHub repository](https://github.com/mrinmoy32/CurioSights-Backend/issues).

Visit the [CurioSights-Backend GitHub repository](https://github.com/mrinmoy32/CurioSights-Backend) for more information and updates.
