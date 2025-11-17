import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pen, Eraser, Type, Circle, Square, Undo, Redo, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { io, Socket } from 'socket.io-client';
import { config } from '../../config/env';

type Tool = 'pen' | 'eraser' | 'text' | 'circle' | 'square';
type DrawingMode = 'draw' | 'erase' | 'text' | 'shape';

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io(config.socketUrl, {
      transports: ['websocket'],
    });

    socketRef.current.on('whiteboard-draw', (data: any) => {
      drawOnCanvas(data);
    });

    socketRef.current.on('whiteboard-clear', () => {
      clearCanvas();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const drawOnCanvas = (data: {
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    color: string;
    lineWidth: number;
  }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.lineWidth;
    ctx.beginPath();
    ctx.moveTo(data.prevX, data.prevY);
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'pen' || currentTool === 'eraser') {
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || !canvasRef.current) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = currentTool === 'eraser' ? lineWidth * 3 : lineWidth;
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || (currentTool !== 'pen' && currentTool !== 'eraser')) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevX = ctx.lineTo ? (ctx as any).lastX || x : x;
    const prevY = ctx.lineTo ? (ctx as any).lastY || y : y;

    ctx.lineTo(x, y);
    ctx.stroke();

    // Emit drawing data via Socket.IO
    if (socketRef.current) {
      socketRef.current.emit('whiteboard-draw', {
        x,
        y,
        prevX,
        prevY,
        color: currentTool === 'eraser' ? '#ffffff' : color,
        lineWidth: currentTool === 'eraser' ? lineWidth * 3 : lineWidth,
      });
    }

    (ctx as any).lastX = x;
    (ctx as any).lastY = y;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      (ctx as any).lastX = undefined;
      (ctx as any).lastY = undefined;
    }
  };

  const handleClear = () => {
    clearCanvas();
    if (socketRef.current) {
      socketRef.current.emit('whiteboard-clear');
    }
  };

  const tools = [
    { id: 'pen' as Tool, icon: Pen, label: 'Pen' },
    { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser' },
    { id: 'text' as Tool, icon: Type, label: 'Text' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
    { id: 'square' as Tool, icon: Square, label: 'Square' },
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentTool(tool.id)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentTool === tool.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </motion.button>
          );
        })}

        <div className="flex-1" />

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                color === c ? "border-blue-500 scale-110" : "border-gray-300 dark:border-gray-600"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
          />
        </div>

        {/* Line Width */}
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-24"
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClear}
          className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
          title="Clear"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full cursor-crosshair"
        />
      </div>
    </div>
  );
}

