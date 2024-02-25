// @ts-nocheck
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Audio, } from 'expo-av';

export const useSocket = () => {
  const socket = io('http://192.168.0.203:5001/');

  const [isConnected, setIsConnected] = useState(false);
  const [sockId, setSockId] = useState("");
  const [alarmActive, setAlarmActive] = useState(false);
  const [sound, setSound] = useState(new Audio.Sound());
  const [tileReady, setTileReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (alarmActive) {
        await sound.loadAsync(require('./../assets/Hello.mp3'));
        try {
          await sound.playAsync()
        } catch (e) {
          console.log(e)
        }
      } else {
        await sound.stopAsync()
        await sound.unloadAsync()
      }
    })()
  }, [alarmActive])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
      setSockId(socket.id as string);
      setIsConnected(true);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  useEffect(() => {
    socket.on('Alarm', (message) => {
      if (message.on) {
        setAlarmActive(true);
      }
    });

    socket.on('AlarmDone', (message) => {
      if (!message.on) {
        setAlarmActive(false);
      }
    })

    socket.on('TileReady', () => {
      setTileReady(true);
    })

    socket.on('Finish', () => {
      setAlarmActive(false);
      setTileReady(false);
    })

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendUserId = (userId: Number) => {
    socket.emit('deviceConnected', userId);
  }

  const sendPasscode = (id: Number, passcode: String) => {
    socket.emit('clientDevicePasscode', { id: id, passcode: passcode });
  }

  const sendTilePasscode = (id: Number, tile: Number) => {
    socket.emit('clientDeviceTilePasscode', { id: id, tile: tile })
  }

  return { isConnected, sockId, sendUserId, alarmActive, setAlarmActive, sendPasscode, sendTilePasscode, tileReady }
}