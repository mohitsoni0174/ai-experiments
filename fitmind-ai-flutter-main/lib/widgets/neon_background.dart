import 'dart:ui';

import 'package:flutter/material.dart';

class NeonBackground extends StatelessWidget {
  final Widget child;

  const NeonBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        const _NeonGlowLayer(),
        child,
      ],
    );
  }
}

class _NeonGlowLayer extends StatelessWidget {
  const _NeonGlowLayer();

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: DecoratedBox(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF0B1220),
              Color(0xFF0B1220),
              Color(0xFF0F1A2E),
            ],
          ),
        ),
        child: Stack(
          children: const [
            _GlowBlob(
              alignment: Alignment(-0.9, -0.8),
              color: Color(0xFF2DD9FF),
              size: 260,
              opacity: 0.25,
            ),
            _GlowBlob(
              alignment: Alignment(0.9, -0.6),
              color: Color(0xFF2DFF8A),
              size: 220,
              opacity: 0.22,
            ),
            _GlowBlob(
              alignment: Alignment(0.4, 0.9),
              color: Color(0xFF7C3AED),
              size: 320,
              opacity: 0.16,
            ),
          ],
        ),
      ),
    );
  }
}

class _GlowBlob extends StatelessWidget {
  final Alignment alignment;
  final Color color;
  final double size;
  final double opacity;

  const _GlowBlob({
    required this.alignment,
    required this.color,
    required this.size,
    required this.opacity,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: alignment,
      child: ImageFiltered(
        imageFilter: ImageFilter.blur(sigmaX: 32, sigmaY: 32),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: color.withAlpha((opacity * 255).round()),
          ),
        ),
      ),
    );
  }
}
