import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const App: React.FC = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.text}>STEPFLOW</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' }, text: { fontSize: 20 } });

export default App;
