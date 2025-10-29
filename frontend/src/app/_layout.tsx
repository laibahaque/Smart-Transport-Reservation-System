import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { Stack } from "expo-router";


// 👇 Yahan apna key lagao .env se
const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  return (
    <ClerkProvider  publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="index" />
      </Stack>
    </ClerkProvider>
  );
}
