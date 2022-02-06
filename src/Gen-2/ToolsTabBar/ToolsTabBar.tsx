import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Easing,
  SafeAreaView,
} from 'react-native';
import { main_colors } from '../../assets/TabColor';
import { ToolsStyle } from '../../assets/TabStyle';
import ToolsButton from './ToolsButton';
import type { ToolsTabBarConfig } from './types';

const ToolsTabBar = ({
  state,
  descriptors,
  navigation,
  maxWidth = 600,
  height,
  darkMode = false,
  colorPalette = main_colors,
  closeIcon,
  openIcon,
  toolsData
}: ToolsTabBarConfig) => {
  const BACKGROUND_COLOR = darkMode ? colorPalette.dark : colorPalette.light;
  const FOREGROUND_COLOR = darkMode ? colorPalette.light : colorPalette.dark;

  const [tools_view, setToolsView] = useState(false);

  const renderToolsIcon = (type: 'close' | 'open') => {
    switch (type) {
      case 'close':
        if (closeIcon === undefined || closeIcon === null) {
          return (
            <View
              style={{
                ...ToolsStyle.itemIconNotFound,
                borderColor: main_colors.light,
              }}
            />
          );
        }
    
        return closeIcon({
          color: main_colors.light,
          size: 23,
        });    

      case 'open':
        if (openIcon === undefined || openIcon === null) {
          return (
            <View
              style={{
                ...ToolsStyle.itemIconNotFound,
                borderColor: main_colors.light,
              }}
            />
          );
        }
    
        return openIcon({
          color: main_colors.light,
          size: 23,
        });        

      default:
        return undefined
    }
  };

  return (
    <SafeAreaView
      style={[
        ToolsStyle.container,
        {
          backgroundColor: BACKGROUND_COLOR,
          height: height,
        },
      ]}
    >
      <View
        style={[
          ToolsStyle.content,
          {
            maxWidth: maxWidth,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focusAnimation = useRef(new Animated.Value(0)).current;

          const { options } = descriptors[route.key];

          let color =
            options.tabBarActiveTintColor !== undefined
              ? options.tabBarActiveTintColor
              : options.color !== undefined
              ? options.color
              : colorPalette.primary;
          color = (color || '').charAt(0) == '#' ? color : colorPalette[color];

          const icon =
            options.tabBarIcon !== undefined
              ? options.tabBarIcon
              : options.icon !== undefined
              ? options.icon
              : null;

          const renderIcon = (focused: boolean) => {
            if (icon === undefined || icon === null) {
              return (
                <View
                  style={{
                    ...ToolsStyle.itemIconNotFound,
                    borderColor: focused ? color : FOREGROUND_COLOR,
                  }}
                />
              );
            }

            return icon({
              focused,
              color: focused ? color : FOREGROUND_COLOR,
              size: 23,
            });
          };

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          useEffect(() => {
            if (isFocused) {
              onFocusedAnimation();
            } else {
              notFocusedAnimation();
            }
          }, [isFocused]);

          const onFocusedAnimation = () => {
            Animated.timing(focusAnimation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }).start();
          };

          const notFocusedAnimation = () => {
            Animated.timing(focusAnimation, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }).start();
          };

          const scaleIcon = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          });

          return (
            <Animated.View key={index} style={ToolsStyle.item}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={ToolsStyle.touchableItem}
              >
                <Animated.View
                  style={[
                    ToolsStyle.itemIconLayer,
                    {
                      transform: [
                        { scale: scaleIcon },
                      ],
                    },
                  ]}
                >
                  {renderIcon(isFocused)}
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
      <ToolsButton
        color={main_colors.danger}
        renderIcon={renderToolsIcon}
      />
    </SafeAreaView>
  );
};

export default ToolsTabBar;
