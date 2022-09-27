import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import ImagePicker from 'react-native-image-crop-picker';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {initializeApp} from 'firebase/app';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  query,
  QueryConstraint,
  setDoc,
  where,
} from 'firebase/firestore/lite';
import md5 from 'md5';
import {Alert} from 'react-native';
import {firebaseConfig} from '../utils/firebase-config';
import {Button, Layout} from '@ui-kitten/components';
import {addListFiles, TypeFile} from '../store/FilesSlice';
import FileCard from './FileCard';
import {FlatGrid} from 'react-native-super-grid';
import {perfectSize} from '../utils/pixel';
const FilesScreen = () => {
  const {user} = useSelector((root: RootState) => root.user);
  const {files} = useSelector((root: RootState) => root.files);
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
        await getFiles().then(listfiles => dispatch(addListFiles(listfiles)));
        Alert.alert('Cargado', 'imagen subida correctamente');
      });
    });
  };

  const getGloassary = async (
    refData: CollectionReference<DocumentData>,
    queryFire: QueryConstraint,
  ) => {
    const q = query(refData, queryFire);
    return await getDocs(q);
  };

  const getFiles = async () => {
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const citiesRef = collection(firestore, 'videos');
    const listFiles: TypeFile[] = [];
    await getGloassary(citiesRef, where('user_id', '==', user.id)).then(
      response =>
        response.forEach(data => listFiles.push(data.data() as TypeFile)),
    );

    return await listFiles;
  };
  const dispatch = useDispatch();
  useEffect(() => {
    getFiles().then(listfiles => dispatch(addListFiles(listfiles)));
  }, []);

  const removeFile = (fileId: string) => {
    console.log(fileId);
  };

  const onPressImage = () => {
    console.log('select file');
  };

  return (
    <Layout style={style.container}>
      <Button onPress={onPress}>Seleccionar archivos</Button>
      <FlatGrid
        itemDimension={perfectSize(150)}
        data={files}
        spacing={10}
        renderItem={({item}) => (
          <FileCard
            path={item.file}
            id={item.id}
            removeFile={removeFile}
            onPress={onPressImage}
          />
        )}
      />
    </Layout>
  );
};

export default FilesScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
