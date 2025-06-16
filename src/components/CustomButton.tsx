import { Pressable, StyleSheet, Text, PressableProps } from "react-native"

type CustomButtonProps = {
    text: string;
} & PressableProps;

export default function CustomButton({text, ...props}: CustomButtonProps) {
    return (
        <Pressable {...props} style={[styles.button]}>
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#Ac9fbb',
  },
  buttonText: {
    color: '#F7EBEC',
    fontSize: 16,
    fontWeight: '600',
  }
})