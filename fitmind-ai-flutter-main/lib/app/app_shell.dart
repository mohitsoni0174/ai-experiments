import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:fitmind_ai/widgets/neon_background.dart';

class AppShell extends StatelessWidget {
  final Widget child;

  const AppShell({super.key, required this.child});

  static const tabs = <_TabSpec>[
    _TabSpec('/home', Icons.home_rounded, 'Home'),
    _TabSpec('/workouts', Icons.fitness_center_rounded, 'Workouts'),
    _TabSpec('/diet', Icons.restaurant_rounded, 'Diet'),
    _TabSpec('/progress', Icons.show_chart_rounded, 'Progress'),
    _TabSpec('/coach', Icons.chat_bubble_rounded, 'Coach'),
  ];

  int _indexForLocation(String location) {
    for (var i = 0; i < tabs.length; i++) {
      if (location.startsWith(tabs[i].location)) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    final index = _indexForLocation(location);

    return NeonBackground(
      child: Scaffold(
        extendBody: true,
        body: SafeArea(child: child),
        bottomNavigationBar: Padding(
          padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(22),
            child: NavigationBar(
              height: 70,
              selectedIndex: index,
              backgroundColor: Colors.black.withAlpha((0.35 * 255).round()),
              indicatorColor: Colors.white.withAlpha((0.10 * 255).round()),
              onDestinationSelected: (i) => context.go(tabs[i].location),
              destinations: [
                for (final t in tabs)
                  NavigationDestination(icon: Icon(t.icon), label: t.label),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TabSpec {
  final String location;
  final IconData icon;
  final String label;

  const _TabSpec(this.location, this.icon, this.label);
}
