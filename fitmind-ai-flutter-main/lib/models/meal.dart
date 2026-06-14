class MealSuggestion {
  final String title;
  final String description;

  const MealSuggestion({required this.title, required this.description});
}

class MacroTargets {
  final int calories;
  final int proteinG;
  final int carbsG;
  final int fatsG;

  const MacroTargets({
    required this.calories,
    required this.proteinG,
    required this.carbsG,
    required this.fatsG,
  });
}

class DailyMealPlan {
  final MacroTargets macros;
  final MealSuggestion breakfast;
  final MealSuggestion lunch;
  final MealSuggestion dinner;
  final MealSuggestion snacks;

  const DailyMealPlan({
    required this.macros,
    required this.breakfast,
    required this.lunch,
    required this.dinner,
    required this.snacks,
  });
}
