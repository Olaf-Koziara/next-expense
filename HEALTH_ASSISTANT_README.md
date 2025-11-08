# Personal Health Lifestyle Assistant

A compact C++ program that helps users track their health goals and simulate 52 weeks of progress. All functionality is contained in a single main() function for simplicity.

## Features

- **User Input Validation**: Validates weight (30-250kg), height (100-250cm), age (15-100), and gender (M/K) using do-while loops
- **Goal Selection**: Choose between weight loss, maintenance, or weight gain
- **Activity Level Selection**: Select from sedentary, lightly active, moderately active, or very active
- **Health Calculations**:
  - BMI (Body Mass Index)
  - BMR (Basal Metabolic Rate) using Harris-Benedict formula
  - TDEE (Total Daily Energy Expenditure)
  - Ideal Weight (BMI=22)
  - Daily Caloric Goal
- **52-Week Simulation**:
  - Weekly weight changes based on caloric deficit/surplus
  - Natural weight fluctuations using sin() function
  - Motivation decay using exp() function
  - Vacation weeks every 8 weeks (simulation skipped)
  - Monthly summaries showing average weight and progress
  - Break conditions when goal is reached or weight becomes unsafe
- **Final Analysis**: Total weight change, weekly average, new BMI, estimated time to goal, total calories burned

## Building and Running

### Prerequisites
- C++ compiler (g++ recommended)
- Make (optional, but recommended)

### Build Instructions

Using Make:
```bash
make
```

Manual compilation:
```bash
g++ -std=c++11 -Wall -Wextra -O2 -o health_assistant health_assistant.cpp -lm
```

### Running the Program

Using Make:
```bash
make run
```

Or directly:
```bash
./health_assistant
```

## Usage Example

```
=== Personal Health Lifestyle Assistant ===

Enter weight (kg) [30-250]: 80
Enter height (cm) [100-250]: 175
Enter age [15-100]: 25
Enter gender (M/K): M

=== Select Your Goal ===
1. Weight Loss
2. Weight Maintenance
3. Weight Gain
Enter choice (1-3): 1

=== Select Activity Level ===
1. Sedentary (little or no exercise)
2. Lightly Active (exercise 1-3 days/week)
3. Moderately Active (exercise 3-5 days/week)
4. Very Active (exercise 6-7 days/week)
Enter choice (1-4): 2
```

The program will then display your health profile, calculated metrics, and simulate 52 weeks of progress with monthly summaries.

## Code Structure

- **Simple and compact**: All logic in main() function (~180 lines)
- **No separate functions**: Everything is contained in a single main() for clarity
- Uses standard C++ libraries: iostream, cmath, iomanip
- Mathematical functions: pow(), abs(), sin(), exp()
- No arrays (as per requirements)
- Clean, minimal code

## Clean Up

To remove the compiled binary:
```bash
make clean
```
