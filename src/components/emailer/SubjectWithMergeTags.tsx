import React, { useState } from 'react';
import TextInput from '@commercetools-uikit/text-input';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { mergeTags } from './mergeTags';

interface SubjectWithMergeTagsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SubjectWithMergeTags: React.FC<SubjectWithMergeTagsProps> = ({
  value,
  onChange,
  placeholder = 'Enter email subject',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInsertMergeTag = (tag: string) => {
    // Insert the merge tag at the current cursor position or at the end
    onChange(value + ' ' + tag);
    setIsDropdownOpen(false);
  };

  return (
    <Spacings.Stack scale="xs">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <TextInput
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />
        </div>
        <SecondaryButton
          label="Insert Tag"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
      </div>
      
      {isDropdownOpen && (
        <div 
          style={{ 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            maxHeight: '300px', 
            overflowY: 'auto',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {Object.entries(mergeTags).map(([category, tags]) => (
            <div key={category}>
              <div 
                style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #ddd'
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              {Object.entries(tags).map(([key, tag]) => (
                <div
                  key={`${category}.${key}`}
                  onClick={() => handleInsertMergeTag(tag)}
                  style={{ 
                    padding: '8px 12px 8px 24px', 
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  {key}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </Spacings.Stack>
  );
};

export default SubjectWithMergeTags; 