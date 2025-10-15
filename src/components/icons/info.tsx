import { SVGProps } from 'react'

export const InfoSquareIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" {...props}>
    <path
      d="M8 1.355c.56-.473 1.465-.473 2.01 0l1.264 1.082c.24.2.697.37 1.017.37h1.36c.85 0 1.546.697 1.546 1.547v1.363c0 .32.168.77.368 1.01l1.08 1.267c.473.561.473 1.467 0 2.012l-1.08 1.267c-.2.24-.368.69-.368 1.01v1.363c0 .85-.697 1.548-1.545 1.548h-1.36c-.321 0-.77.168-1.01.369l-1.264 1.082c-.56.473-1.465.473-2.01 0l-1.264-1.082c-.24-.2-.697-.37-1.009-.37h-1.4a1.552 1.552 0 0 1-1.546-1.547v-1.37c0-.313-.16-.77-.36-1.003l-1.08-1.275c-.465-.553-.465-1.451 0-2.004l1.08-1.275c.2-.24.36-.69.36-1.002V4.362c0-.85.697-1.548 1.545-1.548H5.72c.32 0 .768-.168 1.009-.369L8 1.355Z"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 5.91v3.872M8.996 12.22h.006"
      stroke="currentColor"
      strokeWidth={1.375}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const InfoOutlineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
    <path d="M7.005 9.76V6.44" stroke="currentColor" strokeWidth={1.179} strokeLinecap="round" strokeLinejoin="round" />
    <circle
      cx={7}
      cy={7}
      r={6}
      stroke="currentColor"
      strokeWidth={1.286}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7.005 4.35H7" stroke="currentColor" strokeWidth={1.179} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
