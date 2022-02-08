import { TouchableOpacity, Animated, View } from 'react-native';
import React from 'react';
import { ToolsStyle } from '../../assets/TabStyle';
import type { ToolsButtonConfig } from './types';

const ToolsButton = ({renderIcon, color, translateY, rotate, onPress}: ToolsButtonConfig) => {
  return (
    <Animated.View style={[
        ToolsStyle.toolsButtonContainer,
        {
            transform: [
                {
                    translateY: translateY,
                }
            ]
        }
    ]}>
        <TouchableOpacity onPress={onPress}>
            <View style={[
                ToolsStyle.toolsButton,
                {
                    backgroundColor: color,
                }
            ]}>
            {renderIcon('open')}
            </View>
        </TouchableOpacity>
    </Animated.View>
  );
};

export default ToolsButton;
