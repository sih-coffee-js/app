import Toast from 'react-native-root-toast';

export function toast(message) {
    Toast.show(message, {
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: '#343538',
        textColor: '#fff',
        opacity: 1,
        position: Toast.positions.BOTTOM,
        containerStyle: {
            borderRadius: 18,
            marginTop: 90
        }
    });
}
