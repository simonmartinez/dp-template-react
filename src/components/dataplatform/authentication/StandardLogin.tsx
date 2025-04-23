import React, { useState } from "react";
import ApplicationPreference, { AuthMode } from "../../../models/dataplatform/ApplicationPreference";
import { toast } from "sonner"
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import DataPlatformApi from "../../../services/dataplatform/api/DataPlatformApi";
import { useAuthStore } from "../../../stores/dataplatform/authStore";
import MFA from "./MFA";
import { FormLogin } from "../../../models/dataplatform/Authentication";
import { Loader2, User2 } from "lucide-react";
import ForgotPassword from "./ForgotPassword";
import { useTranslation } from "react-i18next";

type StandardLoginProps = {
    authMode: AuthMode;
    applicationPreference: ApplicationPreference
    onClose?: () => void
};

const StandardLogin: React.FC<StandardLoginProps> = ({ applicationPreference, authMode, onClose }) => {
    const { t } = useTranslation();
    const [form, setForm] = useState<FormLogin>({
        login: "",
        password: "",
        auth_mode_id: authMode._id,
    });

    const [forgotPassword, setForgotPassword] = useState(false);
    const [loginInfo, setLoginInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const color = applicationPreference.color || "#00CCF9";


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const loginAction = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!form.login || !form.password) return;

        setLoading(true);
        try {
            const loginResponse = await DataPlatformApi.login(form);
            setLoginInfo(loginResponse.data);
            if (!applicationPreference.mfa?.enforce) {
                afterLoginSuccess(loginResponse.data);
            }
        } catch (err: any) {
            toast("Connection error", {
                className: "login-toast-error",
                description: err.response?.data?.message || "An error just occurred"
            })
        } finally {
            setLoading(false);
        }
    };

    const afterLoginSuccess = (login: any) => {
        DataPlatformApi.checkSession(login.token).then((data) => {
            useAuthStore.getState().setSession(data.data);
        })
    };

    if (forgotPassword) {
        return <ForgotPassword onClose={() => setForgotPassword(false)} applicationPreference={applicationPreference} />;
    }

    if (applicationPreference.mfa?.enforce && loginInfo?.acr === "aal1") {
        return (
            <MFA applicationPreference={applicationPreference} loginInfo={loginInfo} />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg w-96">
            <form id="login-form" className="w-full space-y-4" onSubmit={loginAction}>
                <label className="text-sm font-medium" style={{ color }}>
                    {t('authentication.username')}
                </label>
                <Input
                    type="text"
                    name="login"
                    value={form.login}
                    onChange={handleInputChange}
                    placeholder={t('authentication.username_placeholder')}
                    className="w-full"
                />

                <label className="text-sm font-medium" style={{ color }}>
                    {t('authentication.password')}
                </label>
                <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder={t('authentication.password_placeholder')}
                    className="w-full"
                />

                <div className="flex justify-between items-center mt-4">
                    <Button id="login-form-submit-btn" type="submit" className="w-full" style={{ backgroundColor: color }} disabled={loading}>
                        {loading && <Loader2 className="w-6 h-6 animate-spin text-gray-500" />}
                        {!loading && <User2 className="w-6 h-6 text-gray-500" />}
                        {t('authentication.sign_in')}
                    </Button>
                </div>

                <div className="flex justify-between text-sm mt-2">
                    <Button id="login-form-forgotpwd-btn" variant={'link'} onClick={() => setForgotPassword(true)}>
                        {t('authentication.forgot_password')}
                    </Button>
                    {onClose && (
                        <Button id="login-form-back-btn" variant={'link'} onClick={onClose}>
                            {t('authentication.back')}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );

};

export default StandardLogin;
