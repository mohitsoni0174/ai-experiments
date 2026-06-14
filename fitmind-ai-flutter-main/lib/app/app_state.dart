import 'package:flutter/material.dart';

import 'package:fitmind_ai/data/demo_data.dart';
import 'package:fitmind_ai/models/chat.dart';
import 'package:fitmind_ai/models/meal.dart';
import 'package:fitmind_ai/models/progress.dart';
import 'package:fitmind_ai/models/workout.dart';
import 'package:fitmind_ai/services/ai_coach_service.dart';

class AppState extends ChangeNotifier {
  bool onboardingComplete = false;
  bool loggedIn = false;

  ThemeMode themeMode = ThemeMode.dark;
  bool notificationsEnabled = true;

  int heightCm = 175;
  double weightKg = 78.5;
  String goal = 'Fat loss';

  int caloriesBurned = 420;
  int steps = 6840;
  int waterMl = 1200;
  int streakDays = 6;

  final Set<String> completedWorkoutIds = {};

  final List<ChatMessage> chat = [
    ChatMessage(
      id: 'seed-1',
      role: ChatRole.ai,
      text:
          "Hi! I’m your FitMind AI coach. Pick a quick prompt or tell me your goal and schedule.",
      createdAt: DateTime.now(),
    ),
  ];

  List<WorkoutPlan> get workouts => DemoData.allWorkouts();

  DailyMealPlan get todayMealPlan => DemoData.mealPlanForGoal(goal);

  List<WeightEntry> get weightHistory => DemoData.weightHistory();
  List<WeeklyWorkoutsEntry> get weeklyWorkouts => DemoData.weeklyWorkouts();
  List<CaloriesEntry> get caloriesHistory => DemoData.caloriesIntake();

  WorkoutPlan get todaysWorkout {
    // Choose a workout based on goal keywords (simple heuristic for demo).
    final g = goal.toLowerCase();
    final list = workouts;
    final fatLoss = list.where((w) => w.target.toLowerCase().contains('fat')).toList();
    if (g.contains('fat') && fatLoss.isNotEmpty) return fatLoss.first;
    return list.first;
  }

  void completeOnboarding() {
    onboardingComplete = true;
    notifyListeners();
  }

  void login({required String email, required String password}) {
    loggedIn = true;
    notifyListeners();
  }

  void logout() {
    loggedIn = false;
    notifyListeners();
  }

  void toggleTheme() {
    themeMode = themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    notifyListeners();
  }

  void toggleNotifications(bool value) {
    notificationsEnabled = value;
    notifyListeners();
  }

  void updateProfile({int? heightCm, double? weightKg, String? goal}) {
    if (heightCm != null) this.heightCm = heightCm;
    if (weightKg != null) this.weightKg = weightKg;
    if (goal != null) this.goal = goal;
    notifyListeners();
  }

  void markWorkoutCompleted(String workoutId) {
    completedWorkoutIds.add(workoutId);
    streakDays = (streakDays + 1).clamp(0, 999);
    caloriesBurned += 150;
    steps += 800;
    notifyListeners();
  }

  void addWater(int amountMl) {
    waterMl = (waterMl + amountMl).clamp(0, 5000);
    notifyListeners();
  }

  void sendUserMessage(String text) {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    chat.add(
      ChatMessage(
        id: DateTime.now().microsecondsSinceEpoch.toString(),
        role: ChatRole.user,
        text: trimmed,
        createdAt: DateTime.now(),
      ),
    );

    final reply = AiCoachService.replyTo(trimmed, goal: goal);

    chat.add(
      ChatMessage(
        id: (DateTime.now().microsecondsSinceEpoch + 1).toString(),
        role: ChatRole.ai,
        text: reply,
        createdAt: DateTime.now(),
      ),
    );

    notifyListeners();
  }

  WorkoutPlan? workoutById(String id) {
    for (final w in workouts) {
      if (w.id == id) return w;
    }
    return null;
  }
}
