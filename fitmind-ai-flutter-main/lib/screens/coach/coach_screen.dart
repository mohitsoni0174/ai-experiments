import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:fitmind_ai/app/app_state.dart';
import 'package:fitmind_ai/models/chat.dart';
import 'package:fitmind_ai/widgets/glass_card.dart';

class CoachScreen extends StatefulWidget {
  const CoachScreen({super.key});

  @override
  State<CoachScreen> createState() => _CoachScreenState();
}

class _CoachScreenState extends State<CoachScreen> {
  final _controller = TextEditingController();
  final _scroll = ScrollController();
  bool _isTyping = false;

  static const quickPrompts = [
    'Make a fat loss plan',
    'Suggest gym routine',
    'Diet for muscle gain',
    'How many calories should I eat?',
  ];

  @override
  void dispose() {
    _controller.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _send(String text) async {
    context.read<AppState>().sendUserMessage(text);
    _controller.clear();

    setState(() => _isTyping = true);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scroll.hasClients) return;
      _scroll.animateTo(
        _scroll.position.maxScrollExtent + 220,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    });

    // Simulate AI typing delay
    await Future.delayed(const Duration(milliseconds: 800));
    if (mounted) setState(() => _isTyping = false);
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Coach'),
        actions: [
          IconButton(
            onPressed: () => context.push('/profile'),
            icon: const Icon(Icons.settings_rounded),
            tooltip: 'Profile & Settings',
          ),
        ],
      ),
      body: Column(
        children: [
          SizedBox(
            height: 54,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              scrollDirection: Axis.horizontal,
              itemBuilder: (context, i) {
                final p = quickPrompts[i];
                return ActionChip(label: Text(p), onPressed: () => _send(p));
              },
              separatorBuilder: (_, _) => const SizedBox(width: 10),
              itemCount: quickPrompts.length,
            ),
          ),
          const SizedBox(height: 6),
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
              itemCount: app.chat.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, i) {
                if (i == app.chat.length && _isTyping) {
                  return const _TypingIndicator();
                }
                final m = app.chat[i];
                return _ChatBubble(message: m);
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 16),
            child: GlassCard(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: const InputDecoration(
                        hintText: 'Ask your coach…',
                        border: InputBorder.none,
                      ),
                      onSubmitted: (v) => _send(v),
                    ),
                  ),
                  IconButton(
                    onPressed: () => _send(_controller.text),
                    icon: const Icon(Icons.send_rounded),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChatBubble extends StatelessWidget {
  final ChatMessage message;

  const _ChatBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    final isUser = message.role == ChatRole.user;

    final bubble = Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        gradient: isUser
            ? const LinearGradient(
                colors: [Color(0xFF2DD9FF), Color(0xFF2DFF8A)],
              )
            : null,
        color: isUser ? null : Colors.white.withAlpha((0.06 * 255).round()),
        border: Border.all(
          color: isUser
              ? Colors.transparent
              : Colors.white.withAlpha((0.10 * 255).round()),
        ),
      ),
      child: Text(
        message.text,
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: isUser ? Colors.black : Colors.white,
          height: 1.35,
        ),
      ),
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        mainAxisAlignment: isUser
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        children: [
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 320),
            child: bubble,
          ),
        ],
      ),
    );
  }
}

class _TypingIndicator extends StatefulWidget {
  const _TypingIndicator();

  @override
  State<_TypingIndicator> createState() => _TypingIndicatorState();
}

class _TypingIndicatorState extends State<_TypingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 80),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                color: Colors.white.withAlpha((0.06 * 255).round()),
                border: Border.all(
                  color: Colors.white.withAlpha((0.10 * 255).round()),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: List.generate(3, (i) {
                  return AnimatedBuilder(
                    animation: _controller,
                    builder: (context, child) {
                      final delay = i * 0.15;
                      final value = (_controller.value - delay) % 1.0;
                      final opacity = (value < 0.5
                          ? value * 2
                          : (1 - value) * 2);
                      return Padding(
                        padding: EdgeInsets.only(left: i > 0 ? 4 : 0),
                        child: Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: const Color(
                              0xFF2DD9FF,
                            ).withOpacity(0.3 + opacity * 0.7),
                          ),
                        ),
                      );
                    },
                  );
                }),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
