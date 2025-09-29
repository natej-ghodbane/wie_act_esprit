'use client'

import React, { forwardRef, InputHTMLAttributes, useState } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

const inputVariants = cva(
  'flex w-full rounded-lg border bg-background px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 
          'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        ghost: 
          'border-transparent bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        glass:
          'glass border-white/20 dark:border-white/10 text-white placeholder:text-white/70 focus:border-white/40 focus:ring-2 focus:ring-white/20',
        neuro:
          'neuro-inset border-0 text-neutral-700 dark:text-neutral-300 focus:ring-2 focus:ring-primary-500/20',
      },
      inputSize: {
        default: 'h-10 px-3',
        sm: 'h-8 px-2 text-sm',
        lg: 'h-12 px-4 text-base',
        xl: 'h-14 px-6 text-lg',
      },
      state: {
        default: '',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20 pr-10',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20 pr-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
      state: 'default',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  helperText?: string
  error?: string
  success?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  animateOnFocus?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    inputSize, 
    state, 
    type = 'text',
    label,
    helperText,
    error,
    success,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    animateOnFocus = true,
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    
    // Determine actual input type
    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type
    
    // Determine state based on error/success
    const actualState = error ? 'error' : success ? 'success' : state
    
    // Password toggle handler
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const inputElement = (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        {/* Input */}
        <input
          type={inputType}
          className={cn(
            inputVariants({ variant, inputSize, state: actualState }),
            leftIcon && 'pl-10',
            (rightIcon || showPasswordToggle || error || success) && 'pr-10',
            className
          )}
          ref={ref}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />
        
        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {/* Error/Success Icons */}
          {error && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          {success && !error && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          
          {/* Password Toggle */}
          {showPasswordToggle && !error && !success && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {/* Custom Right Icon */}
          {rightIcon && !showPasswordToggle && !error && !success && (
            <div className="text-neutral-400 dark:text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {/* Focus Ring Animation */}
        {animateOnFocus && isFocused && variant !== 'neuro' && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-primary-500/50 pointer-events-none"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    )

    // Wrap with label if provided
    if (label) {
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
          {inputElement}
          {/* Helper Text / Error / Success Message */}
          {(helperText || error || success) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'text-sm',
                error && 'text-red-600 dark:text-red-400',
                success && 'text-green-600 dark:text-green-400',
                !error && !success && 'text-neutral-500 dark:text-neutral-400'
              )}
            >
              {error || success || helperText}
            </motion.p>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-1">
        {inputElement}
        {/* Helper Text / Error / Success Message */}
        {(helperText || error || success) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-sm',
              error && 'text-red-600 dark:text-red-400',
              success && 'text-green-600 dark:text-green-400',
              !error && !success && 'text-neutral-500 dark:text-neutral-400'
            )}
          >
            {error || success || helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
