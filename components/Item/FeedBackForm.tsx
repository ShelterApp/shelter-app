import React, { useState } from "react";
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Field, Formik } from "formik";
import ImagePicker from "react-native-image-picker";
import { Image } from "react-native-elements";
import { connect } from "react-redux";
import { getCoords, getCurrentLocation } from "@app/redux/service/selectors";
import { ICoords } from "@app/redux/service/reducer";

import {
    Button,
    InputFiled,
    Icon,
    ErrorText,
    CheckBox,
} from "@app/components/Common";
import { IBasicScreenProps } from "@app/components/Types";

import { log } from "@app/utils/log";
import translate from "@app/utils/i18n";
import theme from "@app/styles/theme";
import common from "@app/styles/common";

import { convertI18NText } from "@app/utils";

import { FeedbacksApi } from "@shelter/core/dist/apis";

const options = {
    title: "Select Avatar",
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
        skipBackup: true,
        path: "images",
    },
};

const KEYS = ["email", "phone", "name", "message"];

const validateFeedBackForm = (values) => {
    const errors: any = {};

    KEYS.map((key) => {
        if (!values[key]) {
            errors[key] = translate("REQUIRED_INPUT_CTA", {
                value: translate(key.toUpperCase()),
            });
        }
    });

    if (values.email) {
        delete errors.phone;
    }
    if (values.phone) {
        delete errors.email;
    }

    return errors;
};

const tranformImgs = (images) =>
    images.map((file, idx) => ({
        fileName: file.fileName,
        type: "jpg",
        size: `${file.fileSize}`,
        content: file.data,
        contentType: file.type,
        idTemp: Date.now() + idx,
        concatUrl: "data:jpg;base64,",
    }));

export const tranformBeforeSendToServer = (files) =>
    files &&
    files.length &&
    files.map((file) => {
        if (file.idTemp) {
            return { ...file, idTemp: undefined };
        }
        return { id: file.id };
    });

interface IFeedBackFormProps extends IBasicScreenProps {
    currentLocation: ICoords;
}

const FeedBackForm: React.SFC<IFeedBackFormProps> = (
    props: IFeedBackFormProps
) => {
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [isLocation, setLocation] = useState(false);

    const handleUploadFile = () => {
        ImagePicker.showImagePicker(options, (response) => {
            /* tslint:disable */
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log(
                    "User tapped custom button: ",
                    response.customButton
                );
            } else {
                setImages(tranformImgs([...images, response]));
            }
        });
    };

    const removeImage = async (img) => {
        if (images.length) {
            setImages(images.filter((imgIn) => imgIn.idTemp !== img.idTemp));
            return;
        }
    };

    const handleOnSubmit = async (values, { setSubmitting }) => {
        const { longitude, latitude } = props.currentLocation;

        const obj = {
            ...values,
            email: values.email && values.email.toLowerCase(),
            files: tranformBeforeSendToServer(images) || [],
            type: "SERVICE",
            subject: props.name,
            service: props.id,
            coordinates: isLocation
                ? props.currentLocation && [longitude, latitude].join("|")
                : "0|0",
        };
        if (obj.files && obj.files.length && !obj.files[0].fileName)
            obj.files[0].fileName = "image";

        try {
            const res = await FeedbacksApi.createServiceFeedBack(obj);

            if (res) {
                setError(null);
                setSubmitting(false);
                props.closeModal();
                log.success(translate("SENT_FEEDBACK_SUCCESSFULLY"));
            }
        } catch (error) {
            setSubmitting(false);
            setError(convertI18NText(error.message));
            throw new Error(
                `Can notcreate feedback with error: ${error.message}`
            );
        }
    };

    const renderFeedBackForm = (args) => {
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
            <>
                <View style={styles.contentContainer}>
                    <Field
                        name="name"
                        component={InputFiled}
                        placeholder="mark"
                        label={translate("NAME")}
                        style={{ paddingTop: 29 }}
                    />
                    <Field
                        name="email"
                        component={InputFiled}
                        placeholder="mark@gmail.com"
                        label={translate("EMAIL")}
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
                        name="message"
                        component={InputFiled}
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
                        label={translate("MESSAGE")}
                    />
                    {/* <View style={styles.fileContainer}>
            <Text style={styles.labelUploadFile}>
              {translate("ATTACHMENTS")}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <TouchableOpacity
                style={styles.uploadFileButton}
                onPress={handleUploadFile}
              >
                <Icon name="md-attach" size={32} color={theme.WHITE_COLOR} />
              </TouchableOpacity>

              {images &&
                images.length > 0 &&
                images.map((img, idx) => {
                  const url = img.concatUrl
                    ? `${img.concatUrl}${img.content}`
                    : img.content;
                  return (
                    <View key={idx} style={styles.wrapImage}>
                      <TouchableOpacity
                        style={styles.removeImage}
                        onPress={() => removeImage(img)}
                      >
                        <Icon
                          name="ios-close-circle-outline"
                          size={24}
                          color={theme.RED_COLOR}
                        />
                      </TouchableOpacity>
                      <View>
                        <Image
                          style={{ width: 48, height: 48 }}
                          source={{ uri: url }}
                          PlaceholderContent={<ActivityIndicator />}
                        />
                      </View>
                    </View>
                  );
                })}
            </View>
          </View> */}
                    {!!props.currentLocation.longitude &&
                        !!props.currentLocation.latitude && (
                            <CheckBox
                                checked={isLocation}
                                onPress={() => setLocation(!isLocation)}
                                title={translate("ADD_YOUR_LOCATION")}
                                containerStyle={styles.containerCheckbox}
                            />
                        )}
                    {error && <ErrorText text={error} />}
                </View>
                <View style={styles.footerContainer}>
                    <Button
                        onPress={props.closeModal}
                        containerStyle={[
                            styles.actionButton,
                            { marginRight: 4 },
                        ]}
                        // buttonStyle={{ backgroundColor: theme.RED_COLOR }}
                        type="outline"
                        title={translate("CANCEL")}
                    />
                    <Button
                        onPress={handleSubmit}
                        containerStyle={[
                            styles.actionButton,
                            { marginLeft: 4 },
                        ]}
                        title={translate("SEND")}
                        loading={!!isSubmitting}
                        disabled={!!isSubmitting}
                    />
                </View>
            </>
        );
    };

    return (
        <>
            <ScrollView style={{ width: "100%" }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>
                        {translate("CONNECT_TO", { value: props.name })}
                    </Text>
                </View>
                <Formik
                    initialValues={{
                        email: "",
                        name: "",
                        message: "",
                        phone: "",
                    }}
                    validate={validateFeedBackForm}
                    onSubmit={handleOnSubmit}
                    render={(args) => renderFeedBackForm(args)}
                    enableReinitialize
                />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 10,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.LIGHT_COLOR,
        display: "flex",
        width: "100%",
    },
    contentContainer: {
        paddingVertical: 10,
        width: "100%",
    },
    footerContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        ...common.h1,
        fontWeight: "600",
        color: theme.BLACK_COLOR,
        textAlign: "center",
    },
    forgotPasswordButton: {
        marginTop: 24,
        width: "100%",
    },
    actionButton: {
        flex: 1,
        height: 50,
        borderRadius: 20,
    },
    fileContainer: {
        paddingVertical: 10,
        width: "100%",
    },
    labelUploadFile: {
        ...common.label,
        color: theme.GRAY_DARKER_COLOR,
        marginBottom: 16,
    },
    uploadFileButton: {
        ...common.flexCenter,
        width: 48,
        height: 48,
        backgroundColor: theme.PRIMARY_COLOR,
        borderRadius: 50,
        marginBottom: 8,
        marginRight: 12,
    },
    wrapImage: {
        position: "relative",
        marginRight: 12,
    },
    removeImage: {
        position: "absolute",
        top: -10,
        right: -8,
        zIndex: 2,
    },
    containerCheckbox: {
        marginRight: 0,
        marginLeft: 0,
        marginTop: 20,
    },
});

const mapStateToProps = (state) => ({
    coords: getCoords(state),
    currentLocation: getCurrentLocation(state),
});

export default connect(
    mapStateToProps,
    null
)(FeedBackForm);
