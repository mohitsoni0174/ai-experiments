// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:fitmind_ai/app.dart';

void main() {
  testWidgets('FitMind AI app boots', (WidgetTester tester) async {
    await tester.pumpWidget(const FitMindApp());

    // Let splash delay / routing happen.
    await tester.pump(const Duration(milliseconds: 1400));

    // We should land on onboarding (fresh state) or auth.
    expect(find.text('FitMind AI'), findsWidgets);
  });
}
