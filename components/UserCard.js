import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function UserCard({ user, isFav, onToggleFav }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: user?.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
      <Icon
        name="star"
        size={25}
        color={isFav ? 'gold' : 'gray'}
        style={{ backgroundColor: 'none' }}
        onPress={onToggleFav}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  star: {
    fontSize: 20,
  },
});
