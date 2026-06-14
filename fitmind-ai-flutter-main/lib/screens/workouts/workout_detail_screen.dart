import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/models/workout.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';
import 'package:fitmind_ai/widgets/primary_button.dart';

class WorkoutDetailScreen extends StatefulWidget {
  final String workoutId;

  const WorkoutDetailScreen({super.key, required this.workoutId});

  @override
  State<WorkoutDetailScreen> createState() => _WorkoutDetailScreenState();
}

class _WorkoutDetailScreenState extends State<WorkoutDetailScreen> {
  Timer? _timer;
  int _secondsLeft = 60;
  bool _running = false;

  void _toggleTimer() {
    setState(() => _running = !_running);

    _timer?.cancel();
    if (!_running) return;

    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_secondsLeft <= 0) {
        _timer?.cancel();
        setState(() => _running = false);
        return;
      }
      setState(() => _secondsLeft--);
    });
  }

  void _resetTimer() {
    _timer?.cancel();
    setState(() {
      _secondsLeft = 60;
      _running = false;
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final WorkoutPlan? workout = app.workoutById(widget.workoutId);

    if (workout == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Workout')),
        body: const Center(child: Text('Workout not found.')),
      );
    }

    final completed = app.completedWorkoutIds.contains(workout.id);

    return Scaffold(
      appBar: AppBar(title: Text(workout.name)),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 120),
        children: [
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${workout.level} • ${workout.durationMinutes} min • ${workout.target}',
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: Colors.white70),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: PrimaryGradientButton(
                        label: completed ? 'Completed' : 'Start',
                        icon: completed
                            ? Icons.check_circle_rounded
                            : Icons.play_arrow_rounded,
                        onPressed: completed
                            ? null
                            : () => app.markWorkoutCompleted(workout.id),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Exercise list',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 10),
                for (final e in workout.exercises) ...[
                  _ExerciseRow(exercise: e),
                  const SizedBox(height: 10),
                ],
              ],
            ),
          ),
          const SizedBox(height: 12),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Rest timer',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        _formatTime(_secondsLeft),
                        style: Theme.of(context)
                            .textTheme
                            .displaySmall
                            ?.copyWith(fontWeight: FontWeight.w900),
                      ),
                    ),
                    IconButton(
                      onPressed: _toggleTimer,
                      icon: Icon(_running
                          ? Icons.pause_rounded
                          : Icons.play_arrow_rounded),
                      tooltip: _running ? 'Pause' : 'Start',
                    ),
                    IconButton(
                      onPressed: _resetTimer,
                      icon: const Icon(Icons.restart_alt_rounded),
                      tooltip: 'Reset',
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Tip: Rest 45–90s for hypertrophy, 2–3 min for strength.',
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: Colors.white70),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static String _formatTime(int seconds) {
    final m = (seconds ~/ 60).toString().padLeft(2, '0');
    final s = (seconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }
}

class _ExerciseRow extends StatelessWidget {
  final Exercise exercise;

  const _ExerciseRow({required this.exercise});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withAlpha((0.06 * 255).round()),
        border: Border.all(color: Colors.white.withAlpha((0.08 * 255).round())),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              exercise.name,
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.w800),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            '${exercise.sets} x ${exercise.reps}',
            style: Theme.of(context)
                .textTheme
                .titleSmall
                ?.copyWith(color: Colors.white70),
          ),
        ],
      ),
    );
  }
}
