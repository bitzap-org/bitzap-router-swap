import { cn } from '@/lib/utils'

type PageProps = {
  className?: string
  children?: React.ReactNode
}

export function Page({ className, children }: PageProps) {
  return <main className={cn('container grow', className)}>{children}</main>
}
