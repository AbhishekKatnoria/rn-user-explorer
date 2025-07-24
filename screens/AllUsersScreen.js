import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { FavoritesContext } from '../context/FavoritesContext';
import UserCard from '../components/UserCard';
import { API_BASE_URL } from '@env';

export default function AllUsersScreen() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // Fetch users for pagination (current page)
  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users?page=${page}`);
      setUsers(response?.data?.data || []);
      setTotalPages(response?.data?.total_pages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all users dynamically for search
  const fetchAllUsers = async () => {
    try {
      const allUsersData = [];
      for (let i = 1; i <= totalPages; i++) {
        const response = await axios.get(`${API_BASE_URL}/users?page=${i}`);
        allUsersData.push(...response?.data?.data || []);
      }
      setAllUsers(allUsersData);
    } catch (err) {
      console.error(err);
    }
  };

  // Perform search filtering from all users
  const filteredUsers = search
    ? allUsers.filter(user =>
      `${user?.first_name} ${user?.last_name}`
        .toLowerCase()
        .includes(search?.toLowerCase())
    )
    : users;

  // Fetch users for the current page (pagination) and all users for search
  useEffect(() => {
    if (search) {
      fetchAllUsers();
    } else {
      fetchUsers(currentPage);
    }
  }, [currentPage, search]);

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

      <View style={styles.pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.pageButton, currentPage === i + 1 && styles.activePage]}
            onPress={() => setCurrentPage(i + 1)}
          >
            <Text style={styles.pageText}>{i + 1}</Text>
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
    flexWrap: 'wrap',
  },
  pageButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 6,
  },
  activePage: {
    backgroundColor: '#007bff',
  },
  pageText: {
    color: '#000',
  },
});
