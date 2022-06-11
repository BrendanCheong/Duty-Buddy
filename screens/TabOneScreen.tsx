import React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useTailwind } from 'tailwind-rn';

/**
 * @param root0
 * @param root0.navigation
 */
export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const tailwind = useTailwind();

    console.log('hello world');
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Things</Text>
            <Text style={tailwind('text-blue-600')}>Hello</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <EditScreenInfo path="/screens/TabOneScreen.tsx" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%'
    }
});
