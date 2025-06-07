import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Toolbar from './components/Toolbar';

const socket = io('http://localhost:3001');

type Tool = 'pen' | 'eraser';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const [tool, setTool] = useState<Tool>('pen');

  useEffect(() => {
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
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;

    socket.on('drawing', onDrawingEvent);
  }, []);

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
    if (!drawing.current) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;

    if (tool === 'eraser') {
      contextRef.current.strokeStyle = 'white';
      contextRef.current.lineWidth = 20;
    } else {
      contextRef.current.strokeStyle = 'black';
      contextRef.current.lineWidth = 5;
    }

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    socket.emit('drawing', {
      x0: offsetX,
      y0: offsetY,
      x1: offsetX,
      y1: offsetY,
      color: contextRef.current.strokeStyle,
      lineWidth: contextRef.current.lineWidth,
    });
  };

  const onDrawingEvent = (data: { x0: number, y0: number, x1: number, y1: number, color: string, lineWidth: number }) => {
    const { x0, y0, x1, y1, color, lineWidth } = data;
    if (!contextRef.current) return;
    const originalStrokeStyle = contextRef.current.strokeStyle;
    const originalLineWidth = contextRef.current.lineWidth;
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = lineWidth;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0);
    contextRef.current.lineTo(x1, y1);
    contextRef.current.stroke();
    contextRef.current.closePath();
    contextRef.current.strokeStyle = originalStrokeStyle;
    contextRef.current.lineWidth = originalLineWidth;
  };

  return (
    <div>
      <Toolbar setTool={setTool} />
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
