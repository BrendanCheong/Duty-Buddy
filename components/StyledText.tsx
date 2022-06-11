import { Text, TextProps } from './Themed';

/** @param props */
export function MonoText(props: TextProps) {
    return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}
