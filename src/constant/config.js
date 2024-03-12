export const emailValidRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
export const passwordValidRegExp =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;

export const uppercaseRegExp = /(?=.*?[A-Z])/;
export const lowercaseRegExp = /(?=.*?[a-z])/;
export const digitsRegExp = /(?=.*?[0-9])/;
export const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
export const minLengthRegExp = /.{8,}/;
