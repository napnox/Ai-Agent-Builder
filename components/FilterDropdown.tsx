import React, { useState, useRef, useEffect } from 'react';
import { SingleFilterCategory } from '../types';
import { ICONS } from '../constants';

interface FilterDropdownProps {
  label: string;
  category: SingleFilterCategory;
  options: string[];
  value: string;
  onChange: (category: SingleFilterCategory, value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, category, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100);
    } else {
        setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(category, option === 'Any' ? '' : option);
    setIsOpen(false);
  };
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue = value || 'Any';

  return (
    <div className="flex-1 min-w-[150px] relative" ref={wrapperRef}>
      <label htmlFor={category} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <button
        type="button"
        id={category}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border text-gray-900 text-sm rounded-lg focus-custom flex justify-between items-center p-2.5 transition ${isOpen ? 'border-gray-400' : 'border-gray-300'}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate pr-2">{displayValue}</span>
        <ICONS.chevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search ${label}...`}
              className="w-full bg-white px-2 py-1.5 text-sm border border-gray-300 rounded-md focus-custom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="py-1 max-h-52 overflow-y-auto custom-scrollbar" role="listbox">
            {filteredOptions.length > 0 ? filteredOptions.map(option => (
              <li 
                key={option}
                className={`px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer ${option === displayValue ? 'custom-selected-bg font-semibold' : ''}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option === displayValue}
              >
                {option}
              </li>
            )) : <li className="px-3 py-2 text-sm text-gray-500 text-center">No options found.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;