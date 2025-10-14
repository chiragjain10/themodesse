# The Modesse - Frontend

This is the frontend application for The Modesse e-commerce platform built with Vue.js 3.

## Features

- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add, remove, and manage cart items
- **User Authentication**: Login, register, and profile management
- **Checkout Process**: Complete order placement with payment integration
- **Payment Gateway**: Razorpay integration for online payments
- **Order Management**: Track and view order history
- **Responsive Design**: Mobile-first responsive design

## Payment Integration

### Razorpay Setup

1. **Get Razorpay Keys**:
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Get your test keys from the dashboard
   - For production, use live keys

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_API_BASE_URL=http://localhost:8000
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   VITE_APP_BASE_URL=http://localhost:3000
   ```

3. **Payment Flow**:
   - User selects Razorpay as payment method
   - System creates Razorpay order
   - User completes payment on Razorpay modal
   - Payment is verified on backend
   - Order is confirmed and user is redirected

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API configuration
├── assets/           # Static assets
├── components/       # Reusable components
├── composables/      # Vue composables
├── elements/         # Page components
├── router/           # Vue router configuration
├── services/         # API services
├── stores/           # Pinia stores
└── utils/            # Utility functions
```

## API Integration

The frontend communicates with the Laravel backend API. Make sure the backend is running and properly configured.

## Payment Methods

- **Cash on Delivery (COD)**: Pay when you receive
- **Razorpay**: Online payment gateway
- **Stripe**: Alternative payment gateway (configured but not active)

## Development

### Adding New Payment Methods

1. Add payment method to backend `payment_types` table
2. Update frontend payment methods display
3. Add payment processing logic in checkout
4. Test payment flow thoroughly

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:8000 |
| VITE_RAZORPAY_KEY_ID | Razorpay public key | rzp_test_xxx |
| VITE_APP_BASE_URL | Frontend base URL | http://localhost:3000 |

## Troubleshooting

### Payment Issues
- Check Razorpay keys are correct
- Verify backend is running
- Check network connectivity
- Review browser console for errors

### CORS Issues
- Ensure backend CORS is configured
- Check API URL is correct
- Verify authentication headers

## Support

For issues and questions, please contact the development team.
