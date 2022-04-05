import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
export default class AlertMessage extends React.Component {
  public state = {
    title: '',
    subTitle: '',
    style: '',
    openAlert: false,
    height: false,
  };

  public componentDidMount() {
    this.setState({
        title: this.props.title ? this.props.title : '',
        button1: 'NO',
        button2: null,
        isReferral: false,
        style: this.props.style ? this.props.style : 'success',
        text: '',
        deny: false,
      });
  }
  public setText(title, button2, type) {
    this.setState({ title, button2, type, height: 190 });
    this.show();
  }
  public setButton1(title, button1) {
    this.setState({ title, button1, height: 190 });
    this.show();
  }

  public show() {
    this.setState({ openAlert: true });
  }
  public hide(e) {
    this.setState({ openAlert: false });
    this.props.onPress && this.props.onPress(e);
  }
  public render() {
    return (
            <TouchableWithoutFeedback
                onPress={() => this.setState({ openAlert: false })}
            >
                <Modal
                    isVisible={this.state.openAlert}
                    coverScreen={true}
                    onBackdropPress={() => this.setState({ openAlert: false })}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <Text
                                style={[
                                  styles.subTitle,
                                  {
                                    textAlign: this.state.deny
                                            ? 'justify'
                                            : 'center',
                                  },
                                ]}
                            >
                                {this.state.title}
                            </Text>

                            <View style={{ marginTop: 30 }} />
                            <View style={styles.button}>
                                {this.state.button2 == null ? (
                                    <TouchableOpacity
                                        style={[
                                          styles.button1,
                                            { width: '100%' },
                                        ]}
                                        onPress={() => this.hide('button1')}
                                    >
                                        <Text
                                            style={{
                                              fontSize: 17,
                                            }}
                                        >
                                            {this.state.button1}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                  [
                                    <TouchableOpacity
                                            style={[
                                              styles.button1,
                                              {
                                                width: '50%',
                                                borderRightColor: '#d6d7da',
                                                borderRightWidth: 1,
                                              },
                                            ]}
                                            onPress={() => this.hide('button1')}
                                            key={1}
                                        >
                                            <Text
                                                style={{
                                                  fontSize: 17,
                                                  color: '#1E2731',
                                                }}
                                            >
                                                {this.state.button1}
                                            </Text>
                                        </TouchableOpacity>,
                                    <TouchableOpacity
                                            style={[
                                              styles.button1,
                                                { width: '50%' },
                                            ]}
                                            onPress={() =>
                                                this.hide(this.state.type)
                                            }
                                            key={2}
                                        >
                                            <Text
                                                style={{
                                                  fontSize: 17,
                                                  color: '#1E2731',
                                                  textAlign: 'center',
                                                }}
                                            >
                                                {this.state.button2}
                                            </Text>
                                        </TouchableOpacity>,
                                  ]
                                )}
                            </View>
                        </View>
                    </View>
                </Modal>
            </TouchableWithoutFeedback>
      );
  }
}
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    width: '100%',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    width: 300,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    paddingTop: 0,
    zIndex: 1,
  },
  title: {
    color: '#38424F',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  subTitle: {
    color: 'black',
    opacity: 0.8,
    width: '89%',
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
    textAlign: 'center',
  },
  button: {
    fontSize: 21,
    width: '100%',
    height: 55,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopColor: '#d6d7da',
    borderTopWidth: 1,
  },
  button1: {
    color: '#1E2731',
    textAlign: 'center',
    fontSize: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  try: {
    color: '#1E2731',
    width: '50%',
    textAlign: 'center',
    fontSize: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
