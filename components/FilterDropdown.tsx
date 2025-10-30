import React from 'react';
import { SingleFilterCategory } from '../types';

interface FilterDropdownProps {
  label: string;
  category: SingleFilterCategory;
  options: string[];
  value: string;
  onChange: (category: SingleFilterCategory, value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, category, options, value, onChange }) => {
  return (
    <div className="flex-1 min-w-[150px]">
      <label htmlFor={category} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <select
        id={category}
        name={category}
        value={value}
        onChange={(e) => onChange(category, e.target.value)}
        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition"
      >
        {options.map(option => (
          <option key={option} value={option === 'Any' ? '' : option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
