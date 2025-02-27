import {Navigate, Route, Routes} from 'react-router-dom';
import AppLayout from "./layout/AppLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import QuestionForm from "./pages/question/QuestionForm.tsx";
import QuestionTableWrapper from "@pages/question/QuestionTableWrapper.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Game from "@pages/quiz/Game.tsx";

function App() {

    const queryClient = new QueryClient();

  return (

      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
  )
}

export default App
