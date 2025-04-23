import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/dataplatform/authStore";
import { useEffect } from "react";
import { Toaster } from "sonner";

function LayoutDisconnected() {
  const session = useAuthStore((state) => state.session);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  if (session) {
    return null;
  }

  return (
    <div className="w-full">
      <Outlet />

      <Toaster />
    </div>
  );
}

export default LayoutDisconnected