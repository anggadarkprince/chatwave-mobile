import React from 'react';
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  PlusCircleIcon, PlusIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';

export const HeroIcon = ({name, ...rest}) => {
  if (name === 'plus-circle') {
    return <PlusCircleIcon {...rest} />;
  }
  if (name === 'plus') {
    return <PlusIcon {...rest} />;
  }
  if (name === 'pencil-square') {
    return <PencilSquareIcon {...rest} />;
  }
  if (name === 'x-mark') {
    return <XMarkIcon {...rest} />;
  }
  if (name === 'cog-6-tooth') {
    return <Cog6ToothIcon {...rest} />;
  }
  if (name === 'chevron-down') {
    return <ChevronDownIcon {...rest} />;
  }
};
