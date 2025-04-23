import { useState } from "react";
import { Loader2, Lock, User2 } from "lucide-react";
import ApplicationPreference from "../../../models/dataplatform/ApplicationPreference";
import DataPlatformApi from "../../../services/dataplatform/api/DataPlatformApi";
import { Input } from "../../ui/input";
import { FormResetPassword } from "../../../models/dataplatform/Authentication";
import { Button } from "../../ui/button";
import zxcvbn from 'zxcvbn'
import { toast } from "sonner";
import { useAuth } from "../../../contexts/dataplatform/AuthContext";
import Session from "../../../models/dataplatform/Session";
import { useQuery } from "@tanstack/react-query";

const PasswordChange = () => {
  const { session, setSession } = useAuth();

  const [loadingForm, setLoadingForm] = useState(false);

  const [form, setForm] = useState<FormResetPassword>({
    oldPassword: "",
    password: "",
    confirmPassword: ""
  });

  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  const [oldPasswordMatchError, setOldPasswordMatchError] = useState<string | null>(null);

  const { isLoading: loadingApplicationPreference, error: errorApplicationPreference, data: applicationPreference } = useQuery({
    queryKey: [],
    queryFn: () =>
      DataPlatformApi.getApplicationPreferences().then((data: any) => {
        return data.data as ApplicationPreference;
      })
  })

  const color = applicationPreference?.color || "#00CCF9";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => {
      const updatedForm = { ...prev, [e.target.name]: e.target.value };

      if (updatedForm.password !== updatedForm.confirmPassword) {
        setPasswordMatchError("Confirm password doesn't match with password");
      } else {
        setPasswordMatchError(null);
      }

      if (e.target.name === "password") {
        const result = zxcvbn(updatedForm.password);
        setPasswordStrength(result.score === 4 ? "strong" : result.score === 3 ? "good" : result.score === 2 ? "weak" : "very weak");
        validatePassword(updatedForm.password);

        if (updatedForm.password === form.oldPassword) {
          setOldPasswordMatchError("New password cannot be the same as the old password");
        } else {
          setOldPasswordMatchError(null);
        }
      }
      if (e.target.name === "oldPassword") {
        if (form.password === updatedForm.oldPassword) {
          setOldPasswordMatchError("New password cannot be the same as the old password");
        } else {
          setOldPasswordMatchError(null);
        }
      }

      return updatedForm;
    });
  };

  const validatePassword = (password: string) => {
    if (!applicationPreference) return;

    const { nb_char, nb_schar, nb_int, nb_cchar } = applicationPreference.password_policies;

    if (password.length < Number(nb_char)) {
      setPasswordError(`Password must be at least ${nb_char} characters long.`);
    } else if ((password.match(/[A-Z]/) || []).length < Number(nb_cchar)) {
      setPasswordError(`Password must contain at least ${nb_cchar} uppercase letters.`);
    } else if ((password.match(/[0-9]/) || []).length < Number(nb_int)) {
      setPasswordError(`Password must contain at least ${nb_int} number(s).`);
    } else if ((password.match(/[^\w\s]/) || []).length < Number(nb_schar)) {
      setPasswordError(`Password must contain at least ${nb_schar} special character(s).`);
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (passwordError || passwordMatchError || oldPasswordMatchError) return;

    setLoadingForm(true);
    DataPlatformApi.passwordChange(form.password, form.oldPassword).then(() => {
      setSession({ ...session, ...{ password_renew: false } } as Session)
    }).catch((err: any) => {
      toast('An error occured', {
        className: "pwdchange-toast-error",
        description: err.response.data.message ?? 'An error just occured'
      })
    }).finally(() => {
      setLoadingForm(false);
    })
  };

  if (loadingApplicationPreference) {
    return <div className="container">
      <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
    </div>
  }

  if (errorApplicationPreference) {
    return <div className="container">
      An error occurred: {errorApplicationPreference.message}
    </div>
  }

  if (applicationPreference)
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg mt-4">
          <h1 className="text-3xl font-bold mb-4">Reset password</h1>

          <form id="pwdchange-form" className="w-full space-y-4" onSubmit={handleSubmit}>
            <label className="text-sm font-medium" style={{ color }}>
              Old password
            </label>
            <div className="flex">
              <Input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleInputChange}
                placeholder="Your old password"
                className="w-full"
              />
              <div style={{ width: "100px" }} />
            </div>

            <label className="text-sm font-medium" style={{ color }}>
              New password
            </label>
            <div className="flex">
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Your new password"
                className={`w-full ${(oldPasswordMatchError || passwordError) ? "ring-2 ring-red-500" : ""}`}
              />
              {(passwordStrength && !passwordError) ? (
                <div style={{ width: "100px" }} className={`text-sm text-center p-1 ${passwordStrength === "strong" ? "text-green-500" : passwordStrength === "good" ? "text-yellow-500" : "text-red-500"}`}>
                  <Lock className="inline mr-2" />{passwordStrength}
                </div>
              ) : <div style={{ width: "100px" }} />}
            </div>

            {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
            {oldPasswordMatchError && <div className="text-red-500 text-sm">{oldPasswordMatchError}</div>}

            <label className="text-sm font-medium" style={{ color }}>
              Confirm password
            </label>
            <div className="flex">
              <Input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full ${passwordMatchError ? "ring-2 ring-red-500" : ""}`}
              />
              <div style={{ width: "100px" }} />
            </div>
            {passwordMatchError && <div className="text-red-500 text-sm">{passwordMatchError}</div>}

            <div className="flex justify-between items-center mt-4">
              <Button id="pwdchange-form-submit-btn" type="submit" className="w-full" style={{ backgroundColor: color }} disabled={loadingForm || !!passwordError || !!passwordMatchError}>
                {loadingForm && <Loader2 className="w-6 h-6 animate-spin text-gray-500" />}
                {!loadingForm && <User2 className="w-6 h-6 text-gray-500" />}
                Change Password
              </Button>
            </div>
          </form>
        </div >
      </div >
    )
};

export default PasswordChange;
