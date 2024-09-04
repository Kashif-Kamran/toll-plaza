# Toll Plaza

## Introduction

The **Toll Plaza** project is a learning-oriented application designed to simulate a toll system with entry and exit points. The primary goal of this project is to deepen the understanding of testing methodologies in Node.js using Jest. The project includes two main routes: `/toll/entry` and `/toll/exit`, which handle the logic for vehicles entering and exiting the toll plaza.

## Learning Objectives

In this project, I focused on the following learning objectives:

- ✅ Understanding the fundamentals of **Jest** for testing JavaScript applications.
- ✅ Learning how to implement **Jest mocks** to simulate external dependencies.
- ✅ Using **SuperTest** for end-to-end testing of HTTP routes.
- ✅ Implementing **Jest Spy** functions to monitor and manipulate function calls within the application.
- ✅ Writing optimal and efficient test cases to ensure comprehensive test coverage.

## Routes Implemented

The following routes are implemented in this project:

- **`POST /toll/entry`**
  - Handles vehicle entry into the toll system.
  - Records entry time and toll point.

- **`POST /toll/exit`**
  - Handles vehicle exit from the toll system.
  - Calculates the toll fee based on the entry and exit points.

## How to Set Up the Project

This project is not configured for production use. It is intended for educational and development purposes only.

To set up the project locally, follow these steps:

1. Clone the repository to your local machine:
    ```bash
   git clone <repository-url>
    ```

2. Navigate to the project directory and install the necessary dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
   ```bash
   npm run start:dev`
    ```

## Disclaimer

This project is developed solely for educational purposes. It is intended as a learning tool to explore and practice testing techniques in a Node.js environment. The functionality and implementations may not be suitable for production use.
