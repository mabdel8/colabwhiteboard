import React from 'react';
import './Toolbar.css';

type Tool = 'pen' | 'eraser';

interface ToolbarProps {
  setTool: (tool: Tool) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ setTool }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <button onClick={() => setTool('pen')}>Pen</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
      </div>
    </div>
  );
};

export default Toolbar; 