import { StyleSheet } from 'react-native';
import { spacing, radius } from '../../theme';

export default StyleSheet.create({
    welcomeWrapper: {
        position: 'absolute',
        top: 0,
        width: '100%'
    },
    welcome: {
        padding: spacing.xl,
        fontSize: 30,
        fontWeight: '700',
    },
    user: {
        padding: spacing.xl,
        fontSize: 24,
        fontWeight: '600',
    },
});
