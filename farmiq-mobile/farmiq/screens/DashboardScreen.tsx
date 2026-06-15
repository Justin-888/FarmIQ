import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DashboardScreen({ route, navigation }: any) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FarmIQ</Text>
      <Text style={styles.welcome}>Welcome, {user.fullName}!</Text>
      <Text style={styles.tier}>Plan: {user.subscriptionTier}</Text>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Weather')}>
  <Text style={styles.cardIcon}>🌤</Text>
  <Text style={styles.cardText}>Weather</Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🌱</Text>
          <Text style={styles.cardText}>Crop Advisor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PestDetection')}>
  <Text style={styles.cardIcon}>🐛</Text>
  <Text style={styles.cardText}>Pest Detection</Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>💧</Text>
          <Text style={styles.cardText}>Irrigation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📊</Text>
          <Text style={styles.cardText}>Market Prices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Chatbot')}>
          <Text style={styles.cardIcon}>AI</Text>
          <Text style={styles.cardText}>AI Chatbot</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f2d1f', padding: 24, paddingTop: 60 },
  logo: { fontSize: 32, textAlign: 'center', marginBottom: 8, color: '#fff' },
  welcome: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  tier: { color: '#4caf50', textAlign: 'center', marginBottom: 32, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#1a3d2b', borderRadius: 16, width: '47%', padding: 20, alignItems: 'center', marginBottom: 16 },
  cardIcon: { fontSize: 36, marginBottom: 8 },
  cardText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  logout: { backgroundColor: '#c0392b', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 16 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});