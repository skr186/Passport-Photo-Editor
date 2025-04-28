import React from 'react';

const RangeInput = ({ min, max, step, defaultValue, value, onChange }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    defaultValue={defaultValue}
    value={value}
    onChange={onChange}
    style={{ width: '100%' }}
  />
);

export default RangeInput;