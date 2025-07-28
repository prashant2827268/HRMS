
import React, { useState, useEffect } from "react";
import { FiMoreVertical, FiSearch } from "react-icons/fi";
import { attendanceAPI } from "../services/api";
import styles from "../css/Attendance.module.css";
import CustomDropdown from "../components/CustomDropdown";


const statuses = ["Present", "Absent"];

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [statusFilter]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await attendanceAPI.getAll(params);
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const toggleStatusDropdown = (id) => {
    setOpenStatusDropdownId(openStatusDropdownId === id ? null : id);
  };

  const handleDropdownAction = (action, attendanceId) => {
    console.log(`${action} for attendance ID: ${attendanceId}`);
    setOpenDropdownId(null);
  };

  const handleStatusChange = async (attendanceId, newStatus) => {
    try {
      await attendanceAPI.update(attendanceId, { status: newStatus });
      fetchAttendance(); // Refresh the data
      setOpenStatusDropdownId(null);
    } catch (error) {
      console.error("Error updating attendance status:", error);
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch = record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.task?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className={styles.attendancecontainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.attendancecontainer}>
      <div className={styles.attendanceheader}>
        <div className={styles.attendancefilters}>
          <div className={styles.filtergroup}>
           
            <CustomDropdown
              statuses={statuses}
              selected={statusFilter}
              setSelected={setStatusFilter}
              placeholder="Status"
            />
          </div>
        </div>
        <div className={styles.attendanceactions}>
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
        </div>
      </div>

      <div className={styles.attendancetablecontainer}>
        <table className={styles.attendancetable}>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((record) => (
              <tr key={record.id} className="attendance-row">
                <td>
                  <img
                    src={record.profile}
                    alt="Profile"
                    className={styles.attendanceavatar}
                  />
                </td>
                <td className={styles.employeename}>{record.name}</td>
                <td className={styles.position}>{record.position}</td>
                <td className={styles.department}>{record.department}</td>
                <td className={styles.task}>{record.task}</td>
                <td className={styles.statuscell}>
                  <div className={styles.statuscontainer}>
                    <button
                      className={`${styles["statusbtn"]} ${
                        styles[`statusbtn${record.status}`.toLowerCase()]
                      }`}
                      onClick={() => toggleStatusDropdown(record.id)}
                    >
                      {record.status}
                      <svg
                        className={styles.statusarrow}
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
                    {openStatusDropdownId === record.id && (
                      <div className={styles.statusdropdown}>
                        {statuses.map((status) => (
                          <button
                            key={status}
                            className={`${styles["statusoption"]} ${
                              styles[`statusoption${status}`.toLowerCase()]
                            }`}
                            onClick={() =>
                              handleStatusChange(record.id, status)
                            }
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className={styles.actioncolumn}>
                  <button
                    className={styles.actionbtn}
                    onClick={() => toggleDropdown(record.id)}
                  >
                    <FiMoreVertical />
                  </button>
                  {openDropdownId === record.id && (
                    <div className={styles.dropdownmenu}>
                      <button
                        onClick={() =>
                          handleDropdownAction("Edit Attendance", record.id)
                        }
                        className={styles.dropdownitem}
                      >
                        Edit Attendance
                      </button>
                      <button
                        className={`${styles.dropdownitem} ${styles.deletebtn}`}
                        onClick={() =>
                          handleDropdownAction("Delete Attendance", record.id)
                        }
                      >
                        Delete Attendance
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;