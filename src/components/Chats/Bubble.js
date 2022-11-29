import React, {useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Colors from '../Utilities/Colors';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import {v4 as uuidv4} from 'uuid';
import Clipboard from '@react-native-clipboard/clipboard';
import {DocumentDuplicateIcon, StarIcon} from 'react-native-heroicons/outline';
import {StarIcon as StarFilledIcon} from 'react-native-heroicons/solid';
import {starMessage} from '../../utils/actions/chatActions';
import {useSelector} from 'react-redux';

function formatAmPm(dateString) {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}

const MenuItem = props => {
  return (
    <MenuOption
      onSelect={props.onSelect}
      customStyles={{optionWrapper: {borderRadius: 7, overflow: 'hidden'}}}>
      <View style={styles.menuItemContainer}>
        <Text style={[styles.menuText, props.textStyle]}>{props.text}</Text>
        {props.icon}
      </View>
    </MenuOption>
  );
};

export const Bubble = props => {
  const {text, type, messageId, userId, chatId, date} = props;

  const starredMessages = useSelector(
    state => state.messages.starredMessages[chatId] ?? {},
  );

  const bubbleStyle = {...styles.container};
  const textStyle = {...styles.text};
  const wrapperStyle = {...styles.wrapperStyle};

  const menuRef = useRef(null);
  const id = useRef(uuidv4());

  let Container = View;
  let isUserMessage = false;
  const dateString = formatAmPm(date);

  switch (type) {
    case 'system':
      textStyle.color = '#65644A';
      bubbleStyle.backgroundColor = '#fffdd9';
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      break;
    case 'error':
      textStyle.color = Colors.white;
      bubbleStyle.backgroundColor = Colors.danger;
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      break;
    case 'myMessage':
      wrapperStyle.justifyContent = 'flex-end';
      bubbleStyle.backgroundColor = '#E7FED6';
      bubbleStyle.maxWidth = '90%';
      Container = TouchableOpacity;
      isUserMessage = true;
      break;
    case 'theirMessage':
      wrapperStyle.justifyContent = 'flex-start';
      bubbleStyle.maxWidth = '90%';
      Container = TouchableOpacity;
      isUserMessage = true;
      break;
    default:
      break;
  }

  const copyToClipboard = async copyText => {
    Clipboard.setString(copyText);
  };

  const openContextMenu = () => {
    menuRef.current.props.ctx.menuActions.openMenu(id.current);
  };

  const isStarred = isUserMessage && starredMessages[messageId] !== undefined;
  const Star = isStarred ? StarFilledIcon : StarIcon;
  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={openContextMenu}
        activeOpacity={0.8}
        style={[styles.menuContainer, wrapperStyle]}>
        <View style={bubbleStyle}>
          <Text style={textStyle}>{text}</Text>

          <View style={styles.timeContainer}>
            {isStarred && <StarFilledIcon size={15} color={Colors.primary} />}
            <Text style={[styles.time, isStarred && {marginLeft: 5}]}>{dateString}</Text>
          </View>

          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions
              customStyles={{
                optionsContainer: {borderRadius: 7, paddingVertical: 8},
              }}>
              <MenuItem
                text="Copy to clipboard"
                icon={<DocumentDuplicateIcon size={20} color={Colors.dark} />}
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text={`${isStarred ? 'Unstar' : 'Star'} message`}
                icon={
                  <Star
                    size={20}
                    color={isStarred ? Colors.primary : Colors.dark}
                  />
                }
                onSelect={() => starMessage(messageId, chatId, userId)}
                textStyle={{color: isStarred ? Colors.primary : Colors.dark}}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: Colors.fade,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark,
  },
  menuContainer: {
    width: '100%',
  },
  menuItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.dark,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  time: {
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.3,
    color: Colors.gray,
    fontSize: 12,
  },
});
