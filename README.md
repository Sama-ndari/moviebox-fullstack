# 🎬 MovieBox

A modern full-stack movie and TV show streaming platform built with NestJS, React, TypeScript, and MongoDB. Features include user authentication, watchlists, reviews, ratings, recommendations, real-time notifications, and comprehensive content management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## ✨ Features

### 🎥 Content Management
- Browse movies and TV shows with advanced filtering
- Detailed content pages with cast, crew, and metadata
- Season and episode management for TV shows
- Trending, popular, top-rated, and upcoming content
- Genre-based content discovery
- Advanced search functionality

### 👤 User Features
- User authentication (JWT-based)
- User profiles with follow/unfollow functionality
- Personal watchlists with notes and priorities
- Watch history tracking with progress
- Content reviews and ratings
- Real-time notifications via WebSockets

### 🤖 Smart Features
- Personalized content recommendations
- Similar content suggestions
- Analytics and insights
- Email notifications
- Image optimization

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Queue**: BullMQ
- **Authentication**: JWT + Passport
- **Real-time**: Socket.io
- **Documentation**: Swagger/OpenAPI
- **Image Processing**: Sharp
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Theme**: next-themes (Dark/Light mode)

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- Redis (optional, for caching)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/samandari/MovieBox.git
cd MovieBox
```

### 2. Backend Setup

```bash
cd moviebox-backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your configuration
# - MongoDB connection string
# - JWT secret
# - Redis configuration
# - SMTP settings

# Run in development mode
npm run start:dev

# Backend will run on http://192.168.40.107:8001/api/lite
# Swagger docs: http://192.168.40.107:8001/api/lite/docs
```

### 3. Frontend Setup

```bash
cd moviebox-frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with backend API URL
# VITE_API_BASE_URL=http://192.168.40.107:8001/api/lite

# Run in development mode
npm run dev

# Frontend will run on http://localhost:5173
```

## 🐳 Docker Setup

Run the entire stack with Docker Compose:

```bash
# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📁 Project Structure

```
MovieBox/
├── moviebox-backend/          # NestJS Backend
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── movie/        # Movies
│   │   │   ├── tv-show/      # TV Shows
│   │   │   ├── user/         # Users
│   │   │   ├── watchlist/    # Watchlists
│   │   │   ├── reviews/      # Reviews & Ratings
│   │   │   └── ...
│   │   ├── config/           # Configuration
│   │   ├── common/           # Shared utilities
│   │   └── helpers/          # Helper functions
│   └── package.json
│
├── moviebox-frontend/         # React Frontend
│   ├── client/
│   │   ├── src/
│   │   │   ├── api/          # API clients
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Page components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── lib/          # Utilities
│   │   │   ├── types/        # TypeScript types
│   │   │   └── store/        # State management
│   │   └── package.json
│   └── package.json
│
├── .github/
│   └── workflows/            # CI/CD pipelines
├── docker-compose.yml        # Docker orchestration
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)

```env
# Application
NODE_ENV=development
PORT=8001
API_PREFIX=api/lite
IP_ADDRESS=192.168.40.107

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviebox

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://192.168.40.107:8001/api/lite
VITE_APP_NAME=MovieBox
VITE_ENABLE_ANALYTICS=false
```

## 📚 API Documentation

Once the backend is running, access the Swagger documentation at:
```
http://192.168.40.107:8001/api/lite/docs
```

### Key Endpoints

- **Auth**: `/api/lite/auth/*` - Authentication & registration
- **Movies**: `/api/lite/movies/*` - Movie management
- **TV Shows**: `/api/lite/tv-shows/*` - TV show management
- **Users**: `/api/lite/users/*` - User management
- **Watchlist**: `/api/lite/watchlist/*` - Watchlist operations
- **Reviews**: `/api/lite/reviews/*` - Reviews & ratings
- **Search**: `/api/lite/search` - Global search

## 🧪 Testing

```bash
# Backend tests
cd moviebox-backend
npm test

# Frontend tests
cd moviebox-frontend
npm test
```

## 🏗️ Build for Production

### Backend

```bash
cd moviebox-backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd moviebox-frontend
npm run build
# Output in dist/ directory
```

## 🚢 Deployment

### Backend Deployment
- Deploy to services like Heroku, Railway, Render, or AWS
- Ensure MongoDB Atlas is accessible
- Set production environment variables

### Frontend Deployment
- Deploy to Netlify, Vercel, or any static hosting
- Update `VITE_API_BASE_URL` to production backend URL

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting (100 requests/minute)
- CORS configuration
- Helmet.js security headers
- Input validation with class-validator
- XSS protection

## 🎨 UI Features

- Responsive design (mobile, tablet, desktop)
- Dark/Light theme toggle
- Smooth animations with Framer Motion
- Lazy loading with code splitting
- Optimized images
- Keyboard shortcuts
- Error boundaries
- Loading states

## 📊 Performance Optimizations

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Code splitting for reduced bundle size
- Image optimization with Sharp
- Lazy loading of routes and components
- React Query for efficient data fetching

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Samandari**
- GitHub: [@samandari](https://github.com/samandari)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React team for the UI library
- shadcn for the beautiful UI components
- All open-source contributors

## 📞 Support

For support, email sammynegalbert@gmail.com or open an issue on GitHub.

---

⭐ If you like this project, please give it a star on GitHub!
