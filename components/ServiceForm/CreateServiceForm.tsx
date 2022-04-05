import React, { useState, useEffect, useRef, createRef } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Field, Formik } from 'formik';
import dayjs from 'dayjs';

import {
    Button,
    InputFiled,
    CheckBox,
    PanelGroup,
    ErrorText,
    PickerSelect,
    DatePicker,
} from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import { convertI18NText, getDataToLocal } from '@app/utils';
import { SchedulePanelForm } from './SchedulePanelForm';

import translate from '@app/utils/i18n';
import { log } from '@app/utils/log';

import {
    typeCheckboxs,
    categoryCheckboxs,
    tranformSchedules,
    tranformScheduleTypes,
    tranformDayInWeek,
    tranformWeekInMonth,
    getIndexOfItemByName,
    IScheduleProps,
} from './utils';
import common from '@app/styles/common';
import { Service as IServiceProps, User, UserRole } from '@shelter/core';
import { ServicesApi, AuthApi } from '@shelter/core/dist/apis';
import AlertMessage from '@app/components/Item/Alert';

interface ICreateServiceFormProps extends IBasicScreenProps {
  initialValues?: IServiceProps;
  onScrollToTop?: any;
  isCreate: boolean;
  userInfo?: User;
  setToast?: (toast: string) => void;
}

const defaultShedule: IScheduleProps = {
  scheduleType: tranformScheduleTypes[0].value,
  period: tranformWeekInMonth[0].value, // First
  dayInWeek: tranformDayInWeek[0].value, // Monday
  startDate: dayjs(new Date()).format('MM/DD/YYYY'),
  endDate: dayjs(new Date()).format('MM/DD/YYYY'),
  startTime: '08:00 AM',
  endTime: '05:00 PM',
};
const holiday: IScheduleProps = {
  scheduleType: tranformScheduleTypes[0].value,
  period: tranformWeekInMonth[0].value, // First
  dayInWeek: tranformDayInWeek[6].value, // Monday
  startDate: dayjs(new Date()).format('MM/DD/YYYY'),
  endDate: dayjs(new Date()).format('MM/DD/YYYY'),
  startTime: '12:00 AM',
  endTime: '11:59 PM',
};

const defaultValues: IServiceProps = {
  name: '',
  description: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  contactEmail: '',
  website: '',
  facebook: '',
  twitter: '',
  serviceSummary: '',
  age: '',
  isShowDonate: false,
  isShowFlag: true,
  userEmail: '',
  country: '',
  isCriticalHeader: false,
  criticalDescription: '',
  criticalExpiredAt: new Date(),
  isCriticalNeverExpire: false,
};

const prepareInitValues = (initialValues) => {
  if (!initialValues) {
    return defaultValues;
  }
  return initialValues;
};

const KEYS = ['name', 'description', 'address1', 'city', 'state'];
const CATEGORY_ALL_NAME = 'ALL';

const validateCreateServiceForm = (values) => {
  const errors: any = {};

  KEYS.map((key) => {
    if (!values[key]) {
        errors[key] = translate('REQUIRED_INPUT_CTA', {
            value: translate(key.toUpperCase()),
          });
      }
  });

  if (values.description && values.description.length > 1000) {
    errors.password = translate('DESC_LESS_THAN_VALUE', { value: 1000 });
  }

  return errors;
};

const tranformTypeCheckboxs = (types) => {
  return typeCheckboxs.map((type) => ({
    name: type.name,
    isCheck: types.includes(type.name),
  }));
};

const tranformCategoryCheckboxs = (categories) => {
  return categoryCheckboxs.map((type) => ({
    name: type.name,
    isCheck: categories.includes(type.name),
  }));
};

const getSchedulesWithKey = (schedules) => {
  return schedules.map((schedule, idx) => ({
    key: idx,
    ...schedule,
  }));
};

const CreateServiceForm: React.SFC<ICreateServiceFormProps> = (
    props: ICreateServiceFormProps,
) => {
  const refFormik = useRef() as any;
  const [error, setError] = useState(null);

  const [isContact, setIsContact] = useState(false);
  const [isFlag, setIsFlag] = useState(false);
  const [isDonate, setIsDonate] = useState(false);
  const [isCriticalHeader, setIsCriticalHeader] = useState(false);
  const [isCriticalNeverExpire, setIsCriticalNeverExpire] = useState(false);
  const [expriteTime, setExpriteTime] = useState(
        dayjs(new Date()).format('hh:mm A'),
    );
  const [expriteDate, setExpriteDate] = useState(
        dayjs(new Date()).format('MM/DD/YYYY'),
    );
  const [updateCritical, setUpdateCritical] = useState(false);
  const [types, setTypes] = useState(typeCheckboxs);
  const [categories, setCategories] = useState(categoryCheckboxs);
  const [typesAfter, setTypesAfter] = useState([]);
  const [categoriesAfter, setCategoriesAfter] = useState([]);

  const [schedules, setSchedules] = useState([]);
  const [closeSchedules, setCloseSchedules] = useState([]);
  const alert = createRef();

  useEffect(() => {
    const { initialValues, navigation, userInfo } = props;
    const hasPermision =
            userInfo.roles.includes(UserRole.Administrator) ||
            userInfo.roles.includes('SUPER USER');
    setUpdateCritical(hasPermision);
    if (initialValues) {
        setSchedules(getSchedulesWithKey(initialValues.schedules));
        setCloseSchedules(
                getSchedulesWithKey(initialValues.closeSchedules),
            );
        setTypes(tranformTypeCheckboxs(initialValues.type));
        setCategories(tranformCategoryCheckboxs(initialValues.category));
        setTypesAfter([...initialValues.type]);
        setCategoriesAfter([...initialValues.category]);
        setIsContact(initialValues.isContact);
        setIsFlag(initialValues.isShowFlag);
        setIsDonate(initialValues.isShowDonate);
        setIsCriticalHeader(initialValues.isCriticalHeader);
        setIsCriticalNeverExpire(initialValues.isCriticalNeverExpire);
        if (initialValues.criticalExpiredAt) {
            setExpriteDate(
                    dayjs(new Date(initialValues.criticalExpiredAt)).format(
                        'MM/DD/YYYY',
                    ),
                );
            setExpriteTime(
                    dayjs(new Date(initialValues.criticalExpiredAt)).format(
                        'hh:mm A',
                    ),
                );
          }

        return;
      }
    if (!userInfo.isAdmin) setIsFlag(true);

    const blurListener = navigation.addListener('didBlur', () => {
        refFormik.current.resetForm();
        resetAll();
      });

    return () => blurListener.remove();
  }, [props.initialValues, props.isCreate, props.userInfo]);

  const resetAll = () => {
    setTypes(typeCheckboxs);
    setCategories(categoryCheckboxs);
    setTypesAfter([]);
    setCategoriesAfter([]);
    setIsContact(false);
    setSchedules([]);
    setCloseSchedules([]);
    setIsCriticalHeader(false);
    setIsCriticalNeverExpire(false);
  };

  const handleOnSubmit = async (
        values,
        { setSubmitting, setValues, setTouched, setErrors },
    ) => {
        // validate type, category, shedule, serviceSummary
    if (!typesAfter.length) {
        props.setToast(translate('PLEASE_SELECT_AT_LEAST_ONE_SERVICE'));
        setSubmitting(false);
        return;
      }
    if (typesAfter.length && !values.serviceSummary) {
        props.setToast(translate('PLEASE_ENTER_SERVICE_TYPE'));
        setSubmitting(false);
        return;
      }
    if (
            values.totalBeds &&
            values.availableBeds &&
            values.totalBeds < values.availableBeds
        ) {
        props.setToast(translate('AVAILABLE_BEDS_LESS_THAN'));
        setSubmitting(false);
        return;
      }  if (values.availableBeds && !values.totalBeds) {
          props.setToast(translate('PLEASE_TYPE_TOTAL_BEDS'));
          setSubmitting(false);
          return;
        }
    if (!categoriesAfter.length) {
        props.setToast(translate('PLEASE_SELECT_AT_LEAST_ONE_CATEGORY'));
        setSubmitting(false);
        return;
      }

    if (!isContact && !schedules.length) {
        props.setToast(translate('PLEASE_ADD_SCHEDULE'));
        setSubmitting(false);
        return;
      }

    const newSchedules = schedules.map((sche) => {
        delete sche.key;
        return { ...sche };
      });

    const newCloseSchedules = closeSchedules.map((clo) => {
        delete clo.key;
        return { ...clo };
      });

    const obj = {
        ...values,
        isContact,
        userEmail: props.userInfo.email,
        schedules: isContact ? [] : newSchedules,
        closeSchedules: isContact ? [] : newCloseSchedules,
        type: typesAfter,
        category: categoriesAfter,
        isShowFlag: true,
        isCriticalHeader,
      };
    if (obj.totalBeds == '') obj.totalBeds = 0;
    if (obj.availableBeds == '') obj.availableBeds = 0;

    if (!obj.country) {
        props.setToast(translate('PLEASE_ENTER_COUNTRY'));
        setSubmitting(false);
        return;
      }

    if (props.userInfo.isAdmin) {
        obj.isShowDonate = isDonate;
        obj.isShowFlag = isFlag;
        obj.userEmail = values.userEmail || props.userInfo.email;
        obj.isCriticalNeverExpire = isCriticalNeverExpire;
        const minus = new Date(Date.parse('11/24/2014 ' + expriteTime));
        obj.criticalExpiredAt = new Date(
                new Date(expriteDate).setHours(
                    minus.getHours(),
                    minus.getMinutes(),
                ),
            );
      } else if (props.userInfo.roles.includes('SUPER USER')) {
          obj.isCriticalNeverExpire = isCriticalNeverExpire;
          const minus = new Date(Date.parse('11/24/2014 ' + expriteTime));
          obj.criticalExpiredAt = new Date(
                new Date(expriteDate).setHours(
                    minus.getHours(),
                    minus.getMinutes(),
                ),
            );
        }
    try {
        const token = await getDataToLocal('@ShelterToken');
        const res = props.isCreate
                ? await ServicesApi.create(obj, token)
                : await ServicesApi.update(obj, token);
        if (res) {
            setSubmitting(false);
            setError(null);
            if (props.isCreate) {
                const badgeCount = await AuthApi.reportNotifications(token);

                if (
                        !props.userInfo.roles.includes(
                            UserRole.Administrator,
                        ) &&
                        props.userInfo.totalServices ==
                            badgeCount.countManagedServices
                    ) {
                    alert.current.setButton1(
                            translate('ADDED_SUCCESSFULLY'),
                            'Close',
                        );
                    props.navigation.navigate('AdminServices');
                    return;
                  }
                alert.current.setText(
                        translate(
                            'ADDED_SUCCESSFULLY_AND_YOU_WANT_TO_CREATE_NEW',
                        ),
                        'YES',
                        'add',
                    );
              } else {
                props.navigation.navigate('AdminServices');
                log.success(translate('UPDATE_SERVICE_SUCCESSFULLY'));
              }
          }
      } catch (error) {
        setSubmitting(false);
        setError(convertI18NText(error.message));
        throw new Error(
                `Can not create service with error: ${error.message}`,
            );
      }
  };

  const handleClickCheckBok = (service, isCategory) => {
        // tslint:disable
        const { name, isCheck } = service;

        const idx = getIndexOfItemByName(isCategory ? categories : types, name);
        const newValue = {
            name,
            isCheck: !isCheck,
        };

        if (isCategory) {
            if (name === CATEGORY_ALL_NAME) {
                checkAll(isCheck);
                return;
            }

            let afterCate = categories;
            if (idx !== -1) {
                afterCate = [
                    ...afterCate.slice(0, idx),
                    newValue,
                    ...afterCate.slice(idx + 1),
                ];
            }

            // check if pick all checkbox
            let isCheckAll = false;
            const notAllCate = afterCate.filter(
                (ce) => ce.name !== CATEGORY_ALL_NAME
            );

            for (const k of notAllCate) {
                if (!k.isCheck) {
                    isCheckAll = false;
                    unCheckAll(afterCate);
                    return;
                }
                isCheckAll = true;
            }

            if (isCheckAll) {
                checkAll(isCheck);
                return;
            }

            setCategories(afterCate);
            setCategoriesAfter(
                afterCate
                    .filter((fil) => fil.isCheck)
                    .map((cate) => cate["name"])
            );
            return;
        }

        let afterType = types;
        if (idx !== -1) {
            afterType = [
                ...afterType.slice(0, idx),
                newValue,
                ...afterType.slice(idx + 1),
            ];
        }

        setTypes(afterType);
        setTypesAfter(
            afterType.filter((fil) => fil.isCheck).map((type) => type["name"])
        );
        return;
    };

    const unCheckAll = (cates) => {
        const idx = getIndexOfItemByName(categories, CATEGORY_ALL_NAME);
        const newValue = {
            name: CATEGORY_ALL_NAME,
            isCheck: false,
        };

        let afterCate = cates;
        if (idx !== -1) {
            afterCate = [
                ...afterCate.slice(0, idx),
                newValue,
                ...afterCate.slice(idx + 1),
            ];
        }

        setCategories(afterCate);
        setCategoriesAfter(
            afterCate.filter((fil) => fil.isCheck).map((cate) => cate["name"])
        );
        return;
    };

    const checkAll = (isCheck: boolean) => {
        const afterCate = categories.map((cate) => ({
            ...cate,
            isCheck: !isCheck,
        }));

        setCategories(afterCate);
        setCategoriesAfter(afterCate.map((cate) => cate["name"]));
    };

    const renderCheckboxs = (service, isTrue: boolean) => {
        const { name, isCheck } = service;

        return (
            <CheckBox
                key={name}
                title={translate(name)}
                checked={isCheck}
                onPress={() => handleClickCheckBok(service, isTrue)}
                containerStyle={styles.containerCheckbox}
            />
        );
    };

    const addToSchedule = (obj) => {
        setSchedules([obj, ...schedules]);
    };

    const addToCloseSchedule = (obj) => {
        setCloseSchedules([obj, ...closeSchedules]);
    };

    const onDeleteSchedule = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);

        const newData = schedules.map((she, idx) => ({ ...she, key: idx }));
        const index = newData.findIndex((fa) => fa.key === rowKey);
        newData.splice(index, 1);
        setSchedules(newData);
        props.setToast(translate("DELETED"));
    };

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const onDeleteCloseSchedule = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);

        const newData = closeSchedules.map((she, idx) => ({
            ...she,
            key: idx,
        }));
        const index = newData.findIndex((fa) => fa.key === rowKey);
        newData.splice(index, 1);
        setCloseSchedules(newData);
        props.setToast(translate("DELETED"));
    };
    const onPress = (type) => {
        if (type == "add") {
            refFormik.current.setSubmitting(false);
            refFormik.current.setValues(defaultValues);
            refFormik.current.setTouched({});
            refFormik.current.setErrors({});
            resetAll();
            props.onScrollToTop();
        } else if (type == "button1") {
            props.navigation.navigate("Home");
        }
    };

    const renderCreateServiceFormForm = (args) => {
        const { handleSubmit, isSubmitting, setFieldValue } = args;
        const formatPhoneNumber = (phone) => {
            let result = phone;
            if (result.length == 3) result = `(${phone}) `;
            else if (result.endsWith("-"))
                result = result.slice(0, result.length - 1);
            else if (result.endsWith(" ") || result.endsWith(")"))
                result = result.slice(1, 4);
            else if (result.length == 9) result = `${phone}-`;
            else if (result.length > 15) return;
            setFieldValue("phone", result);
        };
        return (
            <View>
                <PanelGroup title="NAME">
                    <Field
                        name="name"
                        component={InputFiled}
                        placeholder="Ex: Non-Profit Name"
                        label={translate("COMMUNITY_SERVICE_NAME")}
                    />
                    <Field
                        name="description"
                        component={InputFiled}
                        placeholder={translate("DESC_LESS_THAN_VALUE", {
                            value: 1000,
                        })}
                        maxLength={1000}
                        multiline
                        inputContainerStyle={{
                            borderWidth: 1,
                            borderRadius: 4,
                            marginTop: 8,
                        }}
                        inputStyle={{ padding: 8, height: 100 }}
                        containerStyle={{
                            marginBottom: 0,
                            marginTop: 10,
                            paddingHorizontal: 0,
                        }}
                        label={translate("DESCRIPTION")}
                    />
                </PanelGroup>
                <PanelGroup title="ADDRESS">
                    <View>
                        <Field
                            name="address1"
                            component={InputFiled}
                            placeholder="Broadway & E Colfax Ave"
                            label={translate("ADDRESS_1")}
                        />
                        <Field
                            name="address2"
                            component={InputFiled}
                            placeholder="(Civic Center Park)"
                            label={translate("ADDRESS_2")}
                        />
                        <Field
                            name="city"
                            component={InputFiled}
                            placeholder="Denver"
                            label={translate("CITY")}
                        />
                        <Field
                            name="state"
                            component={InputFiled}
                            placeholder="CO"
                            label={translate("STATE")}
                        />
                        <Field
                            name="zip"
                            component={InputFiled}
                            placeholder="80202"
                            label={translate("ZIP")}
                        />
                        <Field
                            name="country"
                            component={PickerSelect}
                            placeholder="United States"
                            onValueChange={(value) =>
                                setFieldValue("country", value)
                            }
                            label={"Country"}
                            items={country_list}
                        />
                        <Field
                            name="phone"
                            keyboardType="phone-pad"
                            component={InputFiled}
                            placeholder="(303) 555-0100"
                            onValueChange={(value) => formatPhoneNumber(value)}
                            label={translate("PHONE")}
                        />
                        <Field
                            name="contactEmail"
                            component={InputFiled}
                            placeholder="name@your-nonprofit.org"
                            label={translate("EMAIL")}
                        />
                        <Field
                            name="website"
                            component={InputFiled}
                            placeholder="https://your-nonprofit.org"
                            label={translate("WEBSITE")}
                        />
                    </View>
                </PanelGroup>
                <PanelGroup title="Social Media Links">
                    <Field
                        name="facebook"
                        component={InputFiled}
                        placeholder="https://www.facebook.com/abc.xyz"
                        label={translate("FACEBOOK")}
                    />
                    <Field
                        name="twitter"
                        component={InputFiled}
                        placeholder="https://www.twitter.com/abc.xyz"
                        label={translate("TWITTER")}
                    />
                    <Field
                        name="instagram"
                        component={InputFiled}
                        placeholder="https://www.instagram.com/abc.xyz"
                        label={translate("INSTAGRAM")}
                    />
                    <Field
                        name="youtube"
                        component={InputFiled}
                        placeholder="https://www.youtube.com/abc.xyz"
                        label={translate("YOUTUBE")}
                    />
                </PanelGroup>
                <PanelGroup title="Service">
                    <View style={styles.wrapCheckbox}>
                        {types.map((type) => renderCheckboxs(type, false))}
                    </View>
                    {typesAfter.length > 0 && (
                        <Field
                            name="serviceSummary"
                            component={InputFiled}
                            placeholder="Ex: Food Pantry, Emergency Shelter, HIV Test, Clothes, GED Training..."
                            label={translate("SERVICE_DETAILS")}
                        />
                    )}
                    {typesAfter.includes("SHELTER") && (
                        <>
                            <Field
                                name="totalBeds"
                                component={InputFiled}
                                placeholder="1 or more"
                                label={translate("TOTAL_BEDS")}
                                keyboardType="phone-pad"
                            />
                            <Field
                                name="availableBeds"
                                component={InputFiled}
                                placeholder="0 or more"
                                label={translate("AVAILABLE_BEDS")}
                                keyboardType="phone-pad"
                            />
                        </>
                    )}
                </PanelGroup>
                <PanelGroup title="CATEGORY">
                    <View style={styles.wrapCheckbox}>
                        {categories.map((type) => renderCheckboxs(type, true))}
                    </View>
                </PanelGroup>

                <PanelGroup title="AGE_GROUP">
                    <Field
                        name="age"
                        component={InputFiled}
                        placeholder="Ex: 18+, 17-21, 24 & under, All Ages, ..."
                        multiline
                        inputStyle={{ height: 40 }}
                        containerStyle={{
                            marginBottom: 0,
                            marginTop: 10,
                            paddingHorizontal: 0,
                        }}
                    />
                </PanelGroup>

                <PanelGroup title="CONTACT_SERVICE">
                    <CheckBox
                        title={translate("IS_SHOW_CONTACT")}
                        checked={isContact}
                        onPress={() => setIsContact(!isContact)}
                        containerStyle={styles.contactCheckbox}
                    />
                </PanelGroup>
                {!isContact && (
                    <>
                        <SchedulePanelForm
                            addToSchedule={addToSchedule}
                            schedules={tranformSchedules(schedules)}
                            onDeleteSchedule={onDeleteSchedule}
                            titlePannel="SCHEDULE"
                            defaultValues={defaultShedule}
                            setToast={props.setToast}
                        />
                        {/* {typesAfter.length > 0 && */}
                        <SchedulePanelForm
                            addToSchedule={addToCloseSchedule}
                            schedules={tranformSchedules(closeSchedules)}
                            onDeleteSchedule={onDeleteCloseSchedule}
                            close
                            titlePannel="HOLIDAYS_CLOSED_DAYS"
                            defaultValues={holiday}
                            setToast={props.setToast}
                        />
                    </>
                )}
                {updateCritical && (
                    <PanelGroup title="CRITICAL_SERVICES">
                        <CheckBox
                            title={translate("ADD_THIS_HEADER")}
                            checked={isCriticalHeader}
                            onPress={() =>
                                setIsCriticalHeader(!isCriticalHeader)
                            }
                            containerStyle={styles.contactCheckbox}
                        />
                        <Field
                            name="criticalDescription"
                            component={InputFiled}
                            placeholder="One-Sentence Description"
                        />
                        {!isCriticalNeverExpire && (
                            <View style={common.flexRow}>
                                <Field
                                    name="startDate"
                                    component={DatePicker}
                                    label={"EXPIRE DATE"}
                                    onDateChange={(e) =>
                                        setExpriteDate(
                                            Platform.OS == "android"
                                                ? e
                                                : e.replaceAll("-", "/")
                                        )
                                    }
                                    // onDateChange={setExpriteDate}
                                    date={expriteDate}
                                    mode="date"
                                    styles={{ width: "50%", paddingRight: 16 }}
                                />
                                <Field
                                    name="startTime"
                                    component={DatePicker}
                                    label={"EXRIRE TIME"}
                                    onDateChange={(e) =>
                                        setExpriteTime(
                                            Platform.OS == "android"
                                                ? e
                                                : e.replaceAll("-", "/")
                                        )
                                    }
                                    date={expriteTime}
                                    mode="time"
                                    format="hh:mm A"
                                    styles={{ width: "50%", paddingRight: 16 }}
                                />
                            </View>
                        )}
                        <CheckBox
                            title={translate("NEVER_EXPIRIES")}
                            checked={isCriticalNeverExpire}
                            onPress={() =>
                                setIsCriticalNeverExpire(!isCriticalNeverExpire)
                            }
                            containerStyle={styles.contactCheckbox}
                        />
                    </PanelGroup>
                )}

                {props.userInfo.isAdmin && (
                    <>
                        <PanelGroup title="FLAG_AND_DONATE">
                            <CheckBox
                                title={translate("IS_SHOW_FLAG")}
                                checked={isFlag}
                                onPress={() => setIsFlag(!isFlag)}
                                containerStyle={styles.contactCheckbox}
                            />
                            <CheckBox
                                title={translate("IS_SHOW_DONATE")}
                                checked={isDonate}
                                onPress={() => setIsDonate(!isDonate)}
                                containerStyle={styles.contactCheckbox}
                            />
                        </PanelGroup>
                        <PanelGroup title={translate("OWNED_BY")}>
                            <Field
                                name="userEmail"
                                component={InputFiled}
                                placeholder="name@your-nonprofit.org"
                            />
                        </PanelGroup>
                    </>
                )}

                {error && <ErrorText text={error} />}
                <Button
                    onPress={handleSubmit}
                    containerStyle={styles.createServiceFormButton}
                    title={translate(
                        !props.isCreate ? "UPDATE_SERVICE" : "ADD_SERVICE"
                    )}
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                />
                <View style={{ paddingBottom: 200 }} />
                {/* <Spinner isLoading={isSubmitting} /> */}
            </View>
        );
    };
    return (
        <View>
            <Formik
                initialValues={prepareInitValues(props.initialValues)}
                validate={validateCreateServiceForm}
                onSubmit={handleOnSubmit}
                render={(args) => renderCreateServiceFormForm(args)}
                enableReinitialize
                ref={refFormik}
            />
            <AlertMessage ref={alert} onPress={onPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    createServiceFormButton: {
        marginTop: 24,
        marginBottom: 32,
        width: "100%",
        height: 54,
    },
    wrapCheckbox: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        maxWidth: "100%",
        justifyContent: "flex-start",
    },
    containerCheckbox: {
        width: "50%",
        flexBasis: "50%",
        marginRight: 0,
        paddingRight: 32,
        paddingBottom: 16,
        marginLeft: 0,
    },
    contactCheckbox: {
        marginLeft: 0,
    },
});
var country_list = [
    "United States",
    "Canada",
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegowina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo, the Democratic Republic of the",
    "Cook Islands",
    "Costa Rica",
    "Cote d'Ivoire",
    "Croatia (Hrvatska)",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands (Malvinas)",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "France Metropolitan",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard and Mc Donald Islands",
    "Holy See (Vatican City State)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, Democratic People's Republic of",
    "Korea, Republic of",
    "Kuwait",
    "Kyrgyzstan",
    "Lao, People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libyan Arab Jamahiriya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia, The Former Yugoslav Republic of",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova, Republic of",
    "Monaco",
    "Mongolia",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia (Slovak Republic)",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "Spain",
    "Sri Lanka",
    "St. Helena",
    "St. Pierre and Miquelon",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen Islands",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan, Province of China",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna Islands",
    "Western Sahara",
    "Yemen",
    "Yugoslavia",
    "Zambia",
    "Zimbabwe",
].map((item) => ({ value: item, label: item }));

export { CreateServiceForm };
