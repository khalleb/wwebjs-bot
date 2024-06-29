import { Header } from '@/components/header'
import { QrCode } from '@/components/qr-code'

export default async function Home() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <p className="text-sm text-muted-foreground">Select an organization</p>
        <QrCode></QrCode>
      </main>
    </div>
  )
}
