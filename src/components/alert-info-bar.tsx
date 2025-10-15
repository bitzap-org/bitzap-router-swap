import { Information } from '@/components/icons/Information'

interface Props {
  description: string
  onClose?: () => void
}

export const AlertInfoBar = ({ description, onClose }: Props) => {
  return (<div className="py-3 px-6 md:py-4 md:px-6 rounded-sm text-foreground overflow-hidden mb-4 bg-info  ">
    <div className="flex items-start justify-start gap-2">
      <Information className='size-6 text-primary hover:text-primary' />
      <div className="text-foreground text-sm h-full">{description}</div>
    </div>
  </div>)
}