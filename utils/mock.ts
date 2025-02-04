const categories = ['food', 'house', 'family', 'sport'];

const now = new Date();
const oneWeekAgo = new Date();
oneWeekAgo.setDate(now.getDate() - 7);

const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomAmount = () => {
    return parseFloat((Math.random() * 100).toFixed(2));
};

export const generateExpenses = (num: number) => {
    const expenses = [];
    for (let i = 0; i < num; i++) {
        const date = getRandomDate(oneWeekAgo, now);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const amount = getRandomAmount();
        const title = expenseTitles[Math.floor(Math.random() * expenseTitles.length)];
        expenses.push({date: date.toISOString().split('T')[0], category, amount, title});
    }
    return expenses;
};
const expenseTitles = [
    "Office Supplies",
    "Electricity Bill",
    "Water Bill",
    "Internet Subscription",
    "Mobile Phone Bill",
    "Software Subscriptions",
    "Transportation Costs",
    "Fuel Expenses",
    "Parking Fees",
    "Groceries",
    "Dining Out",
    "Rent Payment",
    "Mortgage Payment",
    "Property Taxes",
    "Car Maintenance",
    "Health Insurance",
    "Life Insurance",
    "Pet Expenses",
    "Gym Membership",
    "Childcare Costs",
    "Tuition Fees",
    "School Supplies",
    "Clothing Purchases",
    "Entertainment",
    "Streaming Services",
    "Vacation Expenses",
    "Home Repairs",
    "Furniture Purchase",
    "Electronics Purchase",
    "Credit Card Payments",
    "Loan Repayment",
    "Charitable Donations",
    "Holiday Gifts",
    "Laundry Services",
    "Legal Fees",
    "Professional Development",
    "Business Travel",
    "Event Tickets",
    "House Cleaning Services",
    "Landscaping Costs",
    "Banking Fees",
    "Subscription Boxes",
    "Fitness Equipment",
    "Hobbies and Crafts",
    "Books and Magazines",
    "Music Lessons",
    "Medical Bills",
    "Prescriptions",
    "Dental Expenses",
    "Emergency Fund Deposit"
];
