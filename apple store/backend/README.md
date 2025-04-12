# Apple Store Backend API

This is the backend API for the Apple Store Clone application. It provides all the necessary endpoints for product management, user authentication, shopping cart operations, and order processing.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory
   ```
   cd backend
   ```
3. Install dependencies
   ```
   npm install
   ```
4. Create a `.env` file in the `config` directory based on the example
5. Start the development server
   ```
   npm run dev
   ```
   
## Environment Variables

Create a `.env` file in the `config` directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/apple_store
JWT_SECRET=yoursecretkey
JWT_EXPIRE=30d
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=1000000
```

## API Endpoints

### Products

- GET `/api/products` - Get all products (with filters, sorting, pagination)
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create a product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)
- PUT `/api/products/:id/image` - Upload product image (Admin)

### Users

- POST `/api/users/register` - Register user
- POST `/api/users/login` - Login user
- GET `/api/users/logout` - Logout user
- GET `/api/users/me` - Get current user
- PUT `/api/users/profile` - Update user profile
- PUT `/api/users/password` - Update password

### Cart

- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:itemId` - Update cart item quantity
- DELETE `/api/cart/:itemId` - Remove item from cart
- DELETE `/api/cart` - Clear cart

### Orders

- POST `/api/orders` - Create new order
- GET `/api/orders` - Get all orders for current user
- GET `/api/orders/all` - Get all orders (Admin)
- GET `/api/orders/:id` - Get order by ID
- PUT `/api/orders/:id/pay` - Update order to paid
- PUT `/api/orders/:id/status` - Update order status (Admin)
- PUT `/api/orders/:id/cancel` - Cancel order

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid Bearer token in the Authorization header.

## Error Handling

The API returns consistent error responses in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Data Models

### User

- firstName
- lastName
- email
- password (hashed)
- role (user, admin)
- address
- phone
- createdAt

### Product

- name
- description
- price
- category
- subcategory
- images
- colors
- storage
- features
- specifications
- inStock
- quantity
- shipping
- isNewRelease
- isFeatured
- rating
- numReviews
- createdAt

### Cart

- user
- items (array of product items)
- totalQuantity
- totalPrice
- createdAt
- updatedAt

### Order

- user
- items
- shippingAddress
- paymentMethod
- paymentResult
- subtotal
- taxPrice
- shippingPrice
- totalPrice
- isPaid
- paidAt
- isDelivered
- deliveredAt
- trackingNumber
- estimatedDelivery
- status
- createdAt 