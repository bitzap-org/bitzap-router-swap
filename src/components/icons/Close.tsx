import { SVGProps } from 'react'

export const Close = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" {...props}>
    <path d="M24 8L8 24" stroke="currentColor" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8L24 24" stroke="currentColor" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
