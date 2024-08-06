import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function COAInput({ value, onChange, options }) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputValue) {
      const filter = options.filter(option =>
        option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.id.toString().includes(inputValue)
      );
      setFilteredOptions(filter);
      setShowDropdown(filter.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [inputValue, options]);

  const handleOptionSelect = (option) => {
    setInputValue(`${option.code} - ${option.name}`);
    onChange(option.id);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Form.Control
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        // onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && (
        <DropdownButton
          style={{ position: 'absolute', width: '100%', zIndex: 10 }}
          show
        >
          {filteredOptions.map(option => (
            <Dropdown.Item
              key={option.id}
              onClick={() => handleOptionSelect(option)}
            >
              {`${option.code} - ${option.name}`}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      )}
    </div>
  );
}

export default COAInput;
