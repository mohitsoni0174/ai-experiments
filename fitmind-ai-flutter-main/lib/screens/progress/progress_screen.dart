import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final isWide = MediaQuery.of(context).size.width > 800;
    final chartHeight = isWide ? 110.0 : 130.0;
    final sectionGap = isWide ? 8.0 : 10.0;
    final headerPadding = isWide ? 6.0 : 8.0;

    return Scaffold(
      appBar: AppBar(title: const Text('Progress')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 110),
        children: [
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Weight tracking',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: isWide ? 18 : null,
                  ),
                ),
                SizedBox(height: headerPadding),
                SizedBox(
                  height: chartHeight,
                  child: LineChart(
                    LineChartData(
                      gridData: const FlGridData(show: false),
                      borderData: FlBorderData(show: false),
                      titlesData: const FlTitlesData(show: false),
                      lineBarsData: [
                        LineChartBarData(
                          isCurved: true,
                          color: const Color(0xFF2DD9FF),
                          barWidth: 3,
                          dotData: const FlDotData(show: false),
                          belowBarData: BarAreaData(
                            show: true,
                            color: const Color(
                              0xFF2DD9FF,
                            ).withAlpha((0.12 * 255).round()),
                          ),
                          spots: [
                            for (var i = 0; i < app.weightHistory.length; i++)
                              FlSpot(i.toDouble(), app.weightHistory[i].kg),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: sectionGap),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Weekly workouts',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: isWide ? 18 : null,
                  ),
                ),
                SizedBox(height: headerPadding),
                SizedBox(
                  height: chartHeight,
                  child: BarChart(
                    BarChartData(
                      gridData: const FlGridData(show: false),
                      borderData: FlBorderData(show: false),
                      titlesData: const FlTitlesData(show: false),
                      barGroups: [
                        for (var i = 0; i < app.weeklyWorkouts.length; i++)
                          BarChartGroupData(
                            x: i,
                            barRods: [
                              BarChartRodData(
                                toY: app.weeklyWorkouts[i].workouts.toDouble(),
                                width: 12,
                                borderRadius: BorderRadius.circular(6),
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFF2DD9FF),
                                    Color(0xFF2DFF8A),
                                  ],
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: sectionGap),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Calories intake',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: isWide ? 18 : null,
                  ),
                ),
                SizedBox(height: headerPadding),
                SizedBox(
                  height: chartHeight,
                  child: LineChart(
                    LineChartData(
                      gridData: const FlGridData(show: false),
                      borderData: FlBorderData(show: false),
                      titlesData: const FlTitlesData(show: false),
                      lineBarsData: [
                        LineChartBarData(
                          isCurved: true,
                          color: const Color(0xFF2DFF8A),
                          barWidth: 3,
                          dotData: const FlDotData(show: false),
                          belowBarData: BarAreaData(
                            show: true,
                            color: const Color(
                              0xFF2DFF8A,
                            ).withAlpha((0.10 * 255).round()),
                          ),
                          spots: [
                            for (var i = 0; i < app.caloriesHistory.length; i++)
                              FlSpot(
                                i.toDouble(),
                                app.caloriesHistory[i].calories.toDouble(),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
