import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, Button, Divider, Card} from '@ui-kitten/components';
import InputLabel from '../components/inputs/InputLabel';
const windowHeight = Dimensions.get('window').height;

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';

import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../utils/firebase-config';
import {doc, getFirestore, setDoc, collection} from 'firebase/firestore/lite';
import {Formik} from 'formik';
import {perfectSize} from '../utils/pixel';
import {RootState} from '../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {addUserAuth} from '../store/userSlice';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/RootStackPramsList';

type ScreenProps = NavigationProp<RootStackParamList, 'Home'>;

const app = initializeApp(firebaseConfig);
const Login = () => {
  const {isLogin} = useSelector((state: RootState) => state.user);
  const [isRegister, setIsRegister] = useState(false);
  const navigation = useNavigation<ScreenProps>();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLogin) {
      navigation.navigate('Home');
    }
  }, [isLogin]);

  const addRoleStorage = async (user: User) => {
    const firestore = getFirestore(app);
    const citiesRef = collection(firestore, 'users');
    const docRef = await doc(citiesRef, `${user.uid}`);
    setDoc(docRef, {
      role: 'user',
    })
      .then(resp => console.log(resp))
      .catch(err => console.log(err));
  };

  const initialState = {email: '', password: ''};
  const onSubmit = (values: typeof initialState) => {
    const auth = getAuth(app);
    console.log(values);
    if (isRegister) {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(response => {
          addRoleStorage(response.user);
          console.log(response.user);
          dispatch(
            addUserAuth({
              isLogin: true,
              user: {
                email: values.email,
                role: 'user',
                id: response.user.uid,
              },
              accessToken: response.user.accessToken,
            }),
          );

          navigation.navigate('Home');
        })
        .catch(err => {
          console.log(err);
          setError('este email ya ha sido registrado');
        });
    }

    if (!isRegister) {
      signInWithEmailAndPassword(auth, values.email, values.password).then(
        response => {
          addRoleStorage(response.user);
          console.log(response.user);
          dispatch(
            addUserAuth({
              isLogin: true,
              user: {
                email: values.email,
                role: 'user',
                id: response.user.uid,
              },
              accessToken: response.user.accessToken,
            }),
          );
          navigation.navigate('Home');
        },
      );
    }
  };

  return (
    <View style={style.container}>
      <Card style={style.subcontainer}>
        <Formik initialValues={initialState} onSubmit={onSubmit}>
          {({handleChange, handleBlur, handleSubmit, errors}) => (
            <>
              <Text category="h4" style={style.title}>
                {isRegister ? 'REGISTRARME' : 'INGRESAR'}
              </Text>
              <InputLabel
                label="email"
                placeholder="Email Address"
                keyboardType="email-address"
                onChangeText={handleChange}
                onBlur={handleBlur}
                name="email"
                error={errors.email}
              />

              <InputLabel
                name="password"
                label="Contraseña"
                placeholder="*****"
                secureTextEntry
                onChangeText={handleChange}
                onBlur={handleBlur}
              />
              <Divider style={style.divider} />
              {error?.length ? (
                <Text style={style.message_error}>
                  Este email ya ha sido usado
                </Text>
              ) : (
                <></>
              )}
              <Button onPress={handleSubmit}>
                {isRegister ? 'REGISTRARME' : 'LOGIN'}
              </Button>
              <Divider style={style.divider_buttons} />
              <Button onPress={() => setIsRegister(!isRegister)}>
                {isRegister ? 'LOGIN' : 'REGISTRARME'}
              </Button>
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
  divider_buttons: {
    marginVertical: 10,
  },
  message_error: {paddingVertical: perfectSize(5), textAlign: 'center'},
});

export default Login;
