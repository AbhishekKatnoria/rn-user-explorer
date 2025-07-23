import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { FavoritesContext } from '../context/FavoritesContext';
import UserCard from '../components/UserCard';
import { API_BASE_URL } from '@env';

export default function AllUsersScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // Fetch all users from page 1 and page 2 only
  const fetchAllUsers = async () => {
    try {
      const page1 = await axios.get(`${API_BASE_URL}/users?page=1`);
      const page2 = await axios.get(`${API_BASE_URL}/users?page=2`);
      setUsers([
        ...(page1?.data?.data || []),
        ...(page2?.data?.data || []),
      ]);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = users?.filter(user =>
    `${user?.first_name} ${user?.last_name}`.toLowerCase().includes(search?.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Search by name"
        value={search}
        onChangeText={(text) => setSearch(text)}
        style={styles.search}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            isFav={favorites?.some((f) => f?.id === item?.id)}
            onToggleFav={() => toggleFavorite(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pageBtn: {
    backgroundColor: '#eee',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  active: {
    backgroundColor: '#007bff',
  },
});
