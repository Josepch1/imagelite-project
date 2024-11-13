# 📸 ImageLiteAPI

Welcome to **ImageLiteAPI**! This project is a demo application built with Spring Boot. It provides a simple API for managing images and users.

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher

### Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/josepch1/imageliteapi.git
  ```
2. Navigate to the project directory:
  ```sh
  cd imageliteapi
  ```
3. Build the project:
  ```sh
  mvn clean install
  ```

### Running the Application

To run the application, use the following command:
```sh
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

## 🛠️ Configuration

### Security

The application uses JWT for authentication and authorization. The security configuration can be found in `src/main/java/io/github/josepch1/imageliteapi/config/SecurityConfig.java`.

### Endpoints

- `/v1/users/**` - Public endpoints for user management.
- `/v1/images/**` - Public endpoints for image retrieval.
- Other endpoints require authentication.

## 🧪 Running Tests

To run the tests, use the following command:
```sh
mvn test
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- [josepch1](https://github.com/josepch1)

Feel free to contribute to this project by submitting issues or pull requests.

Happy coding! 🎉