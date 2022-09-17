import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  BottomNavigationTab,
  Button,
  Layout,
  Text,
} from '@ui-kitten/components';
import {firebaseConfig} from '../utils/firebase-config';
import ViewHome from './ViewHome';
import ImagePicker from 'react-native-image-crop-picker';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {initializeApp} from 'firebase/app';
import {collection, doc, getFirestore, setDoc} from 'firebase/firestore/lite';
import md5 from 'md5';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';

const {Navigator, Screen} = createBottomTabNavigator();
const OrdersScreen = () => {
  const {user} = useSelector((root: RootState) => root.user);
  const onPress = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
    }).then(async image => {
      const response = await fetch(image.path);
      const blob = await response.blob();
      const app = initializeApp(firebaseConfig);

      const storage = await getStorage(app);
      const storageRef = await ref(
        storage,
        `new_folder/${md5(new Date().toISOString())}.${
          image.mime.split('/')[1]
        }`,
      );
      await uploadBytes(storageRef, blob).then(async snapshot => {
        getDownloadURL(snapshot.ref).then(async downloadURL => {
          const firestore = getFirestore(app);
          const citiesRef = collection(firestore, 'videos');
          const docRef = await doc(citiesRef, md5(new Date().toISOString()));
          const newGlosary = {
            id: md5(new Date().toISOString()),
            user_id: user.id,
            file: downloadURL,
          };
          setDoc(docRef, newGlosary);
        });
        Alert.alert('Cargado', 'imagen subida correctamente');
      });
    });
  };
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">Upload Videos</Text>
      <Button onPress={onPress}>Slect file</Button>
    </Layout>
  );
};
const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title="Home" />
    <BottomNavigationTab title="Videos" />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen
      options={{
        title: 'Home',
      }}
      name="ViewHome"
      component={ViewHome}
    />
    <Screen name="Videos" component={OrdersScreen} />
  </Navigator>
);

const Home = () => <TabNavigator />;

export default Home;
