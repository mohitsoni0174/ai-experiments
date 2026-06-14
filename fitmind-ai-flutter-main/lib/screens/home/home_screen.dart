import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';
import 'package:fitmind_ai/widgets/primary_button.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final today = app.todaysWorkout;
    final isWide = MediaQuery.of(context).size.width > 800;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'FitMind AI',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Your personal AI fitness coach',
                      style: Theme.of(
                        context,
                      ).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () => context.push('/profile'),
                icon: const Icon(Icons.person_rounded),
                tooltip: 'Profile',
              ),
            ],
          ),
          const SizedBox(height: 14),
          if (isWide)
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 2,
                  child: _TodayWorkoutCard(today: today, app: app),
                ),
                const SizedBox(width: 14),
                Expanded(child: _QuickActionsCard()),
              ],
            )
          else ...[
            _TodayWorkoutCard(today: today, app: app),
            const SizedBox(height: 14),
            _QuickActionsCard(),
          ],
        ],
      ),
    );
  }
}

class _TodayWorkoutCard extends StatelessWidget {
  final dynamic today;
  final AppState app;

  const _TodayWorkoutCard({required this.today, required this.app});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  "Today's Workout",
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2DD9FF), Color(0xFF2DFF8A)],
                  ),
                ),
                child: Text(
                  'Today',
                  style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: Colors.black,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            '${today.name} • ${today.durationMinutes} min • ${today.target}',
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              _StatPill(
                icon: Icons.local_fire_department_rounded,
                label: 'Calories burned',
                value: '${app.caloriesBurned}',
              ),
              _StatPill(
                icon: Icons.directions_walk_rounded,
                label: 'Steps',
                value: '${app.steps}',
              ),
              _StatPill(
                icon: Icons.water_drop_rounded,
                label: 'Water',
                value: '${app.waterMl} ml',
              ),
              _StatPill(
                icon: Icons.local_fire_department_rounded,
                label: 'Streak',
                value: '${app.streakDays} days',
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: PrimaryGradientButton(
                  label: 'Start Workout',
                  icon: Icons.play_arrow_rounded,
                  onPressed: () => context.push('/workout/${today.id}'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _QuickActionsCard extends StatelessWidget {
  const _QuickActionsCard();

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quick actions',
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          _QuickAction(
            icon: Icons.chat_bubble_rounded,
            label: 'Ask AI Coach',
            onTap: () => context.go('/coach'),
          ),
          const SizedBox(height: 10),
          _QuickAction(
            icon: Icons.restaurant_rounded,
            label: 'Track Meal',
            onTap: () => context.go('/diet'),
          ),
          const SizedBox(height: 10),
          _QuickAction(
            icon: Icons.water_drop_rounded,
            label: 'Add Water (+250ml)',
            onTap: () => context.read<AppState>().addWater(250),
          ),
        ],
      ),
    );
  }
}

class _StatPill extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _StatPill({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withAlpha((0.06 * 255).round()),
        border: Border.all(color: Colors.white.withAlpha((0.08 * 255).round())),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: const Color(0xFF2DD9FF)),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label,
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _QuickAction extends StatefulWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  State<_QuickAction> createState() => _QuickActionState();
}

class _QuickActionState extends State<_QuickAction> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      onTap: widget.onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        transform: Matrix4.identity()..scale(_isPressed ? 0.97 : 1.0),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            color: _isPressed
                ? Colors.white.withAlpha((0.03 * 255).round())
                : Colors.transparent,
          ),
          child: Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2DD9FF), Color(0xFF2DFF8A)],
                  ),
                ),
                child: Icon(widget.icon, color: Colors.black, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  widget.label,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const Icon(Icons.chevron_right_rounded, color: Colors.white54),
            ],
          ),
        ),
      ),
    );
  }
}
