import { io, Socket } from 'socket.io-client'

let socket: Socket | undefined

// URL do servidor
const SERVER_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : ''

// Função para conectar ao socket
const connectSocket = (): Socket => {
  if (!socket) {
    try {
      socket = io(SERVER_URL)
      console.log('Socket conectado:', socket.id)
    } catch (error) {
      console.error('Erro ao conectar ao socket:', error)
      throw error // Opcional: Repassar o erro para o chamador lidar
    }
  }
  return socket
}

export { connectSocket }
