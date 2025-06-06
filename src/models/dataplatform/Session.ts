export default interface Session {
    acl: any;
    acls: string;
    authentication_type: string;
    civility: string;
    configuration: any;
    dataplant_id: string;
    email: string;
    family_name: string;
    firstname: string;
    fprn: string;
    given_name: string;
    groups: string[];
    intercom: any;
    lastname: string;
    login: string;
    name: string;
    organization_id: string;
    password_expiration: Date;
    password_renew: boolean;
    phone: string;
    role: any[];
    scope: string;
    sub: string;
    tags: any[];
    token: string;
    token_duration: number;
    token_expire: Date;
    token_refreshed_at: Date;
    uid: string;
    user: string;
}