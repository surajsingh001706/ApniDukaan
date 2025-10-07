# ApniDukaan

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MERN Stack](https://img.shields.io/badge/Tech-MERN%20Stack-brightgreen.svg)](https://mernjs.com/)

## Overview

Welcome to **ApniDukaan**, a scalable, full-stack vendor platform designed for multi-vendor operations. This application empowers vendors to manage products, track orders, and process secure payments, while providing administrators with a comprehensive dashboard for oversight and analytics. Built with modern technologies, it ensures high performance, robust security, and an intuitive user experience.

Key highlights:
- **Multi-Vendor Support**: Vendors can upload, manage, and sell products seamlessly.
- **Secure Payments**: Integrated with PayPal for compliant, hassle-free transactions.
- **Real-Time Analytics**: Admin dashboard offers live insights into sales, orders, and vendor performance.
- **Scalable Architecture**: Optimized for growth with caching, lazy loading, and efficient API design.

This project demonstrates end-to-end development using the MERN stack, focusing on best practices for security, performance, and maintainability.

## Features

- **Vendor Management**:
  - Product catalog creation and editing with image uploads via Cloudinary.
  - Order tracking and fulfillment status updates.
  - Secure checkout with real-time inventory management.

- **Admin Dashboard**:
  - Vendor approval and monitoring.
  - Sales analytics with visualizations (e.g., revenue trends, top products).
  - Order oversight and dispute resolution.

- **User Features**:
  - Role-based access: Buyers, Vendors, and Admins.
  - Responsive UI with lazy loading for fast navigation.
  - Real-time notifications via WebSockets (extensible with Redis pub/sub).

- **Security & Performance**:
  - JWT-based authentication with RBAC for granular permissions.
  - Redis caching for API optimization and session management.
  - PayPal API integration for PCI-compliant payments.

## Tech Stack

| Category          | Technologies                          |
|-------------------|---------------------------------------|
| **Backend**       | Node.js, Express.js, MongoDB, Redis   |
| **Frontend**      | React, Redux Toolkit, Tailwind CSS    |
| **Database**      | MongoDB (NoSQL for flexible schemas)  |
| **Media Handling**| Cloudinary (image/video storage)      |
| **Payments**      | PayPal API                            |
| **Other Tools**   | JWT (auth), Axios (API calls), Nodemon (dev) |

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas cloud instance)
- Redis (for caching; optional but recommended)
- PayPal Sandbox Account (for testing payments)
- Cloudinary Account (for media uploads)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/surajsingh001706/ApniDukaan.git
cd ApniDukaan
```

### 2. Backend Setup
The backend is in the `/backend` directory.

```bash
cd backend
npm install
```

- Create a `.env` file in `/backend` and add the following (replace placeholders with your values):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_URL=your_redis_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

- Start MongoDB and Redis services.
- Run the backend:
```bash
npm run dev  # For development with Nodemon
# or
npm start    # For production
```

### 3. Frontend Setup
The frontend is in the `/frontend` directory.

```bash
cd ../frontend
npm install
```

- Update the API base URL in `/frontend/src/utils/api.js` if needed:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

- Run the frontend:
```bash
npm start  # Starts on http://localhost:3000
```

### 4. Database Initialization
- The backend includes Mongoose models for Users, Products, Orders, and Vendors.
- On first run, seed initial data (optional script in `/backend/scripts/seed.js`):
```bash
cd backend
node scripts/seed.js
```

## Usage

1. **Access the Platform**:
   - Frontend: Open `http://localhost:3000` in your browser.
   - Register as a Buyer, Vendor, or use admin credentials (default: admin@example.com / password123).

2. **Vendor Workflow**:
   - Login as Vendor → Dashboard → Add Product (upload images via Cloudinary).
   - Monitor orders in real-time.

3. **Admin Workflow**:
   - Login as Admin → Analytics Dashboard → View sales charts, approve vendors.

4. **Buyer Workflow**:
   - Browse products → Add to cart → Checkout with PayPal.

5. **Testing Payments**:
   - Use PayPal Sandbox for simulated transactions. Ensure webhook endpoints are configured in PayPal Developer Dashboard.

## API Documentation

The backend exposes RESTful APIs at `/api/v1`. Use tools like Postman for testing.

### Key Endpoints
| Method | Endpoint                  | Description                          | Auth Required |
|--------|---------------------------|--------------------------------------|---------------|
| POST   | `/auth/register`          | User/Vendor registration             | No            |
| POST   | `/auth/login`             | JWT token generation                 | No            |
| GET    | `/products`               | Fetch all products (paginated)       | No            |
| POST   | `/products`               | Create new product                   | Yes (Vendor)  |
| GET    | `/orders`                 | Fetch user orders                    | Yes           |
| POST   | `/orders/checkout`        | Initiate PayPal payment              | Yes           |
| GET    | `/admin/analytics`        | Sales and metrics overview           | Yes (Admin)   |

- All endpoints use JSON payloads.
- Error handling: Standardized responses with status codes (e.g., 401 for unauthorized).

For full OpenAPI spec, run `npm run docs` in `/backend` (generates Swagger UI at `/api-docs`).

## Performance Optimizations

- **Caching**: Redis stores frequent queries (e.g., product lists) with TTL.
- **Frontend**: Redux Toolkit for state management, lazy loading for routes, and batched API calls via RTK Query.
- **Backend**: Rate limiting with `express-rate-limit`, compression middleware.

## Security Considerations

- **Authentication**: JWT tokens expire in 7 days; refresh tokens handled securely.
- **RBAC**: Middleware enforces roles (e.g., only admins access `/admin/*`).
- **Payments**: All sensitive data tokenized; no storage of card details.
- **Best Practices**: Input validation with Joi, HTTPS enforcement in production, CORS configured for frontend origin.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Ensure code adheres to ESLint standards and includes tests (using Jest for backend, React Testing Library for frontend).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, reach out via GitHub Issues or the repository owner: [surajsingh001706](https://github.com/surajsingh001706).

---
