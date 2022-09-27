import {Button, Icon} from '@ui-kitten/components';
import React, {ReactElement} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-paper';
import {IMG_PLACEHOLDER} from '../utils/declarations';
import {perfectSize} from '../utils/pixel';

type Props = {
  path: string;
  removeFile: (fileId: string) => void;
  onPress: () => void;
  id: string;
};

const FileCard = ({path, removeFile, onPress, id}: Props): ReactElement => {
  const style = styleFileCard();
  return (
    <TouchableOpacity style={style.container} onPress={() => onPress()}>
      <Image
        source={path?.includes('.mp4') ? IMG_PLACEHOLDER.gallery : {uri: path}}
        style={style.file}
        resizeMode={'contain'}
      />
      <TouchableOpacity
        style={style.icon_delete}
        onPress={() => removeFile(id)}>
        <Button
          status="danger"
          size="tiny"
          accessoryLeft={<Icon name="trash" />}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default FileCard;

const styleFileCard = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      position: 'relative',
      padding: perfectSize(2),
    },
    file: {
      width: '100%',
      height: 100,
      borderRadius: perfectSize(5),
    },
    icon_file: {
      position: 'absolute',
      padding: perfectSize(2),
      backgroundColor: Colors.blue400,
      bottom: perfectSize(10),
      right: perfectSize(10),
      borderRadius: perfectSize(10),
    },
    icon_delete: {
      position: 'absolute',
      padding: perfectSize(1),
      top: perfectSize(10),
      right: perfectSize(10),
      borderRadius: perfectSize(10),
    },
    size_container: {
      position: 'absolute',
      padding: perfectSize(1),
      backgroundColor: '#000',
      bottom: perfectSize(10),
      left: perfectSize(10),
      borderRadius: perfectSize(10),
    },
    size_text: {
      color: '#fff',
      fontSize: perfectSize(10),
      paddingHorizontal: perfectSize(5),
    },
  });
