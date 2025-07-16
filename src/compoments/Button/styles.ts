
import { StyleSheet } from 'react-native';
import { spacing, radius } from '../../theme';

export default StyleSheet.create({
  button: {
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    width: '80%',
    margin: 16,
  },
  bottomButton: {
    padding: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  fillButton: {
    // borderRadius: radius.lg,
    flex: 1, // 平均佔據空間
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 12,
  }
});

