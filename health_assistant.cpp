#include <iostream>
#include <cmath>
#include <iomanip>

using namespace std;

int main() {
    cout << fixed << setprecision(2);
    cout << "=== Personal Health Lifestyle Assistant ===" << endl << endl;
    
    double weight, height, heightM, bmi, bmr, tdee, idealWeight, dailyGoal, weeklyChange;
    int age, goal, activity, week, choice;
    char gender;
    
    // Input validation - weight
    do {
        cout << "Enter weight (kg) [30-250]: ";
        cin >> weight;
        if (weight < 30 || weight > 250) cout << "Invalid weight. Please try again." << endl;
    } while (weight < 30 || weight > 250);
    
    // Input validation - height
    do {
        cout << "Enter height (cm) [100-250]: ";
        cin >> height;
        if (height < 100 || height > 250) cout << "Invalid height. Please try again." << endl;
    } while (height < 100 || height > 250);
    
    // Input validation - age
    do {
        cout << "Enter age [15-100]: ";
        cin >> age;
        if (age < 15 || age > 100) cout << "Invalid age. Please try again." << endl;
    } while (age < 15 || age > 100);
    
    // Input validation - gender
    do {
        cout << "Enter gender (M/K): ";
        cin >> gender;
        gender = toupper(gender);
        if (gender != 'M' && gender != 'K') cout << "Invalid gender. Please enter M or K." << endl;
    } while (gender != 'M' && gender != 'K');
    
    // Goal selection menu
    do {
        cout << "\n=== Select Your Goal ===" << endl;
        cout << "1. Weight Loss" << endl;
        cout << "2. Weight Maintenance" << endl;
        cout << "3. Weight Gain" << endl;
        cout << "Enter choice (1-3): ";
        cin >> choice;
        goal = choice;
        switch (choice) {
            case 1: cout << "Goal: Weight Loss selected" << endl; break;
            case 2: cout << "Goal: Weight Maintenance selected" << endl; break;
            case 3: cout << "Goal: Weight Gain selected" << endl; break;
            default: cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice < 1 || choice > 3);
    
    // Activity level menu
    do {
        cout << "\n=== Select Activity Level ===" << endl;
        cout << "1. Sedentary (little or no exercise)" << endl;
        cout << "2. Lightly Active (exercise 1-3 days/week)" << endl;
        cout << "3. Moderately Active (exercise 3-5 days/week)" << endl;
        cout << "4. Very Active (exercise 6-7 days/week)" << endl;
        cout << "Enter choice (1-4): ";
        cin >> choice;
        activity = choice;
        switch (choice) {
            case 1: cout << "Activity Level: Sedentary selected" << endl; break;
            case 2: cout << "Activity Level: Lightly Active selected" << endl; break;
            case 3: cout << "Activity Level: Moderately Active selected" << endl; break;
            case 4: cout << "Activity Level: Very Active selected" << endl; break;
            default: cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice < 1 || choice > 4);
    
    // Calculate metrics
    heightM = height / 100.0;
    bmi = weight / pow(heightM, 2);
    bmr = (gender == 'M') ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age) 
                          : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    tdee = bmr * (activity == 1 ? 1.2 : activity == 2 ? 1.375 : activity == 3 ? 1.55 : 1.725);
    idealWeight = 22.0 * pow(heightM, 2);
    dailyGoal = (goal == 1) ? tdee - 500 : (goal == 3) ? tdee + 300 : tdee;
    weeklyChange = ((dailyGoal - tdee) * 7) / 7700.0;
    
    // Display profile
    cout << "\n=== Your Health Profile ===" << endl;
    cout << "Weight: " << weight << " kg" << endl;
    cout << "Height: " << height << " cm" << endl;
    cout << "Age: " << age << " years" << endl;
    cout << "Gender: " << gender << endl;
    cout << "\n=== Calculated Metrics ===" << endl;
    cout << "BMI: " << bmi << endl;
    cout << "BMR: " << bmr << " calories/day" << endl;
    cout << "TDEE: " << tdee << " calories/day" << endl;
    cout << "Ideal Weight (BMI=22): " << idealWeight << " kg" << endl;
    cout << "Daily Caloric Goal: " << dailyGoal << " calories" << endl;
    cout << "Expected Weekly Weight Change: " << weeklyChange << " kg" << endl;
    cout << "\n=== Starting 52-Week Simulation ===" << endl << endl;
    
    // Simulation
    double initialWeight = weight, initialBMI = bmi, currentWeight = weight;
    double monthlySum = 0;
    int monthWeeks = 0;
    week = 1;
    
    while (week <= 52) {
        // Vacation week
        if (week % 8 == 0) {
            cout << "Week " << week << ": Vacation week - no tracking" << endl;
            week++;
            continue;
        }
        
        // Apply changes: motivation decay (exp) and natural fluctuation (sin)
        double decay = 0.6 + (exp(-week / 52.0) * 0.4);
        currentWeight += weeklyChange * decay;
        currentWeight += 0.5 * sin(week * 0.5);
        
        // Safety check
        double currentBMI = currentWeight / pow(heightM, 2);
        if (currentBMI < 16 || currentBMI > 35) {
            cout << "\nWeek " << week << ": WARNING - Weight has reached unsafe levels!" << endl;
            cout << "Current weight: " << currentWeight << " kg" << endl;
            cout << "Simulation stopped for safety." << endl;
            break;
        }
        
        // Goal check
        if (abs(currentWeight - idealWeight) < 0.5) {
            cout << "\nWeek " << week << ": GOAL REACHED!" << endl;
            cout << "Current weight: " << currentWeight << " kg" << endl;
            cout << "Target weight: " << idealWeight << " kg" << endl;
            break;
        }
        
        // Monthly summary
        monthlySum += currentWeight;
        monthWeeks++;
        if (week % 4 == 0) {
            cout << "\n--- Month " << (week / 4) << " Summary ---" << endl;
            cout << "Average weight: " << (monthlySum / monthWeeks) << " kg" << endl;
            cout << "Current weight: " << currentWeight << " kg" << endl;
            cout << "Total change: " << (currentWeight - initialWeight) << " kg" << endl;
            cout << "Distance to goal: " << abs(currentWeight - idealWeight) << " kg" << endl << endl;
            monthlySum = 0;
            monthWeeks = 0;
        }
        week++;
    }
    
    // Final analysis
    double finalWeight = currentWeight;
    double finalBMI = finalWeight / pow(heightM, 2);
    cout << "\n=== FINAL ANALYSIS ===" << endl;
    cout << "Weeks simulated: " << (week - 1) << endl;
    cout << "Initial weight: " << initialWeight << " kg" << endl;
    cout << "Final weight: " << finalWeight << " kg" << endl;
    cout << "Total weight change: " << (finalWeight - initialWeight) << " kg" << endl;
    cout << "Weekly average change: " << ((finalWeight - initialWeight) / (week - 1)) << " kg/week" << endl;
    cout << "Initial BMI: " << initialBMI << endl;
    cout << "Final BMI: " << finalBMI << endl;
    
    double remaining = abs(finalWeight - idealWeight);
    if (remaining >= 0.5) {
        double rate = abs((finalWeight - initialWeight) / (week - 1));
        if (rate > 0.01) {
            cout << "Estimated weeks to goal: " << (int)(remaining / rate) << endl;
        } else {
            cout << "Estimated weeks to goal: Unable to estimate (minimal progress)" << endl;
        }
    } else {
        cout << "Goal achieved!" << endl;
    }
    cout << "Total calories burned/gained: " << (abs(finalWeight - initialWeight) * 7700.0) << " calories" << endl;
    
    return 0;
}
