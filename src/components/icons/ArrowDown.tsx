import { cn } from '@/lib/utils'
import { SVGProps } from 'react'

export const ArrowDown = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    fill="none"
    {...props}
    className={cn('', className)}
  >
    <path d="M9 1V16M9 16L15.5 10.5M9 16L2 10.5" stroke="currentColor" strokeWidth="2" />
  </svg>
)
