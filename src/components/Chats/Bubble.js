import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
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

const MenuItem = props => {
  return (
    <MenuOption onSelect={props.onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{props.text}</Text>
        {props.icon}
      </View>
    </MenuOption>
  );
};

export const Bubble = props => {
  const {text, type} = props;

  const bubbleStyle = {...styles.container};
  const textStyle = {...styles.text};
  const wrapperStyle = {...styles.wrapperStyle};

  const menuRef = useRef(null);
  const id = useRef(uuidv4());

  let Container = View;

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
      break;
    case 'theirMessage':
      wrapperStyle.justifyContent = 'flex-start';
      bubbleStyle.maxWidth = '90%';
      Container = TouchableOpacity;
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

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={openContextMenu}
        activeOpacity={0.8}
        style={[styles.menuContainer, wrapperStyle]}>
        <View style={bubbleStyle}>
          <Text style={textStyle}>{text}</Text>

          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem
                text="Copy to clipboard"
                icon={<DocumentDuplicateIcon size={20} color={Colors.dark} />}
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text="Star message"
                icon={<StarIcon size={20} color={Colors.dark} />}
                onSelect={() => copyToClipboard(text)}
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
    paddingVertical: 2,
  },
  menuText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.dark,
  },
});
