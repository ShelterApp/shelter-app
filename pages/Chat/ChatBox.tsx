import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Linking,
    ActivityIndicator,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { GiftedChat, Time, Bubble, Send } from 'react-native-gifted-chat';
import { Divider } from 'react-native-elements';
import { Flow } from 'react-native-animated-spinkit';
import { connect } from 'react-redux';
import moment from 'moment';
import IconFa from 'react-native-vector-icons/FontAwesome';
import IconCus from 'react-native-vector-icons/FontAwesome5';
import IconCus2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Location from '@app/components/Common/Location';
import { getDataToLocal } from '@app/utils';
import dayjs from 'dayjs';
import { BackButton, Header, Schedule } from '@app/components/Common';
import { IBasicScreenProps, IUserProps } from '@app/components/Types';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import { BotApi } from '@shelter/core/dist/apis';
import { ScheduleCategory, Service } from '@shelter/core';
import { getUserData } from '@app/redux/user/selectors';
import { getCoords, getSearch, getReducer } from '@app/redux/service/selectors';
import { struct } from 'pb-util';
import { tranformSchedules } from '@app/components/ServiceForm/utils';
import translate from '@app/utils/i18n';

const numberRandom = () => Math.round(Math.random() * 1000000);

const commonProps = {
  user: {
    _id: 2,
    avatar: require('@app/assets/images/bot.png'),
  },
};

const waiting = {
  _id: numberRandom(),
  ...commonProps,
  createdAt: new Date(),
  isWating: true,
  quickReplies: {
    type: 'radio',
    name: 'waiting',
    values: [
        {
          title: '',
          value: '',
        },
      ],
  },
};

const tranformChatBoxAPI = (res) => {
  let afterTranform = res.reduce((preV, current) => {
    let last, quickReplies;
    if (current.payload) {
        const { fields } = current.payload;
        if (fields.type && fields.type.stringValue) {
            const type = fields.type.stringValue;
            switch (type) {
                case 'SERVICES_LIST':
                  quickReplies = {
                      name: 'SERVICES_LIST',
                      type: 'radio',
                      values: fields.data.listValue.values.map(
                                (rep) => rep,
                            ),
                    };
                  break;
                case 'ASK_SERVICE_SCHEDULE':
                  quickReplies = {
                      name: 'ASK_SERVICE_SCHEDULE',
                      type: 'radio',
                      values: struct.decode({
                            fields: fields.data.structValue.fields,
                          }),
                    };
                  break;
                case 'ASK_DISTANCE_SERVICE':
                  quickReplies = {
                      name: 'SERVICES_LIST',
                      type: 'radio',
                      values: [fields.data],
                    };
                  break;
                case 'ASK_PARTICULAR_SERVICE':
                  quickReplies = {
                      name: 'SERVICES_LIST',
                      type: 'radio',
                      values: [fields.data],
                    };
                  break;
                case 'GET_SHELTER_AVAILABLE_BEDS':
                  quickReplies = {
                      name: 'SERVICES_LIST',
                      type: 'radio',
                      values: fields.data.listValue.values,
                    };
                  break;
                case 'ASK_SERVICE_BED_AVAILABLE':
                  quickReplies = {
                      name: 'SERVICES_LIST',
                      type: 'radio',
                      values: [fields.data],
                    };
                  break;
                case 'WEATHER':
                  quickReplies = {
                      name: 'WEATHER',
                      type: 'radio',
                      values: struct.decode({
                            fields: fields.data.structValue.fields,
                          }),
                    };
                  break;
                case 'CRISIS_LINES_LIST':
                  quickReplies = {
                      name: 'CRISIS_LINES_LIST',
                      type: 'radio',
                      values: fields.data.listValue.values,
                    };
                default:
                  console.log('Alert');
                  break;
              }
          } else {
            quickReplies = {
                name: 'listValue',
                type: 'radio',
                values: fields.quick_replies.listValue.values.map(
                        (rep) => rep.structValue.fields.text.stringValue,
                    ),
              };
          }
        last = {
            _id: numberRandom(),
            ...commonProps,
            createdAt: new Date(),
            quickReplies,
          };
        return [...preV, last];
      }
    last = {
        _id: numberRandom(),
        ...commonProps,
        createdAt: new Date(),
        text: current.text.text,
      };
    return [...preV, last];
  }, []);
  afterTranform = afterTranform.filter((item) => item);
  return afterTranform.reverse();
};
const renderWeather = (service) => {
  const now = new Date(),
    sunrise = dayjs(
            service.sys.sunrise * 1000 +
                now.getTimezoneOffset() * 60000 +
                service.timezone * 1000,
        ).format('h:mm A'),
    sunset = dayjs(
            service.sys.sunset * 1000 +
                now.getTimezoneOffset() * 60000 +
                service.timezone * 1000,
        ).format('h:mm A');

  return (
        <View style={[styles.repliesContainer]}>
            <View>
                <Text style={[styles.text, { ...common.h1, color: 'black' }]}>
                    Humidity: {service.main.humidity}%
                </Text>
                <Text style={[styles.text, { ...common.h1, color: 'black' }]}>
                    Visibility: {service.visibility / 1000} mi
                </Text>
                <Text style={[styles.text, { ...common.h1, color: 'black' }]}>
                    Wind: {service.wind.speed} km/h
                </Text>
                <Text style={[styles.text, { ...common.h1, color: 'black' }]}>
                    Sunrise Today: {sunrise}
                </Text>
                <Text style={[styles.text, { ...common.h1, color: 'black' }]}>
                    Sunset Today: {sunset}
                </Text>
            </View>
        </View>
  );
};
const renderCrisisLines = (service) => {
  return (
        <View style={styles.repliesContainer}>
            <View style={styles.repliesWrap}>
                {service.map((ser, idx) => {
                  const tempSer = struct.decode(ser.structValue);
                  return (
                        <TouchableOpacity
                            key={idx * 2}
                            style={styles.replies}
                            onPress={() =>
                                tempSer.website &&
                                Linking.openURL(tempSer.website)
                            }
                        >
                            <Text style={styles.repliesText}>
                                {tempSer.title || tempSer.name}
                            </Text>
                        </TouchableOpacity>
                  );
                })}
            </View>
        </View>
  );
};
const renderSchedule = (service) => {
  const { schedules } = service;
  const lastSchedules = schedules && tranformSchedules(schedules);
  if (lastSchedules && lastSchedules.length > 0) {
    return (
            <View style={styles.repliesContainer}>
                <View style={styles.repliesWrap}>
                    <View style={[styles.itemView]}>
                        {lastSchedules.map((s, idx) => (
                            <View
                                key={idx}
                                style={[
                                  styles.rowFront,
                                  idx > 0 &&
                                    lastSchedules[idx - 1].title ===
                                        lastSchedules[idx].title
                                        ? styles.itemInView2
                                        : idx === 0
                                        ? { borderTopWidth: 1 }
                                        : { borderTopWidth: 1 },
                                  idx === lastSchedules.length - 1
                                        ? {
                                          borderBottomWidth: 1,
                                          borderBottomColor:
                                                  theme.LIGHT_COLOR,
                                        }
                                        : null,
                                ]}
                            >
                                <Text
                                    style={[
                                      styles.text,
                                        { marginRight: 48, width: '30%' },
                                    ]}
                                >
                                    {idx > 0 &&
                                    lastSchedules[idx - 1].title ===
                                        lastSchedules[idx].title
                                        ? ''
                                        : translate(s.title)}
                                </Text>
                                <Text style={[styles.text, { width: '70%' }]}>
                                    {s.date}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
      );
  }
};

const ServiceItem = (props) => {
  const {
        handleOpenWebsite,
        handleCallPhone,
        handleOpenMaps,
        name,
        serviceSummary,
        category,
        age,
        website,
        phone,
        address1,
        address2,
        distance,
        likes,
        availableBeds,
        updatedAt,
    } = props;
  const isYouthKid = category && category[0] === ScheduleCategory.Kids;
  const lastCategory = category.indexOf('ALL') !== -1 ? ['Anyone'] : category;
  const withAge = age ? [...lastCategory, age] : lastCategory;

  return (
        <View style={styles.serviceItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      props.goToDetail(props);
                    }}
                >
                    <Text style={[styles.serviceItemText, styles.serviceName]}>
                        {name}
                    </Text>
                </TouchableOpacity>
                {!!website && (
                    <Website
                        website={website}
                        handleOpenWebsite={handleOpenWebsite}
                        iconName="globe-americas"
                    />
                )}
            </View>
            <View style={styles.serviceSummaryContainer}>
                <IconFa name="star" size={16} color="white" />
                <Text style={[styles.serviceItemText, { marginLeft: 4 }]}>
                    {serviceSummary}
                </Text>
            </View>
            <View style={styles.serviceSummaryContainer}>
                <IconFa
                    name={isYouthKid ? 'child' : 'group'}
                    size={16}
                    color="white"
                />
                <Text style={[styles.serviceItemText, { marginLeft: 4 }]}>
                    {withAge.join(', ')}
                </Text>
            </View>
            <View style={styles.serviceSummaryContainer}>
                <IconFa name="clock-o" size={16} color="white" />
                <Text style={[styles.serviceItemText, { marginLeft: 4 }]}>
                    {<Schedule isChatBox={true} {...props} />}
                </Text>
                {props.latitude && props.longitude && distance ? (
                    <Text style={[styles.serviceItemText]}>
                        {distance} miles
                    </Text>
                ) : (
                    likes > 0 && (
                        <Text style={[styles.serviceItemText]}>
                            {likes} Kudos
                        </Text>
                    )
                )}
            </View>
            {!!availableBeds && (
                <View style={styles.serviceSummaryContainer}>
                    <Text style={[styles.serviceItemText, { marginLeft: 4 }]}>
                        {`${availableBeds} Beds Available. Updated `}
                        {updatedAt && moment(updatedAt).fromNow()}
                    </Text>
                </View>
            )}
            <Divider
                style={{
                  backgroundColor: theme.WHITE_COLOR,
                  marginVertical: 8,
                }}
            />
            <View>
                <View style={styles.contactContainer}>
                    {!!phone && (
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => handleCallPhone(phone)}
                        >
                            <Text style={styles.serviceItemText}>Contact</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => handleOpenMaps(address1 || address2)}
                    >
                        <Text style={styles.serviceItemText}>
                            Get Directions
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
  );
};

const Website = (props) => {
  const { website, iconName, handleOpenWebsite } = props;
  return (
        <TouchableOpacity
            onPress={() => handleOpenWebsite(website)}
            style={styles.itemInView}
        >
            <View style={styles.iconCicle}>
                <IconCus name={iconName} size={20} color={theme.WHITE_COLOR} />
            </View>
        </TouchableOpacity>
  );
};

interface IChatBoxProps extends IBasicScreenProps {
  currentLocation: any;
  getSearch: any;
  getReducer: any;
  userInfo: IUserProps;
}

const ChatBox: React.SFC<IChatBoxProps> = (props: IChatBoxProps) => {
  const [messages, setMessage] = useState([waiting]);
  const [isFetching, setFetching] = useState(false);
  const [chatToken, setChatToken] = useState(Math.random().toString(36));
  const [userTimezone, setUserTimezone] = useState(
        new Date().getTimezoneOffset(),
    );
  const location = props.currentLocation;
  const chatRef = useRef() as any;

  useEffect(() => {
    init();
    if (props.userInfo && props.userInfo.id) {
        setChatToken(props.userInfo.id);
      }
    setTimeout(() => chatRef.current.focusTextInput(), 1000);
    const blurListener = props.navigation.addListener('didBlur', () => {
            // init();
      });
    const didListener = props.navigation.addListener('didFocus', () => {
        setTimeout(() => chatRef.current.focusTextInput(), 1000);
      });

    return () => {
        blurListener.remove();
        didListener.remove();
      };
  }, []);

  const init = async () => {
    try {
            // const token = await getDataToLocal("@ShelterToken");
        const res = (await BotApi.query({
            query: 'Hi',
            chatToken,
            userTimezone,
          })) as any;
        if (res && res.length) {
            setFetching(false);
            const results = [
                ...tranformChatBoxAPI(res),
                    // ...defaultChat,
              ];
            setMessage(results);
          }
      } catch (error) {
        setFetching(false);
            /* tslint:disable */
            console.log(error);
        }
    };
    const goToDetail = (service: Service) => {
        if (service) {
            const serviceData = service;
            props.navigation.navigate("ChatDetails", {
                serviceData,
            });
        }
    };

    const onSend = async (newMess, picked?) => {
        const lastNewMessageArr = newMess.map((me) => ({
            ...me,
            _id: numberRandom(),
        }));
        let messageState = messages;

        if (picked) {
            messageState = messageState.filter(
                (m) =>
                    !m.quickReplies ||
                    (m.quickReplies &&
                        m.quickReplies.name &&
                        m.quickReplies.name !== "listValue")
            );
        }

        let combineArr = GiftedChat.append(messageState, [
            waiting,
            ...lastNewMessageArr,
        ]);

        setMessage(combineArr);

        if (newMess) {
            try {
                let query = newMess[0].text,
                    locationQuery;
                const token = await getDataToLocal("@ShelterToken");
                const coordinate =
                    location && location.latitude
                        ? [location.latitude, location.longitude].join("|")
                        : undefined;
                if (!coordinate && props.getReducer.city)
                    locationQuery = props.getReducer.city;
                else if (!coordinate && props.getReducer.zip)
                    locationQuery = props.getReducer.zip;
                const res = (await BotApi.query(
                    {
                        query,
                        coordinate,
                        userTimezone,
                        location: locationQuery,
                        chatToken,
                    },
                    chatToken
                )) as any;
                if (res && res.length) {
                    const tranformIdx = tranformChatBoxAPI(res);
                    const newArray = GiftedChat.append(
                        combineArr.filter((c) => !c.isWating),
                        [...tranformIdx]
                    );
                    setMessage(newArray);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const pickService = (serviceSelected) => {
        const newMess = [
            {
                _id: numberRandom(),
                createdAt: new Date(),
                user: {
                    _id: 1,
                },
                text: serviceSelected,
            },
        ];

        onSend(newMess, true);
    };

    const renderTime = (propsTime) => {
        const { currentMessage } = propsTime;
        const isQuickRep =
            currentMessage &&
            currentMessage.quickReplies &&
            currentMessage.quickReplies.values;
        if (isQuickRep) {
            return <></>;
        }
        return <Time {...propsTime} />;
    };

    const handleOpenWebsite = (link: string) => {
        if (link) {
            Linking.openURL(link);
        }
    };

    const handleCallPhone = (phone) => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        }
    };

    const handleOpenMaps = (address) => {
        if (address) {
            Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${address}`
            );
        }
    };

    const goToFaq = () => {
        props.navigation.navigate("Faq");
    };

    const renderServiceItem = (quickReplies) => {
        const listArr = quickReplies.values.map(
            (item) => item.structValue.fields
        );
        return (
            <ScrollView
                style={styles.serviceContainer}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {listArr.map((ser, idx) => {
                    const obj = struct.decode({ fields: ser });
                    return (
                        <ServiceItem
                            key={idx * 2}
                            {...obj}
                            {...location}
                            goToDetail={goToDetail}
                            handleOpenWebsite={handleOpenWebsite}
                            handleCallPhone={handleCallPhone}
                            handleOpenMaps={handleOpenMaps}
                        />
                    );
                })}
            </ScrollView>
        );
    };

    const renderWaiting = () => {
        return (
            <View style={styles.repliesContainer}>
                <View style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
                    <Flow size={44} color={"#a2a2a2"} />
                </View>
            </View>
        );
    };

    const renderBubble = (props) => {
        if (props.position === "right") {
            return (
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: theme.PRIMARY_COLOR,
                        },
                    }}
                />
            );
        }

        return <Bubble {...props} />;
    };

    const renderQuickReplies = (props) => {
        const { quickReplies } = props.currentMessage;
        const { values, name } = quickReplies;

        if (name) {
            if (name === "SERVICES_LIST") {
                return renderServiceItem(quickReplies);
            }
            if (name === "waiting") {
                return renderWaiting();
            }
            if (name === "listValue") {
                return (
                    <View style={styles.repliesContainer}>
                        <View style={styles.repliesWrap}>
                            {values.map((ser, idx) => (
                                <TouchableOpacity
                                    key={idx * 2}
                                    onPress={() => pickService(ser)}
                                    style={styles.replies}
                                >
                                    <Text style={styles.repliesText}>
                                        {ser}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );
            }
            if (name === "ASK_SERVICE_SCHEDULE") {
                return renderSchedule(values);
            }
            if (name === "WEATHER") {
                return renderWeather(values);
            }
            if (name === "CRISIS_LINES_LIST") {
                return renderCrisisLines(values);
            }
        }
    };

    const renderAvatar = (props) => {
        return (
            <View>
                <Image
                    source={props.currentMessage.user.avatar}
                    style={{ width: 34, height: 34 }}
                />
            </View>
        );
    };

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={{ marginRight: 10, marginBottom: 5 }}>
                    <IconCus2
                        name="send-circle"
                        size={40}
                        color={theme.PRIMARY_COLOR}
                    />
                </View>
            </Send>
        );
    };

    const renderRightItem = () => {
        return (
            <>
                <View style={styles.iconContainer}>
                    <Location />
                </View>

                <TouchableOpacity
                    onPress={goToFaq}
                    style={styles.iconContainer}
                >
                    <IconCus2
                        name="comment-question"
                        size={28}
                        color={theme.WHITE_COLOR}
                        style={{ marginTop: 8 }}
                    />
                </TouchableOpacity>
            </>
        );
    };

    const renderChat = () => {
        if (isFetching) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme.PRIMARY_COLOR}
                    />
                </View>
            );
        }

        return (
            <GiftedChat
                messages={messages}
                ref={chatRef}
                onSend={(message) => onSend(message)}
                user={{
                    _id: 1,
                }}
                renderTime={renderTime}
                renderQuickReplies={renderQuickReplies}
                renderBubble={renderBubble}
                renderAvatar={renderAvatar}
                renderSend={renderSend}
            />
        );
    };

    return (
        <>
            <Header
                renderLeftItem={
                    <>
                        <BackButton
                            onPress={() => props.navigation.navigate("Home")}
                            styles={{ marginLeft: 0 }}
                        />
                    </>
                }
                // renderLeftItem={null}
                renderRightItem={renderRightItem()}
            />
            {renderChat()}
        </>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        paddingVertical: 10,
        paddingHorizontal: 0,
        zIndex: -1,
        height: "100%",
        paddingTop: 34,
        marginTop: 0,
    },
    repliesContainer: {
        maxWidth: 300,
        justifyContent: "flex-start",
        backgroundColor: "#f0f0f0",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 4,
        padding: 5,
        marginTop: -16,
    },
    repliesWrap: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    loadingContainer: {
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        marginTop: "50%",
    },
    serviceContainer: {
        display: "flex",
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#f0f0f0",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 4,
        marginTop: -16,
    },
    replies: {
        padding: 10,
        marginHorizontal: 5,
        marginVertical: 5,
        backgroundColor: theme.WHITE_COLOR,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.PRIMARY_COLOR,
    },
    repliesText: {
        ...common.h2,
        color: theme.PRIMARY_COLOR,
    },
    serviceItem: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: theme.PRIMARY_COLOR,
        marginRight: 16,
    },
    serviceItemText: {
        ...common.h2,
        fontSize: theme.FONT_SIZE_SUPPER_LARGE,
        color: theme.WHITE_COLOR,
        maxWidth: Dimensions.get("window").width * 0.8,
    },
    serviceName: {
        fontWeight: "600",
        marginBottom: 4,
        fontSize: 17,
    },
    serviceSummaryContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    contactContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        borderRadius: 15,
    },
    websiteContainer: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    itemInView: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    iconCicle: {
        ...common.flexCenter,
        width: 32,
        height: 32,
        backgroundColor: theme.PRIMARY_COLOR,
        borderRadius: 50,
        marginRight: 10,
    },
    avatarStyle: {
        width: 50,
        height: 50,
        overflow: "hidden",
        ...common.flexCenter,
        borderRadius: 18,
    },
    iconContainer: {
        ...common.flexCenter,
        width: 38,
    },
    itemView: {
        borderRadius: 2,
        width: "100%",
    },
    rowFront: {
        alignItems: "center",
        justifyContent: "space-between",
        height: 32,
        flexDirection: "row",
        display: "flex",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.LIGHT_COLOR,
    },
    itemInView2: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderBottomColor: theme.LIGHT_COLOR,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        ...common.h2,
        color: theme.PRIMARY_COLOR,
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    option: {
        padding: 4,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        borderColor: "white",
        borderWidth: 1,
    },
});

const mapStateToProps = (state) => ({
    userInfo: getUserData(state),
    currentLocation: getCoords(state),
    getSearch: getSearch(state),
    getReducer: getReducer(state),
});

export default connect(
    mapStateToProps,
    null
)(ChatBox);
