import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, onChange }) => {
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
        // Focus the input when the dropdown opens
        setTimeout(() => inputRef.current?.focus(), 100);
    } else {
        setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onChange(newSelectedOptions);
  };
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 min-w-[150px] relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border text-gray-900 text-sm rounded-lg focus-custom flex justify-between items-center p-2.5 transition ${isOpen ? 'border-gray-400' : 'border-gray-300'}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate pr-2">
          {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Any'}
        </span>
        <ICONS.chevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tools..."
              className="w-full bg-white px-2 py-1.5 text-sm border border-gray-300 rounded-md focus-custom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="py-1 max-h-52 overflow-y-auto custom-scrollbar" role="listbox">
            {filteredOptions.length > 0 ? filteredOptions.map(option => (
              <li 
                key={option} 
                className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center" 
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={selectedOptions.includes(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  readOnly
                  tabIndex={-1}
                  className="w-4 h-4 custom-checkbox bg-gray-100 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 mr-3 pointer-events-none"
                />
                {option}
              </li>
            )) : <li className="px-3 py-2 text-sm text-gray-500 text-center">No tools found.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;