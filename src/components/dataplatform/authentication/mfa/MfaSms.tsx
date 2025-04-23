import { useState } from "react";
import { Button } from "../../../ui/button";
import DataPlatformApi from "../../../../services/dataplatform/api/DataPlatformApi";
import { Phone, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../../ui/input";
import { FormLoginWithMFA } from "../../../../models/dataplatform/Authentication";
import { useAuthStore } from "../../../../stores/dataplatform/authStore";

type MFASmsProps = {
    loginInfo: any
};

const MFASms: React.FC<MFASmsProps> = ({ loginInfo }) => {
    const [state, setState] = useState<string>("start")
    const [loading, setLoading] = useState<boolean>(false)
    const [code, setCode] = useState<string>("")
    const [canBeResend, setCanBeResend] = useState<boolean>(false)

    const sendMFA = async () => {
        setLoading(true)
        try {
            await DataPlatformApi.sendMFA('sms', loginInfo.token)
            setState('sent')
            setCanBeResend(false)
            setTimeout(() => {
                setCanBeResend(true)
            }, 15000)
        } catch (err: any) {
            toast("Connection error", {
                className: "mfasms-toast-error",
                description: err.response?.data?.message || "An error just occurred"
            })
        }
        setLoading(false)
    }

    const validateMfa = async () => {
        setLoading(true)
        try {
            const loginResponse = await DataPlatformApi.loginMFA('sms', { otp: code } as FormLoginWithMFA, loginInfo.token);
            const session = await DataPlatformApi.checkSession(loginResponse.data.token)
            useAuthStore.getState().setSession(session.data)
        } catch (err: any) {
            toast("Connection error", {
                className: "mfasms-toast-error",
                description: err.response?.data?.message || "An error just occurred"
            })
        }
        setLoading(false)
    };

    if (state === 'start') {
        return (
            <>
                <Button id="mfasms-send-btn" disabled={loading} onClick={() => sendMFA()}>
                    {loading && <Loader2 className="w-6 h-6 animate-spin text-gray-500" />}
                    {!loading && <Phone className="w-6 h-6 text-gray-500" />}
                    Send Sms
                </Button>
            </>
        )
    }

    if (state === 'sent') {
        return (
            <>
                <p>
                    Enter the code you received by sms
                    <br />
                    <Button id="mfasms-resend-btn" disabled={!canBeResend} onClick={() => {
                        setState('start')
                        sendMFA()
                    }}>
                        <Phone className="w-6 h-6 text-gray-500" />
                        Resend MFA code
                    </Button>
                </p>
                <Input id="mfasms-code-input" placeholder="XXXXXX" onChange={(event) => {
                    setCode(event.target.value)
                }} />
                <Button id="mfasms-submit-btn" disabled={loading} onClick={() => {
                    validateMfa()
                }}>
                    {loading && <Loader2 className="w-6 h-6 animate-spin text-gray-500" />}
                    {!loading && <Check className="w-6 h-6 text-gray-500" />}
                    Sign in
                </Button>
            </>
        )
    }
};

export default MFASms;