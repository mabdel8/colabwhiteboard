import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Toolbar from './components/Toolbar';
import './JoinRoom.css';

const socket = io('http://localhost:3001');

type Tool = 'pen' | 'eraser';

interface DrawingData {
  roomId: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  lineWidth: number;
}

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomInput, setRoomInput] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<string>('black');
  const [lineWidth, setLineWidth] = useState<number>(5);

  const onDrawingEvent = (data: DrawingData) => {
    if (!contextRef.current) return;
    const { x0, y0, x1, y1, color: strokeColor, lineWidth: strokeWidth } = data;
    const originalStrokeStyle = contextRef.current.strokeStyle;
    const originalLineWidth = contextRef.current.lineWidth;
    contextRef.current.strokeStyle = strokeColor;
    contextRef.current.lineWidth = strokeWidth;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0);
    contextRef.current.lineTo(x1, y1);
    contextRef.current.stroke();
    contextRef.current.closePath();
    contextRef.current.strokeStyle = originalStrokeStyle;
    contextRef.current.lineWidth = originalLineWidth;
  };

  useEffect(() => {
    if (!roomId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    socket.on('initial-drawings', (drawings: DrawingData[]) => {
      if (!contextRef.current) return;
      drawings.forEach((data) => onDrawingEvent(data));
    });

    socket.on('drawing', onDrawingEvent);

    return () => {
      socket.off('initial-drawings');
      socket.off('drawing');
    };
  }, [roomId]);

  useEffect(() => {
    if (!contextRef.current) return;

    if (tool === 'eraser') {
      contextRef.current.strokeStyle = 'white';
      contextRef.current.lineWidth = 20;
    } else {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [tool, color, lineWidth]);

  const handleJoinRoom = () => {
    if (roomInput.trim()) {
      setRoomId(roomInput.trim());
      socket.emit('join-room', roomInput.trim());
    }
  };

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    drawing.current = true;
  };

  const finishDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    drawing.current = false;
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !roomId) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    const drawingData: DrawingData = {
      roomId,
      x0: offsetX,
      y0: offsetY,
      x1: offsetX,
      y1: offsetY,
      color: contextRef.current.strokeStyle as string,
      lineWidth: contextRef.current.lineWidth,
    };
    socket.emit('drawing', drawingData);
  };

  if (!roomId) {
    return (
      <div className="join-room-container">
        <div className="join-room-card">
          <h1>Collaborative Whiteboard</h1>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
          />
          <button onClick={handleJoinRoom}>Join</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toolbar
        setTool={setTool}
        setColor={setColor}
        setLineWidth={setLineWidth}
        lineWidth={lineWidth}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
      />
    </div>
  );
}

export default App;
