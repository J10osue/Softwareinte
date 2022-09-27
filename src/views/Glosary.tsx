import React, {useEffect, useState} from 'react';
import {Button, Text} from '@ui-kitten/components';
import {View, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {initializeApp} from 'firebase/app';
import {
  query,
  getFirestore,
  where,
  getDocs,
  collection,
  CollectionReference,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore/lite';
import {firebaseConfig} from '../utils/firebase-config';
import {RootState} from '../store/store';
import {useDispatch, useSelector} from 'react-redux';
import CardGlosary from '../components/cards/CardGlosary';
import {addListGlosaries, TypeGlosary} from '../store/glosarySlice';
import ModalGlosarry from '../components/modals/ModalGlosarry';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Login from './Login';
import {perfectSize} from '../utils/pixel';

const Tab = createMaterialBottomTabNavigator();

const Example = () => (
  <View>
    <Text>Hello example</Text>
  </View>
);

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Example">
      <Tab.Screen name="Example" component={Example} />
      <Tab.Screen name="Settings" component={Login} />
    </Tab.Navigator>
  );
}

const Glosary = () => {
  const {user} = useSelector((root: RootState) => root.user);
  const {glossaries} = useSelector((root: RootState) => root.golsary);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const getGloassary = async (
    ref: CollectionReference<DocumentData>,
    queryFire: QueryConstraint,
  ) => {
    const q = query(ref, queryFire);
    return await getDocs(q);
  };

  const getGlosary = async (user_id: string): Promise<TypeGlosary[]> => {
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const citiesRef = collection(firestore, 'glossary');
    const listGlosary: TypeGlosary[] = [];
    await getGloassary(citiesRef, where('user_id', '==', user_id)).then(
      response =>
        response.forEach(data => listGlosary.push(data.data() as TypeGlosary)),
    );
    await getGloassary(citiesRef, where('user_id', '==', '')).then(response => {
      response.forEach(data => listGlosary.push(data.data() as TypeGlosary));
    });

    return listGlosary;
  };
  useEffect(() => {
    getGlosary(user.id).then(response => {
      dispatch(addListGlosaries(response));
    });
  }, []);

  const onSuccess = () => {
    setVisible(false);
  };
  return (
    <View>
      <View style={style.container_image}>
        <Button
          style={{
            width: perfectSize(240),
          }}
          onPress={() => setVisible(true)}>
          añadir palabra al glosario
        </Button>
      </View>
      <ModalGlosarry
        visible={visible}
        onPress={() => setVisible(false)}
        onSuccess={onSuccess}
      />
      <SafeAreaView>
        <FlatList
          data={glossaries}
          renderItem={({item}) => <CardGlosary {...item} />}
        />
      </SafeAreaView>
      <MyTabs />
    </View>
  );
};

export default Glosary;

const style = StyleSheet.create({
  container_image: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: perfectSize(10),
  },
});
