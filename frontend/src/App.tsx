import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import Dashboard from './pages/Dashboard/Dashboard';
import websocketService from './services/websocket.service';
import { useAppDispatch } from './store/hooks';
import { setVacuumMap, setVacuumPos } from './store/vacuum/vacuumSlice';
import { WebSocketContext } from './utils/socket.utils';

const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSocket(websocketService());
  }, []);

  useEffect(() => {
    socket &&
      socket.on('connect', () => {
        console.log('connected! ', socket.id);
        socket.emit('getMajorMap');
      });

    socket &&
      socket.on('vacuumMap', (payload) => {
        console.log('receive vacuumMap');
        dispatch(setVacuumMap(payload));
      });

    socket &&
      socket.on('chargePos', (payload) => {
        console.log('receive chargePos', payload);
        dispatch(
          setVacuumPos({
            device: 'dock',
            devicesCoordinates: payload[0],
          }),
        );
      });

    socket &&
      socket.on('botPos', (payload) => {
        console.log('receive botPos', payload);
        dispatch(
          setVacuumPos({
            device: 'bot',
            devicesCoordinates: payload,
          }),
        );
      });
    // dispatch(
    //   setVacuumMap(
    //     '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',
    //   ),
    // );
  }, [socket]);

  return (
    <>
      {socket && (
        <WebSocketContext.Provider value={socket}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          </BrowserRouter>
        </WebSocketContext.Provider>
      )}
      {!socket && <Typography>connection to websocket server in progress...</Typography>}
    </>
  );
};

export default App;
