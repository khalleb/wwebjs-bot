import { Header } from '@/components/header'

import { QrCodeForm } from '../qrcode/qrcode-form'

export default function CreateOrganization() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Criar conexão</h1>
        <QrCodeForm />
      </main>
    </div>
  )
}
