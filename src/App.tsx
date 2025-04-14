import {Navigate, Route, Routes} from 'react-router-dom';
import AppLayout from "./layout/AppLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import QuestionForm from "./pages/question/QuestionForm.tsx";
import QuestionTableWrapper from "@pages/question/QuestionTableWrapper.tsx";
import Game from "@pages/quiz/Game.tsx";
import GuestLayout from "@layout/GuestLayout.tsx";
import Login from "@pages/Login.tsx";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import GameTableWrapper from "@pages/quiz/GameTableWrapper.tsx";
import GameUserJoin from "@pages/quiz/GameUserJoin.tsx";
import {Context, createContext, useEffect, useState} from "react";
import {User} from "@services/Types.ts";
import {getUser} from "@services/Api.ts";

interface AuthContextType {
    user: User|undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
) as Context<AuthContextType>;

const App = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const queryClient = new QueryClient();

    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        getUser()
            .then((response) => {
                setUser(response);
            })
            .catch(() => {});
    });


    return (
        <>
            <AuthenticatedTemplate>
                {activeAccount ? (
                    <AuthContext.Provider value={{ user }}>
                        <QueryClientProvider client={queryClient}>
                            <Routes>
                                <Route element={<AppLayout />}>
                                    <Route path="/dashboard" element={<Dashboard/>} />
                                    <Route path="/question/form" element={<QuestionForm/>} />
                                    <Route path="/question/form/:uuid" element={<QuestionForm/>} />
                                    <Route path="/questions" element={<QuestionTableWrapper/>} />
                                    <Route path="/games" element={<GameTableWrapper/>} />
                                    <Route path="/game/:uuid" element={<Game/>} />
                                    <Route path="/game" element={<Game/>} />

                                    <Route path="/" element={<Navigate to={'/dashboard'} />} />
                                    <Route path="*" element={<Navigate to={'/dashboard'} />} />
                                    <Route path="/join-game/:uuid" element={<GameUserJoin/>} />
                                </Route>
                            </Routes>
                        </QueryClientProvider>
                    </AuthContext.Provider>
                ) : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Routes>
                    <Route element={<GuestLayout />}>
                        <Route element={<Login />} path={"/login"} />
                        <Route path="/" element={<Navigate to={'/login'} />} />
                        <Route path="*" element={<Navigate to={'/login'} />} />
                    </Route>
                </Routes>
            </UnauthenticatedTemplate>
        </>
    );
};

// function App() {
//
//     const queryClient = new QueryClient();
//
//   return (
//
//       <QueryClientProvider client={queryClient}>
//           <Routes>
//               <Route element={<GuestLayout />}>
//                   <Route element={<Login />} path={"/login"} />
//               </Route>
//             <Route element={<AppLayout />}>
//                 <Route path="/dashboard" element={<Dashboard/>} />
//                 <Route path="/question/form" element={<QuestionForm/>} />
//                 <Route path="/question/form/:uuid" element={<QuestionForm/>} />
//                 <Route path="/questions" element={<QuestionTableWrapper/>} />
//                 <Route path="/game/:uuid" element={<Game/>} />
//                 <Route path="/game" element={<Game/>} />
//
//                 <Route path="/" element={<Navigate to={'/dashboard'} />} />
//                 <Route path="*" element={<Navigate to={'/dashboard'} />} />
//             </Route>
//           </Routes>
//       </QueryClientProvider>
//   )
// }

export default App
