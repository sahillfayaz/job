import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./App.css";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: ""
  });

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/jobs/my`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/jobs`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: ""
      });

      fetchMyJobs();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Employer Dashboard</h2>

      <div className="post-job-card">
        <h3>Post New Job</h3>
        <form onSubmit={handleSubmit} className="job-form">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn primary">
            Post Job
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: "40px" }}>My Posted Jobs</h3>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="job-container">
          {jobs.map(job => (
            <div key={job._id} className="job-card">
              <h4>{job.title}</h4>
              <p>{job.company}</p>

              <Link to={`/employer/job/${job._id}`}>
                <button className="btn">View Applications</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;
