import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { FavoritesContext } from '../context/FavoritesContext';
import UserCard from '../components/UserCard';
import { API_BASE_URL } from '@env';

export default function AllUsersScreen() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // Fetch users from the API
  const fetchUsers = async (page) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users?page=${page}`);
      setUsers(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            isFav={favorites.some((f) => f.id === item.id)}
            onToggleFav={() => toggleFavorite(item)}
          />
        )}
      />

      {/* Simple Pagination Buttons */}
      <View style={styles.pagination}>
        {[...Array(totalPages)].map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentPage(index + 1)}
            style={[
              styles.pageBtn,
              currentPage === index + 1 && styles.active,
            ]}
          >
            <Text>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
