export interface AuthMode {
    directory: string;
    hidden: boolean;
    icon: string;
    name: string;
    provider: string;
    subtype: string;
    text: string;
    type: string;
    visible: boolean;
    _id: string;
}

export default interface ApplicationPreference {
    auth_mode: AuthMode[];
    description: string;
    message: string;
    name: string;
    color?: string;
    mfa: {
        authenticator: boolean;
        email: boolean;
        enforce: boolean;
        sms: boolean;
    };
    password_policies: {
        nb_cchar: string;
        nb_char: string;
        nb_int: string;
        nb_schar: string;
        password_expire: string;
        password_renewal_by_users: boolean;
        password_value: string;
    };
    status: number;
    success: boolean;
    url: string;
    version: string;
}