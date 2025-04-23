import { useState } from "react";
import ApplicationPreference from "../../../models/dataplatform/ApplicationPreference";
import { FormForgotPassword } from "../../../models/dataplatform/Authentication";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Loader2, Mail } from "lucide-react";
import DataPlatformApi from "../../../services/dataplatform/api/DataPlatformApi";
import { toast } from "sonner";

type ForgotPasswordProps = {
    onClose: () => void
    applicationPreference: ApplicationPreference
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ applicationPreference, onClose }) => {
    const color = applicationPreference.color || "#00CCF9";

    const [form, setForm] = useState<FormForgotPassword>({
        email: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const [loading, setLoading] = useState(false);

    const send = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!form.email) return;

        setLoading(true);
        try {
            await DataPlatformApi.passwordRenew(form);
            toast("Password renew", {
                className: "forgotpwd-toast-success",
                description: "You will receive an e-mail notification to reset your password"
            })
            onClose()
        } catch (err: any) {
            toast("Password renew", {
                className: "forgotpwd-toast-error",
                description: err.response?.data?.message || "An error just occurred"
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form id="forgotpwd-form" className="w-full space-y-4" onSubmit={send}>
                <label className="text-sm font-medium" style={{ color }}>
                    Username
                </label>
                <Input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    className="w-full"
                />

                <div className="flex justify-between items-center mt-4">
                    <Button id="forgotpwd-form-submit-btn" type="submit" className="w-full" style={{ backgroundColor: color }} disabled={loading}>
                        {loading && <Loader2 className="w-6 h-6 animate-spin text-gray-500" />}
                        {!loading && <Mail className="w-6 h-6 text-gray-500" />}
                        Send
                    </Button>
                </div>
            </form>

            <Button id="forgotpwd-form-back-btn" variant={'link'} onClick={onClose}>
                Back
            </Button>
        </>
    )
};

export default ForgotPassword;