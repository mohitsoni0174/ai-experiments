import 'package:go_router/go_router.dart';

import 'package:fitmind_ai/app/app_shell.dart';
import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/screens/auth/login_screen.dart';
import 'package:fitmind_ai/screens/auth/signup_screen.dart';
import 'package:fitmind_ai/screens/coach/coach_screen.dart';
import 'package:fitmind_ai/screens/diet/diet_screen.dart';
import 'package:fitmind_ai/screens/home/home_screen.dart';
import 'package:fitmind_ai/screens/onboarding/onboarding_screen.dart';
import 'package:fitmind_ai/screens/profile/profile_screen.dart';
import 'package:fitmind_ai/screens/progress/progress_screen.dart';
import 'package:fitmind_ai/screens/splash/splash_screen.dart';
import 'package:fitmind_ai/screens/workouts/workout_detail_screen.dart';
import 'package:fitmind_ai/screens/workouts/workout_plans_screen.dart';

class AppRouter {
  final AppState appState;

  AppRouter(this.appState);

  late final GoRouter router = GoRouter(
    debugLogDiagnostics: true,
    refreshListenable: appState,
    initialLocation: '/splash',
    redirect: (context, state) {
      final loc = state.matchedLocation;

      final inSplash = loc == '/splash';
      final inOnboarding = loc == '/onboarding';
      final inAuth = loc.startsWith('/auth');

      if (!appState.onboardingComplete) {
        if (inSplash || inOnboarding) return null;
        return '/onboarding';
      }

      if (!appState.loggedIn) {
        if (inSplash || inAuth) return null;
        return '/auth/login';
      }

      if (appState.loggedIn && inAuth) return '/home';
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/auth/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/workout/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return WorkoutDetailScreen(workoutId: id);
        },
      ),
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/workouts',
            builder: (context, state) => const WorkoutPlansScreen(),
          ),
          GoRoute(
            path: '/diet',
            builder: (context, state) => const DietScreen(),
          ),
          GoRoute(
            path: '/progress',
            builder: (context, state) => const ProgressScreen(),
          ),
          GoRoute(
            path: '/coach',
            builder: (context, state) => const CoachScreen(),
          ),
        ],
      ),
    ],
  );
}
