import { useState } from "react";
import { FormLoginWithMFA } from "../../../../models/dataplatform/Authentication";
import DataPlatformApi from "../../../../services/dataplatform/api/DataPlatformApi";
import { useAuthStore } from "../../../../stores/dataplatform/authStore";
import { toast } from "sonner";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Check, Loader2 } from "lucide-react";

type MFAAuthenticatorProps = {
    loginInfo: any
};

const MFAAuthenticator: React.FC<MFAAuthenticatorProps> = ({ loginInfo }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [code, setCode] = useState<string>("")

    const validateMfa = async () => {
        setLoading(true)
        try {
            const loginResponse = await DataPlatformApi.loginMFA('authenticator', { otp: code } as FormLoginWithMFA, loginInfo.token);
            const session = await DataPlatformApi.checkSession(loginResponse.data.token)
            useAuthStore.getState().setSession(session.data)
        } catch (err: any) {
            toast("Connection error", {
                className: "mfaauth-toast-error",
                description: err.response?.data?.message || "An error just occurred"
            })
        }
        setLoading(false)
    };

    return (
        <>
            <p>
                Enter the code from the two-factor app on your mobile device. If this is your first time connecting to this app, or if you've lost your authenticator device, please contact your administrator to regenerate an authenticator key code.
            </p>
            <Input id="mfaauth-code-input" placeholder="XXXXXX" onChange={(event) => {
                setCode(event.target.value)
            }} />
            <Button id="mfaauth-submit-btn" disabled={loading} onClick={() => {
                validateMfa()
            }}>
                {loading && <Loader2 className="w-6 h-6 animate-spin text-gray-500" />}
                {!loading && <Check className="w-6 h-6 text-gray-500" />}
                Sign in
            </Button>
        </>
    )
};

export default MFAAuthenticator;