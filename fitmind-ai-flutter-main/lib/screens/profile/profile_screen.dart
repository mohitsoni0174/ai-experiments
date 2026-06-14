import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late final TextEditingController _height;
  late final TextEditingController _weight;
  String _goal = 'Fat loss';

  @override
  void initState() {
    super.initState();
    final app = context.read<AppState>();
    _height = TextEditingController(text: app.heightCm.toString());
    _weight = TextEditingController(text: app.weightKg.toStringAsFixed(1));
    _goal = app.goal;
  }

  @override
  void dispose() {
    _height.dispose();
    _weight.dispose();
    super.dispose();
  }

  void _save() {
    final h = int.tryParse(_height.text.trim());
    final w = double.tryParse(_weight.text.trim());

    context.read<AppState>().updateProfile(
          heightCm: h,
          weightKg: w,
          goal: _goal,
        );

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Saved')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();

    return Scaffold(
      appBar: AppBar(title: const Text('Profile & Settings')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 110),
        children: [
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Your stats',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _height,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Height (cm)'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _weight,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(labelText: 'Weight (kg)'),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _goal,
                  decoration: const InputDecoration(labelText: 'Goal'),
                  items: const [
                    DropdownMenuItem(value: 'Fat loss', child: Text('Fat loss')),
                    DropdownMenuItem(value: 'Muscle gain', child: Text('Muscle gain')),
                    DropdownMenuItem(value: 'Strength', child: Text('Strength')),
                  ],
                  onChanged: (v) => setState(() => _goal = v ?? _goal),
                ),
                const SizedBox(height: 16),
                FilledButton.icon(
                  onPressed: _save,
                  icon: const Icon(Icons.save_rounded),
                  label: const Text('Save'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Settings',
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 10),
                SwitchListTile(
                  value: app.themeMode == ThemeMode.dark,
                  onChanged: (_) => context.read<AppState>().toggleTheme(),
                  title: const Text('Dark mode'),
                  subtitle: const Text('Neon theme looks best in dark mode'),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  value: app.notificationsEnabled,
                  onChanged: (v) => context.read<AppState>().toggleNotifications(v),
                  title: const Text('Notifications'),
                  subtitle: const Text('Motivation + reminders (demo toggle)'),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.logout_rounded),
                  title: const Text('Logout'),
                  onTap: () => context.read<AppState>().logout(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
