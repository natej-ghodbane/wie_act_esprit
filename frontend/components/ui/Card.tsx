'use client'

import React, { forwardRef, HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const cardVariants = cva(
  'rounded-xl border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 
          'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md',
        glass: 
          'glass shadow-glass hover:shadow-glass-lg border-white/20 dark:border-white/10',
        neuro: 
          'neuro hover:shadow-neuro-lg dark:hover:shadow-neuro-dark-lg border-transparent',
        ghost: 
          'bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
        outline: 
          'bg-transparent border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
        gradient: 
          'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:scale-[1.02]',
        glow: 'hover:shadow-lg hover:shadow-primary-500/20',
        scale: 'hover:scale-[1.02]',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      hover: 'none',
    },
  }
)

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 
    'onDrag' | 'onDragEnd' | 'onDragStart' | 
    'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>,
    VariantProps<typeof cardVariants> {
  animateOnHover?: boolean
  children?: React.ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    padding, 
    hover, 
    animateOnHover = false,
    children,
    ...props 
  }, ref) => {
    if (animateOnHover) {
      return (
        <motion.div
          ref={ref}
          className={cn(cardVariants({ variant, padding, hover, className }))}
          whileHover={{ 
            y: hover === 'lift' ? -4 : 0,
            scale: hover === 'scale' || hover === 'lift' ? 1.02 : 1 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover, className }))}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

// Card Title Component
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </Component>
  )
)

CardTitle.displayName = 'CardTitle'

// Card Description Component
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
      {...props}
    >
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

// Card Content Component
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('', className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

// Card Footer Component
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  cardVariants 
}
