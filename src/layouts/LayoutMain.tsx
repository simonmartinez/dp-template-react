import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/dataplatform/AuthContext";
import Menu from "../components/Menu";
import { DictionariesProvider } from "../contexts/dataplatform/DictionariesContext";
import { Toaster } from "sonner";
import PasswordChange from "../components/dataplatform/authentication/PasswordChange";

function LayoutMain() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/authentication/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  if (!!session.password_renew) {
    return (
      <div className="w-full">
        <PasswordChange />
        <Toaster />
      </div>
    )
  }

  return (
    <DictionariesProvider>
      <div className="w-full">
        <Menu />
        <Outlet />
        <Toaster />
      </div>
    </DictionariesProvider>
  );
}

export default LayoutMain