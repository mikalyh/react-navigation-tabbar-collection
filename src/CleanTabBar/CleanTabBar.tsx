import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Easing,
  SafeAreaView,
} from 'react-native';
import { main_colors } from '../assets/TabColor';
import { CleanStyle } from '../assets/TabStyle';
import Dot from './Dot';
import Triangle from './Triangle';
import type { CleanTabBarConfig } from './types';

const CleanTabBar = ({
  state,
  descriptors,
  navigation,
  maxWidth = 600,
  height,
  darkMode = false,
  colorPalette = main_colors,
}: CleanTabBarConfig) => {
  const BACKGROUND_COLOR = darkMode ? colorPalette.dark : colorPalette.light;
  const FOREGROUND_COLOR = darkMode ? colorPalette.light : colorPalette.dark;

  return (
    <SafeAreaView
      style={[
        CleanStyle.container,
        {
          backgroundColor: BACKGROUND_COLOR,
          height: height,
        },
      ]}
    >
      <View
        style={[
          CleanStyle.content,
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
                    ...CleanStyle.itemIconNotFound,
                    borderColor: focused ? color : FOREGROUND_COLOR,
                  }}
                />
              );
            }

            return icon({
              focused,
              color: focused ? FOREGROUND_COLOR : FOREGROUND_COLOR,
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
              duration: 700,
              useNativeDriver: true,
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            }).start();
          };

          const notFocusedAnimation = () => {
            Animated.timing(focusAnimation, {
              toValue: 0,
              duration: 700,
              useNativeDriver: true,
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            }).start();
          };

          const translateYIcon = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -18],
          });
          const scaleIcon = focusAnimation.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [1, 1, 0],
          });
          const translateYFilterIcon = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, -35],
          });
          const translateYText = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0],
          });
          const scaleText = focusAnimation.interpolate({
            inputRange: [0, 0.1, 1],
            outputRange: [0, 1, 1],
          });
          const scaleDot = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.View key={index} style={CleanStyle.item}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={CleanStyle.touchableItem}
              >
                <Animated.View
                  style={[
                    CleanStyle.itemIconLayer,
                    {
                      transform: [
                        { translateY: translateYIcon },
                        { scale: scaleIcon },
                      ],
                    },
                  ]}
                >
                  {renderIcon(isFocused)}
                </Animated.View>
                <Triangle
                  color={BACKGROUND_COLOR}
                  style={CleanStyle.filterIcon}
                  translateY={translateYFilterIcon}
                />

                <Animated.View
                  pointerEvents="none"
                  style={[
                    CleanStyle.itemTextLayer,
                    {
                      transform: [
                        { translateY: translateYText },
                        { scale: scaleText },
                      ],
                    },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      CleanStyle.itemText,
                      labelStyle,
                      {
                        color: color,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Animated.View>
                <Triangle
                  color={BACKGROUND_COLOR}
                  style={CleanStyle.filterText}
                  translateY={-5}
                />

                <Dot color={color} scale={scaleDot} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default CleanTabBar;
