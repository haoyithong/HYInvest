import { Alert } from 'react-native';

type ConfirmOptions = {
    title: string;
    message: string;

    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
};

export const ConfirmDialog = ({
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
}: ConfirmOptions) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: cancelText || 'Cancel',
                style: 'cancel',
                onPress: onCancel,
            },
            {
                text: confirmText || 'OK',
                onPress: onConfirm,
            },
        ],
        { cancelable: true }
    );
};