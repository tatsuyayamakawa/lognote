"use client"

import { motion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo風のカスタムイージング
      }}
    >
      {children}
    </motion.div>
  )
}
