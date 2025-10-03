'use client'

import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 
          'bg-primary-600 text-primary-foreground shadow-lg hover:bg-primary-700 hover:shadow-xl focus:ring-primary-500 hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl focus:ring-red-500 hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border-2 border-primary-500 bg-transparent text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950 focus:ring-primary-500 hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-secondary-500 text-white shadow-lg hover:bg-secondary-600 hover:shadow-xl focus:ring-secondary-500 hover:scale-[1.02] active:scale-[0.98]',
        ghost: 
          'hover:bg-accent hover:text-accent-foreground focus:ring-neutral-500 hover:scale-[1.02] active:scale-[0.98]',
        link: 
          'text-primary-600 underline-offset-4 hover:underline focus:ring-primary-500',
        glass:
          'glass text-white hover:bg-white/20 focus:ring-white/50 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]',
        neuro:
          'neuro text-neutral-700 dark:text-neutral-300 hover:shadow-neuro-lg dark:hover:shadow-neuro-dark-lg focus:ring-primary-500 hover:scale-[1.02] active:scale-[0.98]',
        gradient:
          'bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 text-white shadow-lg hover:shadow-xl focus:ring-primary-500 hover:scale-[1.02] active:scale-[0.98] bg-size-200 hover:bg-pos-100 transition-all duration-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 
    'onDrag' | 'onDragEnd' | 'onDragStart' | 
    'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  animateOnHover?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    animateOnHover = true,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    const buttonContent = (
      <>
        {/* Shimmer effect for gradient variant */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}
        
        {/* Glass effect overlay */}
        {variant === 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        
        <div className="relative flex items-center justify-center gap-2 z-10">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            leftIcon && <span className="flex items-center">{leftIcon}</span>
          )}
          {children}
          {!loading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </div>
      </>
    )

    if (animateOnHover && !asChild) {
      return (
        <motion.button
          ref={ref}
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          disabled={disabled || loading}
          whileHover={{ scale: variant === 'link' ? 1 : 1.02 }}
          whileTap={{ scale: variant === 'link' ? 1 : 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...props}
        >
          {buttonContent}
        </motion.button>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
