# Razorpay Setup Guide

## Frontend Configuration

### 1. Environment Variables
Create or update your `.env` file in the Frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=https://backend.themodesse.com

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
```

### 2. Get Razorpay Keys
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login to your account
3. Go to Settings → API Keys
4. Generate a new key pair
5. Copy the **Key ID** (starts with `rzp_test_` for test mode)
6. Add it to your `.env` file

## Backend Configuration

### 1. Environment Variables
Add these to your backend `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
```

### 2. Get Razorpay Secret
1. In the same Razorpay Dashboard
2. Copy the **Key Secret** (the longer string)
3. Add it to your backend `.env` file

## Important Notes

1. **Test Mode**: Use keys starting with `rzp_test_` for testing
2. **Live Mode**: Use keys starting with `rzp_live_` for production
3. **Security**: Never commit your `.env` files to version control
4. **Key Secret**: Only use the Key Secret on the backend, never expose it to frontend

## Testing

1. Start your frontend: `npm run dev`
2. Start your backend: `php artisan serve`
3. Try making a test payment with Razorpay
4. Check the console for any configuration errors 