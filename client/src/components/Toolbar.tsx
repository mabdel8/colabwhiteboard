import React from 'react';
import { FaPencilAlt, FaEraser } from 'react-icons/fa';
import './Toolbar.css';

interface ToolbarProps {
  setTool: (tool: 'pen' | 'eraser') => void;
  setColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  lineWidth: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ setTool, setColor, setLineWidth, lineWidth }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <button onClick={() => setTool('pen')} title="Pen">
          <FaPencilAlt />
        </button>
        <button onClick={() => setTool('eraser')} title="Eraser">
          <FaEraser />
        </button>
      </div>
      <div className="toolbar-section">
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          title="Color Picker"
        />
      </div>
      <div className="toolbar-section">
        <label htmlFor="lineWidth">Brush Size</label>
        <input
          type="range"
          id="lineWidth"
          min="1"
          max="50"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />
        <span>{lineWidth}</span>
      </div>
    </div>
  );
};

export default Toolbar; 