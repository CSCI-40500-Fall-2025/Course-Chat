# User Authentication Routes

This is the backend so far for our app. There are the /login, /signup routes that allow the user to use each respectively as well as giving a JWT token. The /me GETs the info respective to the JWT token that is used in the request. The `authMiddleware` verifies the JWT token in the `Authorization` header.
If valid, it attaches the authenticated user to `req.user`; otherwise, it returns a 401 response.

---

## 🔐 1. **Example signup:**

Registers a new user by validating input, hashing the password, and storing the user in the database.

### Request Body

```json
{
  "username": "JohnDoe",
  "email": "johndoe@example.com",
  "password": "securepassword123"
}
```

### Response (201 Created)

```json
{
  "message": "User Created Successfully",
  "user": {
    "id": "6710e9e3b9f49a2c46f8a123",
    "username": "JohnDoe",
    "email": "johndoe@example.com"
  },
  "token": "<jwt_token_here>"
}
```

## Setup

1.  Create a `.env` file:

    ```
    JWT_SECRET=your_super_secure_secret_key
    MONGO_URI=mongodb+srv://...
    PORT=5001
    CLOUDINARY_CLOUD_NAME= ...
    CLOUDINARY_API_KEY= ...
    CLOUDINARY_API_SECRET= ...
    ```

2.  Use npm run dev for nodemon, so it updates as you code.
    ```
    cd backend
    npm run dev
    ```
