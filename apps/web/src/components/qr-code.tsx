'use client'

import { useState } from 'react'
import QRCode from 'react-qr-code'
export async function QrCode() {
  const [qrCode, setQrCode] = useState<string>('')

  return (
    <div className="space-y-12">
      <QRCode value={qrCode} />
    </div>
  )
}
