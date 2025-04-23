import ApplicationPreference from "../../models/dataplatform/ApplicationPreference";
import AuthenticationList from "../../components/dataplatform/authentication/AuthenticationList";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../stores/dataplatform/authStore";
import DataPlatformApi from "../../services/dataplatform/api/DataPlatformApi";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function Login() {
  const [searchParams] = useSearchParams();

  const { isLoading: loadingApplicationPreference, error: errorApplicationPreference, data: applicationPreference } = useQuery({
    queryKey: [],
    queryFn: () =>
      DataPlatformApi.getApplicationPreferences().then((data: any) => {
        return data.data as ApplicationPreference;
      })
  })

  const token = searchParams.get('token');
  const { data: dataToken, error: errorToken, isLoading: loadingToken } = useQuery({
    queryKey: ['session', token],
    enabled: !!token,
    retry: false,
    queryFn: () => {
      return DataPlatformApi.checkSession(token as string).then((response) => response.data);
    },
  });

  useEffect(() => {
    if (dataToken) {
      useAuthStore.getState().setSession(dataToken);
    }
  }, [dataToken]);

  if (loadingApplicationPreference || loadingToken) {
    return <div className="container">
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    </div>
  }

  if (errorApplicationPreference) {
    return <div className="container">
      <div className="flex items-center justify-center h-screen">
        An error occurred: {errorApplicationPreference.message}
      </div>
    </div>
  }

  if (errorToken) {
    return <div className="container">
      <div className="flex items-center justify-center h-screen">
        An error occurred: {errorToken.message}
      </div>
    </div>
  }

  if (applicationPreference)
    return (
      <div className="container">
        <h1 className="text-3xl font-bold">
          {applicationPreference.name}
        </h1>

        <AuthenticationList applicationPreference={applicationPreference} />
      </div>
    )
}

export default Login
