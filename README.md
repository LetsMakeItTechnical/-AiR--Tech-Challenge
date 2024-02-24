# AiR Tech Test

This project, developed as part of a technical test for Answers in Retirement (AiR), is a RESTful API designed for managing a music library. It provides endpoints for various operations such as fetching, updating, and deleting songs, as well as handling associated artists. Additionally, the project includes file upload capabilities, with support for direct video uploads to AWS S3 and audio file format detection.

## Features

- RESTful API for managing songs and artists.

- File upload handling with Express and Multer.

- Direct song file uploads to AWS S3.

- Audio file processing and format detection.

- Prisma integration for database operations.

- Enum-based file format handling.

- Randomized song list fetching with associated artists.

- Endpoints for updating song details and deleting songs from the database.

## Getting Started

### Prerequisites

- Node.js

- npm (Node package manager)

- AWS Account (for S3 file uploads)

- A configured PostgreSQL

### Installation

1\. **Clone the repository**

```sh

git clone https://github.com/LetsMakeItTechnical/-AiR--Tech-Challenge.git

```

2\. **Navigate to the project directory**

```sh

cd -AiR--Tech-Challenge

```

3\. **Install NPM packages**

```sh

npm install

```

4\. **Set up environment variables**

Create a `.env` file in the project root and fill in your variables:

```

DATABASE_URL="your-database-url"

AWS_ACCESS_KEY_ID="your-access-key-id"

AWS_SECRET_ACCESS_KEY="your-secret-access-key"

AWS_REGION="your-aws-region"

S3_BUCKET_NAME="your-s3-bucket-name"

```

5\. **Run migrations for Prisma**

```sh

npx prisma migrate dev

```

### Usage

#### Starting the Server

Run the following command to start the Express server:

```sh

npm start

```

#### API Endpoints

- **GET `/songs`**: Fetch all songs

- **GET `/songs/random`**: Fetch a random list of songs.

- **GET `/songs/:id`**: Fetch a specific song by ID

- **PUT `/songs/:id`**: Update a specific song

- **DELETE `/songs/:id`**: Delete a specific song

- **GET `/artists`**: Fetch all artists

- **GET `/artists/:id`**: Fetch a specific artist by ID

- **POST `/artists`**: Create a new artist

- **PUT `/artists/:id`**: Update an artist

- **DELETE `/artists/:id`**: Delete an artist

#### File Upload

Use the `/upload` endpoint to upload files. The server handles video uploads to AWS S3 and audio file format detection.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1\. Fork the Project

2\. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

3\. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)

4\. Push to the Branch (`git push origin feature/AmazingFeature`)

5\. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

My Email - [rasulomeni@gmail.com](mailto:rasulomeni@gmail.com)

Project Link: [https://github.com/LetsMakeItTechnical/-AiR--Tech-Challenge](https://github.com/LetsMakeItTechnical/-AiR--Tech-Challenge)

---


