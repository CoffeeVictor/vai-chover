import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type WeatherAPIResponseDTO = {
  "base": string,
  "clouds": {
    "all": number,
  },
  "cod": number,
  "coord": {
    "lat": number,
    "lon": number,
  },
  "dt": number,
  "id": number,
  "main": {
    "feels_like": number,
    "grnd_level": number,
    "humidity": number,
    "pressure": number,
    "sea_level": number,
    "temp": number,
    "temp_max": number,
    "temp_min": number,
  },
  "name": string,
  "sys": {
    "country": string,
    "id": number,
    "sunrise": number,
    "sunset": number,
    "type": number,
  },
  "timezone": number,
  "visibility": number,
  "weather":
  {
    "description": string,
    "icon": string,
    "id": number,
    "main": string,
  }[],
  "wind": {
    "deg": number,
    "gust": number,
    "speed": number,
  },
}

export default function App() {

  const [city, setCity] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherAPIResponseDTO | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchClimate = async (city: string) => {
    setIsLoading(true);
    setNotFound(false);
    const apiUrl = `https://weather.contrateumdev.com.br/api/weather/city/?city=${city}`
    const response = (await (await axios.get(apiUrl)).data) as WeatherAPIResponseDTO;
    setIsLoading(false);
    if(response.cod == 404) {
      setNotFound(true);
    } else {
      setWeather(response);
    } 
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      {
        isLoading ? (
          <ActivityIndicator />
        ) :
        notFound ? (
          <View>
            <Text>
              {'Cidade não encontrada...'}
            </Text>
          </View>
        ) :
        weather && (
          <View>
            <Text>
              {'Clima em: ' + weather.name}
            </Text>
            <Text>
              {'Temperatura: ' + weather.main.temp + ' ºC'}
            </Text>
            <Text>
              {'Máxima de: ' + weather.main.temp_max + ' ºC'}
            </Text>
            <Text>
              {'Mínima de: ' + weather.main.temp_min + ' ºC'}
            </Text>
            <Text>
              {'Clima: ' + weather.weather.map(item => item.description).join(' ')}
            </Text>
          </View>
        )
      }
      <TextInput
        placeholder={'Digite uma cidade'}
        value={city}
        onChangeText={setCity}
        style={styles.cityInput}
      />
      <TouchableOpacity
        style={styles.button}
      >
        <Text
          onPress={() => {
            fetchClimate(city)
          }}
          style={
            styles.buttonText
          }
        >
          {'Buscar Clima'}
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityInput: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FEFEFE',
    paddingHorizontal: 5,
    width: 200,
    height: 40,
    marginVertical: 15,
    borderColor: '#6FACE9'
  },
  button: {
    width: 190,
    height: 40,
    backgroundColor: '#6FACE9',
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white'
  }
});
