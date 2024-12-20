import {Navigate, Route, Routes} from 'react-router-dom';
import AppLayout from "./layout/AppLayout.tsx";
import Question from "./pages/Question.tsx";
import Dashboard from "./pages/Dashboard.tsx";

function App() {

  return (
      <Routes>
        <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/question" element={<Question/>} />
            <Route path="/" element={<Navigate to={'/dashboard'} />} />
            <Route path="*" element={<Navigate to={'/dashboard'} />} />
        </Route>
      </Routes>
  )
}

export default App
