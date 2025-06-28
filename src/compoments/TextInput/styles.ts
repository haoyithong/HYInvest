import { StyleSheet } from 'react-native';
import { spacing } from '../../theme';

export default StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    textInput: {
        // height: 40,
        // margin: spacing.md,
        borderWidth: 1,
        padding: 10,
        width: '80%',
        borderRadius: 8,
        alignItems: 'center',
    },
    innerBox: {
        alignSelf: 'stretch',         // fill horizontal space inside centered container
        marginLeft: '10%',
    },
    title: {
        marginBottom: 6,
        fontSize: 14,
        color: '#333',
        alignContent: 'flex-start',
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