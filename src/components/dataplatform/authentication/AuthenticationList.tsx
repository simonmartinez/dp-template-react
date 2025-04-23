import React, { useState } from "react";
import ApplicationPreference, { AuthMode } from "../../../models/dataplatform/ApplicationPreference";
import { loginOauth } from "../../../services/dataplatform/api/DataPlatformApi";
import { Loader2 } from "lucide-react";
import StandardLogin from './StandardLogin'


type AuthenticationListProps = {
    applicationPreference: ApplicationPreference
};

const AuthenticationList: React.FC<AuthenticationListProps> = ({ applicationPreference }) => {
    const [useStandardLogin, setUseStandardLogin] = useState(false)
    const [authMode, setAuthMode] = useState<AuthMode | null>(null)

    const authModes = (applicationPreference.auth_mode ?? []).filter(auth => (typeof auth.visible === 'undefined' || auth.visible) && auth.type !== 'mfa') as AuthMode[]

    const selectAuthmode = async (authMode: AuthMode): Promise<void> => {
        const authorizationCode = ['king_id', 'openam_authorization_code', 'authorization_code']
        if (authorizationCode.indexOf(authMode.type) !== -1) {
            setLoading(true)
            let redirectUri = encodeURIComponent(window.location.origin + window.location.pathname + '?token=')
            await loginOauth(authMode, redirectUri)
        } else {
            setAuthMode(authMode)
            setUseStandardLogin(true)
        }
    }
    const [loading, setLoading] = useState<boolean>(false);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
    }

    if (useStandardLogin && authMode)
        return <StandardLogin applicationPreference={applicationPreference} authMode={authMode} onClose={() => setAuthMode(null)} />
    return (
        <div className='p-2'>
            <p>{applicationPreference.message || 'Choose an authentication method below to login to this app.'}</p>
            <ul id="authlist" className="mt-6 w-64 bg-white rounded-lg shadow-md p-4 space-y-2">
                {authModes.map((mode) => {
                    let slugName = mode.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return <li id={`authlist-${slugName}`} className="p-2 border-b last:border-none cursor-pointer" key={mode._id} onClick={() => selectAuthmode(mode)}>
                        <img src={"data:image/jpeg;base64, " + mode.icon} alt={mode.name} width="40px" />
                        {mode.name}
                    </li>
                })}
            </ul>
        </div>
    );
};

export default AuthenticationList;
