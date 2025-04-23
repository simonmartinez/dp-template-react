import axios, { AxiosResponse } from 'axios'
import { getAuthToken } from '../../../stores/dataplatform/authStore'
import Session from '../../../models/dataplatform/Session';
import ApplicationPreference, { AuthMode } from '../../../models/dataplatform/ApplicationPreference';
import { QueryRequest } from '../../../models/dataplatform/Query';
import { FormForgotPassword, FormLogin, FormLoginWithMFA } from '../../../models/dataplatform/Authentication';
import sdk from '../sdk';

let appId: string = "";
let camApi: any = null;
let fApi: any = null;

const init = async () => {
    await sdk.getEnvs();
    appId = sdk.envs.IAM_URL.split('?app_id=')[1]

    camApi = axios.create({
        baseURL: sdk.envs.IAM_URL.split('?')[0],
        headers: {
            'Content-Type': 'application/json'
        }
    });

    fApi = axios.create({
        baseURL: sdk.envs.API_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    camApi.interceptors.request.use((config: any) => {
        if (config.headers.Authorization === undefined) {
            const token = getAuthToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config;
    }, (error: any) => {
        Promise.reject(error)
    })

    fApi.interceptors.request.use((config: any) => {
        if (!config.headers.Authorization) {
            const token = getAuthToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config;
    }, (error: any) => {
        Promise.reject(error)
    })
};
init();


export const loginOauth = async (authMode: AuthMode, redirectUri: string) => {
    await sdk.getEnvs();
    var url = sdk.envs.IAM_URL.split('?')[0] + '/login?app_id=' + appId + '&auth_mode_id=' + authMode._id + '&redirect_uri=' + redirectUri
    window.location.replace(url)
}

export const login = (form: FormLogin) => {
    return camApi.post(`/v4/login`, form, {
        headers: {
            Authorization: ''
        }
    })
}

export const passwordRenew = (form: FormForgotPassword) => {
    return camApi.post(`/v4/sendRenewRequest`, form, {
        headers: {
            Authorization: ''
        }
    })
}

export const loginMFA = (mfaType: string, form: FormLoginWithMFA, token: string) => {
    return camApi.post(`/v4/mfa/validate/${mfaType}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const sendMFA = (mfaType: string, token: string) => {
    return camApi.post(`/v4/mfa/send/${mfaType}?token=${token}`, {
        headers: {
            Authorization: ''
        }
    })
}

export const getApplicationPreferences = async (): Promise<AxiosResponse<ApplicationPreference>> => {
    return camApi.get(`/v1/applications/preferences?app_id=${appId}`, {
        headers: {
            Authorization: ''
        }
    })
}

export const checkSession = (token: string): Promise<AxiosResponse<Session>> => {
    return camApi.get(`/v4/checkSession?app_id=${appId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const passwordChange = (password: string, oldPassword: string): Promise<AxiosResponse<any>> => {
    return camApi.post(`/v4/passwordChange`, {
        password,
        oldpassword: oldPassword
    })
}

export const query = (query: QueryRequest): Promise<AxiosResponse<any>> => {
    return fApi.post(`/qb/query?app_id=${appId}`, query)
}

export default {
    loginOauth,
    getApplicationPreferences,
    checkSession,
    query,
    login,
    loginMFA,
    sendMFA,
    passwordRenew,
    passwordChange
}