import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/app/router.dart';
import 'package:fitmind_ai/app/theme.dart';

class FitMindApp extends StatelessWidget {
  const FitMindApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState(),
      child: Builder(
        builder: (context) {
          final appState = context.watch<AppState>();
          final router = AppRouter(appState).router;

          return MaterialApp.router(
            title: 'FitMind AI',
            debugShowCheckedModeBanner: false,
            theme: FitMindTheme.light(useMaterial3: true),
            darkTheme: FitMindTheme.dark(useMaterial3: true),
            themeMode: appState.themeMode,
            routerConfig: router,
          );
        },
      ),
    );
  }
}
