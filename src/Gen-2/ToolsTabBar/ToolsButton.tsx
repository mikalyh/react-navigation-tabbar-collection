import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ToolsStyle } from '../../assets/TabStyle';
import type { ToolsButtonConfig } from './types';

const ToolsButton = ({
    renderIcon,
    color
}: ToolsButtonConfig) => {
  return (
    <View style={ToolsStyle.toolsButtonContainer}>
        <TouchableOpacity>
            <View style={[
                ToolsStyle.toolsButton,
                {
                    backgroundColor: color
                }
            ]}>
            {renderIcon('open')}
            </View>
        </TouchableOpacity>
    </View>
  );
};

export default ToolsButton;
