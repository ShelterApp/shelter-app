import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

import { Menu, Button, Icon, CheckBox } from '@app/components/Common';

import { Service as IServiceProps } from '@shelter/core';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IItemInListProps extends IServiceProps {
  onDelete: () => void;
  onEdit: () => void;
  onCheck: () => void;
}

const ItemInList: React.SFC<IItemInListProps> = (props: IItemInListProps) => {

  const { name, description, contactEmail, address1,
          city, state, zip, phone,
          website, type, serviceSummary,
          category, age,
          onDelete, onEdit, id, isApproved, onCheck, userEmail,
        } = props;

  const address = { address1, city, state, zip };
  const lastAddress = Object.keys(address).map(ad => `${address[ad]}`);

  return(
    <View style={styles.itemContainer}>
      <View style={styles.contactCheckboxContainer}>
        <CheckBox
          checked={isApproved}
          onPress={onCheck}
          containerStyle={styles.contactCheckbox}
        />
      </View>
      <TouchableOpacity
        onPress={onCheck}
      >
        <Text style={styles.name}>{name}</Text>
        {!!userEmail && <Text style={styles.textItem}>{translate('ADDED_BY')}: {userEmail}</Text>}
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.textItem}
        >{translate('ADDRESS')}: {lastAddress.join(', ')}</Text>
        <Text style={styles.textItem}>{translate('PHONE')}: {phone}</Text>
        <Text style={styles.textItem}>{translate('EMAIL')}: {contactEmail}</Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.textItem}
        >{translate('WEBSITE')}: {website}</Text>
        <Text style={styles.textItem}>{translate('SERVICES')}: {type.join(', ')}</Text>
        <Text style={styles.textItem}>{translate('SERVICE_TYPE')}: {serviceSummary}</Text>
        <Text style={styles.textItem}>{translate('CATEGORIES')}: {category.join(', ')}</Text>
        <Text style={styles.textItem}>{translate('AGE_GROUP')}: {age}</Text>
        <Text style={[styles.textItem,
          { marginTop: 16 }]}>{translate('COMMENT')}: {description}</Text>
      </TouchableOpacity>

        <View style={styles.actionButtonContainer}>
          <Button
            onPress={onEdit}
            containerStyle={[styles.actionButton, { marginRight: 4 }]}
            buttonStyle={styles.buttonStyle}
            title={translate('EDIT_SERVICE')}
          />
          <Button
            onPress={onDelete}
            containerStyle={[styles.actionButton, { marginLeft: 4 }]}
            buttonStyle={[{ backgroundColor: theme.RED_COLOR }, styles.buttonStyle]}
            title={translate('DELETE_SERVICE')}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
    borderRadius: 4,
    backgroundColor: theme.WHITE_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginTop: 12,
    position: 'relative',
  },
  name: {
    ...common.h1,
    color: theme.BLACK_COLOR,
    fontWeight: '600',
    width: '50%',
  },
  textItem: {
    ...common.h2,
    color: theme.BLACK_COLOR,
    marginVertical: 2,
  },
  rowFront: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    flexDirection: 'row',
    display: 'flex',
  },
  text: {
    ...common.h2,
    color: theme.BLACK_COLOR,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  approveStyle: {
    borderRadius: 2,
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuStyles: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    marginRight: 0,
  },
  actionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 38,
  },
  buttonStyle:{
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  contactCheckboxContainer: {
    position: 'absolute',
    top: 8,
    right: 4,
  },
  contactCheckbox: {
    marginRight: 0,
    padding: 0,
  },
});
export { ItemInList };
