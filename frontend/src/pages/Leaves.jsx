import React, { useState, useEffect } from "react";
import {
  FiMoreVertical,
  FiSearch,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCalendar,
  FiUpload,
} from "react-icons/fi";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { leaveAPI } from "../services/api";
import styles from "../css/Leaves.module.css";
import { employeeAPI } from "../services/api";
import { toast } from "react-toastify";


const statuses = ["Pending", "Approved", "Rejected"];
const BASE_URL = "http://localhost:5001";

function Leaves() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isAddLeaveModalOpen, setIsAddLeaveModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newLeaveData, setNewLeaveData] = useState({
    employeeName: "",
    designation: "",
    leaveDate: "",
    documents: null, // Changed to null for file handling
    reason: "",
  });

  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  // Inside your component:
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.dropdownContainer}`)) {
        setShowEmployeeDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {};

      const response = await employeeAPI.getAll(params);

      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch leaves data
  useEffect(() => {
    fetchLeaves();
    fetchApprovedLeaves();
  }, [statusFilter]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await leaveAPI.getAll(params);
      setAppliedLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedLeaves = async () => {
    try {
      const response = await leaveAPI.getApproved();
      setApprovedLeaves(response.data);
    } catch (error) {
      console.error("Error fetching approved leaves:", error);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const toggleStatusDropdown = (id) => {
    setOpenStatusDropdownId(openStatusDropdownId === id ? null : id);
  };

  const handleDropdownAction = (action, leaveId) => {
    console.log(`${action} for leave ID: ${leaveId}`);
    setOpenDropdownId(null);
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await leaveAPI.update(leaveId, { status: newStatus });
      fetchLeaves(); // Refresh the data
      setOpenStatusDropdownId(null);
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const handleCalendarChange = (date) => {
    setCurrentDate(date);
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const openAddLeaveModal = () => {
    setIsAddLeaveModalOpen(true);
  };

  const closeAddLeaveModal = () => {
    setIsAddLeaveModalOpen(false);
    setNewLeaveData({
      employeeName: "",
      designation: "",
      leaveDate: "",
      documents: null,
      reason: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documents" && files) {
      setNewLeaveData((prev) => ({
        ...prev,
        [name]: files[0], // Store the file object
      }));
    } else {
      setNewLeaveData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveLeave = async (e) => {
    e.preventDefault();
    // Validation
    if (
      !newLeaveData.employeeName ||
      !newLeaveData.designation ||
      !newLeaveData.leaveDate ||
      !newLeaveData.reason
    ) {
      alert("Please fill all required fields");
      return;
    }
    if (
      newLeaveData.documents &&
      !newLeaveData.documents.type.startsWith("application/")
    ) {
      alert("Please upload a valid document file (e.g., PDF)");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("employeeName", newLeaveData.employeeName);
      formData.append("designation", newLeaveData.designation);
      formData.append("leaveDate", newLeaveData.leaveDate);
      formData.append("reason", newLeaveData.reason);
      if (newLeaveData.documents) {
        formData.append("documents", newLeaveData.documents); // Append file object
      }

      await leaveAPI.create(formData);
      fetchLeaves(); // Refresh the data
      fetchApprovedLeaves(); // Refresh approved leaves
      closeAddLeaveModal();
    } catch (error) {
      console.error("Error creating leave:", error);
      toast("Error creating leave. Please try again.");
    }
  };

  // Filter applied leaves based on search
  const filteredAppliedLeaves = appliedLeaves.filter((leave) => {
    if (!searchTerm) return true;
    return (
      leave.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get calendar days with events
  const getCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const hasEvent = approvedLeaves.some((leave) => {
        return leave.date && leave.date.includes(format(day, "d"));
      });

      return {
        date: day,
        hasEvent: hasEvent,
        eventCount: hasEvent ? 1 : 0,
      };
    });
  };

  const calendarDays = getCalendarDays();

  if (loading) {
    return (
      <div className={styles.leavesContainer}>
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
    <div className={styles.leavesContainer}>
      <div className={styles.leavesContent}>
        {/* Applied Leaves Section */}
        <div className={styles.appliedLeavesSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Applied Leaves</h3>
            <div className={styles.filterGroup}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.appliedLeavesTableContainer}>
            <table className={styles.appliedLeavesTable}>
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Docs</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppliedLeaves.map((leave) => (
                  <tr key={leave.id} className={styles.leaveRow}>
                    <td>
                      <img
                        src={leave.profile}
                        alt="Profile"
                        className={styles.leaveAvatar}
                      />
                    </td>
                    <td className={styles.employeeInfo}>
                      <div className={styles.employeeName}>{leave.name}</div>
                      <div className={styles.employeePosition}>
                        {leave.position}
                      </div>
                    </td>
                    <td className={styles.leaveDate}>{leave.date}</td>
                    <td className={styles.leaveReason}>{leave.reason}</td>
                    <td className={styles.statusCell}>
                      <div className={styles.statusContainer}>
                        <button
                          className={`${styles.statusBtn} ${
                            styles[leave.status.toLowerCase()]
                          }`}
                          onClick={() => toggleStatusDropdown(leave.id)}
                        >
                          {leave.status}
                          <svg
                            className={styles.statusArrow}
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="m3 4.5 3 3 3-3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {openStatusDropdownId === leave.id && (
                          <div className={styles.statusDropdown}>
                            {statuses.map((status) => (
                              <button
                                key={status}
                                className={`${styles.statusOption} ${
                                  styles[status.toLowerCase()]
                                }`}
                                onClick={() =>
                                  handleStatusChange(leave.id, status)
                                }
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={styles.docsCell}>
                      {leave.docs ? (
                        <a
                          href={
                            leave.docs.startsWith("http")
                              ? leave.docs
                              : `${BASE_URL}/${leave.docs}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className={styles.downloadLink}
                        >
                          Download 📄
                        </a>
                      ) : (
                        <span>No File</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Calendar Section */}
        <div className={styles.leaveCalendarSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Leave Calendar</h3>
            <div className={styles.calendarActions}>
              <div className={styles.searchContainer}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Q Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <button
                className={styles.addLeaveBtn}
                onClick={openAddLeaveModal}
              >
                <FiPlus />
                Add Leave
              </button>
            </div>
          </div>

          <div className={styles.calendarContainer}>
            <div className={styles.calendarNavigation}>
              <button
                onClick={() => navigateMonth("prev")}
                className={styles.navBtn}
              >
                <FiChevronLeft />
              </button>
              <span className={styles.currentMonth}>
                {format(currentDate, "MMMM, yyyy")}
              </span>
              <button
                onClick={() => navigateMonth("next")}
                className={styles.navBtn}
              >
                <FiChevronRight />
              </button>
            </div>

            <div className={styles.customCalendar}>
              <div className={styles.calendarHeader}>
                <div className={styles.dayHeader}>S</div>
                <div className={styles.dayHeader}>M</div>
                <div className={styles.dayHeader}>T</div>
                <div className={styles.dayHeader}>W</div>
                <div className={styles.dayHeader}>T</div>
                <div className={styles.dayHeader}>F</div>
                <div className={styles.dayHeader}>S</div>
              </div>
              <div className={styles.calendarGrid}>
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`${styles.calendarDay} ${
                      day.hasEvent ? styles.hasEvent : ""
                    }`}
                    onClick={() => handleCalendarChange(day.date)}
                  >
                    <span className={styles.dayNumber}>
                      {format(day.date, "d")}
                    </span>
                    {day.hasEvent && (
                      <div className={styles.eventIndicator}>
                        <span className={styles.eventCount}>
                          {day.eventCount}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.approvedLeavesSection}>
            <h4 className={styles.approvedLeavesTitle}>Approved Leaves</h4>
            <div className={styles.approvedLeavesList}>
              {approvedLeaves.map((leave) => (
                <div key={leave.id} className={styles.approvedLeaveItem}>
                  <img
                    src={leave.profile}
                    alt="Profile"
                    className={styles.approvedLeaveAvatar}
                  />
                  <div className={styles.approvedLeaveInfo}>
                    <div className={styles.approvedLeaveName}>{leave.name}</div>
                    <div className={styles.approvedLeavePosition}>
                      {leave.position}
                    </div>
                  </div>
                  <div className={styles.approvedLeaveDate}>{leave.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Leave Modal */}
      {isAddLeaveModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.addLeaveModal}>
            <div className={styles.modalHeader}>
              <h3>Add New Leave</h3>
              <button onClick={closeAddLeaveModal} className={styles.closeBtn}>
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveLeave} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="employeeName">Search Employee Name</label>
                <div className={styles.dropdownContainer}>
                  <div
                    className={styles.dropdownInput}
                    onClick={() => setShowEmployeeDropdown((prev) => !prev)}
                  >
                    <FiSearch className={styles.inputSearchIcon} />
                    <input
                      type="text"
                      name="employeeName"
                      value={newLeaveData.employeeName}
                      onChange={(e) => {
                        handleInputChange(e);
                        setShowEmployeeDropdown(true);
                      }}
                      placeholder="Search employee..."
                      autoComplete="off"
                      required
                    />
                  </div>

                  {showEmployeeDropdown && (
                    <ul className={styles.dropdownList}>
                      {employees
                        .filter((emp) =>
                          emp.name
                            .toLowerCase()
                            .includes(newLeaveData.employeeName.toLowerCase())
                        )
                        .map((emp) => (
                          <li
                            key={emp._id}
                            className={styles.dropdownItem}
                            onClick={() => {
                              setNewLeaveData((prev) => ({
                                ...prev,
                                employeeName: emp.name,
                                designation: emp.designation,
                              }));
                              setShowEmployeeDropdown(false);
                            }}
                          >
                            <strong>{emp.name}</strong> — {emp.designation}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="designation">Designation*</label>
                <input
                  type="text"
                  name="designation"
                  value={newLeaveData.designation}
                  onChange={handleInputChange}
                  placeholder="Enter designation"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="leaveDate">Leave Date*</label>
                <div className={styles.dateInputContainer}>
                  <input
                    type="date" // Changed to date input
                    name="leaveDate"
                    value={newLeaveData.leaveDate}
                    onChange={handleInputChange}
                    required
                  />
                  <FiCalendar className={styles.calendarIcon} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="documents">Documents</label>
                <div className={styles.uploadInputContainer}>
                  <input
                    type="file" // Changed to file input
                    name="documents"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx" // Restrict to common document types
                  />
                  {newLeaveData.documents && (
                    <span className={styles.fileName}>
                      {newLeaveData.documents.name}
                    </span>
                  )}
                </div>
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="reason">Reason*</label>
                <textarea
                  name="reason"
                  value={newLeaveData.reason}
                  onChange={handleInputChange}
                  placeholder="Enter reason for leave"
                  rows="3"
                  required
                />
              </div>

              <div className={styles.formFooter}>
                <button type="submit" className={styles.saveBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaves;
