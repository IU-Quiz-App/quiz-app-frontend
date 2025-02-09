import {Navigate, Route, Routes} from 'react-router-dom';
import AppLayout from "./layout/AppLayout.tsx";
import Question from "./pages/quiz/Question.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import QuestionForm from "./pages/question/QuestionForm.tsx";
import QuestionTableWrapper from "@pages/question/QuestionTableWrapper.tsx";

function App() {

  return (
      <Routes>
        <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/quiz/question" element={<Question/>} />
            <Route path="/question/form" element={<QuestionForm/>} />
            <Route path="/question/form/:uuid" element={<QuestionForm/>} />
            <Route path="/questions" element={<QuestionTableWrapper/>} />

            <Route path="/" element={<Navigate to={'/dashboard'} />} />
            <Route path="*" element={<Navigate to={'/dashboard'} />} />
        </Route>
      </Routes>
  )
}

export default App
