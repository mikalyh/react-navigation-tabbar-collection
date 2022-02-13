import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Easing,
  SafeAreaView,
  Dimensions
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
  toolsData = []
}: ToolsTabBarConfig) => {
  const BACKGROUND_COLOR = darkMode ? colorPalette.dark : colorPalette.light;
  const FOREGROUND_COLOR = darkMode ? colorPalette.light : colorPalette.dark;
  const WIDTH_CONTENT = Dimensions.get('window').width;

  const ITEM_TOTAL = state.routes.length;
  const TOOLS_BUTTON_SIZE = 50;
  const FIRST_ITEM_TOTAL = Math.ceil(ITEM_TOTAL/2);
  const SECOND_ITEM_TOTAL = ITEM_TOTAL - FIRST_ITEM_TOTAL;

  const TOOLS_ITEM_TOTAL = toolsData.length;
  const FIRST_TOOLS_ITEM_TOTAL = Math.ceil(TOOLS_ITEM_TOTAL/2);
  const SECOND_TOOLS_ITEM_TOTAL = TOOLS_ITEM_TOTAL - FIRST_ITEM_TOTAL;

  const [isToolsShow, setToolsShow] = useState(false);
  const toolsAnimation = useRef(new Animated.Value(0)).current;

  const renderToolsIcon = (type: 'close' | 'open') => {
    if ((closeIcon === undefined || closeIcon === null) || (openIcon === undefined || openIcon === null)) {
      return (
        <View
          style={{
            ...ToolsStyle.itemIconNotFound,
            borderColor: main_colors.light,
          }}
        />
      );
    }
    switch (type) {
      case 'close':
        return closeIcon({
          color: main_colors.light,
          size: 23,
        });    

      case 'open':
        return openIcon({
          color: main_colors.light,
          size: 23,
        });        

      default:
        return undefined
    }
  };

  const onToolsPress = () => {
    setToolsShow(!isToolsShow)
  };

  useEffect(() => {
    if (isToolsShow) {
      onOpenToolsAnimation();
    } else {
      onCloseToolsAnimation();
    }
  }, [isToolsShow]);

  const onOpenToolsAnimation = () => {
    Animated.timing(toolsAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }).start();
  };

  const onCloseToolsAnimation = () => {
    Animated.timing(toolsAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }).start();
  };

  const translateYTools = toolsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 27]
  })
  const rotateTools = toolsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  const translateYContainer = toolsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60]
  })

  return (
    <SafeAreaView>
      <View style={ToolsStyle.toolsContainer}>
        <ToolsButton
          color={main_colors.danger}
          renderIcon={renderToolsIcon}
          renderIconType={!isToolsShow ? 'open' : 'close'}
          translateY={translateYTools}
          rotate={rotateTools}
          onPress={onToolsPress}
        />

        <View
          style={ToolsStyle.toolsContent}
        >
          {toolsData.map((tool, index) => {
            const renderIcon = () => {
              const {icon} = tool
              if (icon === undefined || icon === null) {
                return (
                  <View
                    style={{
                      ...ToolsStyle.itemIconNotFound,
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

            return (
              <Animated.View key={index} style={[
                ToolsStyle.toolsItem,
                {
                  width: 50,
                  backgroundColor: 'red'
                  // maxWidth: index < FIRST_TOOLS_ITEM_TOTAL ?
                  //                     (WIDTH_CONTENT/2 - (TOOLS_BUTTON_SIZE+0.5)/2) / FIRST_TOOLS_ITEM_TOTAL
                  //                   : (WIDTH_CONTENT/2 - (TOOLS_BUTTON_SIZE)/2) / SECOND_TOOLS_ITEM_TOTAL,
                  // marginLeft: index === FIRST_TOOLS_ITEM_TOTAL ? TOOLS_BUTTON_SIZE+0.2 : 0,
                }
              ]}>
                {renderIcon()}
              </Animated.View>
            );
          })}
        </View>
      </View>

      
      <View
        style={[
          ToolsStyle.container,
          {
            height: height,
          },
        ]}
      >
        <Animated.View
          style={[
            ToolsStyle.content,
            {
              maxWidth: maxWidth,
              transform: [
                {
                  translateY: translateYContainer
                }
              ]
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
              <View key={index} style={[
                ToolsStyle.item,
                {
                  maxWidth: index < FIRST_ITEM_TOTAL ?
                                      (WIDTH_CONTENT/2 - (TOOLS_BUTTON_SIZE+0.5)/2) / FIRST_ITEM_TOTAL
                                    : (WIDTH_CONTENT/2 - (TOOLS_BUTTON_SIZE)/2) / SECOND_ITEM_TOTAL,
                  marginLeft: index === FIRST_ITEM_TOTAL ? TOOLS_BUTTON_SIZE+0.2 : 0,
                }
              ]}>
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
              </View>
            );
          })}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default ToolsTabBar;
