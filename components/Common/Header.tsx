import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { Header as HeaderCus, SearchBar } from 'react-native-elements';

import { Logo, MenuIcon, Icon } from '@app/components/Common';
import common from '@app/styles/common';
import theme from '@app/styles/theme';
import translate from '@app/utils/i18n';
import Location from './Location';
import { useDebounce } from '@app/utils/debounce';

interface IHeaderProps {
  onPress?: () => void;
  onChatBox?: () => void;
  onQuery?: (query: string) => void;
  renderRightItem?: any;
  renderLeftItem?: React.ReactNode;
  title?: string;
  searchOnly?: boolean;
  placeHolderSearch?: string;
  isSearchActive: boolean;
  isTyping: boolean;
  query: string;
}

const WAIT_INTERVAL = 500;

const Header: React.SFC<IHeaderProps> = (props: IHeaderProps) => {
  const [isSearchActive, setIsSearchActive] = useState(props.isSearchActive);
  const [isTyping, setIsTyping] = useState(props.isTyping);
  const [query, setQuery] = useState(props.query);
  const debouncedSearchTerm = useDebounce(query, WAIT_INTERVAL);

  const searchEl = useRef() as any;

  useEffect(() => {
    if (!isTyping) {
      return;
    }
    props.onQuery(query);
  }, [debouncedSearchTerm]);

  const onSearchPressed = () => {
    if (props.onPress) {
      props.onPress();
      return;
    }
    setIsSearchActive(true);
    searchEl.current.focus();
  };

  const onSearchTextChanged = (searchValue) => {
    setIsTyping(true);
    setQuery(searchValue);
    // props.onQuery(searchValue);
  };

  const onSearchClosed = () => {
    setQuery('');
    setIsSearchActive(false);
  };

  const renderCenter = () => {
    if (props.title) {
      return <Text style={common.headerTitle}>{props.title}</Text>;
    }
    return <Logo />;
  };

  const renderLeft = () => {
    return (
      <View style={styles.leftSide}>
        {props.renderLeftItem ? (
          props.renderLeftItem
        ) : (
          <>
            <MenuIcon />
            <Location />
          </>
        )}
      </View>
    );
  };

  const renderRight = () => {
    return (
      <View style={styles.leftSide}>
        {props.renderRightItem || (
          <>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={onSearchPressed}
            >
              <Icon name="md-search" size={28} color={theme.WHITE_COLOR} />
            </TouchableOpacity>
            {!props.searchOnly && props.onChatBox && (
              // <TouchableOpacity style={styles.iconContainer}>
              //   <Icon name="md-call" size={28} color={theme.WHITE_COLOR}  />
              // </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={props.onChatBox}
              >
                <Image
                  source={require('@app/assets/images/chatbox.png')}
                  style={{ width: 28, height: 28 }}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.searchContainer}>
        <View style={{ display: isSearchActive ? 'flex' : 'none' }}>
          <SearchBar
            ref={searchEl}
            round={false}
            showCancel={true}
            placeholder={translate(props.placeHolderSearch || 'TYPE HERE')}
            cancelButtonProps={{ buttonTextStyle: common.buttonTextStyle }}
            platform="ios"
            cancelButtonTitle={translate('CANCEL')}
            value={query}
            searchIcon={
              <Icon name="ios-search" size={20} color={theme.GRAY_DARK_COLOR} />
            }
            containerStyle={common.searchContainerStyle}
            inputContainerStyle={common.inputSearchContainerStyle}
            inputStyle={common.inputSearchStyle}
            onChangeText={onSearchTextChanged}
            onCancel={onSearchClosed}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      testID="header-id"
      style={{ backgroundColor: theme.PRIMARY_COLOR }}
    >
      <View style={styles.headerContainer}>
        <HeaderCus
          leftComponent={renderLeft()}
          centerComponent={renderCenter()}
          rightComponent={renderRight()}
          containerStyle={styles.headerContainerStyle}
        />
        {renderSearchBar()}
        <View
          style={{ backgroundColor: '#565656', width: '100%', marginTop: -1 }}
        />
      </View>
    </SafeAreaView>
  );
};

Header.defaultProps = {
  isSearchActive: false,
  isTyping: false,
  query: '',
};

const styles = StyleSheet.create({
  headerContainerStyle: {
    backgroundColor: theme.PRIMARY_COLOR,
    height: 44,
    paddingTop: 0,
    justifyContent: 'space-around',
  },
  iconContainer: {
    ...common.flexCenter,
    width: 38,
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    width: '100%',
  },
  headerContainer: {
    position: 'relative',
  },

  leftSide: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export { Header, styles };
