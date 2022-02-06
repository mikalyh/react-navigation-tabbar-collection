import type {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/src/types';
import type { BottomTabDescriptorMap } from '../../types';
import type { ColorPaletteConfig } from '../../assets/types';

type ToolsDataType = {
  icon?: (props: {
    color: string;
    size: number;
  }) => React.ReactNode;
  onPress?: () => void
}

export type ToolsTabBarConfig = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  maxWidth: number;
  height: number;
  darkMode: boolean;
  colorPalette: ColorPaletteConfig;
  closeIcon?: (props: {
    color: string;
    size: number;
  }) => React.ReactNode;
  openIcon?: (props: {
    color: string;
    size: number;
  }) => React.ReactNode;
  toolsData?: Array<ToolsDataType>
};

export type ToolsButtonConfig = {
  color: string,
  renderIcon: (type: 'close' | 'open') => React.ReactNode;
}