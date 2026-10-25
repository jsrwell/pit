import { formatPhone } from '@/shared/format/phone'

const whatsapp = import.meta.env.VITE_STORE_WHATSAPP ?? '11987654321'
const phone = import.meta.env.VITE_STORE_PHONE ?? '1140028922'
const email = import.meta.env.VITE_STORE_EMAIL ?? 'contato@cupcakesgourmet.example'

const WHATSAPP_GREETING = 'Olá! Vim pelo site da Cupcakes Gourmet e gostaria de tirar uma dúvida.'

export const storeContact = {
  whatsapp: {
    label: formatPhone(whatsapp),
    href: `https://wa.me/55${whatsapp}?text=${encodeURIComponent(WHATSAPP_GREETING)}`,
  },
  phone: { label: formatPhone(phone), href: `tel:+55${phone}` },
  email: { label: email, href: `mailto:${email}` },
} as const
