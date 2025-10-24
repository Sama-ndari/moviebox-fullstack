import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log('connected to socket');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('disconnected from socket');
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Connect the socket
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    };
  }, []);

  return { isConnected, socket };
};
