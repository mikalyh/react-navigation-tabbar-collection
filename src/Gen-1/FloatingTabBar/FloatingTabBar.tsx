import React, { useEffect, useRef, useState } from 'react';
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
  closeIcon,
  openIcon
}: FloatingTabBarConfig) => {
  const BACKGROUND_COLOR = darkMode ? colorPalette.dark : colorPalette.light;
  const FOREGROUND_COLOR = darkMode ? colorPalette.light : colorPalette.dark;

  const [isShowContent, setShowContent] = useState<boolean>(false)
  const toggleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    onToggleAnimation(isShowContent ? 1 : 0)
  }, [isShowContent])

  const onToggle = () => {
    setShowContent(!isShowContent)
  }

  const onToggleAnimation = (value: number) => {
    Animated.timing(toggleAnimation, {
      toValue: value,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    }).start();
  }

  const renderToggleIcon = (icon?: (props: {color: string, size: number}) => React.ReactNode) => {
    if (icon === undefined || icon === null) {
      return (
        <View
          style={{
            ...FloatingStyle.itemIconNotFound,
            borderColor: FOREGROUND_COLOR,
          }}
        />
      );
    }

    return icon({
      color: FOREGROUND_COLOR,
      size: 23,
    });
  };

  const scaleXToggle = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [.5, 1],
  });

  return (
    <SafeAreaView
      style={[
        FloatingStyle.container,
        {
          height: height,
        },
      ]}
    >
      <Animated.View
        style={[
          FloatingStyle.content,
          {
            backgroundColor: BACKGROUND_COLOR,
            maxWidth: maxWidth,
            bottom: 0,
            right: 0,
            transform: [
              {scaleX: scaleXToggle},
              {translateX: 0}
            ]
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
            outputRange: [0, -10],
          });
          const translateYText = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 11],
          });
          const scaleText = focusAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
          });

          return (
            <Animated.View key={index} style={[FloatingStyle.item, {
              display: isShowContent ? 'flex' : 'none'
            }]}>
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
                        { translateY: translateYText },
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
        <View style={[
          FloatingStyle.toggleItem,
          {
            backgroundColor: '#00000012',
            borderTopStartRadius: isShowContent ? 0 : 50 ,
            borderBottomStartRadius: isShowContent ? 0 : 50 ,
          }
        ]}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onToggle}
            style={FloatingStyle.touchableItem}
          >
            <View style={FloatingStyle.toggleIconLayer}>
              {isShowContent ? renderToggleIcon(closeIcon) : renderToggleIcon(openIcon)}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default FloatingTabBar;
