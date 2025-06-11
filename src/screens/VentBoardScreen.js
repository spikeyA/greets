import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { getPublicConfessions } from '../services/firebase';
import Geolocation from 'react-native-geolocation-service';

const VentBoardScreen = ({ navigation }) => {
  const [confessions, setConfessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
    loadConfessions();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
      
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const loadConfessions = async () => {
    try {
      const radius = 50; // 50km radius
      const fetchedConfessions = await getPublicConfessions(radius, userLocation);
      setConfessions(fetchedConfessions);
    } catch (error) {
      console.error('Error loading confessions:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadConfessions();
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const confessionDate = timestamp.toDate();
    const diffInMinutes = Math.floor((now - confessionDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const renderConfessionItem = ({ item }) => (
    <View style={styles.confessionCard}>
      <Text style={styles.confessionText}>{item.content}</Text>
      
      <View style={styles.confessionFooter}>
        <Text style={styles.timestamp}>{getTimeAgo(item.createdAt)}</Text>
        
        {item.location && (
          <Text style={styles.location}>
            {`${Math.round(item.distance)}km away`}
          </Text>
        )}
      </View>

      {item.aiResponse && (
        <View style={styles.aiResponseContainer}>
          <Text style={styles.aiResponseLabel}>AI Response:</Text>
          <Text style={styles.aiResponseText}>{item.aiResponse}</Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={confessions}
        renderItem={renderConfessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#1e88e5"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No confessions yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('Confession')}
            >
              <Text style={styles.createButtonText}>Share Your Thoughts</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  listContainer: {
    padding: 16,
  },
  confessionCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  confessionText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  confessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
  },
  location: {
    color: '#888',
    fontSize: 12,
  },
  aiResponseContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  aiResponseLabel: {
    color: '#81b0ff',
    fontSize: 14,
    marginBottom: 4,
  },
  aiResponseText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VentBoardScreen; 