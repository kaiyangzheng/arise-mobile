import { useEffect, useState } from "react";
import { TextInput } from "react-native-paper"
import { Button } from 'react-native-paper';
import { Props } from "../types";
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, View } from "react-native";

export default function Register({ navigation }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const saveLogin = async () => {
    await SecureStore.setItemAsync("name", name);
    await SecureStore.setItemAsync("password", password);
  }

  const getLogin = async () => {
    const name = await SecureStore.getItemAsync("name");
    const password = await SecureStore.getItemAsync("password");
    return { "name": name, "password": password }
  }

  useEffect(() => {
    const handleLogin = async () => {
      const loginData = await getLogin();
      if (loginData.name && loginData.password) {
        handleRegister();
      }
    }

    handleLogin();
  }, [])

  const handleRegister = () => {
    if (!name || !password) {
      return;
    }

    fetch('http://192.168.0.203:5001/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        saveLogin();
        navigation.navigate('Alarm', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <>
      <View style={styles.container}>
        <TextInput
          label="Username"
          mode="flat"
          value={name}
          onChangeText={name => setName(name)}
          style={{
            backgroundColor: "white",
          }}
        />
        <TextInput
          label="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={password => setPassword(password)}
          style={{
            backgroundColor: "white",
            marginTop: 15
          }}
        />
        <Button mode="contained" onPress={handleRegister} style={{
          marginTop: 20
        }}>
          Login
        </Button>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  }
});