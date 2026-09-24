# YelpCamp

A full-stack campground listing and review web application where users can discover campgrounds, create their own listings, upload images, and leave reviews.

## Features

* User registration and authentication
* User login and logout
* Campground creation, editing, and deletion
* Campground image uploads
* Image storage using Cloudinary
* View campground details
* Add and delete reviews
* User authorization for protected actions
* Form validation
* Error handling
* Flash messages for user feedback
* Responsive user interface
* MongoDB database integration

## Tech Stack

### Frontend

* HTML
* CSS
* Bootstrap
* EJS
* JavaScript

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* Passport.js
* Express Session
* MongoDB Session Store
* Joi validation
* Helmet

### Image & Maps

* Cloudinary
* Mapbox

## Project Structure

```text
YelpCamp/
│
├── cloudinary/       # Cloudinary configuration
├── controllers/      # Application controllers
├── models/           # Mongoose database models
├── public/           # Static CSS and JavaScript files
├── routes/           # Express routes
├── seeds/            # Database seed data
├── uploads/          # Uploaded files
├── utility/          # Utility functions
├── views/            # EJS templates
│
├── index.js          # Main application entry point
├── middleware.js     # Custom middleware
├── schemas.js        # Joi validation schemas
├── package.json      # Project dependencies
└── .gitignore
```

## Core Functionality

### Campgrounds

Users can:

* Browse available campgrounds
* View individual campground details
* Create new campground listings
* Edit their own campgrounds
* Delete their own campgrounds
* Upload campground images

### Reviews

Users can:

* Add reviews to campgrounds
* View existing reviews
* Delete their own reviews

### Authentication & Authorization

The application uses authentication to manage user accounts and authorization to ensure that users can only perform actions they are permitted to perform.

Protected operations include campground and review management.

### Image Uploads

Campground images are uploaded and managed using **Cloudinary**, allowing images to be stored separately from the application's server.

### Validation

User-submitted data is validated before being processed to prevent invalid data from being stored in the database.

## Installation

Clone the repository:

```bash
git clone https://github.com/adwaithh4/YelpCamp.git
```

Navigate to the project:

```bash
cd YelpCamp
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory and add the required environment variables.

Example:

```env
DB_URL=your_mongodb_connection_string
SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

MAPBOX_TOKEN=your_mapbox_token
```

Start the application:

```bash
node index.js
```

For development with Nodemon:

```bash
nodemon index.js
```

The application will then be available locally at:

```text
http://localhost:3000
```

## Database

YelpCamp uses **MongoDB** as its database, with **Mongoose** used to define schemas and interact with the database.

The application contains models for the main entities such as:

* Users
* Campgrounds
* Reviews

## Application Flow

```text
User
  ↓
EJS Views
  ↓
Express Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Mongoose Models
  ↓
MongoDB
```

External services such as **Cloudinary** are used for image management and **Mapbox** for location-related functionality.

## Future Improvements

* Advanced campground search and filtering
* Pagination
* Improved image optimization
* Additional user profile features
* More advanced map functionality
* Automated testing
* Improved deployment and CI/CD workflow

