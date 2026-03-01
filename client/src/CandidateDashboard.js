import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await axios.get(
        '${process.env.REACT_APP_API_URL}/api/applications',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setApplications(res.data);
    };

    fetchApplications();
  }, [token]);

  return (
    <div className="dashboard">
      <h2>My Applications</h2>

      <div className="job-container">
  {applications.length === 0 ? (
    <p style={{ fontSize: "18px", marginTop: "20px" }}>
      You have not applied to any jobs yet.
    </p>
  ) : (
    applications.map(app => (
      <div key={app._id} className="job-card">
        <h3>{app.job.title}</h3>
        <p>Company: {app.job.company}</p>
        <p>Status: {app.status}</p>
      </div>
    ))
  )}
</div>

    </div>
  );
}

export default CandidateDashboard;
