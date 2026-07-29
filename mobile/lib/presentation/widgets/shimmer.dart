import 'package:flutter/material.dart';

class Shimmer extends StatefulWidget {
  final double width;
  final double height;
  final ShapeBorder shapeBorder;

  const Shimmer.rectangular({
    super.key,
    required this.width,
    required this.height,
    this.shapeBorder = const RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(12)),
    ),
  });

  const Shimmer.circular({
    super.key,
    required this.width,
    required this.height,
    this.shapeBorder = const CircleBorder(),
  });

  @override
  State<Shimmer> createState() => _ShimmerState();
}

class _ShimmerState extends State<Shimmer> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    final baseColor = isDark ? const Color(0xFF374151) : const Color(0xFFE5E7EB);
    final highlightColor = isDark ? const Color(0xFF4B5563) : const Color(0xFFF3F4F6);

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: ShapeDecoration(
            shape: widget.shapeBorder,
            gradient: LinearGradient(
              colors: [
                baseColor,
                highlightColor,
                baseColor,
              ],
              stops: const [
                0.1,
                0.5,
                0.9,
              ],
              begin: Alignment(-2.0 + _controller.value * 4, -0.3),
              end: Alignment(0.0 + _controller.value * 4, 0.3),
              tileMode: TileMode.clamp,
            ),
          ),
        );
      },
    );
  }
}
