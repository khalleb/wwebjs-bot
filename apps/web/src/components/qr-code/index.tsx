'use client'

import QRCode from 'react-qr-code'

interface QRCodeProps {
  codigo: string
}

const QrCode: React.FC<QRCodeProps> = ({ codigo }) => {
  return (
    <div className="space-y-12">
      <QRCode value={codigo} />
    </div>
  )
}

export default QrCode
