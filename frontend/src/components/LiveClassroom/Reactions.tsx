import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { sendReaction } from '../../store/reactionSlice';
import type { ReactionType } from '../../store/reactionSlice';
import { cn } from '../../utils/cn';

const REACTIONS: Array<{ type: ReactionType; emoji: string; label: string }> = [
  { type: '👏', emoji: '👏', label: 'Clap' },
  { type: '👍', emoji: '👍', label: 'Like' },
  { type: '🔥', emoji: '🔥', label: 'Fire' },
  { type: 'Great Job!', emoji: '⭐', label: 'Great Job!' },
  { type: '🎉', emoji: '🎉', label: 'Celebrate' },
  { type: '⭐', emoji: '⭐', label: 'Star' },
  { type: '💯', emoji: '💯', label: 'Perfect' },
];

export default function Reactions() {
  const dispatch = useAppDispatch();
  const { reactions, totalPoints } = useAppSelector((state) => state.reaction);

  const handleReaction = (type: ReactionType) => {
    dispatch(sendReaction({ type }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Reaction Buttons */}
      <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {REACTIONS.map((reaction) => (
          <motion.button
            key={reaction.type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReaction(reaction.type)}
            className={cn(
              "px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700",
              "hover:bg-gray-200 dark:hover:bg-gray-600",
              "transition-colors flex items-center gap-2",
              "text-lg font-medium"
            )}
          >
            <span>{reaction.emoji}</span>
            <span className="text-sm">{reaction.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Points Display */}
      {totalPoints > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-center"
        >
          <p className="text-sm font-medium">Total Points</p>
          <p className="text-3xl font-bold">{totalPoints}</p>
        </motion.div>
      )}

      {/* Animated Reactions Display */}
      <div className="relative h-32 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
        <AnimatePresence>
          {reactions.slice(-10).map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{
                opacity: 0,
                scale: 0,
                x: Math.random() * 200 - 100,
                y: 100,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: reaction.position?.x || Math.random() * 200 - 100,
                y: reaction.position?.y || Math.random() * 100,
              }}
              exit={{
                opacity: 0,
                scale: 0,
                y: -50,
              }}
              transition={{
                duration: 2,
                ease: 'easeOut',
              }}
              className="absolute text-4xl pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              {reaction.type}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Recent Reactions List */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Recent Reactions
        </h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {reactions.slice(-5).reverse().map((reaction) => (
            <div
              key={reaction.id}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <span className="text-lg">{reaction.type}</span>
              <span>{reaction.userName}</span>
              <span className="text-xs text-gray-400">
                {new Date(reaction.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {reactions.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No reactions yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

