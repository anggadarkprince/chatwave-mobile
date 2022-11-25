export const reducer = (state, action) => {
    const {isValid, inputId, value} = action

    const updatedValues = {
        ...state.inputValues,
        [inputId]: value
    };

    const updatedValidationErrors = {
        ...state.inputErrors,
        [inputId]: isValid
    };

    let updatedFormIsValid = true;

    for (const key in updatedValidationErrors) {
        if (updatedValidationErrors.hasOwnProperty(key)) {
            if (updatedValidationErrors[key] !== undefined) {
                updatedFormIsValid = false;
                break;
            }
        }
    }

    return {
        inputValues: updatedValues,
        inputErrors: updatedValidationErrors,
        formIsValid: updatedFormIsValid
    };
}