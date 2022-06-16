import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Easing,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { main_colors } from '../../assets/TabColor';
import { FloatingStyle } from '../../assets/TabStyle';
import type { FloatingTabBarConfig } from './types';

const FloatingTabBar = ({
  state,
  descriptors,
  navigation,
  maxWidth = Dimensions.get('window').width - 30,
  height = 62,
  darkMode = false,
  colorPalette = main_colors,
  closeIcon,
  openIcon,
  initialOpen = false,
  floatingPosition = 'right'
}: FloatingTabBarConfig) => {
  const BACKGROUND_COLOR = darkMode ? colorPalette.dark : colorPalette.light;
  const FOREGROUND_COLOR = darkMode ? colorPalette.light : colorPalette.dark;

  const [isShowContent, setShowContent] = useState<boolean>(initialOpen)
  const toggleAnimation = useRef(new Animated.Value(0)).current;
  let floatingPositionStyle = {};

  switch(floatingPosition) {
    case 'left':
      floatingPositionStyle = {
        bottom: 0,
        left: 0
      }
      break;
    default:
      floatingPositionStyle = {
        bottom: 0,
        right: 0
      }
  }

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

  const widthToggle = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 600],
  });

  return (
    <SafeAreaView
      style={FloatingStyle.container}
    >
      <Animated.View
        style={[
          FloatingStyle.content,
          {
            backgroundColor: BACKGROUND_COLOR,
            maxWidth: maxWidth,
            width: widthToggle,
            height: height,
          },
          floatingPositionStyle
        ]}
      >
        {
          floatingPosition.includes('left') ? (
            <View style={[
              FloatingStyle.toggleItem,
              {
                backgroundColor: isShowContent ? colorPalette.dark+'12' : 'transparent',
                borderTopStartRadius: 50,
                borderBottomStartRadius: 50,
                borderTopEndRadius: 0,
                borderBottomEndRadius: 0
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
          ) : null
        }
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
            outputRange: [0, -8],
          });
          const translateYText = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 13],
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
        {
          floatingPosition.includes('right') ? (
            <View style={[
              FloatingStyle.toggleItem,
              {
                backgroundColor: isShowContent ? colorPalette.dark+'12' : 'transparent',
                borderTopStartRadius: 0,
                borderBottomStartRadius: 0,
                borderTopEndRadius: 50,
                borderBottomEndRadius: 50
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
          ) : null
        }
      </Animated.View>
    </SafeAreaView>
  );
};

export default FloatingTabBar;
