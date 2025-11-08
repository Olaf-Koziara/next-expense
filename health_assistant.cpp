#include <iostream>
#include <cmath>
#include <iomanip>
#include <string>

using namespace std;

// Constants for validation
const double MIN_WEIGHT = 30.0;
const double MAX_WEIGHT = 250.0;
const double MIN_HEIGHT = 100.0;
const double MAX_HEIGHT = 250.0;
const int MIN_AGE = 15;
const int MAX_AGE = 100;
const double IDEAL_BMI = 22.0;
const double MIN_SAFE_BMI = 16.0;
const double MAX_SAFE_BMI = 35.0;
const int VACATION_INTERVAL = 8;
const int WEEKS_PER_MONTH = 4;
const int TOTAL_WEEKS = 52;
const double CALORIES_PER_KG = 7700.0;

// User data structure
struct UserData {
    double weight;
    double height;
    int age;
    char gender;
    int goal;
    int activityLevel;
};

// Calculated metrics structure
struct HealthMetrics {
    double bmi;
    double bmr;
    double tdee;
    double idealWeight;
    double dailyCaloricGoal;
    double weeklyWeightChange;
};

// Function declarations
double getValidatedWeight();
double getValidatedHeight();
int getValidatedAge();
char getValidatedGender();
int getGoalSelection();
int getActivityLevelSelection();
double calculateBMI(double weight, double height);
double calculateBMR(double weight, double height, int age, char gender);
double calculateTDEE(double bmr, int activityLevel);
double calculateIdealWeight(double height);
double calculateDailyCaloricGoal(double tdee, int goal);
double calculateWeeklyWeightChange(double dailyCaloricGoal, double tdee);
void displayUserInfo(const UserData& user, const HealthMetrics& metrics);
void simulateWeeklyProgress(UserData& user, const HealthMetrics& metrics);
double applyNaturalFluctuation(double weight, int week);
double applyMotivationDecay(double change, int week);
bool isWeightSafe(double weight, double height);
void displayFinalAnalysis(double initialWeight, double finalWeight, double initialBMI, 
                         double finalBMI, int weeksSimulated, double targetWeight);

int main() {
    cout << fixed << setprecision(2);
    cout << "=== Personal Health Lifestyle Assistant ===" << endl << endl;
    
    UserData user;
    HealthMetrics metrics;
    
    // Input validation
    user.weight = getValidatedWeight();
    user.height = getValidatedHeight();
    user.age = getValidatedAge();
    user.gender = getValidatedGender();
    
    // Menu selections
    user.goal = getGoalSelection();
    user.activityLevel = getActivityLevelSelection();
    
    // Calculate initial metrics
    metrics.bmi = calculateBMI(user.weight, user.height);
    metrics.bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    metrics.tdee = calculateTDEE(metrics.bmr, user.activityLevel);
    metrics.idealWeight = calculateIdealWeight(user.height);
    metrics.dailyCaloricGoal = calculateDailyCaloricGoal(metrics.tdee, user.goal);
    metrics.weeklyWeightChange = calculateWeeklyWeightChange(metrics.dailyCaloricGoal, metrics.tdee);
    
    // Display initial information
    displayUserInfo(user, metrics);
    
    // Simulate 52 weeks
    simulateWeeklyProgress(user, metrics);
    
    return 0;
}

double getValidatedWeight() {
    double weight;
    do {
        cout << "Enter weight (kg) [" << MIN_WEIGHT << "-" << MAX_WEIGHT << "]: ";
        cin >> weight;
        if (weight < MIN_WEIGHT || weight > MAX_WEIGHT) {
            cout << "Invalid weight. Please try again." << endl;
        }
    } while (weight < MIN_WEIGHT || weight > MAX_WEIGHT);
    return weight;
}

double getValidatedHeight() {
    double height;
    do {
        cout << "Enter height (cm) [" << MIN_HEIGHT << "-" << MAX_HEIGHT << "]: ";
        cin >> height;
        if (height < MIN_HEIGHT || height > MAX_HEIGHT) {
            cout << "Invalid height. Please try again." << endl;
        }
    } while (height < MIN_HEIGHT || height > MAX_HEIGHT);
    return height;
}

int getValidatedAge() {
    int age;
    do {
        cout << "Enter age [" << MIN_AGE << "-" << MAX_AGE << "]: ";
        cin >> age;
        if (age < MIN_AGE || age > MAX_AGE) {
            cout << "Invalid age. Please try again." << endl;
        }
    } while (age < MIN_AGE || age > MAX_AGE);
    return age;
}

char getValidatedGender() {
    char gender;
    do {
        cout << "Enter gender (M/K): ";
        cin >> gender;
        gender = toupper(gender);
        if (gender != 'M' && gender != 'K') {
            cout << "Invalid gender. Please enter M or K." << endl;
        }
    } while (gender != 'M' && gender != 'K');
    return gender;
}

int getGoalSelection() {
    int choice;
    do {
        cout << "\n=== Select Your Goal ===" << endl;
        cout << "1. Weight Loss" << endl;
        cout << "2. Weight Maintenance" << endl;
        cout << "3. Weight Gain" << endl;
        cout << "Enter choice (1-3): ";
        cin >> choice;
        
        switch (choice) {
            case 1:
                cout << "Goal: Weight Loss selected" << endl;
                break;
            case 2:
                cout << "Goal: Weight Maintenance selected" << endl;
                break;
            case 3:
                cout << "Goal: Weight Gain selected" << endl;
                break;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice < 1 || choice > 3);
    return choice;
}

int getActivityLevelSelection() {
    int choice;
    do {
        cout << "\n=== Select Activity Level ===" << endl;
        cout << "1. Sedentary (little or no exercise)" << endl;
        cout << "2. Lightly Active (exercise 1-3 days/week)" << endl;
        cout << "3. Moderately Active (exercise 3-5 days/week)" << endl;
        cout << "4. Very Active (exercise 6-7 days/week)" << endl;
        cout << "Enter choice (1-4): ";
        cin >> choice;
        
        switch (choice) {
            case 1:
                cout << "Activity Level: Sedentary selected" << endl;
                break;
            case 2:
                cout << "Activity Level: Lightly Active selected" << endl;
                break;
            case 3:
                cout << "Activity Level: Moderately Active selected" << endl;
                break;
            case 4:
                cout << "Activity Level: Very Active selected" << endl;
                break;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice < 1 || choice > 4);
    return choice;
}

double calculateBMI(double weight, double height) {
    double heightInMeters = height / 100.0;
    return weight / pow(heightInMeters, 2);
}

double calculateBMR(double weight, double height, int age, char gender) {
    // Harris-Benedict Formula
    if (gender == 'M') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
}

double calculateTDEE(double bmr, int activityLevel) {
    double multiplier;
    switch (activityLevel) {
        case 1: multiplier = 1.2; break;   // Sedentary
        case 2: multiplier = 1.375; break; // Lightly Active
        case 3: multiplier = 1.55; break;  // Moderately Active
        case 4: multiplier = 1.725; break; // Very Active
        default: multiplier = 1.2; break;
    }
    return bmr * multiplier;
}

double calculateIdealWeight(double height) {
    double heightInMeters = height / 100.0;
    return IDEAL_BMI * pow(heightInMeters, 2);
}

double calculateDailyCaloricGoal(double tdee, int goal) {
    switch (goal) {
        case 1: return tdee - 500; // Weight loss: 500 cal deficit
        case 2: return tdee;        // Maintenance
        case 3: return tdee + 300;  // Weight gain: 300 cal surplus
        default: return tdee;
    }
}

double calculateWeeklyWeightChange(double dailyCaloricGoal, double tdee) {
    double weeklyCalorieChange = (dailyCaloricGoal - tdee) * 7;
    return weeklyCalorieChange / CALORIES_PER_KG;
}

void displayUserInfo(const UserData& user, const HealthMetrics& metrics) {
    cout << "\n=== Your Health Profile ===" << endl;
    cout << "Weight: " << user.weight << " kg" << endl;
    cout << "Height: " << user.height << " cm" << endl;
    cout << "Age: " << user.age << " years" << endl;
    cout << "Gender: " << user.gender << endl;
    cout << "\n=== Calculated Metrics ===" << endl;
    cout << "BMI: " << metrics.bmi << endl;
    cout << "BMR: " << metrics.bmr << " calories/day" << endl;
    cout << "TDEE: " << metrics.tdee << " calories/day" << endl;
    cout << "Ideal Weight (BMI=22): " << metrics.idealWeight << " kg" << endl;
    cout << "Daily Caloric Goal: " << metrics.dailyCaloricGoal << " calories" << endl;
    cout << "Expected Weekly Weight Change: " << metrics.weeklyWeightChange << " kg" << endl;
    cout << "\n=== Starting 52-Week Simulation ===" << endl << endl;
}

void simulateWeeklyProgress(UserData& user, const HealthMetrics& metrics) {
    double initialWeight = user.weight;
    double initialBMI = metrics.bmi;
    double currentWeight = user.weight;
    double targetWeight = metrics.idealWeight;
    int week = 1;
    double monthlyWeightSum = 0.0;
    int monthlyWeekCount = 0;
    
    while (week <= TOTAL_WEEKS) {
        // Vacation week - skip simulation
        if (week % VACATION_INTERVAL == 0) {
            cout << "Week " << week << ": Vacation week - no tracking" << endl;
            week++;
            continue;
        }
        
        // Apply weight change with motivation decay
        double baseWeightChange = metrics.weeklyWeightChange;
        double motivationAdjustedChange = applyMotivationDecay(baseWeightChange, week);
        currentWeight += motivationAdjustedChange;
        
        // Apply natural fluctuation
        currentWeight = applyNaturalFluctuation(currentWeight, week);
        
        // Check if weight is safe
        if (!isWeightSafe(currentWeight, user.height)) {
            cout << "\nWeek " << week << ": WARNING - Weight has reached unsafe levels!" << endl;
            cout << "Current weight: " << currentWeight << " kg" << endl;
            cout << "Simulation stopped for safety." << endl;
            break;
        }
        
        // Check if goal is reached
        double distanceToGoal = abs(currentWeight - targetWeight);
        if (distanceToGoal < 0.5) {
            cout << "\nWeek " << week << ": GOAL REACHED!" << endl;
            cout << "Current weight: " << currentWeight << " kg" << endl;
            cout << "Target weight: " << targetWeight << " kg" << endl;
            break;
        }
        
        // Track for monthly summary
        monthlyWeightSum += currentWeight;
        monthlyWeekCount++;
        
        // Display monthly summary
        if (week % WEEKS_PER_MONTH == 0) {
            double monthNumber = week / WEEKS_PER_MONTH;
            double monthlyAverage = monthlyWeightSum / monthlyWeekCount;
            double monthlyChange = currentWeight - initialWeight;
            
            cout << "\n--- Month " << monthNumber << " Summary ---" << endl;
            cout << "Average weight: " << monthlyAverage << " kg" << endl;
            cout << "Current weight: " << currentWeight << " kg" << endl;
            cout << "Total change: " << monthlyChange << " kg" << endl;
            cout << "Distance to goal: " << abs(currentWeight - targetWeight) << " kg" << endl << endl;
            
            // Reset monthly counters
            monthlyWeightSum = 0.0;
            monthlyWeekCount = 0;
        }
        
        week++;
    }
    
    // Final analysis
    double finalWeight = currentWeight;
    double finalBMI = calculateBMI(finalWeight, user.height);
    displayFinalAnalysis(initialWeight, finalWeight, initialBMI, finalBMI, week - 1, targetWeight);
}

double applyNaturalFluctuation(double weight, int week) {
    // Natural fluctuation using sine function (±0.5 kg)
    double fluctuation = 0.5 * sin(week * 0.5);
    return weight + fluctuation;
}

double applyMotivationDecay(double change, int week) {
    // Motivation decay using exponential function
    // Motivation decreases over time, reducing effectiveness
    double motivationFactor = exp(-week / 52.0);
    // Keep at least 60% effectiveness
    motivationFactor = 0.6 + (motivationFactor * 0.4);
    return change * motivationFactor;
}

bool isWeightSafe(double weight, double height) {
    double bmi = calculateBMI(weight, height);
    return bmi >= MIN_SAFE_BMI && bmi <= MAX_SAFE_BMI;
}

void displayFinalAnalysis(double initialWeight, double finalWeight, double initialBMI, 
                         double finalBMI, int weeksSimulated, double targetWeight) {
    cout << "\n=== FINAL ANALYSIS ===" << endl;
    cout << "Weeks simulated: " << weeksSimulated << endl;
    cout << "Initial weight: " << initialWeight << " kg" << endl;
    cout << "Final weight: " << finalWeight << " kg" << endl;
    cout << "Total weight change: " << (finalWeight - initialWeight) << " kg" << endl;
    cout << "Weekly average change: " << ((finalWeight - initialWeight) / weeksSimulated) << " kg/week" << endl;
    cout << "Initial BMI: " << initialBMI << endl;
    cout << "Final BMI: " << finalBMI << endl;
    
    double remainingDistance = abs(finalWeight - targetWeight);
    if (remainingDistance >= 0.5) {
        double weeklyRate = abs((finalWeight - initialWeight) / weeksSimulated);
        if (weeklyRate > 0.01) {
            int estimatedWeeksToGoal = static_cast<int>(remainingDistance / weeklyRate);
            cout << "Estimated weeks to goal: " << estimatedWeeksToGoal << endl;
        } else {
            cout << "Estimated weeks to goal: Unable to estimate (minimal progress)" << endl;
        }
    } else {
        cout << "Goal achieved!" << endl;
    }
    
    double totalCaloriesBurned = abs(finalWeight - initialWeight) * CALORIES_PER_KG;
    cout << "Total calories burned/gained: " << totalCaloriesBurned << " calories" << endl;
}
