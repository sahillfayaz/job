import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./App.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`);
      setJobs(res.data.jobs);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="hero">
        <h2>Browse All Jobs</h2>
        <input
          type="text"
          placeholder="Search jobs..."
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="job-container">
        {filteredJobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p>{job.salary}</p>
            <Link to={`/job/${job._id}`}>
              <button className="apply-btn">View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
