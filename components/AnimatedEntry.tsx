import React from "react";
import Animated, { FadeIn } from "react-native-reanimated";

interface AnimatedEntryProps {
  /** Delay before animation starts (ms). Use for stagger effect. */
  delay?: number;
  /** Animation duration (ms) */
  duration?: number;
  children: React.ReactNode;
}

/**
 * Reusable enter-animation wrapper.
 * Wraps children in an Animated.View that fades in on mount.
 */
export default function AnimatedEntry({
  delay = 0,
  duration = 400,
  children,
}: AnimatedEntryProps) {
  const entering = FadeIn.delay(delay).duration(duration);

  return <Animated.View entering={entering}>{children}</Animated.View>;
}
