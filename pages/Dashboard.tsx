// @ts-nocheck

import { View } from "react-native"
import DatetimePicker from "../components/DatetimePicker"
import { StyleSheet, Share } from "react-native";
import { Button } from "react-native-paper";
import { useState, useEffect } from "react";
import { Props } from "../types";
import { Text } from 'react-native-paper';
import { useSocket } from "../hooks/useSocket";
import TouchableOpacityGrid from "../components/PatternGrid";

export default function Dashboard({ navigation, route }: Props) {
  const { sendUserId, alarmActive, sendPasscode, sendTilePasscode, tileReady } = useSocket();

  const [date, setDate] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [alarm, setAlarm] = useState(null);
  const [edit, setEdit] = useState(false);

  const user = route.params.user;

  useEffect(() => {
    getAlarms();
    sendUserId(user.id);
  }, [user])

  const handleAlarmSubmit = async () => {
    fetch('http://192.168.0.203:5001/alarm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time: date,
        userId: user.id,
      })
    })
      .then(response => response.json())
      .then(data => {
        setEdit(false);
        getAlarms();
        setAlarm(data.alarm);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const getAlarms = async () => {
    fetch('http://192.168.0.203:5001/alarm/' + user.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setAlarms(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const displayHours = hours % 12 || 12;
    const period = time.getHours() < 12 ? 'am' : 'pm';
    return `${displayHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `http://localhost:3000/alarm/${alarms[0].id}/${user.id}?password=${user.password}`

      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleTilePress = (number: Number) => {
    sendTilePasscode(user.id, number);
  }

  return (
    <>
      {!alarmActive && <View style={styles.container}>
        {edit && <>
          <DatetimePicker date={date} setDate={setDate} />
          {date && <Text variant={"displayLarge"}>{formatTime(date)}</Text>}
          <Button mode="contained" style={styles.createAlarmBtn} onPress={handleAlarmSubmit}>Save</Button>
        </>}
        {!edit && <>
          {!alarm && <Text variant="displayLarge">No alarm set!</Text>}
          {alarm && <Text variant="displayLarge">{formatTime(new Date(alarm.time))}</Text>}
          <Button mode="contained" style={styles.createAlarmBtn} onPress={() => setEdit(true)}>Create alarm</Button>
        </>}
      </View>}

      {alarmActive && <View style={styles.container}>
        {tileReady && <TouchableOpacityGrid handleTilePress={handleTilePress} />}
        <Button onPress={onShare}>Share</Button>
      </View>}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAlarmBtn: {
    marginTop: 15
  }
});

