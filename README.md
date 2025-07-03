# 🎵 Spotify-like Music Streaming App

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) music streaming application with modern UI design, user authentication, playlist management, and admin features.

## ✨ Features

### 🎧 User Features

- **User Authentication**: Secure login/register system
- **Music Library**: Browse and search through songs
- **Playlist Management**: Create, edit, and manage playlists
- **Audio Player**: Full-featured player with queue, skip, repeat, shuffle
- **Queue Management**: Add songs to queue and manage playback
- **Search Functionality**: Search songs by title, artist, album, or genre
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 👨‍💼 Admin Features

- **Song Management**: Add, edit, delete songs with file upload
- **User Management**: View user statistics and manage accounts
- **Analytics Dashboard**: View music library statistics
- **Admin Panel**: Dedicated admin interface with enhanced controls

### 🎨 UI/UX Features

- **Modern Design**: Spotify-inspired dark theme with gradients
- **Glassmorphism**: Beautiful backdrop blur effects
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Adaptive design for all screen sizes
- **Toast Notifications**: User feedback for actions
- **Loading States**: Professional loading indicators

## 🛠️ Tech Stack

### Frontend

- **React.js** - UI framework
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd spotify
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the backend directory:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start the application**

   ```bash
   # Start backend server (from backend directory)
   npm start

   # Start frontend development server (from frontend directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
spotify/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── uploads/         # Audio file uploads
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   └── index.js     # App entry point
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Authentication

- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Songs

- `GET /api/songs` - Get all songs
- `POST /api/songs` - Add new song (admin only)
- `PUT /api/songs/:id` - Update song (admin only)
- `DELETE /api/songs/:id` - Delete song (admin only)
- `POST /api/songs/:id/play` - Increment play count

### Playlists

- `GET /api/playlists` - Get user playlists
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

### Admin

- `GET /api/admin/stats` - Get admin statistics

## 👤 User Roles

### Regular User

- Browse and search songs
- Create and manage playlists
- Add songs to queue
- Play music with full controls

### Admin User

- All regular user features
- Add, edit, delete songs
- Upload audio files
- View admin dashboard
- Manage music library

## 🎨 Design Features

- **Dark Theme**: Spotify-inspired dark color scheme
- **Gradient Effects**: Beautiful gradient backgrounds and buttons
- **Glassmorphism**: Modern backdrop blur effects
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS transitions and hover effects
- **Modern Typography**: Clean and readable fonts

## 🔧 Configuration

### Backend Configuration

- Database connection in `backend/server.js`
- File upload settings in `backend/middleware/upload.js`
- Authentication middleware in `backend/middleware/auth.js`

### Frontend Configuration

- API base URL in Redux slices
- Route configuration in `App.js`
- Theme configuration in `tailwind.config.js`

## 🚀 Deployment

### Backend Deployment

1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Spotify's design and functionality
- Built with modern web technologies
- Special thanks to the open-source community

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Happy Coding! 🎵**
