# 🌾 KOFTI Marketplace Platform

A comprehensive marketplace platform connecting farmers, vendors, and buyers through modern web technologies. Built with Next.js frontend and Nest.js backend for agricultural commerce and education.

🌐 **Live Demo**: [https://wie-act-esprit.vercel.app](https://wie-act-esprit.vercel.app)

## 🚀 Tech Stack

### Frontend
- **Next.js + TypeScript** - React framework with type safety
- **TailwindCSS** - Modern CSS framework for styling
- **Axios** - HTTP client for API requests
- **React Query** - Data fetching and caching
- **Vercel** - Deployment platform

### Backend
- **Nest.js + TypeScript** - Scalable Node.js framework
- **MongoDB Atlas + Mongoose** - Cloud NoSQL database with ODM
- **JWT + Passport** - Authentication and authorization
- **Axios-compatible APIs** - RESTful API design
- **Vercel** - Serverless deployment platform

## 📌 Features

### For Farmers & Vendors
- **Vendor Dashboard**: Add and manage products/services
- **Profile Management**: Complete vendor profiles
- **Product CRUD**: Create, update, delete listings
- **Order Management**: Track and process customer orders

### For Buyers
- **Product Browsing**: Browse and filter agricultural products
- **Purchase System**: Complete purchasing workflow
- **Order Tracking**: Monitor order status and history
- **Educational Content**: Access farming resources and guides

### Platform Features
- **User Authentication**: Secure login/register for all user types
- **AI Assistant**: Intelligent farming and marketplace guidance
- **Educational Resources**: Farming knowledge and best practices
- **Articles & Learning**: Internal and external agricultural resources

## 📂 Project Structure

```
wie_act_esprit/
├── frontend/                    # Next.js Application (Deployed on Vercel)
│   ├── pages/                  # Next.js routing
│   │   ├── auth/              # Authentication pages
│   │   ├── vendor/            # Vendor dashboard
│   │   ├── buyer/             # Buyer interface
│   │   ├── articles/          # Educational articles and resources
│   │   └── api/               # API routes
│   ├── components/            # Reusable UI components
│   ├── styles/                # TailwindCSS styles
│   ├── utils/                 # Axios helpers and utilities
│   └── public/                # Static assets
├── backend/                    # Nest.js API Server (Deployed on Vercel)
│   └── src/
│       ├── auth/              # Authentication module
│       ├── users/             # User management (Buyer, Vendor)
│       ├── products/          # Product/service CRUD APIs
│       ├── orders/            # Transaction and order management
│       ├── marketplaces/      # Marketplace management
│       ├── notifications/     # Notification system
│       ├── payments/          # Payment processing
│       └── common/            # Shared DTOs, pipes, filters
└── README.md                  # Project documentation
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/natej-ghodbane/wie_act_esprit
cd wie_act_esprit
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Environment Setup**

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrihope
JWT_SECRET=yourSecretKey
PORT=3001
NODE_ENV=development
```

5. **Run Development Servers**

**Frontend (Terminal 1):**
```bash
cd frontend
npm run dev  # http://localhost:3000
```

**Backend (Terminal 2):**
```bash
cd backend
npm run start:dev  # http://localhost:3001/api
```

## 🏗️ Build for Production

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

## 🌍 Deployment

### Current Deployment
- **Frontend**: [Vercel](https://wie-act-esprit.vercel.app) - Automatic deployment from Git
- **Backend**: Vercel Serverless Functions - API endpoints
- **Database**: MongoDB Atlas - Cloud database

### Deployment Steps
1. Push to main branch for auto-deployment
2. Configure environment variables on Vercel
3. Set up MongoDB Atlas connection string
4. Configure CORS settings for production domains

## 🔧 Available Scripts

### Frontend Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting

### Backend Scripts
- `npm run start:dev` - Development with hot reload
- `npm run build` - Production build
- `npm run start:prod` - Production server
- `npm run test` - Run tests

## 🎯 User Roles

### Vendor/Farmer
- Product/service listing management
- Order processing and fulfillment
- Sales analytics and reporting
- Profile and business information
- Access to educational resources and articles

### Buyer
- Product browsing and purchasing
- Order tracking and history
- Profile management
- Access to educational content and learning materials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **Frontend Team**: Next.js, TailwindCSS, UI/UX
- **Backend Team**: Nest.js, MongoDB, API development
- **DevOps Team**: Deployment and infrastructure
