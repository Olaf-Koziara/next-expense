import {Expense} from "@/app/(root)/expenses/columns";

const categories = [
    "Jedzenie",
    "Transport",
    "Rozrywka",
    "Rachunki",
    "Zakupy",
    "Zdrowie",
    "Edukacja",
    "Sport",
    "Podróże",
    "Dom"
];

const titles = {
    "Jedzenie": ["Zakupy spożywcze", "Restauracja", "Dostawa jedzenia", "Kawiarnia", "Fast food"],
    "Transport": ["Paliwo", "Bilet miesięczny", "Uber", "Serwis samochodu", "Parking"],
    "Rozrywka": ["Kino", "Koncert", "Netflix", "Gry", "Książki"],
    "Rachunki": ["Prąd", "Gaz", "Internet", "Telefon", "Czynsz"],
    "Zakupy": ["Ubrania", "Elektronika", "Kosmetyki", "Prezenty", "Akcesoria"],
    "Zdrowie": ["Leki", "Wizyta lekarska", "Siłownia", "Suplementy", "Dentysta"],
    "Edukacja": ["Kurs online", "Książki", "Szkolenie", "Konferencja", "Materiały"],
    "Sport": ["Sprzęt sportowy", "Karnet na siłownię", "Basen", "Odzież sportowa", "Zawody"],
    "Podróże": ["Hotel", "Bilety lotnicze", "Wycieczka", "Ubezpieczenie", "Transport lokalny"],
    "Dom": ["Meble", "Naprawy", "Dekoracje", "Środki czystości", "Narzędzia"]
};

const amounts = {
    "Jedzenie": {min: 10, max: 200},
    "Transport": {min: 20, max: 500},
    "Rozrywka": {min: 30, max: 300},
    "Rachunki": {min: 100, max: 1000},
    "Zakupy": {min: 50, max: 1000},
    "Zdrowie": {min: 50, max: 500},
    "Edukacja": {min: 100, max: 2000},
    "Sport": {min: 30, max: 400},
    "Podróże": {min: 200, max: 3000},
    "Dom": {min: 50, max: 2000}
};

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateExpenses(count: number): Expense[] {
    const startDate = new Date(2024, 0, 1); // 1 stycznia 2024
    const endDate = new Date(2024, 11, 31); // 31 grudnia 2024

    const expenses: Expense[] = [];

    for (let i = 0; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const titleOptions = titles[category];
        const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
        const {min, max} = amounts[category];
        const amount = +(Math.random() * (max - min) + min).toFixed(2);

        expenses.push({
            date: randomDate(startDate, endDate),
            title,
            amount,
            category
        });
    }

    return expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
}

