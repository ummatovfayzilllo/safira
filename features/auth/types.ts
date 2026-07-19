enum verifyEnumType {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset_password',
}

export type registerDataType = {
  fullName: string;
  email: string;
  password: string;
};

export type verifyDataType = {
  email: string;
  code: string;
  type: verifyEnumType;
};

export type loginDataType = {
  email: string;
  password: string;
};

export type resetPasswordDataType = {
  email: string;
};

export type resetPasswordVerifyDataType = {
  email: string;
  code: string;
  newPassword: string;
};

export type verifiyDataType = verifyDataType;
