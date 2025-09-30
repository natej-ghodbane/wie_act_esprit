# AGRI-HOPE Marketplace Platform Instructions

## Core Architecture

### Application Flow
- Next.js frontend with page-based routing and server components
- Nest.js backend with modular architecture
- MongoDB for data persistence
- JWT-based authentication with role-specific access

### Key Dependencies
Frontend: Next.js, TailwindCSS, React Query, Axios
Backend: Nest.js, Mongoose, Passport-JWT, Class-validator
Shared: TypeScript, ESLint

## Development Workflow

### Local Setup
```bash
# Frontend (Terminal 1)
cd frontend && npm install
npm run dev  # http://localhost:3000

# Backend (Terminal 2)  
cd backend && npm install
npm run start:dev  # http://localhost:3001/api
```

### Environment Variables
Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Backend (.env):
```
MONGODB_URI=mongodb://localhost:27017/agrihope
JWT_SECRET=[secure-key]
PORT=3001
```

## Core Patterns

### Authentication Flow
```typescript
// Frontend auth check (see pages/buyer/dashboard.tsx)
useEffect(() => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  if (!token || !userData) router.push('/auth/login');
});

// Backend JWT guard (see backend/src/auth/jwt-auth.guard.ts)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### API Communication
```typescript
// Frontend API client (see utils/api.ts)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Automatic auth header injection
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Role-Based Access
- Admin: Platform management, user moderation
- Vendor/Farmer: Product listings, order fulfillment 
- Buyer: Browsing, purchasing, educational content

### Deployment
1. Frontend: Vercel (auto-deploy from main)
2. Backend: Render/Railway with MongoDB Atlas
3. Configure production CORS & env vars

## Project Structure Notes
- Use shared types from `common/dto/types.ts`
- Place reusable UI in `components/ui/*`
- Follow module pattern in backend services
- Maintain role separation in route structure