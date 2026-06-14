import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';
import 'package:fitmind_ai/widgets/primary_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _index = 0;

  static const _slides = <_SlideData>[
    _SlideData(
      icon: Icons.fitness_center_rounded,
      title: 'Workout plans',
      desc: 'Beginner → Advanced programs that feel premium and structured.',
    ),
    _SlideData(
      icon: Icons.restaurant_rounded,
      title: 'Diet guidance',
      desc: 'Daily calories + macros with meal suggestions you can follow.',
    ),
    _SlideData(
      icon: Icons.chat_bubble_rounded,
      title: 'AI coach chat',
      desc: 'Ask for routines, calorie targets, motivation and safe tips.',
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _finish() {
    context.read<AppState>().completeOnboarding();
    context.go('/auth/login');
  }

  @override
  Widget build(BuildContext context) {
    final isLast = _index == _slides.length - 1;

    return Scaffold(
      appBar: AppBar(
        title: const Text('FitMind AI'),
        actions: [
          TextButton(
            onPressed: _finish,
            child: const Text('Skip'),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _slides.length,
                onPageChanged: (i) => setState(() => _index = i),
                itemBuilder: (context, i) {
                  final s = _slides[i];
                  return Center(
                    child: GlassCard(
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 72,
                            height: 72,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const LinearGradient(
                                colors: [Color(0xFF2DD9FF), Color(0xFF2DFF8A)],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF2DD9FF)
                                      .withAlpha((0.25 * 255).round()),
                                  blurRadius: 18,
                                  offset: const Offset(0, 10),
                                )
                              ],
                            ),
                            child: Icon(s.icon, color: Colors.black, size: 34),
                          ),
                          const SizedBox(height: 14),
                          Text(
                            s.title,
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(fontWeight: FontWeight.w800),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 10),
                          Text(
                            s.desc,
                            style: Theme.of(context)
                                .textTheme
                                .bodyLarge
                                ?.copyWith(color: Colors.white70),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _slides.length,
                (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 220),
                  margin: const EdgeInsets.symmetric(horizontal: 5),
                  width: i == _index ? 26 : 9,
                  height: 9,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(99),
                    gradient: i == _index
                        ? const LinearGradient(
                            colors: [
                              Color(0xFF2DD9FF),
                              Color(0xFF2DFF8A)
                            ],
                          )
                        : null,
                    color: i == _index
                        ? null
                        : Colors.white.withAlpha((0.18 * 255).round()),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      _controller.previousPage(
                        duration: const Duration(milliseconds: 250),
                        curve: Curves.easeOut,
                      );
                    },
                    child: const Text('Back'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: PrimaryGradientButton(
                    label: isLast ? 'Get Started' : 'Next',
                    icon: isLast
                        ? Icons.arrow_forward_rounded
                        : Icons.navigate_next_rounded,
                    onPressed: () {
                      if (isLast) {
                        _finish();
                      } else {
                        _controller.nextPage(
                          duration: const Duration(milliseconds: 250),
                          curve: Curves.easeOut,
                        );
                      }
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _SlideData {
  final IconData icon;
  final String title;
  final String desc;

  const _SlideData({required this.icon, required this.title, required this.desc});
}
