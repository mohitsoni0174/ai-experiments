class AiCoachService {
  static String replyTo(String prompt, {required String goal}) {
    final p = prompt.trim().toLowerCase();

    if (p.isEmpty) {
      return _motivation();
    }

    if (p.contains('calorie') || p.contains('calories')) {
      return _calories(goal: goal);
    }

    if (p.contains('fat loss') || p.contains('cut') || p.contains('lose weight')) {
      return _fatLossPlan();
    }

    if (p.contains('muscle') || p.contains('bulk')) {
      return _muscleGainPlan();
    }

    if (p.contains('routine') || p.contains('split') || p.contains('gym')) {
      return _gymRoutine();
    }

    if (p.contains('injury') || p.contains('pain') || p.contains('knee') || p.contains('back')) {
      return _injurySafe();
    }

    return "Coach mode: on.\n\nTell me your goal, available days, equipment, and any injuries. I’ll build a plan that’s realistic and safe.\n\nQuick start: \n• 3 workouts/week\n• 8–10k steps/day\n• Protein with every meal\n\nWhat’s your main goal right now: fat loss, muscle gain, or strength?";
  }

  static String _fatLossPlan() {
    return "Fat loss plan (simple + effective):\n\nWorkout (3–4x/week)\n• Full body strength (30–45 min)\n• Finish with 8–12 min incline walk or bike\n\nDaily activity\n• Steps: 8,000–10,000\n\nNutrition\n• Protein: 1.6–2.2 g/kg\n• Calories: slight deficit (start -300/day)\n• Fiber: 25–35g\n\nMindset\n• Track weekly averages (weight + steps)\n• Consistency > perfection\n\nIf you want, tell me your height/weight and I’ll estimate calories and macros.";
  }

  static String _muscleGainPlan() {
    return "Muscle gain plan (lean bulk):\n\nTraining (4–5x/week)\n• Upper/Lower or Push/Pull/Legs\n• 10–16 hard sets per muscle/week\n• Progression: add reps, then weight\n\nNutrition\n• Calories: +150 to +300/day\n• Protein: 1.6–2.2 g/kg\n• Carbs around workouts\n\nRecovery\n• Sleep: 7–9h\n• Rest days are growth days\n\nWant a 4-day split or 5-day split?";
  }

  static String _gymRoutine() {
    return "Gym routine generator (balanced):\n\n4-Day Upper/Lower\nDay 1: Upper (push focus)\n• Bench 4x6–10\n• Incline DB 3x8–12\n• Shoulder press 3x6–10\n• Triceps 3x10–12\n\nDay 2: Lower\n• Squat 4x6–10\n• RDL 3x8–12\n• Lunges 3x10/leg\n• Calves + core\n\nDay 3: Upper (pull focus)\n• Pull-ups 4x5–8\n• Row 4x6–10\n• Lat pulldown 3x10–12\n• Biceps 3x10–12\n\nDay 4: Lower (hinge focus)\n• Deadlift or hip thrust 3–4 sets\n• Leg press 3x10–12\n• Ham curls 3x10–12\n• Core finisher\n\nReply with: equipment (home/gym), days/week, and goal.";
  }

  static String _injurySafe() {
    return "Injury-safe guidance (basic):\n\n• If pain is sharp or worsening, stop and get medical advice.\n• Train around pain: reduce range, load, or swap exercises.\n• Prioritize technique + slower tempo.\n\nExamples\n• Knee pain: swap deep squats → box squats / leg press (pain-free range)\n• Back pain: swap heavy deadlifts → hip hinge pattern with lighter RDLs\n\nTell me where it hurts and what movements trigger it.";
  }

  static String _calories({required String goal}) {
    return "Calories estimate (quick):\n\n1) Maintenance ≈ bodyweight(kg) × 30–34 (depends on activity)\n2) For fat loss: -300 to -500/day\n3) For muscle gain: +150 to +300/day\n\nMacros starter\n• Protein: 1.6–2.2 g/kg\n• Fat: 0.6–1.0 g/kg\n• Carbs: fill the rest\n\nYour current goal in-app is: $goal.\nSend your height + weight + steps/day for a tighter estimate.";
  }

  static String _motivation() {
    return "You don’t need a perfect week—just the next good decision.\n\nToday’s checklist:\n• 1 workout or 30-min walk\n• Protein with 2 meals\n• 2 liters of water\n\nWant me to build today’s workout + meals?";
  }
}
