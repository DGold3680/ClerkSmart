# ClerkSmart Email Integration with Resend

This repository contains the implementation of email functionality for ClerkSmart, a medical education platform. The email integration allows students to receive detailed feedback reports about their clinical performance.

## Implementation Overview

We've implemented email functionality using [Resend](https://resend.com), a modern email API that works seamlessly with React and Next.js.

### Key Components

1. **React Email Template**: We've created a beautiful, responsive email template using React Email components.
2. **Next.js API Route**: A serverless function that securely handles email sending with Resend.
3. **Email Service**: A client-side service that communicates with the API route.
4. **Email Capture Modal**: A user interface for collecting email addresses.

## Setup Instructions

For detailed setup instructions, see [RESEND_SETUP.md](./RESEND_SETUP.md).

## Features

- **Beautiful Email Templates**: Responsive, well-designed emails that look great on all devices.
- **Secure API Key Handling**: API keys are stored securely as environment variables.
- **Error Handling**: Comprehensive error handling for a smooth user experience.
- **Email Validation**: Basic validation to ensure valid email addresses.

## Usage

Students can receive detailed feedback reports by:

1. Completing a clinical case in ClerkSmart
2. Viewing their feedback on the feedback page
3. Clicking "Email Me the Full Report"
4. Entering their email address (if not already provided)

The system will then send a comprehensive report to their email address.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# ClerkSmart - Intelligent Clinical Reasoning Simulator

## Autumn Billing Setup

ClerkSmart uses [Autumn](https://useautumn.com/) for billing and subscription management. Follow these steps to set up Autumn integration:

### 1. Install Dependencies
```bash
npm install autumn-js
```

### 2. Environment Variables
Add the following to your `.env.local` file:

```env
# Autumn Configuration
AUTUMN_SECRET_KEY=am_sk_your_autumn_secret_key_here
NEXT_PUBLIC_AUTUMN_BACKEND_URL=http://localhost:3000
```

Get your Autumn secret key from the [Autumn Dashboard](https://dashboard.useautumn.com/).

### 3. Create Products in Autumn Dashboard

You need to create the following products in your Autumn dashboard:

#### Standard Pricing Product
- **Product ID**: `pro-standard`
- **Name**: "ClerkSmart PRO - Standard"
- **Price**: $29/month
- **Features**: Add a "cases" feature with unlimited usage

#### Emerging Markets Product  
- **Product ID**: `pro-emerging`
- **Name**: "ClerkSmart PRO - Emerging Markets"
- **Price**: $15/month
- **Features**: Add a "cases" feature with unlimited usage

#### Developing Regions Product
- **Product ID**: `pro-developing` 
- **Name**: "ClerkSmart PRO - Developing"
- **Price**: $9/month
- **Features**: Add a "cases" feature with unlimited usage

### 4. Database Migration

Run the Prisma migration to add trial tracking:

```bash
npx prisma db push
```

### 5. Stripe Configuration

In your Autumn dashboard, connect your Stripe account to enable payments.

## Features

- **Location-based Pricing**: Automatic regional pricing based on user location
- **Trial System**: 5 free cases before payment required
- **Subscription Management**: Powered by Autumn + Stripe
- **Medical Case Generation**: AI-powered clinical scenarios

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.
