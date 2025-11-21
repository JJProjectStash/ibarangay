# Barangay Services Frontend

Modern, responsive React frontend for the Barangay Online Services System built with React, TypeScript, and Vite.

## 🎨 Features

- **Modern UI/UX**: Clean, intuitive interface following the design specifications
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Live notifications and status updates
- **Type-Safe**: Full TypeScript implementation for better developer experience
- **Fast Performance**: Built with Vite for lightning-fast development and builds

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.tsx      # Navigation bar with auth state
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Registration page
│   ├── Services.tsx    # Borrow & Return services
│   ├── Complaints.tsx  # Complaint management
│   ├── Events.tsx      # Event listing and registration
│   └── Notifications.tsx # Notification center
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication state management
├── services/           # API service layer
│   └── api.ts          # Axios API client
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types and interfaces
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and CSS variables
```

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## 🛠️ Installation

1. **Navigate to frontend directory**:

   ```bash
   cd barangay-services-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Application will run on `http://localhost:5173` with hot-reload enabled.

### Production Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

Locally preview the production build.

## 🎨 Design System

### Color Palette

The application uses a carefully selected color palette from the design files:

- **Primary**: `#1E3A8A` (Deep Blue) - Main brand color
- **Secondary**: `#3B82F6` (Blue) - Accent color
- **Accent**: `#10B981` (Green) - Success states
- **Background**: `#F9FAFB` (Light Gray) - Page background
- **Surface**: `#FFFFFF` (White) - Card backgrounds
- **Text Primary**: `#1F2937` (Dark Gray) - Main text
- **Text Secondary**: `#6B7280` (Gray) - Secondary text
- **Error**: `#EF4444` (Red) - Error states
- **Warning**: `#F59E0B` (Orange) - Warning states

### Typography

- Font Family: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
- Responsive font sizes with mobile-first approach

### Components

- **Buttons**: Primary, Secondary, and Outline variants
- **Cards**: Elevated cards with hover effects
- **Badges**: Status indicators with color coding
- **Inputs**: Consistent form controls with focus states
- **Modals**: Overlay modals for forms and actions

## 📱 Pages Overview

### Home Page

- Hero section with call-to-action
- Service cards grid
- Information section
- Footer

### Authentication

- **Login**: Email/password authentication with demo accounts
- **Signup**: Multi-step registration form with validation

### Services (Borrow & Return)

- View all service requests
- Create new borrow requests
- Track request status (Pending, Approved, Borrowed, Returned, Rejected)
- View request details and history

### Complaints

- Submit new complaints
- View complaint history
- Track complaint status (Pending, In Progress, Resolved, Closed)
- Priority levels (Low, Medium, High)
- View admin responses

### Events

- Browse upcoming barangay events
- Event details (date, location, attendees)
- Register/unregister for events
- View registration status

### Notifications

- Real-time notification center
- Mark notifications as read
- Delete notifications
- Notification types (Info, Success, Warning, Error)

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically included in API requests
4. Protected routes redirect to login if not authenticated
5. Token expiration handled with automatic logout

## 🌐 API Integration

The frontend communicates with the backend API through the `api.ts` service:

- Axios instance with interceptors
- Automatic token injection
- Error handling and token refresh
- Type-safe API calls

### Example API Usage

```typescript
import api from "../services/api";

// Login
const response = await api.login(email, password);

// Create service request
await api.createServiceRequest({
  itemName: "Tent",
  itemType: "Equipment",
  borrowDate: "2024-12-25",
  expectedReturnDate: "2024-12-27",
  purpose: "Family gathering",
  quantity: 2,
});

// Get notifications
const notifications = await api.getNotifications();
```

## 📦 Key Dependencies

- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **date-fns**: Date formatting and manipulation
- **lucide-react**: Icon library
- **typescript**: Type safety
- **vite**: Build tool and dev server

## 🎯 Features by User Role

### Resident

- Submit service requests
- File complaints
- Register for events
- View notifications
- Update profile

### Staff

- View all service requests
- Manage complaints
- Create and manage events

### Admin

- Full access to all features
- User management capabilities
- System administration

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder contains the production-ready static files that can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Environment Variables for Production

Make sure to set the correct API URL for your production backend:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

## 🧪 Testing

Test the application by:

1. Starting the backend server
2. Running the frontend in development mode
3. Using the demo accounts to test different user roles
4. Testing all CRUD operations for services, complaints, and events

## 📱 Responsive Design

The application is fully responsive with breakpoints for:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `src/index.css`:

```css
:root {
  --primary: #1e3a8a;
  --secondary: #3b82f6;
  /* ... other colors */
}
```

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navbar.tsx`

## 🤝 Contributing

This is a presentation project. For production use, consider:

- Adding form validation library (React Hook Form, Formik)
- Implementing state management (Redux, Zustand)
- Adding testing (Jest, React Testing Library)
- Implementing PWA features
- Adding analytics
- Optimizing images and assets
- Adding error boundaries

## 📄 License

MIT License - Feel free to use this for your projects!

## 🆘 Support

For issues or questions, please refer to the documentation or create an issue in the repository.

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)
