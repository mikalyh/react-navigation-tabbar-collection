import type {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types';
import type { BottomTabDescriptorMap } from '../types';
import type { Animated, StyleProp, ViewStyle } from 'react-native';
import type { ColorPaletteConfig } from '../assets/types';

export type CleanTabBarConfig = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  maxWidth: number;
  height: number;
  darkMode: boolean;
  colorPalette: ColorPaletteConfig;
};

export type TriangleConfig = {
  color?: string;
  style?: StyleProp<ViewStyle>;
  translateY?: number | Animated.AnimatedInterpolation;
};

export type DotConfig = {
  color?: string;
  scale?: number | Animated.AnimatedInterpolation;
};