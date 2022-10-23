import { StyleSheet, Platform } from 'react-native';
export default StyleSheet.create({
    droidSafeArea: {
        flex: 1,
        backgroundColor: 'white',   //edit this
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
});