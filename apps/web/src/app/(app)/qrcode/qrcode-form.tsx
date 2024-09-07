'use client'

import { useEffect, useState } from 'react'

import QrCode from '@/components/qr-code'

import { createQrCodeByConnection } from './actions'

export function QrCodeForm() {
  const [qrCode, setQrCode] = useState<string>('')
  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const tess = await createQrCodeByConnection()
        console.log(tess)
        setQrCode(tess)
      } catch (error) {
        console.error('Error fetching QR code:', error)
      }
    }

    fetchQrCode()
  }, [])

  return (
    <form>
      <QrCode codigo={qrCode} />
    </form>
  )
}
