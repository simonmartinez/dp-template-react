import ApplicationPreference from "../../../models/dataplatform/ApplicationPreference";
import MFAAuthenticator from "./mfa/MfaAuthenticator";
import MFAEmail from "./mfa/MfaEmail";
import MFASms from "./mfa/MfaSms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { AlertTriangle } from "lucide-react";


type MFAProps = {
    applicationPreference: ApplicationPreference
    loginInfo: any
};

const MFA: React.FC<MFAProps> = ({ applicationPreference, loginInfo }) => {
    return (
        <>
            <Tabs id="mfa-tabs" defaultValue={applicationPreference.mfa.email ? 'email' : (applicationPreference.mfa.sms ? 'sms' : 'authenticator')} className="w-[400px]">
                <TabsList>
                    {
                        applicationPreference.mfa.email && <TabsTrigger value="email" id="mfa-tabs-email">Email</TabsTrigger>
                    }
                    {
                        applicationPreference.mfa.sms && <TabsTrigger value="sms" id="mfa-tabs-sms">SMS</TabsTrigger>
                    }
                    {
                        applicationPreference.mfa.authenticator && <TabsTrigger value="authenticator" id="mfa-tabs-auth">Authenticator</TabsTrigger>
                    }
                </TabsList>

                {
                    applicationPreference.mfa.email && <TabsContent value="email"><MFAEmail loginInfo={loginInfo} /></TabsContent>
                }
                {
                    applicationPreference.mfa.sms && <TabsContent value="sms">
                        {
                            !!loginInfo.phone && <MFASms loginInfo={loginInfo} />
                        }
                        {
                            !loginInfo.phone && <Alert variant="destructive" className="max-w-sm text-center bg-destructive">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>User account has no phone number define
                                </AlertDescription>
                            </Alert>
                        }

                    </TabsContent>
                }
                {
                    applicationPreference.mfa.authenticator && <TabsContent value="authenticator">
                        <MFAAuthenticator loginInfo={loginInfo} />
                    </TabsContent>
                }

            </Tabs>
        </>
    )
};

export default MFA;