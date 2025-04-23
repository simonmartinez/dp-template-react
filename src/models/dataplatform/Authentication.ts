
export interface FormLogin {
    login: string;
    password: string;
    auth_mode_id: string;
}

export interface FormLoginWithMFA {
    otp: string;
}

export interface FormForgotPassword {
    email: string;
}

export interface FormResetPassword {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}