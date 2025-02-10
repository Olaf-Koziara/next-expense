# In production

# Budget Management App (Next.js)

## Overview

This is a **budget management app** built with **Next.js**. It allows users to track their expenses and incomes,
visualize financial trends, and categorize transactions. The app provides an intuitive interface for budget planning and
financial insights.

## Features

- **Expense & Income Tracking**: Add, edit, and delete transactions categorized as income or expenses.
![Screenshot 2025-02-10 at 17 00 22 (2)](https://github.com/user-attachments/assets/e57b5622-930f-4242-9f6b-7b965bc0acc8)
- **Date-Based Filtering**: Filter transactions by date range to analyze specific periods.
- **Transaction Grouping**: Organize transactions into categories (e.g., food, travel, rent, salary).
- ![Screenshot 2025-02-10 at 17 02 30 (2)](https://github.com/user-attachments/assets/794562cc-1058-4021-bb7c-88119cb6246d)
- **Data Visualization**: Charts and graphs for financial insights.
- **Balance Calculation**: View real-time balance updates based on income vs. expenses.
- **Multi-Currency Support**: Convert and track expenses in different currencies.
- **Recurring Transactions**: Set up automatic recurring expenses/incomes (e.g., salary, rent, subscriptions).
- **Export Data**: Download reports in CSV or PDF format.
- **User Authentication**: Secure login and account management.
- **Dark Mode Support**: User-friendly dark mode for better usability.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Context API / Zustand (Optional: Redux Toolkit)
- **Database**: MongoDB with Mongoose
- **Backend API**: Next.js API Routes (or Express.js if separated backend)
- **Charting Library**: Recharts / Chart.js
- **Authentication**: NextAuth.js / Firebase Auth

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/budget-management-app.git
cd budget-management-app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the necessary environment variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_next_auth_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Transactions

- `POST /api/transactions` - Add a new transaction
- `GET /api/transactions` - Fetch all transactions
- `GET /api/transactions?startDate=&endDate=` - Get transactions filtered by date
- `DELETE /api/transactions/:id` - Delete a transaction

### Users

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Get user session

## Future Enhancements

- **AI-powered Budget Recommendations**: Get suggestions based on past spending habits.
- **Personalized Savings Goals**: Set monthly/annual savings targets.
- **Investment Tracking**: Monitor stock investments and returns.
- **Bank API Integration**: Sync transactions directly from your bank.
- **Push Notifications**: Alerts for exceeding budget limits.

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.



