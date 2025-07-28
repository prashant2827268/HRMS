import React, { useState, useEffect } from "react";
import {
  FiMoreVertical,
  FiUploadCloud,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { candidateAPI } from "../services/api";
import styles from "../css/Candidates.module.css";
import { toast } from "react-toastify";
import CustomDropdown from "../components/CustomDropdown";
const statuses = ["New", "Selected", "Rejected"];
const positions = [
  "Senior Developer",
  "Human Resource Intern",
  "Full Time Designer",
  "Full Time Developer",
];



function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCandidateId, setEditCandidateId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCandidate, setNewCandidate] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    position: "",
    experience: "",
    resume: null,
    resumeName: "",
    declare: false,
  });

  useEffect(() => {
    fetchCandidates();
  }, [statusFilter, positionFilter]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (positionFilter) params.position = positionFilter;
      const response = await candidateAPI.getAll(params);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleCandidateToEmployee = async (e, candidate) => {
    const newStatus = e.target.value;

    try {
      await candidateAPI.update(candidate.id, { status: newStatus });
      console.log("-candidate", candidate);

      if (newStatus === "Selected") {
        const response = await candidateAPI.moveToEmployee(
          candidate.id,
          candidate
        );
        
        toast("Candidate moved to Employees.");
      }

      if (newStatus === "Rejected") {
        await candidateAPI.delete(candidate.id);
        toast("Candidate rejected and removed.");
      }
      await candidateAPI.delete(candidate.id);
      fetchCandidates();
    } catch (err) {
      console.error("Error handling status change:", err);
      alert("Failed to update status.");
    }
  };

  const handleDropdownAction = async (action, candidateId) => {
    console.log(`${action} for candidate ID: ${candidateId}`);
    setOpenDropdownId(null);

    if (action === "Delete Candidate") {
      try {
        await candidateAPI.delete(candidateId);
        fetchCandidates();
      } catch (error) {
        console.error("Error deleting candidate:", error);
        alert("Error deleting candidate. Please try again.");
      }
    } else if (action === "Edit Candidate") {
      const candidateToEdit = candidates.find((c) => c.id === candidateId);
      if (candidateToEdit) {
        setNewCandidate({
          fullName: candidateToEdit.name || "",
          emailAddress: candidateToEdit.email || "",
          phoneNumber: candidateToEdit.phone || "",
          position: candidateToEdit.position || "",
          experience: candidateToEdit.experience || "",
          resume: null,
          resumeName: "",
          declare: true,
        });
        setEditCandidateId(candidateId);
        setEditMode(true);
        setIsModalOpen(true);
      }
    }
  };

  const openModal = () => {
    setEditMode(false);
    setNewCandidate({
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
      position: "",
      experience: "",
      resume: null,
      resumeName: "",
      declare: false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setEditCandidateId(null);
    setNewCandidate({
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
      position: "",
      experience: "",
      resume: null,
      resumeName: "",
      declare: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setNewCandidate({ ...newCandidate, [name]: checked });
    } else if (type === "file") {
      setNewCandidate({
        ...newCandidate,
        resume: files[0],
        resumeName: files[0] ? files[0].name : "",
      });
    } else {
      setNewCandidate({ ...newCandidate, [name]: value });
    }
  };

  const handleRemoveResume = () => {
    setNewCandidate({
      ...newCandidate,
      resume: null,
      resumeName: "",
    });
  };

  const handleAddCandidateSubmit = async (e) => {
    e.preventDefault();
    if (!newCandidate.declare) {
      alert("Please accept the declaration");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", newCandidate.fullName);
      formData.append("emailAddress", newCandidate.emailAddress);
      formData.append("phoneNumber", newCandidate.phoneNumber);
      formData.append("position", newCandidate.position);
      formData.append("experience", newCandidate.experience);
      if (newCandidate.resume) {
        formData.append("resume", newCandidate.resume);
      }
      console.log("formdata", formData);
      await candidateAPI.create(formData);
      fetchCandidates();
      closeModal();
    } catch (error) {
      console.error("Error creating candidate:", error);
      toast("Error creating candidate. Please try again.");
    }
  };

  const handleEditCandidateSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("fullName", newCandidate.fullName);
      formData.append("emailAddress", newCandidate.emailAddress);
      formData.append("phoneNumber", newCandidate.phoneNumber);
      formData.append("position", newCandidate.position);
      formData.append("experience", newCandidate.experience);
      if (newCandidate.resume) {
        formData.append("resume", newCandidate.resume);
      }

      await candidateAPI.update(editCandidateId, formData);
      fetchCandidates();
      closeModal();
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Error updating candidate. Please try again.");
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className={styles.candidateContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.candidateContainer}>
      <div className={styles.candidateheader}>
        <div className={styles.candidatefilters}>
          <div className={styles.filtergroup}>
            <CustomDropdown
              statuses={statuses}
              selected={statusFilter}
              setSelected={setStatusFilter}
              placeholder="Status"
            />
          </div>
          <div className={styles.filtergroup}>
            <CustomDropdown
              statuses={positions}
              selected={positionFilter}
              setSelected={setPositionFilter}
              placeholder="Position"
            />
          </div>
        </div>
        <div className={styles.candidateactions}>
          <div className={styles.searchcontainer}>
            <FiSearch className={styles.searchicon} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchinput}
            />
          </div>
          <button className={styles.addcandidatebtn} onClick={openModal}>
            Add Candidate
          </button>
        </div>
      </div>

      <div className={styles.candidatetablecontainer}>
        <table className={styles.candidatestable}>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="candidate-row">
                <td>
                  <img
                    src={candidate.profile || "https://i.pravatar.cc/40?img=70"}
                    alt="Profile"
                    className="candidate-avatar"
                  />
                </td>
                <td className={styles.candidatename}>{candidate.name}</td>
                <td className={styles.email}>{candidate.email}</td>
                <td className={styles.phone}>{candidate.phone}</td>
                <td className={styles.position}>{candidate.position}</td>
                <td className={styles.experience}>{candidate.experience}</td>
                <td className={styles.statuscell}>
                  {/* <select
                    className={`${styles.statusselect} ${
                      styles[candidate.status.toLowerCase()]
                    }`}
                    value={candidate.status}
                    onChange={(e) => {
                      handleCandidateToEmployee(e, candidate);
                      console.log("Status changed to:", e.target.value);
                    }}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select> */}
                  <CustomDropdown
                    statuses={statuses}
                    selected={statusFilter}
                    setSelected={setStatusFilter}
                    placeholder="Status"
                    onChange={(value) =>
                      handleCandidateToEmployee(
                        { target: { value } },
                        candidate
                      )
                    } 
                  />
                </td>
                <td className={styles.actioncolumn}>
                  <button
                    className={styles.actionbtn}
                    onClick={() => toggleDropdown(candidate.id)}
                  >
                    <FiMoreVertical />
                  </button>
                  {openDropdownId === candidate.id && (
                    <div className={styles.dropdownmenu}>
                      <button
                        onClick={() =>
                          handleDropdownAction("Edit Candidate", candidate.id)
                        }
                        className={styles.dropdownitem}
                      >
                        Edit Candidate
                      </button>
                      <button
                        className={`${styles.dropdownitem} ${styles.deletebtn}`}
                        onClick={() =>
                          handleDropdownAction("Delete Candidate", candidate.id)
                        }
                      >
                        Delete Candidate
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modaloverlay}>
          <div className={styles.modalcontainer}>
            <div className={styles.modalheader}>
              <h3>{editMode ? "Edit Candidate" : "Add New Candidate"}</h3>
              <button onClick={closeModal}>
                <FiX size={24} />
              </button>
            </div>

            <form
              onSubmit={
                editMode ? handleEditCandidateSubmit : handleAddCandidateSubmit
              }
              className={styles.modalform}
            >
              <div className={styles.inputgroup}>
                <label htmlFor="fullName">Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  value={newCandidate.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="emailAddress">Email Address*</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={newCandidate.emailAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="phoneNumber">Phone Number*</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={newCandidate.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="position">Position*</label>
                <input
                  type="text"
                  name="position"
                  value={newCandidate.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="experience">Experience*</label>
                <input
                  type="number"
                  name="experience"
                  value={newCandidate.experience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="resume">Resume{!editMode ? "*" : ""}</label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx"
                  {...(editMode ? {} : { required: true })}
                />
                {newCandidate.resumeName && (
                  <div className={styles.resumename}>
                    <span>{newCandidate.resumeName}</span>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="remove-resume-btn"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
              </div>
              {!editMode && (
                <div className={styles.inputgroup + " " + styles.checkbox}>
                  <input
                    type="checkbox"
                    name="declare"
                    checked={newCandidate.declare}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="declare">
                    I declare that all the information provided is true and
                    accurate
                  </label>
                </div>
              )}
              <div className={styles.formfooter}>
                <button type="submit">
                  {editMode ? "Save Changes" : "Add Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Candidates;
