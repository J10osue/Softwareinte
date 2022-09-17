import React, {ReactElement} from 'react';
import {initializeApp} from 'firebase/app';
import {collection, doc, getFirestore, setDoc} from 'firebase/firestore/lite';
import {Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import md5 from 'md5';
import {Button, Card, Divider, Modal} from '@ui-kitten/components';
import {Formik} from 'formik';
import * as Yup from 'yup';
import InputLabel from '../inputs/InputLabel';

import {RootState} from '../../store/store';
import {perfectSize} from '../../utils/pixel';
import {addNewGlossary} from '../../store/glosarySlice';
import {firebaseConfig} from '../../utils/firebase-config';

type Props = {
  visible: boolean;
  onPress: () => void;
  onSuccess: () => void;
};

type TypeInitialState = {
  name: string;
  description: string;
};

const ModalGlosarry = ({visible, onPress, onSuccess}: Props): ReactElement => {
  const windowWidth = Dimensions.get('window').width;
  const {user} = useSelector((root: RootState) => root.user);

  const dispatch = useDispatch();
  const initialState = {
    name: '',
    description: '',
  };
  const onSubmit = (values: TypeInitialState) => {
    addRoleStorage(values);
  };

  const addRoleStorage = async (values: TypeInitialState) => {
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const citiesRef = collection(firestore, 'glossary');
    const uuid = md5(new Date().toISOString());
    const docRef = await doc(citiesRef, uuid);
    const newGlosary = {
      id: uuid,
      user_id: user.id,
      name: values.name,
      description: values.description,
    };
    setDoc(docRef, newGlosary);
    dispatch(addNewGlossary(newGlosary));
    onSuccess();
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

export default ModalGlosarry;
