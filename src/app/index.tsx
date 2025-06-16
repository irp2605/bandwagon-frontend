import { Text, StyleSheet, View } from 'react-native';
import {Link} from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bandwagon</Text>
      <Link href="/sign-in">Go to Sign In</Link>
    </View>

  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20',
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7EBEC',
  }
})