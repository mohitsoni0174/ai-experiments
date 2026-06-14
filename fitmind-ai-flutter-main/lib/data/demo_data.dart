import 'package:fitmind_ai/models/meal.dart';
import 'package:fitmind_ai/models/progress.dart';
import 'package:fitmind_ai/models/workout.dart';

class DemoData {
  static final beginnerWorkouts = <WorkoutPlan>[
    WorkoutPlan(
      id: 'b1',
      name: 'Full Body Starter',
      level: 'Beginner',
      target: 'Fat loss',
      durationMinutes: 25,
      exercises: const [
        Exercise(name: 'Bodyweight Squat', sets: 3, reps: '12'),
        Exercise(name: 'Push-ups (knees ok)', sets: 3, reps: '10'),
        Exercise(name: 'Glute Bridge', sets: 3, reps: '12'),
        Exercise(name: 'Plank', sets: 3, reps: '30s'),
      ],
    ),
    WorkoutPlan(
      id: 'b2',
      name: 'Upper Body Basics',
      level: 'Beginner',
      target: 'Chest/Back',
      durationMinutes: 30,
      exercises: const [
        Exercise(name: 'Incline Push-ups', sets: 3, reps: '12'),
        Exercise(name: 'Dumbbell Row', sets: 3, reps: '10/side'),
        Exercise(name: 'Shoulder Press', sets: 3, reps: '10'),
        Exercise(name: 'Dead Bug', sets: 3, reps: '10/side'),
      ],
    ),
  ];

  static final intermediateWorkouts = <WorkoutPlan>[
    WorkoutPlan(
      id: 'i1',
      name: 'Push Day Power',
      level: 'Intermediate',
      target: 'Chest/Shoulders/Triceps',
      durationMinutes: 40,
      exercises: const [
        Exercise(name: 'Bench Press', sets: 4, reps: '6–10'),
        Exercise(name: 'Incline DB Press', sets: 3, reps: '8–12'),
        Exercise(name: 'Lateral Raises', sets: 3, reps: '12–15'),
        Exercise(name: 'Triceps Rope Pushdown', sets: 3, reps: '10–12'),
      ],
    ),
    WorkoutPlan(
      id: 'i2',
      name: 'Legs + Core',
      level: 'Intermediate',
      target: 'Legs',
      durationMinutes: 45,
      exercises: const [
        Exercise(name: 'Back Squat', sets: 4, reps: '6–10'),
        Exercise(name: 'Romanian Deadlift', sets: 3, reps: '8–12'),
        Exercise(name: 'Walking Lunges', sets: 3, reps: '10/leg'),
        Exercise(name: 'Hanging Knee Raises', sets: 3, reps: '12'),
      ],
    ),
  ];

  static final advancedWorkouts = <WorkoutPlan>[
    WorkoutPlan(
      id: 'a1',
      name: 'Hypertrophy Split: Pull',
      level: 'Advanced',
      target: 'Back/Biceps',
      durationMinutes: 45,
      exercises: const [
        Exercise(name: 'Weighted Pull-ups', sets: 4, reps: '5–8'),
        Exercise(name: 'Barbell Row', sets: 4, reps: '6–10'),
        Exercise(name: 'Lat Pulldown', sets: 3, reps: '10–12'),
        Exercise(name: 'Incline Curls', sets: 3, reps: '10–12'),
      ],
    ),
    WorkoutPlan(
      id: 'a2',
      name: 'Conditioning (MetCon)',
      level: 'Advanced',
      target: 'Fat loss',
      durationMinutes: 30,
      exercises: const [
        Exercise(name: 'Row / Bike', sets: 5, reps: '1 min hard'),
        Exercise(name: 'Kettlebell Swings', sets: 5, reps: '15'),
        Exercise(name: 'Burpees', sets: 5, reps: '10'),
        Exercise(name: 'Rest', sets: 5, reps: '60s'),
      ],
    ),
  ];

  static List<WorkoutPlan> allWorkouts() => [
        ...beginnerWorkouts,
        ...intermediateWorkouts,
        ...advancedWorkouts,
      ];

  static DailyMealPlan mealPlanForGoal(String goal) {
    // Simple presets to look premium; can be replaced with real AI later.
    final goalKey = goal.toLowerCase();
    final macros = switch (goalKey) {
      _ when goalKey.contains('muscle') => const MacroTargets(
          calories: 2800,
          proteinG: 170,
          carbsG: 320,
          fatsG: 80,
        ),
      _ when goalKey.contains('strength') => const MacroTargets(
          calories: 2600,
          proteinG: 160,
          carbsG: 290,
          fatsG: 75,
        ),
      _ => const MacroTargets(
          calories: 2200,
          proteinG: 150,
          carbsG: 220,
          fatsG: 70,
        ),
    };

    return DailyMealPlan(
      macros: macros,
      breakfast: const MealSuggestion(
        title: 'Breakfast',
        description: 'Greek yogurt + berries + oats (high protein, easy).',
      ),
      lunch: const MealSuggestion(
        title: 'Lunch',
        description: 'Chicken bowl: rice + veggies + olive oil + salsa.',
      ),
      dinner: const MealSuggestion(
        title: 'Dinner',
        description: 'Salmon + potatoes + salad (omega-3 + fiber).',
      ),
      snacks: const MealSuggestion(
        title: 'Snacks',
        description: 'Protein shake + banana, or nuts + fruit.',
      ),
    );
  }

  static List<WeightEntry> weightHistory() {
    final now = DateTime.now();
    return List.generate(8, (i) {
      final date = now.subtract(Duration(days: (7 - i) * 4));
      final kg = 78.5 - (7 - i) * 0.4;
      return WeightEntry(date: date, kg: kg);
    });
  }

  static List<WeeklyWorkoutsEntry> weeklyWorkouts() {
    final now = DateTime.now();
    return List.generate(6, (i) {
      final weekStart = now.subtract(Duration(days: (5 - i) * 7));
      final workouts = 2 + (i % 3);
      return WeeklyWorkoutsEntry(weekStart: weekStart, workouts: workouts);
    });
  }

  static List<CaloriesEntry> caloriesIntake() {
    final now = DateTime.now();
    return List.generate(10, (i) {
      final date = now.subtract(Duration(days: 9 - i));
      final calories = 2000 + (i.isEven ? 120 : -80);
      return CaloriesEntry(date: date, calories: calories);
    });
  }
}
