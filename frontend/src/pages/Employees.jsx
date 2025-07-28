import React, { useState, useEffect } from "react";
import { FiMoreVertical, FiX, FiSearch } from "react-icons/fi";
import { employeeAPI } from "../services/api";
import styles from "../css/Employee.module.css";
import CustomDropdown from "../components/CustomDropdown";
import { toast } from "react-toastify";

const positions = ["Intern", "Full Time", "Senior", "Junior", "Team Lead"];

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, [positionFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (positionFilter) params.position = positionFilter;
      const response = await employeeAPI.getAll(params);
      
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    setIsEditModalOpen(true); // Open modal with employee details
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEmployee(null); // Clear current employee on close
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (currentEmployee && currentEmployee.id) {
      try {
        await employeeAPI.update(currentEmployee.id, currentEmployee);
        fetchEmployees();
        closeEditModal();
        toast("Employee updated successfully")
      } catch (error) {
        console.error("Error updating employee:", error);
        toast("Error updating employee. Please try again.");
      }
    }
  };
  function formatDateToInputValue(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("/");

    if (parts.length !== 3) return "";

    const day = parts[0];
    const month = parts[1];
    let year = parts[2];

    if (year.length === 2) {
      year = parseInt(year) < 50 ? "20" + year : "19" + year;
    }

    
    return `${year}-${month}-${day}`; // 
  }



  const handleDropdownAction = async (action, employeeId) => {
    setOpenDropdownId(null); // Close dropdown after action
    
    if (action === "Edit Employee") {
      const employeeToEdit = employees.find((emp) => emp.id === employeeId);
      
      if (employeeToEdit) {
        openEditModal(employeeToEdit); // Open modal for editing
      }
    }
    if (action === "Delete Employee") {
      try {
        await employeeAPI.delete(employeeId);
        toast("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast ("Error deleting employee. Please try again.");
      }
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition =
      !positionFilter || employee.position === positionFilter;

    return matchesSearch && matchesPosition;
  });

  if (loading) {
    return (
      <div className={styles.employeecontainer}>
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
    <div className={styles.employeecontainer}>
      <div className={styles.employeeheader}>
        <div className={styles.employeefilters}>
          <div className={styles.filtergroup}>
            
            <CustomDropdown
              statuses={positions}
              selected={positionFilter}
              setSelected={setPositionFilter}
              placeholder="Position"
            />
          </div>
        </div>
        <div className={styles.employeeactions}>
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

      <div className={styles.employeetablecontainer}>
        <table className={styles.employeetable}>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.id} className="employee-row">
                <td>
                  <img
                    src={e.profile}
                    alt="Profile"
                    className={styles.employeeavatar}
                  />
                </td>
                <td className={styles.employeename}>{e.name}</td>
                <td className={styles.email}>{e.email}</td>
                <td className={styles.phone}>{e.phone}</td>
                <td className={styles.position}>{e.position}</td>
                <td className={styles.department}>{e.department}</td>
                <td className={styles.doj}>{e.joinDate}</td>
                <td className={styles.actioncolumn}>
                  <button
                    className={styles.actionbtn}
                    onClick={(event) => toggleDropdown(e.id, event)}
                  >
                    <FiMoreVertical />
                  </button>
                  {openDropdownId === e.id && (
                    <div className={styles.dropdownmenu}>
                      <button
                        onClick={() =>
                          handleDropdownAction("Edit Employee", e.id)
                        }
                        className={styles.dropdownitem}
                      >
                        Edit Employee
                      </button>
                      <button
                        className={`${styles.dropdownitem} ${styles.deletebtn}`}
                        onClick={() =>
                          handleDropdownAction("Delete Employee", e.id)
                        }
                      >
                        Delete Employee
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && currentEmployee && (
        <div className={styles.modaloverlay}>
          <div className={styles.modalcontainer}>
            <div className={styles.modalheader}>
              <h3>Edit Employee Details</h3>
              <button onClick={closeEditModal}>
                <FiX size={24} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateEmployeeSubmit}
              className={styles.modalform}
            >
              <div className={styles.inputgroup}>
                <label htmlFor="name">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={currentEmployee.name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  name="email"
                  value={currentEmployee.email}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="phone">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={currentEmployee.phone}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.customDropdown}>
                <CustomDropdown
                  statuses={positions}
                  selected={currentEmployee.position || ""}
                  setSelected={(value) =>
                    handleEditInputChange({
                      target: { name: "position", value },
                    })
                  }
                  placeholder="Position"
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="department">Department*</label>
                <input
                  type="text"
                  name="department"
                  value={currentEmployee.department}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.inputgroup}>
                <label htmlFor="doj">Date of Joining*</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formatDateToInputValue(currentEmployee.joinDate) || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formfooter}>
                <button type="submit">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
