import type {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types';
import type { BottomTabDescriptorMap } from '../types';
import type { ColorPaletteConfig } from '../assets/types';

export type ColorfulTabBarConfig = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  maxWidth: number;
  height: number;
  darkMode: boolean;
  colorPalette: ColorPaletteConfig;
};