import { useState } from 'react';

/**
 * DateInput — clean date picker with validation.
 */
export default function DateInput({ onDateSelect }) {
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError('');

    if (!value) return;

    const selectedDate = new Date(value + 'T00:00:00');

    if (selectedDate > new Date()) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    if (selectedDate.getFullYear() < 1900) {
      setError('Please enter a date after 1900.');
      return;
    }

    onDateSelect(selectedDate);
  };

  return (
    <div className="date-input-container">
      <label htmlFor="dob-picker" className="date-label">
        Select Your Date of Birth
      </label>
      <div className="input-wrapper">
        <input
          type="date"
          id="dob-picker"
          className="date-picker"
          value={inputValue}
          max={today}
          min="1900-01-01"
          onChange={handleChange}
          aria-describedby="dob-error"
        />
      </div>
      {error && (
        <p id="dob-error" className="date-error" role="alert">
          {error}
        </p>
      )}
      <p className="date-hint">
        The day of your birth determines which parent carries the stronger legacy
      </p>
    </div>
  );
}
