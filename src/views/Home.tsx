import {
  Button,
  Card,
  Modal,
  Text,
  Divider,
  List,
  Icon,
} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {View, Dimensions, FlatList, SafeAreaView} from 'react-native';
import {RootStackParamList} from '../navigation/RootStackPramsList';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {initializeApp} from 'firebase/app';
import {v4 as uuidv4} from 'uuid';
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
import InputLabel from '../components/inputs/InputLabel';
import {Formik} from 'formik';
import {perfectSize} from '../utils/pixel';
import * as Yup from 'yup';
type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

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

const Home = () => {
  const navigation = useNavigation<HomeScreenProp>();
  const {user} = useSelector((root: RootState) => root.user);
  const {glossaries} = useSelector((root: RootState) => root.golsary);
  console.log(user.id, glossaries);
  const dispatch = useDispatch();
  useEffect(() => {
    getGlosary(user.id).then(response => {
      dispatch(addListGlosaries(response));
    });
  }, []);
  console.log(user, 'user');
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Button status="success" onPress={() => setVisible(true)}>
        add
      </Button>
      <ModalGlosarry visible={visible} onPress={() => setVisible(false)} />
      {/* {glossaries.length ? <CardGlosary item={{...glossaries[0]}} /> : <></>} */}
      <SafeAreaView>
        <FlatList data={glossaries} renderItem={CardGlosary} />
      </SafeAreaView>
    </View>
  );
};

export default Home;
import {doc, setDoc} from 'firebase/firestore/lite';
import CardGlosary from '../components/cards/CardGlosary';
import {
  addListGlosaries,
  addNewGlossary,
  TypeGlosary,
} from '../store/glosarySlice';

const windowWidth = Dimensions.get('window').width;
const ModalGlosarry = ({visible, onPress}) => {
  const {user} = useSelector((root: RootState) => root.user);

  const dispatch = useDispatch();
  const initialState = {
    name: '',
    description: '',
  };
  const onSubmit = values => {
    console.log('submit');
    addRoleStorage(values);
  };

  const addRoleStorage = async values => {
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const citiesRef = collection(firestore, 'glossary');
    const uuid = uuidv4();
    const docRef = await doc(citiesRef, uuid);
    const newGlosary = {
      id: uuid,
      user_id: user.id,
      name: values.name,
      description: values.description,
    };
    setDoc(docRef, newGlosary);
    dispatch(addNewGlossary(newGlosary));
  };

  return (
    <Modal visible={visible}>
      <Card disabled={true} style={{width: windowWidth - perfectSize(40)}}>
        <Formik
          initialValues={initialState}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(2, 'Must be 2 characters or less')
              .required('Required'),
            description: Yup.string()
              .min(2, 'min 2 characters')
              .max(255, 'Must be 20 characters or less')
              .required('Required'),
          })}
          onSubmit={onSubmit}
          validateOnBlur
          validateOnChange>
          {({handleChange, handleBlur, handleSubmit, errors}) => (
            <>
              <InputLabel
                label="name"
                placeholder="Name"
                keyboardType="email-address"
                onChangeText={handleChange}
                onBlur={handleBlur}
                name="name"
                error={errors.name}
              />
              <InputLabel
                label="descriptión"
                placeholder="Description"
                keyboardType="email-address"
                onChangeText={handleChange}
                onBlur={handleBlur}
                name="description"
                error={errors.description}
                multiline
                numberOfLines={3}
              />
              <Button onPress={handleSubmit}>GUARDAR</Button>
              <Divider style={{marginVertical: perfectSize(10)}} />
              <Button onPress={onPress} status="danger">
                CANCELAR
              </Button>
            </>
          )}
        </Formik>
      </Card>
    </Modal>
  );
};
