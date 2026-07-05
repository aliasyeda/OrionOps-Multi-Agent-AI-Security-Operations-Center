import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
        secondary: 'border-white/10 bg-white/5 text-slate-300',
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
        danger: 'border-red-500/30 bg-red-500/10 text-red-300',
        outline: 'border-white/20 text-slate-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
