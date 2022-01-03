import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Easing,
  SafeAreaView,
  LayoutChangeEvent,
} from 'react-native';
import { main_colors } from '../assets/TabColor';
import { ColorfulStyle } from '../assets/TabStyle';
import { hexToRGB } from '../utils/Converter';
import type { ColorfulTabBarConfig } from './types';

const ColorfulTabBar = ({
  state,
  descriptors,
  navigation,
  maxWidth,
  height,
  darkMode = false,
  colorPalette = main_colors,
}: ColorfulTabBarConfig) => {
  const BACKGROUND_COLOR = darkMode ? colorPalette.dark : colorPalette.light;
  const FOREGROUND_COLOR = darkMode ? colorPalette.light : colorPalette.dark;
  const ITEM_TOTAL = state.routes.length;

  return (
    <SafeAreaView
      style={[
        ColorfulStyle.container,
        {
          backgroundColor: BACKGROUND_COLOR,
          height: height,
        },
      ]}
    >
      <View
        style={[
          ColorfulStyle.content,
          {
            maxWidth: maxWidth
              ? maxWidth
              : ITEM_TOTAL == 1
              ? 150
              : 100 * ITEM_TOTAL,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focusAnimation = useRef(new Animated.Value(0)).current;
          const [width_text, setWidthText] = useState(0)
          const [width_icon, setWidthIcon] = useState(0)

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
          const rgb_color = hexToRGB(color);

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
                    ...ColorfulStyle.itemIconNotFound,
                    borderColor: focused ? color : FOREGROUND_COLOR,
                  }}
                />
              );
            }

            return icon({
              focused,
              color: focused
                ? darkMode
                  ? FOREGROUND_COLOR
                  : color
                : FOREGROUND_COLOR,
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
              useNativeDriver: false,
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            }).start();
          };

          const notFocusedAnimation = () => {
            Animated.timing(focusAnimation, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            }).start();
          };

          const flexItem = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2],
          });
          const filterColor = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [
              `rgba(${rgb_color[0]}, ${rgb_color[1]}, ${rgb_color[2]}, 0)`,
              `rgba(${rgb_color[0]}, ${rgb_color[1]}, ${rgb_color[2]}, ${
                darkMode ? '1' : '.2'
              })`,
            ],
          });

          const HALF_ICON_WIDTH = width_icon/2
          const TEXT_ICON_WIDTH = width_text+HALF_ICON_WIDTH

          const translateXIcon = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -(TEXT_ICON_WIDTH)/2],
          });
          const translateXText = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, (HALF_ICON_WIDTH)+5],
          });
          const opacityText = focusAnimation.interpolate({
            inputRange: [0.3, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.View
              key={index}
              style={[
                ColorfulStyle.item,
                {
                  flex: flexItem,
                },
              ]}
            >
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={ColorfulStyle.touchableItem}
              >
                <Animated.View
                  style={[
                    ColorfulStyle.filterColor,
                    {
                      backgroundColor: filterColor,
                    },
                  ]}
                >
                  <Animated.View style={{
                      position: 'absolute',
                      transform: [
                        {translateX: translateXIcon}
                      ]
                  }}
                  onLayout={(e: LayoutChangeEvent) => {
                    const {width} = e.nativeEvent.layout
                    setWidthIcon(width)
                  }}>
                    {renderIcon(isFocused)}
                  </Animated.View>

                  <Animated.View
                    style={{
                      position: 'absolute',
                      opacity: opacityText,
                      transform: [
                        {translateX: translateXText}
                      ],
                    }}
                    onLayout={(e: LayoutChangeEvent) => {
                      const {width} = e.nativeEvent.layout
                      setWidthText(width)
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        ColorfulStyle.itemText,
                        {
                          color: darkMode ? FOREGROUND_COLOR : color,
                        },
                        labelStyle,
                      ]}
                    >
                      {label}
                    </Text>
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default ColorfulTabBar;
