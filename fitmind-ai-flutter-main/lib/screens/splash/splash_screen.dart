import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    Future.delayed(const Duration(milliseconds: 1100), () {
      if (!mounted) return;
      final state = context.read<AppState>();

      if (!state.onboardingComplete) {
        context.go('/onboarding');
        return;
      }

      if (!state.loggedIn) {
        context.go('/auth/login');
        return;
      }

      context.go('/home');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: GlassCard(
            padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 22),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'FitMind AI',
                  style: TextStyle(fontSize: 34, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 6),
                Text(
                  'Your personal AI fitness coach',
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(color: Colors.white70),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 18),
                const SizedBox(
                  width: 26,
                  height: 26,
                  child: CircularProgressIndicator(strokeWidth: 2.6),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
