import {Avatar, Button, Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {closeSession} from '../store/userSlice';
import {perfectSize} from '../utils/pixel';
import {getAuth, signOut} from 'firebase/auth';
import {firebaseConfig} from '../utils/firebase-config';
import {initializeApp} from 'firebase/app';
import {RootStackParamList} from '../navigation/RootStackPramsList';
import {NavigationProp, useNavigation} from '@react-navigation/native';
type ScreenProps = NavigationProp<RootStackParamList, 'Home'>;
const ProfileScreen = () => {
  const navigation = useNavigation<ScreenProps>();

  const {user, isLogin} = useSelector((root: RootState) => root.user);
  const dispatch = useDispatch();
  const signOutPress = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    signOut(auth);
    dispatch(closeSession({}));
    navigation.navigate('Login');
  };

  return (
    <View
      style={{
        marginHorizontal: perfectSize(20),
      }}>
      <View style={style.container_avatar}>
        <Avatar
          style={style.avatar}
          source={{
            uri: `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff&size=128`,
          }}
        />
      </View>
      <Text category="h5">Email</Text>
      <Text category="h6">{user.email}</Text>
      <Text category="h5">{JSON.stringify(isLogin)}</Text>
      <Button
        style={{
          marginVertical: perfectSize(20),
        }}
        onPress={signOutPress}>
        Cerrar sessión
      </Button>
    </View>
  );
};

export default ProfileScreen;

const style = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150,
  },
  container_avatar: {
    alignItems: 'center',
  },
});
