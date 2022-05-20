import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Easing,
  SafeAreaView,
} from 'react-native';
import { main_colors } from '../../assets/TabColor';
import { FloatingStyle } from '../../assets/TabStyle';
import type { FloatingTabBarConfig } from './types';

const FloatingTabBar = ({
  state,
  descriptors,
  navigation,
  maxWidth = 600,
  height,
  darkMode = false,
  colorPalette = main_colors,
}: FloatingTabBarConfig) => {
  const BACKGROUND_COLOR = darkMode ? colorPalette.dark : colorPalette.light;
  const FOREGROUND_COLOR = darkMode ? colorPalette.light : colorPalette.dark;

  return (
    <SafeAreaView
      style={[
        FloatingStyle.container,
        {
          backgroundColor: BACKGROUND_COLOR,
          height: height,
        },
      ]}
    >
      <View
        style={[
          FloatingStyle.content,
          {
            maxWidth: maxWidth,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focusAnimation = useRef(new Animated.Value(0)).current;

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.label !== undefined
              ? options.label
              : options.title !== undefined
              ? options.title
              : route.name;
          const labelStyle =
            options.tabBarLabelStyle !== undefined
              ? options.tabBarLabelStyle
              : options.labelStyle !== undefined
              ? options.labelStyle
              : {};

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
                    ...FloatingStyle.itemIconNotFound,
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
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            }).start();
          };

          const notFocusedAnimation = () => {
            Animated.timing(focusAnimation, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            }).start();
          };

          const translateYIcon = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [5, -2],
          });
          const scaleText = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.View key={index} style={FloatingStyle.item}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={FloatingStyle.touchableItem}
              >
                <Animated.View
                  style={[
                    FloatingStyle.itemIconLayer,
                    {
                      transform: [
                        { translateY: translateYIcon },
                      ],
                    },
                  ]}
                >
                  {renderIcon(isFocused)}
                </Animated.View>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    FloatingStyle.itemTextLayer,
                    {
                      transform: [
                        { scale: scaleText },
                      ],
                    },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      FloatingStyle.itemText,
                      labelStyle,
                      {
                        color: isFocused ? color : FOREGROUND_COLOR,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default FloatingTabBar;
