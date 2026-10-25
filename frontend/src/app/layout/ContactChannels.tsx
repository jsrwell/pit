import { Fragment } from 'react'

import { storeContact } from '@/shared/config/store-contact'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.2a8.7 8.7 0 0 0-7.5 13.2L3.3 20.8l4.5-1.2A8.7 8.7 0 1 0 12 3.2z" />
      <path d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.7.8c.3.1.3.3.3.5 0 .9-.7 1.7-1.6 1.8-2.8.2-6.4-3.2-6.4-6 .1-.6.1-1.4.5-2z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.6 3.5h2.7l1.4 4.1-2 1.4a11 11 0 0 0 6.3 6.3l1.4-2 4.1 1.4v2.7a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function ContactChannels() {
  const { whatsapp, phone, email } = storeContact

  return (
    <ul className="contact-channels">
      <li>
        <a
          href={whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Conversar pelo WhatsApp: ${whatsapp.label} (abre em nova aba)`}
        >
          <WhatsAppIcon />
          <span>
            <small>WhatsApp</small>
            {whatsapp.label}
          </span>
        </a>
      </li>
      <li>
        <a href={phone.href} aria-label={`Ligar para a loja: ${phone.label}`}>
          <PhoneIcon />
          <span>
            <small>Telefone</small>
            {phone.label}
          </span>
        </a>
      </li>
      <li>
        <a href={email.href} aria-label={`Enviar e-mail para ${email.label}`}>
          <MailIcon />
          <span>
            <small>E-mail</small>
            <span className="contact-channels__email">
              {email.label.split('@').map((part, index) => (
                <Fragment key={part}>
                  {index > 0 && (
                    <>
                      @<wbr />
                    </>
                  )}
                  {part}
                </Fragment>
              ))}
            </span>
          </span>
        </a>
      </li>
    </ul>
  )
}
