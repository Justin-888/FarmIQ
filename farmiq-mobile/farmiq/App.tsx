import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import WeatherScreen from './screens/WeatherScreen';
import MarketPricesScreen from './screens/MarketPricesScreen';
import PestDetectionScreen from './screens/PestDetectionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="Weather" component={WeatherScreen} />
        <Stack.Screen name="MarketPrices" component={MarketPricesScreen} />
        <Stack.Screen name="PestDetection" component={PestDetectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}