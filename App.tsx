import React from 'react';
import { useFonts as usePoppins, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts as useInter, Inter_400Regular } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const [poppinsLoaded] = usePoppins({ Poppins_700Bold });
  const [interLoaded] = useInter({ Inter_400Regular });

  if (!poppinsLoaded || !interLoaded) {
    return <AppLoading />;
  }

  return <AppNavigator />;
}
