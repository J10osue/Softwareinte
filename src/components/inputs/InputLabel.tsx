import React from 'react';
import {View, StyleSheet, KeyboardType} from 'react-native';
import {Text, Input} from '@ui-kitten/components';
import {perfectSize} from '../../utils/pixel';
type Props = {
  label: string;
  placeholder: string;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
  onChangeText: (e?: any) => any;
  error?: string;
  name: string;
  onBlur: (e: FocusEvent) => any;
  multiline?: boolean;
  numberOfLines?: number;
};
const InputLabel = ({
  label,
  placeholder,
  keyboardType,
  secureTextEntry,
  onChangeText,
  error,
  name,
  onBlur,
  numberOfLines,
  multiline,
}: Props) => {
  return (
    <View style={style.container}>
      <Text category="h6" style={style.label}>
        {label?.toUpperCase()}
      </Text>
      <Input
        keyboardType={keyboardType || 'default'}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onBlur={onBlur(name)}
        onChangeText={onChangeText(name)}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error?.length && <Text style={style.error}>{error}</Text>}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: perfectSize(2),
  },
  label: {
    width: '100%',
  },
  error: {
    fontSize: perfectSize(13),
    marginVertical: perfectSize(2),
  },
});

export default InputLabel;
