# ✍️ Blog API

A full-stack Blog API built with **Node.js**, **Express**, **MySQL**, and a vanilla **HTML/CSS/JavaScript** frontend. Users can register, write posts, comment, like posts, and manage their profiles.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)

---

## ✨ Features

- 🔐 JWT Authentication (Register & Login)
- 📝 Full CRUD for blog posts
- 💬 Comments on posts
- ❤️ Like / Unlike posts
- 🔍 Search posts by title
- 📊 Sort posts by most liked
- 👤 Profile management (update name & password)
- 📄 My Posts page (view only your posts)
- 🛡️ Input validation on all routes
- 🔒 Protected routes with JWT middleware

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MySQL | Database |
| mysql2 | MySQL driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variables |
| cors | Cross-origin requests |
| nodemon | Development server |

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling |
| JavaScript | Interactivity |
| Live Server | Development server |

---

## 📁 Project Structure

```
blog/
├── config/
│   └── db.js                  # MySQL connection pool
├── controllers/
│   ├── authController.js      # Register & Login
│   ├── postController.js      # Post CRUD
│   ├── commentController.js   # Comment CRUD
│   ├── likeController.js      # Like/Unlike
│   └── userController.js      # Profile management
├── middleware/
│   ├── auth.js                # JWT verification
│   └── validate.js            # Input validation
├── routes/
│   ├── authRoutes.js
│   ├── postRoutes.js
│   ├── commentRoutes.js
│   ├── likeRoutes.js
│   └── userRoutes.js
├── frontend/
│   ├── style.css              # Global styles
│   ├── login.html             # Login page
│   ├── register.html          # Register page
│   ├── index.html             # All posts page
│   ├── post.html              # Single post page
│   ├── create.html            # Create post page
│   ├── myposts.html           # My posts page
│   └── profile.html           # Profile page
├── app.js                     # Express app & routes
├── server.js                  # Server entry point
├── .env                       # Environment variables
└── package.json
```

---

## 🗄️ Database Schema

```sql
blog_db
├── users       # User accounts
├── posts       # Blog posts
├── comments    # Comments on posts
└── likes       # Post likes
```

### Relationships
```
users ──────── posts    (one user → many posts)
users ──────── comments (one user → many comments)
users ──────── likes    (one user → many likes)
posts ──────── comments (one post → many comments)
posts ──────── likes    (one post → many likes)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm
- Live Server (for frontend)

### 1. Clone the repository

```bash
git clone https://github.com/ThivyaVenkatachalam/blog-api.git
cd blog-api
```

### 2. Setup the database

Open MySQL Workbench and run:

```sql
CREATE DATABASE blog_db;
USE blog_db;

CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  title      VARCHAR(255) NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  post_id    INT NOT NULL,
  user_id    INT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  post_id    INT NOT NULL,
  user_id    INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_like (post_id, user_id)
);
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog_db
JWT_SECRET=your_secret_key
PORT=4000
```

### 5. Start the backend

```bash
npm run dev
```

Backend runs on `http://localhost:4000`

### 6. Start the frontend

```bash
cd frontend
live-server
```

Frontend runs on `http://127.0.0.1:8080`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |

### Posts
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/posts` | Get all posts (search & sort) | Public |
| GET | `/api/posts/:id` | Get single post | Public |
| GET | `/api/posts/my` | Get my posts | Protected |
| POST | `/api/posts` | Create post | Protected |
| PUT | `/api/posts/:id` | Update post | Protected (owner) |
| DELETE | `/api/posts/:id` | Delete post | Protected (owner) |

### Comments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/posts/:id/comments` | Get comments | Public |
| POST | `/api/posts/:id/comments` | Add comment | Protected |
| PUT | `/api/posts/:id/comments/:commentId` | Edit comment | Protected (owner) |
| DELETE | `/api/posts/:id/comments/:commentId` | Delete comment | Protected (owner) |

### Likes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/posts/:id/like` | Get like count | Protected |
| POST | `/api/posts/:id/like` | Like / Unlike | Protected |

### Profile
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/profile` | Get profile | Protected |
| PUT | `/api/profile/update-name` | Update name | Protected |
| PUT | `/api/profile/update-password` | Update password | Protected |

---

## 🔍 Query Parameters

### Search posts by title
```
GET /api/posts?search=javascript
```

### Sort posts by most liked
```
GET /api/posts?sort=popular
```

### Combine search and sort
```
GET /api/posts?search=node&sort=popular
```

---

## 🖥️ Frontend Pages

| Page | File | Description |
|---|---|---|
| Register | `register.html` | Create new account |
| Login | `login.html` | Login to account |
| All Posts | `index.html` | View all posts with search & sort |
| Single Post | `post.html` | Read post, like, comment |
| Create Post | `create.html` | Write new post |
| My Posts | `myposts.html` | View your own posts |
| Profile | `profile.html` | Update name & password |

---

## 🔐 Authentication

This project uses **JWT (JSON Web Token)** authentication.

1. Register or Login → receive a token
2. Include token in every protected request:
```
Authorization: Bearer <your_token>
```
3. Token expires in **7 days**

---

## 🔄 Like System

- Each user can only like a post **once**
- Liking again automatically **unlikes** the post
- Like count is shown on every post card
- Posts can be sorted by most likes

---

## 🛡️ Validation Rules

| Field | Rule |
|---|---|
| Name | Required, not empty |
| Email | Required, must contain @ |
| Password | Required, minimum 6 characters |
| Post title | Required, minimum 3 characters |
| Post content | Required, minimum 10 characters |
| Comment | Required, minimum 2 characters |

---


