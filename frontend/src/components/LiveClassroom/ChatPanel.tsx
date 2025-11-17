import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { sendMessage, setActiveTab, receiveMessage } from '../../store/chatSlice';
import { MessageCircle, HeadphonesIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { io, Socket } from 'socket.io-client';
import { config } from '../../config/env';

export default function ChatPanel() {
  const dispatch = useAppDispatch();
  const { classMessages, supportMessages, activeTab } = useAppSelector(
    (state) => state.chat
  );
  const { user } = useAppSelector((state) => state.user);
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io(config.socketUrl, {
      transports: ['websocket'],
    });

    socketRef.current.on('chat-message', (message: any) => {
      dispatch(receiveMessage({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [classMessages, supportMessages, activeTab]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    await dispatch(sendMessage({ message: inputMessage, type: activeTab }));
    setInputMessage('');

    // Emit via Socket.IO
    if (socketRef.current) {
      socketRef.current.emit('chat-message', {
        message: inputMessage,
        type: activeTab,
        userId: user?.id,
        userName: user?.name,
        userRole: user?.role,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const messages = activeTab === 'class' ? classMessages : supportMessages;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => dispatch(setActiveTab('class'))}
          className={cn(
            "flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors",
            activeTab === 'class'
              ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          <MessageCircle className="w-5 h-5" />
          Class Chat
        </button>
        <button
          onClick={() => dispatch(setActiveTab('support'))}
          className={cn(
            "flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors",
            activeTab === 'support'
              ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          <HeadphonesIcon className="w-5 h-5" />
          Tech Support
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col",
                message.userId === user?.id ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.userId === user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold">{message.userName}</span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      message.userRole === 'teacher'
                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : message.userRole === 'support'
                        ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    )}
                  >
                    {message.userRole}
                  </span>
                </div>
                <p className="text-sm">{message.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Type a message in ${activeTab === 'class' ? 'class chat' : 'support'}...`}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
}

