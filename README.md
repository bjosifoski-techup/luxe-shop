# Luxe Furniture - E-commerce Platform

A modern, full-stack furniture e-commerce platform built with Next.js 14, Supabase, and TypeScript.

## Features

### Public Features
- **Homepage** with featured products and category showcase
- **Product Catalog** with advanced filtering, search, and sorting
- **Product Detail Pages** with image galleries and product information
- **Shopping Cart** with persistent storage and real-time updates
- **Checkout Flow** with shipping information collection
- **Responsive Design** optimized for all devices

### User Features
- **Authentication** (Sign up, Login, Logout) using Supabase Auth
- **User Profile** management
- **Order History** with detailed order tracking
- **Saved Addresses** for quick checkout

### Admin Features
- **Product Management** (Create, Read, Update, Delete)
- **Category Management** with image upload support
- **Order Management** with status updates
- **Inventory Tracking**

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod validation
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Database Schema

The platform uses a PostgreSQL database with the following main tables:

- `categories` - Product categories
- `products` - Product catalog with images, pricing, and inventory
- `orders` - Customer orders with shipping and payment information
- `order_items` - Individual items within orders
- `user_profiles` - Extended user information with admin flags

All tables include Row Level Security (RLS) policies for secure data access.

## Prerequisites

- Node.js 18+ and npm
- Supabase account (automatically configured)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The Supabase connection is already configured in the `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database Setup

The database schema and seed data have already been applied via Supabase migrations. The database includes:

- 4 product categories (Living Room, Bedroom, Dining, Office)
- 16 sample products with images
- Configured RLS policies for secure access

### 4. Create Admin User

To access admin features:

1. Sign up for a new account at `/auth/signup`
2. After registration, manually update the user profile in Supabase:
   ```sql
   UPDATE user_profiles
   SET is_admin = true
   WHERE id = 'your-user-id';
   ```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 6. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                      # Next.js app router pages
│   ├── admin/               # Admin panel pages
│   ├── auth/                # Authentication pages
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   ├── orders/              # Order history
│   ├── products/            # Product catalog
│   └── profile/             # User profile
├── components/              # Reusable React components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utility functions and configurations
│   ├── supabase/           # Supabase client and types
│   ├── auth-context.tsx    # Authentication context
│   └── cart.ts             # Cart management utilities
└── public/                  # Static assets
```

## Key Features Explained

### Authentication
Uses Supabase Auth with email/password authentication. Automatic profile creation on signup via database triggers.

### Shopping Cart
Client-side cart management using localStorage with real-time UI updates via custom events.

### Admin Panel
Protected routes accessible only to users with `is_admin = true`. Includes full CRUD operations for products, categories, and order management.

### Image Management
Product images use direct URLs (optimized with Pexels stock photos). Supabase Storage can be integrated for custom uploads.

### Order Processing
Demo checkout flow creates orders in the database. Stripe integration placeholder included for future payment processing.

## Security Features

- Row Level Security (RLS) on all database tables
- Admin-only routes and operations
- Secure authentication flow
- Input validation and sanitization
- Protected API endpoints

## Demo Credentials

Create a new account via the signup page. For admin access, manually update the `is_admin` flag in the database as described above.

## Sample Data

The platform includes:
- 4 categories with images
- 16 products across different categories
- Various price points ($279 - $2,499)
- Mixed stock levels for realistic demo

## Future Enhancements

- Stripe payment integration
- Product reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Email notifications
- Inventory alerts
- Analytics dashboard

## Troubleshooting

### Build Warnings
The Supabase Realtime dependency warnings are normal and don't affect functionality.

### Type Issues
Some Supabase type inference issues are handled with `@ts-expect-error` comments. This is a known limitation with generated types.

### Authentication Issues
Ensure the Supabase URL and anon key are correctly configured in `.env`.

## License

This project is for demonstration purposes.

## Support

For issues or questions, please refer to the documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
