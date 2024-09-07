'use server'
import { connectSocket } from '@/lib/socket'
export async function createQrCodeByConnection() {
  const socket = connectSocket()
  socket.emit('qr', () => {
    console.log('testeeeeeeee')
  })

  return new Date().getTime().toString()
}
