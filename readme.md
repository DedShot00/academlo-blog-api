# Blog API

This project is a blog API developed using Node.js and Express, with a PostgreSQL database. The API offers users a variety of functions for posting and viewing posts, comments, and user profiles, as well as real-time updates through Socket.IO.

## Used Technologies

- **Node.js:** JavaScript runtime platform for building server-side applications.
- **Express:** Node.js framework for creating efficient web applications and APIs.
- **PostgreSQL:** Relational database management system for storing blog information.
- **Socket.IO:** Library for bidirectional real-time communication between server and clients.
- **JWT (JSON Web Tokens):** Used for user authentication and securing sensitive endpoints.
- **Firebase:** Cloud-based platform for hosting images and files.

## Key Features

- **User Authentication:** Utilizes JWT tokens for user authentication with role-based access restrictions.
- **Content Publishing:** Users can create and publish detailed posts.
- **Comments:** Allows users to comment on existing posts and view associated comments.
- **Content Viewing:** Users can access a full list of posts and view associated comments.
- **Real-Time Updates:** Events like creating or deleting posts trigger real-time updates for all users.
- **Password Encryption:** User passwords are stored securely with bcryptjs encryption.
- **Security and Validations:** Uses Sequelize to prevent SQL injection and Helmet, HPP libraries for protection against vulnerabilities.
- **Image Storage:** Images are stored in Firebase and managed with Multer.
- **Error Handling:** The API effectively handles errors and provides clear messages in case of user errors.
- **Database Relationships:** Implements relationships between users, posts, and comments using Sequelize.

## Usage Instructions

1. **Clone the Repository:** Clone this repository to your local machine.

2. **Install Dependencies:** Navigate to the project folder and run:
```
npm install
```

3. **Configure the Database:** Adjust the connection to the PostgreSQL database in the corresponding configuration.

4. **Set Up Firebase:** Create a Firebase app and initialize Firestore for image storage.

5. **Configure Environment Variables:** Clone the `.env.template` file and rename it to `.env`. Fill in the necessary environment variables, including Firebase credentials and PostgreSQL configuration.

6. **Run the Server:** Start the server in dev mode with:
```
npm run dev
```

7. **Explore the API:** Use Postman or other methods to interact with the API.

---