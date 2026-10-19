import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#090D14" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#090D14' },
          animation: 'fade',
        }}
      />
    </>
  );
}
