import { Information } from '@/components/icons/Information';
import { InformationSquareFilled } from '@/components/icons/InformationSquareFilled';
import { SuccessIcon } from '@/components/icons/success';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:rounded-8xl group-[.toaster]:px-8 group-[.toaster]:shadow-sm',
          description: 'group-[.toast]:text-card-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: 'group-[.toaster]:!bg-[#E8F9F6] group-[.toaster]:!text-[#1F1F1F] text-sm',
          error: 'group-[.toaster]:!bg-[#ffd9d9] group-[.toaster]:!text-[#1F1F1F] text-sm',
          info: 'group-[.toaster]:!bg-[#FDFAEC] group-[.toaster]:!text-[#1F1F1F] text-sm',
          warning: 'group-[.toaster]:!bg-[#fffcec] group-[.toaster]:!text-[#1F1F1F] text-sm',
          // title: 'group-[.toaster]:font-title',
          icon: 'group-[.toaster]:mr-2',
        },
      }}
      icons={{
        success: <SuccessIcon className="w-6 h-6 text-[#00AD45]" />,
        error: <InformationSquareFilled className="w-6 h-6 text-[#FB4A4B]" />,
        info: <Information className="w-6 h-6 text-[#EFC942]" />,
        warning: <Information className="w-6 h-6 text-[#EFC942]" />,
      }}
      {...props}
    />
  );
};

export const useToast = (): { toast: typeof toast } => {
  return {
    toast,
  };
};
