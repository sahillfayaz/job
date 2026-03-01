import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import JobDetails from "./JobDetails";
import Login from "./Login";
import Register from "./Register";
import Jobs from "./Jobs";
import EmployerDashboard from "./EmployerDashboard";
import CandidateDashboard from "./CandidateDashboard";






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />





      </Routes>
    </Router>
  );
}

export default App;
