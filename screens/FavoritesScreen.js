import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FavoritesContext } from '../context/FavoritesContext';
import UserCard from '../components/UserCard';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserCard user={item} isFav={true} onToggleFav={() => toggleFavorite(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
});
