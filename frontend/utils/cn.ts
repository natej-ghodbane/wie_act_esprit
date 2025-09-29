import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const focusRing = {
  default: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900',
  inset: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset',
}

export const glassmorphism = {
  light: 'bg-white/10 backdrop-blur-md border border-white/20',
  dark: 'bg-black/10 backdrop-blur-md border border-white/10',
  adaptive: 'bg-glass-light dark:bg-glass-dark backdrop-blur-md border border-white/20 dark:border-white/10',
}

export const neumorphism = {
  light: 'bg-neutral-100 shadow-neuro dark:bg-neutral-800 dark:shadow-neuro-dark',
  raised: 'bg-neutral-100 shadow-neuro hover:shadow-neuro-lg transition-shadow dark:bg-neutral-800 dark:shadow-neuro-dark dark:hover:shadow-neuro-dark-lg',
  inset: 'bg-neutral-100 shadow-neuro-inner dark:bg-neutral-800 dark:shadow-neuro-inner',
}

export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  default: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
  bounce: 'transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
}
