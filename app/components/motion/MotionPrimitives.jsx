'use client'

import { motion } from 'framer-motion'

const easing = [0.25, 0, 0, 1]

export const gentleFadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easing },
  },
}

export const gentleStagger = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export function FadeIn({ children, className = '', delay = 0, once = true, amount = 0.15 }) {
  return (
    <motion.div
      className={className}
      variants={gentleFadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: '-50px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGroup({ children, className = '', once = true, amount = 0.15 }) {
  return (
    <motion.div
      className={className}
      variants={gentleStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: '-50px' }}
    >
      {children}
    </motion.div>
  )
}

export function FadeItem({ children, className = '' }) {
  return (
    <motion.div className={className} variants={gentleFadeUp}>
      {children}
    </motion.div>
  )
}
