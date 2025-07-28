import React, { useState } from "react";
import styles from '../css/CustomDropdown.module.css'
import {
  FiMoreVertical,
  FiUploadCloud,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiSearch,
} from "react-icons/fi";
const CustomDropdown = ({
  statuses,
  selected,
  setSelected,
  placeholder,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
    if (onChange) onChange(value); //  Call parent’s handler
  };

  const handleClear = () => {
    setSelected(""); // or null, depending on your logic
    setIsOpen(false);
    if (onChange) onChange(""); // optional: clear in parent too
  };

  return (
    <div className={styles.dropdowncontainer}>
      <div
        className={styles.dropdownheader}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected || placeholder}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {isOpen && (
        <ul className={styles.dropdownlist}>
          {statuses.map((status) => (
            <li
              key={status}
              onClick={() => handleSelect(status)}
              className={styles.dropdownoption}
            >
              {status}
            </li>
          ))}
          <li className={styles.clearoption} onClick={handleClear}>
            Clear
          </li>
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown
