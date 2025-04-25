import Button from "@components/Button.tsx";
import {useMsal} from "@azure/msal-react";
import {loginRequest, msalConfig} from "../auth/AuthConfig.ts";

const Login: React.FC = () => {


    const { instance } = useMsal();

    const handleLoginRedirect = () => {
        const config = msalConfig;
        console.log(config);

        instance.loginRedirect({
                ...loginRequest,
                prompt: "consent",
                scopes: ["api://iu-quiz-be-dev/access_as_user"],
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            <Button variant={'primary'} className={'w-fit h-fit'} onClick={handleLoginRedirect}>Login</Button>
        </div>
    );
}

export default Login;