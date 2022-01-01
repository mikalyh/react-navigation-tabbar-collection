import React from 'react';
import { Animated } from 'react-native';
import { CleanStyle } from '../assets/TabStyle';
import type { DotConfig } from './types';

const Dot = ({ color, scale = 1 }: DotConfig) => {
  return (
    <Animated.View
      style={[
        CleanStyle.itemDot,
        {
          backgroundColor: color,
          transform: [{ scale: scale }],
        },
      ]}
    />
  );
};

export default Dot;
