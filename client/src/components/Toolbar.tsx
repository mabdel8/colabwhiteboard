import React from 'react';
import './Toolbar.css';

const Toolbar: React.FC = () => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <button>Pen</button>
        <button>Eraser</button>
      </div>
    </div>
  );
};

export default Toolbar; 