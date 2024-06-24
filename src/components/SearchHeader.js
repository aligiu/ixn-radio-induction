import React from 'react';
import { useColorScheme } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { customLightColors } from '../theme/colors';
import { customDarkColors } from '../theme/colors';

export default function CustomHeader({ navigation, route }) {
    const colorScheme = useColorScheme();
    const paperTheme = 
    // colorScheme === 'dark' 
    false
    ? customDarkColors 
    : customLightColors;

    return (
        <Searchbar
            placeholder="Search"
            style={{ backgroundColor: paperTheme.background }}
            inputStyle={{ color: paperTheme.text }}
            iconColor={paperTheme.text}
            placeholderTextColor={paperTheme.textSecondary}
        />
    );
}