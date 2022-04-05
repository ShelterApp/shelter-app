import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

import { tranformSchedules } from '@app/components/ServiceForm/utils';
import { Menu, Button, Icon } from '@app/components/Common';

import { Service as IServiceProps } from '@shelter/core';

interface IItemInListProps extends IServiceProps {
  onDelete: (id: string) => void;
  onDeleteWithoutAlert: (id: string) => void;
  onEdit: (service: IServiceProps) => void;
}

const ItemInList: React.SFC<IItemInListProps> = (props: IItemInListProps) => {

  const { name, description, contactEmail, address1,
          city, state, zip, phone,
          website, type, serviceSummary,
          category, age, schedules, closeSchedules,
          isApproved, onDelete, onEdit, id, isContact,
          onDeleteWithoutAlert, userEmail,
        } = props;

  const address = { address1, city, state, zip };
  const lastAddress = Object.keys(address).map(ad => `${address[ad]}`);
  const lastSchedules = schedules && tranformSchedules(schedules);
  const lastCloseSchedules = closeSchedules && tranformSchedules(closeSchedules);

  return(
    <View style={styles.itemContainer}>
      <Menu
        data={[
          {
            name: translate('EDIT_SERVICE'),
            onClick: () => onEdit(props),
          },
          {
            name: translate('DELETE_SERVICE'),
            onClick: () => onDeleteWithoutAlert(id),
          },
        ]}
        styleContainer={styles.menuStyles}
      />
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
      {lastSchedules.length > 0 &&
        <View>
          <Text style={styles.textItem}>{translate('SCHEDULE')}: </Text>
          {lastSchedules.map((s, idx) =>
             <View key={idx} style={styles.rowFront}>
                <Text style={[styles.text, { marginRight: 48, width: '30%' }]}>
                  {s.title}
                </Text>
                <Text style={[styles.text, { width: '70%' }]}>
                  {s.date}
                </Text>
            </View>,
          )}
        </View>
      }
      {isContact && <Text style={styles.textItem}>{translate('IS_SHOW_CONTACT')}</Text>}
      <Text style={[styles.textItem,
        { marginTop: 16 }]}>{translate('COMMENT')}: {description}</Text>
        <View
          style={[styles.approveStyle, {
            borderColor: isApproved ? theme.GREEN_COLOR : theme.RED_COLOR,
          }]}>
            {
              <Text
              style={{ color: isApproved ? theme.GREEN_COLOR : theme.RED_COLOR }}
              >{translate(isApproved ? 'THIS_SERVICE_IS_APPROVED'
              : 'THIS_SERVICE_IS_NOT_APPROVED')}</Text>
            }
        </View>
        <View style={styles.actionButtonContainer}>
          <Button
            onPress={() => onEdit(props)}
            containerStyle={[styles.actionButton, { marginRight: 4 }]}
            title={translate('EDIT_SERVICE')}
          />
          <Button
            onPress={() => onDelete(id)}
            containerStyle={[styles.actionButton, { marginLeft: 4 }]}
            buttonStyle={{ backgroundColor: theme.RED_COLOR }}
            title={translate('DELETE_SERVICE')}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderWidth: 1,
    borderColor: theme.GRAY_DARKER_COLOR,
    borderRadius: 4,
    backgroundColor: theme.WHITE_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginTop: 12,
    marginHorizontal: 8,
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
    // paddingHorizontal: 52,
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
  },
  actionButton: {
    flex: 1,
    height: 50,
  },
});
export { ItemInList };
