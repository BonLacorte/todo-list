import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Home from './components/Home';
import GlobalStyles from './GlobalStyles';

export default function App() {
    return (
        <SafeAreaView style={GlobalStyles.droidSafeArea}>
            <View style={styles.container}>
                <Home />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
