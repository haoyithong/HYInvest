import { StyleProp, View, ViewStyle, Text } from "react-native";
import styles from "./styles";
import { useTheme } from "../../theme";

type Props = {
    user: string;
    style?: StyleProp<ViewStyle>;
};

const WelcomeText: React.FC<Props> = ({ user, style }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.welcomeWrapper}>
            {/* <Text style={[styles.welcome, { backgroundColor: colors.primary }, style]}>
                Welcome, <Text style={[styles.user, { backgroundColor: colors.primary }, style]}{user}</Text>
            </Text> */}
            <Text style={[styles.welcome, { backgroundColor: colors.primary, color: "#FFF" }, style]}>
                Hello, <Text style={[styles.user, { backgroundColor: colors.primary, color: "#FFF" }, style]}>{user}</Text>
            </Text>
        </View>
    );
};

export default WelcomeText;