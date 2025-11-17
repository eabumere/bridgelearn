import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openSupportModal, closeSupportModal } from '../../store/chatSlice';
import { HeadphonesIcon, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import ChatPanel from './ChatPanel';

export default function SupportButton() {
  const dispatch = useAppDispatch();
  const { isSupportModalOpen } = useAppSelector((state) => state.chat);

  return (
    <>
      {/* Floating Support Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(openSupportModal())}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center z-50"
      >
        <HeadphonesIcon className="w-6 h-6" />
      </motion.button>

      {/* Support Modal */}
      <AnimatePresence>
        {isSupportModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(closeSupportModal())}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-6 right-6 w-96 h-[600px] z-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <HeadphonesIcon className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Tech Support
                    </h3>
                  </div>
                  <button
                    onClick={() => dispatch(closeSupportModal())}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Chat Panel */}
                <div className="flex-1 overflow-hidden">
                  <ChatPanel />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

