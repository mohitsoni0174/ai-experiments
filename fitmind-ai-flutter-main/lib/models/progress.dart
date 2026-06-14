class WeightEntry {
  final DateTime date;
  final double kg;

  const WeightEntry({required this.date, required this.kg});
}

class WeeklyWorkoutsEntry {
  final DateTime weekStart;
  final int workouts;

  const WeeklyWorkoutsEntry({required this.weekStart, required this.workouts});
}

class CaloriesEntry {
  final DateTime date;
  final int calories;

  const CaloriesEntry({required this.date, required this.calories});
}
