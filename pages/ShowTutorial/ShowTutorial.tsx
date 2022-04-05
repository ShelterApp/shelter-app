import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { connect } from 'react-redux';

import { Icon, Button } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import { setDataToLocal } from '@app/utils';
import { GeolocationService } from '@app/utils/geolocation';
import IconFa from 'react-native-vector-icons/FontAwesome';
import IconAn from 'react-native-vector-icons/AntDesign';
import { setLocationModal } from '@app/redux/other/actions';
import { setCoordinates, setCurrentLocation } from '@app/redux/service/actions';
/* tslint:disable */
const styles = StyleSheet.create({
    silderContainer: {
        display: "flex",
        alignItems: "center",
        marginTop: 38,
        position: "relative",
    },
    doneContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 160,
        paddingHorizontal: 8,
    },
    image: {
        marginBottom: 16,
        width: 320,
        height: 320,
    },
    title: {
        ...common.h1,
        fontSize: 18,
        color: theme.BLACK_COLOR,
        fontWeight: "700",
    },
    desc: {
        ...common.h2,
        fontSize: 15,
        color: theme.BLACK_COLOR,
        marginHorizontal: 16,
        marginTop: 8,
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: theme.PRIMARY_COLOR,
        // opacity: 0.8,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flex: 1,
    },
    buttonCircleDone: {
        width: 60,
        height: 60,
        backgroundColor: theme.PRIMARY_COLOR,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        marginBottom: 16,
        // flex: 1,
    },
    skipButton: {
        ...common.h1,
        fontSize: 16,
        color: theme.PRIMARY_COLOR,
    },
    skipButtonContainer: {
        top: 0,
        right: 16,
        position: "absolute",
        zIndex: 10,
    },
    herfText: {
        textDecorationLine: "underline",
    },
    doneTitle: {
        fontSize: 24,
        color: theme.BLACK_COLOR,
        fontWeight: "700",
    },
    doneDesc: {
        ...common.h1,
        fontSize: 16,
        color: theme.BLACK_COLOR,
    },
    termContainer: {
        marginVertical: 24,
        textAlign: "center",
        borderColor: "red",
        borderWidth: 1,
        padding: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 24,
    },
    button: {
        width: "48%",
        height: 54,
    },
});

const slides = [
    {
        title: "Welcome to Shelter App",
        desc: (
            <Text style={styles.desc}>
                Home Screen of the App displays list of services with info like
                Bed Availablility for Shelters, Open or Closed Times, Distance
                from your Location, etc. Feel Free to give Kudos to services
                that you like using{" "}
                <IconAn name="like1" size={20} color={theme.PRIMARY_COLOR} />
            </Text>
        ),
        image: require("@app/assets/images/1firstscreen.png"),
    },
    {
        desc: (
            <Text style={styles.desc}>
                You can click on any service on the Home Screen to get detailed
                info including Bus Directions to that service from your
                Location. You can click on{" "}
                <Icon name="md-star" size={20} color={theme.PRIMARY_COLOR} /> at
                the top right of details screen to add that service to My
                Favorites.
            </Text>
        ),
        image: require("@app/assets/images/2secondscreen.png"),
    },
    {
        desc: (
            <Text style={styles.desc}>
                Tabs at the bottom of Home screen will help you navigate to
                resources like Food, Shelter, Health, Resources & Work. Each tab
                has Sub Tabs on top of them like Clothes, Hygiene, Tech, etc.,
                to help narrow your search.
            </Text>
        ),
        image: require("@app/assets/images/3BottomIcons.png"),
    },
    {
        desc: (
            <Text style={styles.desc}>
                Clicking on{" "}
                <Icon name="md-menu" size={20} color={theme.PRIMARY_COLOR} /> at
                the top of Home Screen will take you to Options Menu where you
                can filter services based on Category like Youth, LGBT, Women,..
                Services that are Open Now, Map View, Crisis Lines, My
                Favorites, etc.
            </Text>
        ),
        image: require("@app/assets/images/4Options.png"),
    },
    {
        desc: (
            <Text style={styles.desc}>
                You can click on Crisis Lines in Options Menu to reach out to
                National Hotlines for emotional support. You can also search for
                Crisis Lines or Services using{"  "}
                <Icon name="md-search" size={20} color={theme.PRIMARY_COLOR} />
            </Text>
        ),
        image: require("@app/assets/images/5CrisisLines.png"),
    },
    {
        desc: (
            <Text style={styles.desc}>
                Clicking{" "}
                <IconFa name="flag" size={20} color={theme.PRIMARY_COLOR} /> on
                Home screen for services will help you connect to the App Admin
                or Service Provider for that resource.
            </Text>
        ),
        image: require("@app/assets/images/6Contact.png"),
    },
    {
        desc: (
            <Text style={styles.desc}>
                You can view services in List View or Map View and can even
                search for another City or Zip using{" "}
                <Icon name="md-pin" size={20} color={theme.PRIMARY_COLOR} /> at
                the top of Home Screen.
            </Text>
        ),
        image: require("@app/assets/images/7Mapview.png"),
    },
    {
        desc: (
            <Text style={styles.desc}>
                Click{" "}
                <Image
                    source={require("@app/assets/images/chatbox.png")}
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 5,
                        backgroundColor: theme.PRIMARY_COLOR,
                    }}
                />{" "}
                on Home Screen for interacting with our AI Powered Chatbot to
                find services with ease
            </Text>
        ),
        image: require("@app/assets/images/8Chatbot.png"),
    },
    {
        id: "done",
    },
];

const ShowTutorial: React.SFC<IBasicScreenProps> = (
    props: IBasicScreenProps
) => {
    const slideRef = useRef(null);

    useEffect(() => {
        slideRef.current.goToSlide(0);
        getLocation();
        // props.setLocationModal(true);

        // const focusListener = props.navigation.addListener('didFocus', () => {
        //   slideRef.current.goToSlide(0);
        // });
        // return () => focusListener.remove();
    }, []);
    const getLocation = async () => {
        const geo = new GeolocationService();
        geo.getCurrentPosition(
            async (position) => {
                if (position && position.coords) {
                    const { latitude, longitude } = position.coords;
                    await props.setCoordinates({ latitude, longitude });
                    await props.setCurrentLocation({ latitude, longitude });
                }
            },
            (error) => {
                console.log(error, "tutoal");
                // if (error.PERMISSION_DENIED == 1) {
                //     props.setLocationModal(true);
                // }
            }
        );
    };

    const handleClickAgreee = () => {
        setDataToLocal("isFirstOpen", JSON.stringify(true));
        props.navigation.navigate("Home");
    };

    const renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="md-arrow-round-forward"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                    style={{ backgroundColor: "transparent" }}
                />
            </View>
        );
    };

    const renderPrevButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="md-arrow-round-back"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                    style={{ backgroundColor: "transparent" }}
                />
            </View>
        );
    };

    const renderItem = ({ item, index }) => {
        if (item.id && item.id === "done") {
            return (
                <View key={index} style={styles.doneContainer}>
                    <View style={styles.buttonCircleDone}>
                        <Icon
                            name="md-checkmark"
                            color="rgba(255, 255, 255, .9)"
                            size={32}
                            style={{ backgroundColor: "transparent" }}
                        />
                    </View>
                    <Text style={styles.doneTitle}>ACCEPT TERMS</Text>
                    <Text style={styles.termContainer}>
                        <Text style={styles.doneDesc}>
                            By Clicking I agree, you agree to the Shelter App,
                            Inc’s
                        </Text>
                        <Text
                            onPress={() =>
                                props.navigation.navigate("Terms", {
                                    isShowTutorial: true,
                                })
                            }
                            style={styles.herfText}
                        >
                            {" "}
                            {translate("TERMS_OF_USE")}
                        </Text>
                        <Text style={styles.doneDesc}> and </Text>
                        <Text
                            onPress={() =>
                                props.navigation.navigate("Privacy", {
                                    isShowTutorial: true,
                                })
                            }
                            style={styles.herfText}
                        >
                            {" "}
                            {translate("PRIVACY_POLICY")}
                        </Text>
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={() => slideRef.current.goToSlide(0)}
                            containerStyle={styles.button}
                            title={translate("CANCEL")}
                        />
                        <Button
                            onPress={handleClickAgreee}
                            containerStyle={styles.button}
                            title={translate("I_AGREE")}
                        />
                    </View>
                </View>
            );
        }
        return (
            <View key={index} style={styles.silderContainer}>
                <TouchableOpacity
                    onPress={() =>
                        slideRef.current.goToSlide(slides.length - 1)
                    }
                    style={styles.skipButtonContainer}
                >
                    <Text style={styles.skipButton}>SKIP</Text>
                </TouchableOpacity>
                <Image style={styles.image} source={item.image} />
                {item.title && <Text style={styles.title}>{item.title}</Text>}
                <Text style={styles.desc}>{item.desc}</Text>
            </View>
        );
    };
    return (
        <AppIntroSlider
            ref={slideRef}
            renderItem={renderItem}
            slides={slides}
            renderNextButton={renderNextButton}
            renderPrevButton={renderPrevButton}
            activeDotStyle={{
                backgroundColor: theme.PRIMARY_COLOR,
                opacity: 0.9,
            }}
            showPrevButton
            showDoneButton={false}
        />
    );
};
const mapStateToProps = () => ({});

const mapDispatchToProps = {
    setCoordinates,
    setLocationModal,
    setCurrentLocation,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowTutorial);
