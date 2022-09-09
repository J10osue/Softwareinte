import {Button, Card, Text, Icon, Layout} from '@ui-kitten/components';
import {initializeApp} from 'firebase/app';
import {
  collection,
  doc,
  getFirestore,
  deleteDoc,
} from 'firebase/firestore/lite';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {removeItemGlossary, TypeGlosary} from '../../store/glosarySlice';
import {firebaseConfig} from '../../utils/firebase-config';
import {perfectSize} from '../../utils/pixel';
import {v4 as uuidv4} from 'uuid';
import {useDispatch} from 'react-redux';

const CardGlosary = ({item: {name, description, id}}: {item: TypeGlosary}) => {
  console.log(name, description, id);
  const dispatch = useDispatch();
  const deleted = async (idRemove: string) => {
    console.log('remove', idRemove);
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const citiesRef = collection(firestore, 'glossary');
    const docRef = await doc(citiesRef, idRemove);
    deleteDoc(docRef);
    dispatch(removeItemGlossary(idRemove));
  };
  return (
    <Layout style={style.container}>
      <View style={style.content}>
        <Text category="h4">{name}</Text>
        <Text>{description}</Text>
      </View>
      <View style={style.container_buttons_flex}>
        <View style={style.container_buttons}>
          <Button
            style={style.buttons}
            status="danger"
            size="tiny"
            accessoryLeft={<Icon name="trash" />}
            onPress={() => deleted(id)}
          />
          <Button
            style={style.buttons}
            status="warning"
            size="tiny"
            accessoryLeft={<Icon name="edit" />}
          />
          <Button
            style={style.buttons}
            status="success"
            size="tiny"
            accessoryLeft={<Icon name="eye" />}
          />
        </View>
      </View>
    </Layout>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: perfectSize(4),
  },
  content: {
    flex: 1,
    padding: perfectSize(10),
  },
  container_buttons_flex: {
    display: 'flex',
    justifyContent: 'center',
  },
  container_buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttons: {
    marginHorizontal: 2,
  },
});

export default CardGlosary;
