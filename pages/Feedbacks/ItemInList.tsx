import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';
import ImageViewer from 'react-native-image-zoom-viewer';
import Config from 'react-native-config';
import axios from 'axios';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

import { Icon } from '@app/components/Common';
const { GOOGLE_MAPS_APIKEY } = Config;
import AlertMessage from '@app/components/Item/Alert';
import { Feedback } from '@shelter/core/dist/models';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const { IMAGE_SERVER_URL } = Config;

interface IItemInListProps extends Feedback {
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

const tranformViewerImages = (images) =>
  images.map((img, idx) => ({
    idx,
    url: `${IMAGE_SERVER_URL}/${img}`,
    freeHeight: true,
  }));

const openLocation = (coords) => {
  const url = 'https://www.google.com/maps/search/';
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords[1]},${
        coords[0]
      }&key=${GOOGLE_MAPS_APIKEY}`,
    )
    .then((data) => {
      const value = data.data;
      if (value.plus_code && value.plus_code.compound_code) {
        console.log(url + value.plus_code.compound_code);
        Linking.openURL(
          `https://maps.google.com/?q=${encodeURIComponent(
            value.plus_code.compound_code,
          )}`,
        );
      }
    });
};

const ItemInList: React.SFC<IItemInListProps> = (props: IItemInListProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const alert = createRef();
  const handleDelete = (props) => {
    alert.current.setText(
      translate('DO_YOU_WANT_TO_DELETE_THIS', { value: 'Feedback' }),
      'YES',
      'delete',
    );
  };
  const handleArchive = (props) => {
    alert.current.setText(
      translate('ARE_YOU_SURE_WANT_TO_ARCHIVE_THIS'),
      'YES',
      'archive',
    );
  };
  const onPress = (type) => {
    if (type == 'delete') props.onDelete(props.id);
    else if (type == 'archive') props.onArchive(props.id);
  };
  const handleCallPhone = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };
  const handleMailBox = (mail: string, subject: string, message: string) => {
    Linking.openURL(`mailto:${mail}?subject=${subject}&body=${message}`);
  };
  const {
    subject,
    message,
    email,
    type,
    createdAt,
    phone,
    isArchive,
    files,
    location,
  } = props;
  return (
    <View style={styles.itemContainer}>
      <View style={styles.titleContainer}>
        <View style={styles.containerTitle}>
          <Icon
            name={`ios-${type === 'SERVICE' ? 'flag' : 'create'}`}
            size={22}
            color={theme.PRIMARY_COLOR}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.title}>{subject}</Text>
        </View>
        {files.length > 0 && (
          <TouchableOpacity
            style={styles.leftWrap}
            onPress={() => setModalVisible(true)}
          >
            <Icon
              name="md-photos"
              size={22}
              color={theme.PRIMARY_COLOR}
              style={{ marginRight: 16 }}
            />
            <Modal
              visible={modalVisible}
              transparent={true}
              onRequestClose={() => setModalVisible(!modalVisible)}
            >
              <ImageViewer
                imageUrls={tranformViewerImages(files)}
                index={imageIndex}
                onSwipeDown={() => setModalVisible(!modalVisible)}
                enableSwipeDown={true}
                renderHeader={() => (
                  <SafeAreaView
                    style={{
                      width: '100%',
                      marginTop: 40,
                      height: 50,
                      alignItems: 'flex-end',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                      style={styles.closeIconStyle}
                    >
                      <Icon
                        name="ios-close"
                        size={48}
                        color={theme.WHITE_COLOR}
                      />
                    </TouchableOpacity>
                  </SafeAreaView>
                )}
              />
            </Modal>
          </TouchableOpacity>
        )}
        {location &&
          type !== 'APP' &&
          location.coordinates &&
          location.coordinates[0] !== 0 &&
          location.coordinates[1] !== 0 && (
            <TouchableOpacity
              style={styles.leftWrap}
              onPress={() => openLocation(location.coordinates)}
            >
              <Icon name="md-pin" size={22} color={theme.PRIMARY_COLOR} />
            </TouchableOpacity>
          )}
      </View>
      {!!props.name && (
        <View style={styles.phoneContainer}>
          <View style={styles.phoneFirst}>
            <Text style={styles.phone}>
              {`${props.name} ${dayjs(createdAt).format('MM/DD/YYYY hh:mm A')}`}
            </Text>
          </View>
        </View>
      )}

      {!!phone && (
        <View style={styles.phoneContainer}>
          <View style={styles.phoneFirst}>
            <TouchableWithoutFeedback onPress={() => handleCallPhone(phone)}>
              <Text style={styles.phone}>{phone}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}
      <View style={styles.descContainer}>
        <Text style={styles.desc}>{message}</Text>
      </View>
      {!!email && (
        <View style={styles.lastContainer}>
          <TouchableOpacity
            style={{ width: '80%' }}
            onPress={() => handleMailBox(email, subject, message)}
          >
            <Text style={styles.title}>{email}</Text>
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '20%',
            }}
          >
            {!isArchive && (
              <TouchableOpacity
                onPress={() => handleArchive(props)}
                style={styles.action}
              >
                <Icon name="md-archive" size={22} color={theme.PRIMARY_COLOR} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => handleDelete(props)}
              style={styles.action}
            >
              <Icon
                style={{ marginLeft: 16 }}
                name="md-trash"
                size={22}
                color={theme.PRIMARY_COLOR}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <AlertMessage ref={alert} onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderWidth: 1,
    borderColor: theme.GRAY_DARKER_COLOR,
    borderRadius: 4,
    backgroundColor: theme.WHITE_COLOR,
    marginTop: 12,
    marginHorizontal: 8,
  },
  titleContainer: {
    padding: 8,
    backgroundColor: theme.WHITE_LIGHTER_COLOR,
    borderBottomWidth: 1,
    borderColor: theme.GRAY_DARK_COLOR,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerTitle: {
    flexDirection: 'row',
    ...common.flexCenter,
    justifyContent: 'flex-start',
  },
  title: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
    fontWeight: '600',
    width: '80%',
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  phoneContainer: {
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: theme.WHITE_LIGHTER_COLOR,
    borderColor: theme.GRAY_DARK_COLOR,
    alignItems: 'center',
  },
  phoneFirst: {
    flexDirection: 'row',
    ...common.flexCenter,
    marginRight: 24,
  },
  phone: {
    ...common.h2,
    // marginLeft: 4,
    color: theme.PRIMARY_COLOR,
  },
  descContainer: {
    padding: 8,
    backgroundColor: theme.WHITE_COLOR,
    borderBottomWidth: 1,
    borderColor: theme.GRAY_DARK_COLOR,
  },
  desc: {
    ...common.h2,
    color: theme.BLACK_COLOR,
  },
  lastContainer: {
    padding: 8,
    backgroundColor: theme.WHITE_LIGHTER_COLOR,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  leftWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeIconStyle: {
    height: 50,
    marginRight: 10,
    zIndex: 1000,
  },
});

export { ItemInList };
