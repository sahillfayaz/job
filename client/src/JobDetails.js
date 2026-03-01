import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function JobDetails() {
    
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [file, setFile] = useState(null); // ← ADD THIS

  useEffect(() => {
    const fetchJob = async () => {
      const res = await axios.get('${process.env.REACT_APP_API_URL}/api/jobs');
      const foundJob = res.data.jobs.find(j => j._id === id);
      setJob(foundJob);
    };

    fetchJob();
  }, [id]);

  const applyJob = async () => {
    try {

      if (!file) {
        alert("Please upload your resume (PDF)");
        return;
      }

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("resume", file); // ← SEND FILE

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/applications/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Application submitted successfully 🎉");

    } catch (error) {
  if (error.response && error.response.data.message) {
    alert(error.response.data.message);
  } else {
    alert("Application failed");
  }
}
  }

  if (!job) return <p>Loading...</p>;

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p>{job.description}</p>

      {localStorage.getItem("token") ? (
        localStorage.getItem("role") === "candidate" ? (
          <>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ marginTop: "15px" }}
            />

            <button
              className="apply-btn"
              onClick={applyJob}
              style={{ marginTop: "15px" }}
            >
              Apply Now
            </button>
          </>
        ) : (
          <p style={{ marginTop: "15px", color: "gray" }}>
            Employers cannot apply to jobs.
          </p>
        )
      ) : (
        <p style={{ marginTop: "15px", color: "red" }}>
          Please login as candidate to apply.
        </p>
      )}

    </div>
  );
}

export default JobDetails;
