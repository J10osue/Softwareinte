import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, Button, Divider, Card} from '@ui-kitten/components';
import InputLabel from '../components/inputs/InputLabel';
const windowHeight = Dimensions.get('window').height;

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../utils/firebase-config';
import {Formik} from 'formik';

const Register = () => {
  const onSubmit = values => {
    const app = initializeApp(firebaseConfig);
    console.log(values);
    const auth = getAuth(app);

    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(response => {
        console.log(response);
      })
      .catch(err => console.error(err));
  };

  return (
    <View style={style.container}>
      <Card style={style.subcontainer}>
        <Formik initialValues={{email: '', password: ''}} onSubmit={onSubmit}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <>
              <Text category="h1" style={style.title}>
                Register
              </Text>
              <InputLabel
                label="email"
                placeholder="Email Address"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleChange('email')}
                error={errors.email}
              />

              <InputLabel
                name="password"
                label="Contraseña"
                placeholder="*****"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleChange('password')}
              />
              <Divider style={style.divider} />
              <Button onPress={handleSubmit}>LOGIN</Button>
            </>
          )}
        </Formik>
      </Card>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: windowHeight,
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subcontainer: {},
  divider: {
    marginVertical: 20,
  },
});

export default Register;
