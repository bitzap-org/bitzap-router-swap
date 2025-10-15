import { SVGProps } from 'react'

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18 10H11.7778" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M15.6667 12.3333L17.9324 10.0676C17.9697 10.0303 17.9697 9.96962 17.9324 9.93229L15.6667 7.66663"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M14.1111 4.55555V4.16666C14.1111 3.52233 13.5887 3 12.9444 3H5.55555C4.69644 3 4 3.69644 4 4.55555V15.4444C4 16.3036 4.69644 17 5.55555 17H12.9444C13.5887 17 14.1111 16.4776 14.1111 15.8333V15.4444"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgComponent
