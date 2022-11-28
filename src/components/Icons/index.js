import React from "react";
import {PencilSquareIcon, PlusCircleIcon, XMarkIcon} from "react-native-heroicons/outline";

export const HeroIcon = ({name, ...rest}) => {
    if (name === 'plus-circle') {
        return <PlusCircleIcon {...rest} />
    }
    if (name === 'pencil-square') {
        return <PencilSquareIcon {...rest} />
    }
    if (name === 'x-mark') {
        return <XMarkIcon {...rest} />
    }
};