import { StyleSheet } from 'react-native';
import { spacing, typography } from '../../theme';

export default StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    textInput: {
        height: 50,
        // margin: spacing.md,
        borderWidth: 1,
        padding: 10,
        width: '100%',
        borderRadius: 8,
        alignItems: 'center',

    },
    innerBox: {
        alignSelf: 'stretch',         // fill horizontal space inside centered container
    },
    title: {
        marginBottom: 6,
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    error: {
        marginTop: 4,
        fontSize: 12,
        color: '#e74c3c',
    },
});