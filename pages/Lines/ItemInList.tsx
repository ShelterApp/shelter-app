import React, { createRef, useState } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

import { Icon } from '@app/components/Common';

import { CrisisLine } from '@shelter/core';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AlertMessage from '@app/components/Item/Alert';
import { getDataToLocal } from '@app/utils';
interface IItemInListProps extends CrisisLine {
  onDelete: (id: string, token: string) => void;
  onEdit: (lines: CrisisLine) => void;
  isAdmin?: boolean;
}

const handleCallPhone = (phone) => {
  if (phone) {
    Linking.openURL(`tel:${phone}`);
  }
};

const handleOpenWebsite = (link: string) => {
  if (link) {
    Linking.openURL(link);
  }
};

const ItemInList: React.SFC<IItemInListProps> = (props: IItemInListProps) => {
  const {
    name,
    description,
    text,
    website,
    phone,
    area,
    chatWebLink,
    time,
    isAdmin,
  } = props;
  const [idPicker, setIdPicker] = useState('');
  const alert = createRef();

  const handleDelete = (props) => {
    alert.current.setText(
      translate('DO_YOU_WANT_TO_DELETE_THIS', { value: 'Crisisline' }),
      'YES',
      'delete',
    );
  };
  const onPress = async (type) => {
    if (type == 'delete') {
      const token = await getDataToLocal('@ShelterToken');
      props.onDelete(idPicker, token);
    }
  };
  return (
    <View style={styles.itemContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.action}>
          {!!chatWebLink && (
            <TouchableOpacity onPress={() => handleOpenWebsite(chatWebLink)}>
              <Icon name="md-chatboxes" size={22} color={theme.PRIMARY_COLOR} />
            </TouchableOpacity>
          )}
          {!!website && (
            <TouchableOpacity onPress={() => handleOpenWebsite(website)}>
              <Icon
                style={{ marginLeft: 16 }}
                name="md-globe"
                size={22}
                color={theme.PRIMARY_COLOR}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.phoneContainer}>
        {phone && (
          <TouchableOpacity
            style={styles.phoneFirst}
            onPress={() => handleCallPhone(phone)}
          >
            <Icon name="md-call" size={22} color={theme.PRIMARY_COLOR} />
            <Text style={styles.phone}>{phone}</Text>
          </TouchableOpacity>
        )}
        {!!text && (
          <View style={styles.phoneSecond}>
            <Icon name="ios-chatboxes" size={22} color={theme.PRIMARY_COLOR} />
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.phone}>
              {text}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.descContainer}>
        <Text style={styles.desc}>{description}</Text>
      </View>
      <View style={styles.lastContainer}>
        <View style={styles.first}>
          <Text>
            {area && (
              <>
                <Text style={[styles.bold, { marginRight: 8 }]}>Area: </Text>
                <Text style={styles.thin}>{area}, </Text>
              </>
            )}
            {time && (
              <>
                <Text style={[styles.bold, { marginRight: 8 }]}>Hours: </Text>
                <Text style={styles.thin}>{time}</Text>
              </>
            )}
          </Text>
        </View>
        {isAdmin && (
          <View style={styles.second}>
            <TouchableOpacity onPress={() => props.onEdit(props)}>
              <Icon name="ios-create" size={22} color={theme.PRIMARY_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIdPicker(props.id);
                handleDelete(props);
              }}
            >
              <Icon
                style={{ marginLeft: 16 }}
                name="md-trash"
                size={22}
                color={theme.PRIMARY_COLOR}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  title: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
    fontWeight: '600',
    width: '80%',
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  phoneContainer: {
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: theme.WHITE_LIGHTER_COLOR,
    borderColor: theme.GRAY_DARK_COLOR,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    // overflow: 'hidden',
  },
  phoneFirst: {
    flexDirection: 'row',
    ...common.flexCenter,
    marginRight: 24,
  },
  phoneSecond: {
    flexDirection: 'row',
    ...common.flexCenter,
  },
  phone: {
    ...common.h2,
    marginLeft: 4,
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
    flexDirection: 'row',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  first: {
    width: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  second: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bold: {
    ...common.h2,
    fontWeight: '600',
    color: theme.PRIMARY_COLOR,
    flexWrap: 'wrap',
    display: 'flex',
  },
  thin: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
  },
});
export { ItemInList };
