import { motion } from "framer-motion";
import { Sparkles, Zap, Star, Heart } from "lucide-react";

import type { Variants } from "framer-motion";

const floatingVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const shapes = [
  { Icon: Sparkles, color: "text-gray-400", delay: 0, x: "10%", y: "20%" },
  { Icon: Zap, color: "text-gray-500", delay: 1, x: "85%", y: "15%" },
  { Icon: Star, color: "text-gray-600", delay: 2, x: "15%", y: "70%" },
  { Icon: Heart, color: "text-gray-400", delay: 1.5, x: "80%", y: "75%" },
  { Icon: Sparkles, color: "text-gray-500", delay: 0.5, x: "50%", y: "10%" },
];

export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.color} opacity-20`}
          style={{ left: shape.x, top: shape.y }}
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: shape.delay }}
        >
          <shape.Icon className="w-12 h-12 md:w-16 md:h-16" />
        </motion.div>
      ))}
    </div>
  );
};
