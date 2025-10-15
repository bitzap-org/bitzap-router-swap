// import React from 'react'
// import { sitePath } from '@/lib/utils'
// import { LINKS } from '@/ui/AppNav/constants'
// import { XIcon } from '@/ui/icons/twitter'
// import { TelegramIcon } from '@/ui/icons/telegram'
// import { GitHubIcon } from '@/ui/icons/github'

// export function Footer() {
//   return (
//     <footer className="container pt-8 px-4 pb-16 hidden md:block">
//       <div className="grid gap-16">
//         <img src={sitePath('/images/bitzap.png')} alt="Bitzap" className="w-[408px] h-[133px]" />
//         <div className="flex gap-[220px] items-start">
//           <div className="flex gap-3">
//             <RoundLinkButton href={LINKS.twitter}>
//               <XIcon className="size-4.5" />
//             </RoundLinkButton>
//             <RoundLinkButton href={LINKS.telegram}>
//               <TelegramIcon className="size-4.5" />
//             </RoundLinkButton>
//             <RoundLinkButton href={LINKS.github}>
//               <GitHubIcon className="size-4.5" />
//             </RoundLinkButton>
//           </div>
//           <div className="grid grid-cols-2 gap-12">
//             <Section title="Community">
//               <LinkList>
//                 <LinkItem href={LINKS.twitter}>Twitter</LinkItem>
//                 <LinkItem href={LINKS.telegram}>Telegram</LinkItem>
//               </LinkList>
//             </Section>
//             <Section title="Resources">
//               <LinkList>
//                 <LinkItem href={LINKS.bridge}>Bridge</LinkItem>
//                 <LinkItem href={LINKS.brandKit}>BrandKit</LinkItem>
//               </LinkList>
//             </Section>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// function RoundLinkButton({ children, href }: { href: string; children?: React.ReactNode }) {
//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noreferrer"
//       className="size-9 border border-[#d6d6d6] rounded-full flex items-center justify-center duration-200 hover:text-primary"
//     >
//       {children}
//     </a>
//   )
// }

// function Section({ title, children }: { title: string; children?: React.ReactNode }) {
//   return (
//     <section className="flex flex-col gap-3">
//       <h4 className="text-xl font-medium">{title}</h4>
//       {children}
//     </section>
//   )
// }

// function LinkList({ children }: { children?: React.ReactNode }) {
//   return <ul className="space-y-1">{children}</ul>
// }

// function LinkItem({ href, children }: { href: string; children?: React.ReactNode }) {
//   return (
//     <li>
//       <a href={href} className="text-sm duration-300 hover:text-primary" rel="noreferrer">
//         {children}
//       </a>
//     </li>
//   )
// }

export const Footer = () => {
  return (
    <footer className="container pt-8 px-4 pb-16 hidden md:block md:max-w-[1200px] md:mx-auto">
      <div className="grid gap-16">
        <img src={'/images/bitzap.png'} alt="Bitzap" className="w-[408px] h-[133px]" />
      </div>
    </footer>
  )
}