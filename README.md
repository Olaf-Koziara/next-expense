# In production
Trial version: https://next-expense.netlify.app/ 
Account for testing: test@gmail.com 12test34
# Budget Management App (Next.js)

## Overview

This is a **budget management app** built with **Next.js**. It allows users to track their expenses and incomes,
visualize financial trends, and categorize transactions. The app provides an intuitive interface for budget planning and
financial insights.

## Features

- **Expense & Income Tracking**: Add, edit, and delete transactions categorized as income or expenses.
<img width="2704" height="1434" alt="image" src="https://github.com/user-attachments/assets/e4d76bf0-9be0-4677-ae67-972706d03038" />

- **Date-Based Filtering**: Filter transactions by date range to analyze specific periods.
- **Transaction Grouping**: Organize transactions into categories (e.g., food, travel, rent, salary).
<img width="1772" height="1384" alt="image" src="https://github.com/user-attachments/assets/62e24b85-2221-490a-a1fb-cf5f1c4ec4bb" />
- **Data Visualization**: Charts and graphs for financial insights.
- <img width="2687" height="1446" alt="image" src="https://github.com/user-attachments/assets/8c33d644-543e-4b22-8961-a2de15da7b51" />
- **Balance Calculation**: View real-time balance updates based on income vs. expenses.
- **Multi-Currency Support**: Convert and track expenses in different currencies.
- **Recurring Transactions**: Set up automatic recurring expenses/incomes (e.g., salary, rent, subscriptions).
- **Export Data**: Download reports in CSV or PDF format.
- **User Authentication**: Secure login and account management.
- **Dark Mode Support**: User-friendly dark mode for better usability.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Context API 
- **Database**: MongoDB with Mongoose
- **Backend API**: Next.js API Routes 
- **Charting Library**: Recharts 
- **Authentication**: NextAuth.js 

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



