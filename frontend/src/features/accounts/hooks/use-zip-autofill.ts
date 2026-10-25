import { useRef, useState } from 'react'

import { lookupZip, ZIP_DIGITS, zipDigits, type ZipAddress } from '../api/zip-lookup'

export type ZipStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'failed'

export const ZIP_MESSAGES: Record<ZipStatus, string> = {
  idle: '',
  loading: 'Buscando o endereço deste CEP...',
  found: 'Endereço encontrado. Confira os dados e informe o número.',
  not_found: 'CEP não encontrado. Preencha o endereço manualmente.',
  failed: 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.',
}

export interface ZipAutofill {
  status: ZipStatus
  lookup: (zip: string) => Promise<void>
}

export function useZipAutofill(onFound: (address: ZipAddress) => void): ZipAutofill {
  const [status, setStatus] = useState<ZipStatus>('idle')
  const latest = useRef('')

  async function lookup(zip: string): Promise<void> {
    const digits = zipDigits(zip)
    latest.current = digits
    if (digits.length !== ZIP_DIGITS) {
      setStatus('idle')
      return
    }
    setStatus('loading')
    try {
      const found = await lookupZip(digits)
      if (latest.current !== digits) return
      if (found === null) {
        setStatus('not_found')
        return
      }
      onFound(found)
      setStatus('found')
    } catch {
      if (latest.current === digits) setStatus('failed')
    }
  }

  return { status, lookup }
}
