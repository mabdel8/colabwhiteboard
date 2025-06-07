import React from 'react';
import './Toolbar.css';

type Tool = 'pen' | 'eraser';

interface ToolbarProps {
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ setTool, setColor }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <button onClick={() => setTool('pen')}>Pen</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
      </div>
      <div className="toolbar-section">
        <label htmlFor="color-picker">Color:</label>
        <input id="color-picker" type="color" onChange={(e) => setColor(e.target.value)} />
      </div>
    </div>
  );
};

export default Toolbar; 