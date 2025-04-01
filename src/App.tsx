import {Navigate, Route, Routes} from 'react-router-dom';
import AppLayout from "./layout/AppLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import QuestionForm from "./pages/question/QuestionForm.tsx";
import QuestionTableWrapper from "@pages/question/QuestionTableWrapper.tsx";
import Game from "@pages/quiz/Game.tsx";
import GuestLayout from "@layout/GuestLayout.tsx";
import Login from "@pages/Login.tsx";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";

const App = () => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance,
     * that tells you what msal is currently doing. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    return (
        <div>
            <AuthenticatedTemplate>
                {activeAccount ? (
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<Dashboard/>} />
                            <Route path="/question/form" element={<QuestionForm/>} />
                            <Route path="/question/form/:uuid" element={<QuestionForm/>} />
                            <Route path="/questions" element={<QuestionTableWrapper/>} />
                            <Route path="/game/:uuid" element={<Game/>} />
                            <Route path="/game" element={<Game/>} />

                            <Route path="/" element={<Navigate to={'/dashboard'} />} />
                            <Route path="*" element={<Navigate to={'/dashboard'} />} />
                        </Route>
                    </Routes>
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
        </div>
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
