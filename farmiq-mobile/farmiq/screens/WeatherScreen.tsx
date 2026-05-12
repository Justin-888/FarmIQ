import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator
} from 'react-native';

export default function WeatherScreen({ navigation }: any) {
  const [city, setCity] = useState('Accra');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8081/api/weather/current?city=${city}`);
      const data = await response.json();

      if (data.error) {
        setError('City not found. Try another location.');
        setLoading(false);
        return;
      }
      setWeather(data);
    } catch (e) {
      setError('Could not fetch weather. Check your connection.');
    }
    setLoading(false);
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️';
    if (code <= 2) return '🌤️';
    if (code <= 3) return '☁️';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌦️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌧️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code <= 2) return 'Partly Cloudy';
    if (code <= 3) return 'Overcast';
    if (code <= 48) return 'Foggy';
    if (code <= 57) return 'Drizzle';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  };

  const getFarmingAdvice = (code: number, temp: number) => {
    if (code >= 80 && code <= 99) return 'Heavy rain or storms expected. Keep workers off the field. Secure equipment.';
    if (code >= 61 && code <= 67) return 'Rainy day. Skip irrigation. Check for waterlogging in fields.';
    if (temp > 35) return 'Very hot! Water crops early morning or evening. Protect seedlings from heat.';
    if (code === 0 && temp < 35) return 'Perfect farming day! Great for planting, spraying, or harvesting.';
    if (code <= 3) return 'Good conditions for transplanting seedlings today.';
    return 'Monitor your crops and soil moisture today.';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Weather</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city or region..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={fetchWeather}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#4caf50" style={{ marginTop: 40 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {weather && (
        <View>
          <View style={styles.mainCard}>
            <Text style={styles.cityName}>{weather.city}, Ghana</Text>
            <Text style={styles.weatherIcon}>
              {getWeatherIcon(weather.current.weather_code)}
            </Text>
            <Text style={styles.temp}>{Math.round(weather.current.temperature_2m)}°C</Text>
            <Text style={styles.description}>
              {getWeatherDesc(weather.current.weather_code)}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{weather.current.relative_humidity_2m}%</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>{weather.current.wind_speed_10m} km/h</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Lat/Lon</Text>
                <Text style={styles.detailValue}>{weather.latitude.toFixed(1)}/{weather.longitude.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.adviceCard}>
            <Text style={styles.adviceTitle}>Farming Advice</Text>
            <Text style={styles.adviceText}>
              {getFarmingAdvice(weather.current.weather_code, weather.current.temperature_2m)}
            </Text>
          </View>

          {weather.hourly && (
            <View style={styles.forecastCard}>
              <Text style={styles.forecastTitle}>Hourly Forecast</Text>
              {weather.hourly.time.slice(0, 6).map((time: string, index: number) => (
                <View key={index} style={styles.forecastRow}>
                  <Text style={styles.forecastTime}>
                    {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.forecastIcon}>
                    {getWeatherIcon(weather.hourly.weather_code[index])}
                  </Text>
                  <Text style={styles.forecastTemp}>
                    {Math.round(weather.hourly.temperature_2m[index])}°C
                  </Text>
                  <Text style={styles.forecastDesc}>
                    {getWeatherDesc(weather.hourly.weather_code[index])}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {!weather && !loading && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🌤️</Text>
          <Text style={styles.placeholderText}>
            Search for your city or region to get weather and farming advice
          </Text>
          <TouchableOpacity style={styles.quickBtn} onPress={fetchWeather}>
            <Text style={styles.quickBtnText}>Get Accra Weather</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f2d1f' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, backgroundColor: '#1a3d2b' },
  back: { color: '#4caf50', fontSize: 16, marginRight: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  searchRow: { flexDirection: 'row', padding: 16, gap: 8 },
  input: { flex: 1, backgroundColor: '#1a3d2b', borderRadius: 10, padding: 12, color: '#fff', fontSize: 16 },
  searchBtn: { backgroundColor: '#4caf50', borderRadius: 10, padding: 12, justifyContent: 'center' },
  searchText: { color: '#fff', fontWeight: 'bold' },
  error: { color: '#ff6b6b', textAlign: 'center', padding: 16 },
  mainCard: { margin: 16, backgroundColor: '#1a3d2b', borderRadius: 20, padding: 24, alignItems: 'center' },
  cityName: { color: '#4caf50', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  weatherIcon: { fontSize: 64, marginBottom: 8 },
  temp: { fontSize: 56, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  description: { color: '#aaa', fontSize: 16, textTransform: 'capitalize', marginBottom: 16 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  detail: { alignItems: 'center' },
  detailLabel: { color: '#888', fontSize: 12 },
  detailValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  adviceCard: { margin: 16, marginTop: 0, backgroundColor: '#1a4a2e', borderRadius: 16, padding: 16 },
  adviceTitle: { color: '#4caf50', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  adviceText: { color: '#fff', fontSize: 14, lineHeight: 22 },
  forecastCard: { margin: 16, marginTop: 0, backgroundColor: '#1a3d2b', borderRadius: 16, padding: 16 },
  forecastTitle: { color: '#4caf50', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  forecastRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space-between' },
  forecastTime: { color: '#888', fontSize: 13, width: 60 },
  forecastIcon: { fontSize: 24, width: 36 },
  forecastTemp: { color: '#fff', fontSize: 16, fontWeight: 'bold', width: 50 },
  forecastDesc: { color: '#aaa', fontSize: 13, flex: 1, textAlign: 'right' },
  placeholder: { alignItems: 'center', padding: 40 },
  placeholderIcon: { fontSize: 80, marginBottom: 16 },
  placeholderText: { color: '#888', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  quickBtn: { backgroundColor: '#4caf50', borderRadius: 10, padding: 14, paddingHorizontal: 24 },
  quickBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});