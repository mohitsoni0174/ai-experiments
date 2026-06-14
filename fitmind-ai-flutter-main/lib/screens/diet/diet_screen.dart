import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';

class DietScreen extends StatelessWidget {
  const DietScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final plan = app.todayMealPlan;

    return Scaffold(
      appBar: AppBar(title: const Text('Diet / Meal Plan')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 110),
        children: [
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Daily goals',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    _MacroPill(label: 'Calories', value: '${plan.macros.calories}'),
                    _MacroPill(label: 'Protein', value: '${plan.macros.proteinG}g'),
                    _MacroPill(label: 'Carbs', value: '${plan.macros.carbsG}g'),
                    _MacroPill(label: 'Fats', value: '${plan.macros.fatsG}g'),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  'Goal: ${app.goal}',
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          _MealCard(title: 'Breakfast', desc: plan.breakfast.description),
          const SizedBox(height: 12),
          _MealCard(title: 'Lunch', desc: plan.lunch.description),
          const SizedBox(height: 12),
          _MealCard(title: 'Dinner', desc: plan.dinner.description),
          const SizedBox(height: 12),
          _MealCard(title: 'Snacks', desc: plan.snacks.description),
        ],
      ),
    );
  }
}

class _MacroPill extends StatelessWidget {
  final String label;
  final String value;

  const _MacroPill({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withAlpha((0.06 * 255).round()),
        border: Border.all(color: Colors.white.withAlpha((0.08 * 255).round())),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }
}

class _MealCard extends StatefulWidget {
  final String title;
  final String desc;

  const _MealCard({required this.title, required this.desc});

  @override
  State<_MealCard> createState() => _MealCardState();
}

class _MealCardState extends State<_MealCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final icons = {
      'Breakfast': Icons.breakfast_dining_rounded,
      'Lunch': Icons.lunch_dining_rounded,
      'Dinner': Icons.dinner_dining_rounded,
      'Snacks': Icons.cookie_rounded,
    };
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        transform: Matrix4.identity()..scale(_isPressed ? 0.98 : 1.0),
        child: GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context)
                .textTheme
                .titleLarge
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: Theme.of(context)
                .textTheme
                .bodyLarge
                ?.copyWith(color: Colors.white70),
          ),
        ],
      ),
    );
  }
}
