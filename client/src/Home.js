import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./App.css";

function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`);
    setJobs(res.data.jobs);
  };

  const featuredJobs = jobs.slice(0, 3);

  return (
    <div>
      <nav className="navbar">
        <h1>JobBoard</h1>
        <div>

    {localStorage.getItem("token") &&
 localStorage.getItem("role") === "candidate" && (
  <Link to="/candidate-dashboard">
    <button className="btn">My Applications</button>
  </Link>
)}


  {localStorage.getItem("token") &&
   localStorage.getItem("role") === "employer" && (
    <Link to="/employer-dashboard">
      <button className="btn">Dashboard</button>
    </Link>
  )}

  {localStorage.getItem("token") ? (
    <button
      className="btn primary"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.reload();
      }}
    >
      Logout
    </button>
  ) : (
    <>
      <Link to="/login">
        <button className="btn">Login</button>
      </Link>

      <Link to="/register">
        <button className="btn primary">Register</button>
      </Link>
    </>
  )}

</div>

      </nav>

      <div className="hero">
        <h2>Welcome to JobBoard</h2>
        <p>Explore top opportunities and build your career</p>
      </div>

      <div className="job-container">
        {featuredJobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p className="company">{job.company}</p>
            <p>{job.location}</p>
            <p className="salary">{job.salary}</p>

            <Link to={`/job/${job._id}`}>
              <button className="apply-btn">View Details</button>
            </Link>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Link to="/jobs">
          <button className="btn primary">View All Jobs</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
