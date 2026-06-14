import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/models/workout.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';

class WorkoutPlansScreen extends StatelessWidget {
  const WorkoutPlansScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final workouts = context.watch<AppState>().workouts;

    final beginner = workouts.where((w) => w.level == 'Beginner').toList();
    final intermediate = workouts.where((w) => w.level == 'Intermediate').toList();
    final advanced = workouts.where((w) => w.level == 'Advanced').toList();

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Workout Plans'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Beginner'),
              Tab(text: 'Intermediate'),
              Tab(text: 'Advanced'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _WorkoutList(workouts: beginner),
            _WorkoutList(workouts: intermediate),
            _WorkoutList(workouts: advanced),
          ],
        ),
      ),
    );
  }
}

class _WorkoutList extends StatelessWidget {
  final List<WorkoutPlan> workouts;

  const _WorkoutList({required this.workouts});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      itemBuilder: (context, i) {
        final w = workouts[i];
        return _WorkoutCard(workout: w);
      },
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemCount: workouts.length,
    );
  }
}

class _WorkoutCard extends StatefulWidget {
  final WorkoutPlan workout;

  const _WorkoutCard({required this.workout});

  @override
  State<_WorkoutCard> createState() => _WorkoutCardState();
}

class _WorkoutCardState extends State<_WorkoutCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final w = widget.workout;
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      onTap: () => context.push('/workout/${w.id}'),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        transform: Matrix4.identity()..scale(_isPressed ? 0.98 : 1.0),
        child: GlassCard(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        w.name,
                        style: Theme.of(context)
                            .textTheme
                            .titleLarge
                            ?.copyWith(fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '${w.durationMinutes} min • ${w.level} • ${w.target}',
                        style: Theme.of(context)
                            .textTheme
                            .bodyMedium
                            ?.copyWith(color: Colors.white70),
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: [
                          _MiniTag(text: 'Duration: ${w.durationMinutes}m'),
                          _MiniTag(text: 'Difficulty: ${w.level}'),
                          _MiniTag(text: 'Target: ${w.target}'),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                const Icon(Icons.chevron_right_rounded, color: Colors.white70),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MiniTag extends StatelessWidget {
  final String text;

  const _MiniTag({required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        color: Colors.white.withAlpha((0.06 * 255).round()),
        border: Border.all(color: Colors.white.withAlpha((0.08 * 255).round())),
      ),
      child: Text(
        text,
        style: Theme.of(context)
            .textTheme
            .labelLarge
            ?.copyWith(color: Colors.white70),
      ),
    );
  }
}
