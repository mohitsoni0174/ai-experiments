class Exercise {
  final String name;
  final int sets;
  final String reps;

  const Exercise({required this.name, required this.sets, required this.reps});
}

class WorkoutPlan {
  final String id;
  final String name;
  final String level; // Beginner | Intermediate | Advanced
  final String target; // Chest/Legs/Fat loss/etc
  final int durationMinutes;
  final List<Exercise> exercises;

  const WorkoutPlan({
    required this.id,
    required this.name,
    required this.level,
    required this.target,
    required this.durationMinutes,
    required this.exercises,
  });
}
