import React from 'react';
import { Animated, View } from 'react-native';
import { CleanStyle } from '../assets/TabStyle';
import type { TriangleConfig } from './types';

const Triangle = ({ color, style, translateY }: TriangleConfig) => {
  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY: translateY }],
        },
      ]}
    >
      <View
        style={[
          CleanStyle.triangleTop,
          {
            borderBottomColor: color,
          },
        ]}
      />
      <View
        style={[
          CleanStyle.triangleBottom,
          {
            backgroundColor: color,
          },
        ]}
      />
    </Animated.View>
  );
};

export default Triangle;
