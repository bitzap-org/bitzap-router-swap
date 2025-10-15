import { useMediaQuery } from '@react-hook/media-query'

export function useMedia() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return {
    isMobile: !isDesktop,
    isDesktop,
  }
}
