import { TextInput, StyleSheet, TextInputProps, Text, View } from "react-native"
import { Controller, Control, FieldValues, Path, Field } from "react-hook-form"

type CustomInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({ control, name, ...props }: CustomInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={styles.container}>
                    <TextInput
                        {...props}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={[styles.input, props.style, error ? { borderColor: '#DDBDD5' } : { borderColor: '#F7EBEC' }]}
                    />
                    {<Text style={styles.error}>{error?.message}</Text>}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: '#F7EBEC',
        color: '#F7EBEC',
    },
    error: {
        color: `#DDBDD5`

    },
    container:{
        gap: 3,
    }
});