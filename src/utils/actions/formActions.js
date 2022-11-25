import {validateEmail, validatePassword, validateString, validateWithConstraints} from '../validationConstraints';

export const validateInput = (inputId, inputValue) => {
    if (inputId === "firstName" || inputId === "lastName") {
        return validateString(inputId, inputValue)
    } else if (inputId === "email") {
        return validateEmail(inputId, inputValue)
    } else if (inputId === "password") {
        return validatePassword(inputId, inputValue)
    }
}

export const validate = (value, constraints) => {
    return validateWithConstraints(value, constraints)
}