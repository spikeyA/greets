import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { auth, firestore, createEphemeralMessage } from '../services/firebase';

const AnonymousChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);
  const { recipientId } = route.params;

  useEffect(() => {
    const unsubscribe = subscribeToMessages();
    return () => unsubscribe();
  }, []);

  const subscribeToMessages = () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return () => {};

    return firestore()
      .collection('ephemeral_messages')
      .where('expiresAt', '>', firestore.Timestamp.now())
      .orderBy('expiresAt', 'asc')
      .orderBy('createdAt', 'asc')
      .onSnapshot(async (snapshot) => {
        const newMessages = [];
        
        for (const change of snapshot.docChanges()) {
          const message = {
            id: change.doc.id,
            ...change.doc.data(),
          };

          // Only show messages between current user and recipient
          if ((message.senderId === currentUser.uid && message.receiverId === recipientId) ||
              (message.senderId === recipientId && message.receiverId === currentUser.uid)) {
            
            if (change.type === 'added') {
              newMessages.push(message);
            }
            
            // Mark message as read if recipient is current user
            if (!message.isRead && message.receiverId === currentUser.uid) {
              await firestore()
                .collection('ephemeral_messages')
                .doc(message.id)
                .update({ isRead: true });
            }
          }
        }

        setMessages(prevMessages => [...prevMessages, ...newMessages]);
        setIsLoading(false);
      }, (error) => {
        console.error('Messages subscription error:', error);
        setIsLoading(false);
      });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const currentUser = auth().currentUser;
    if (!currentUser) {
      navigation.navigate('Auth');
      return;
    }

    try {
      await createEphemeralMessage(currentUser.uid, recipientId, newMessage.trim());
      setNewMessage('');
      flatListRef.current?.scrollToEnd();
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const currentUser = auth().currentUser;
    const isOwnMessage = item.senderId === currentUser?.uid;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>
            {new Date(item.expiresAt.toDate() - 24 * 60 * 60 * 1000).toLocaleTimeString()}
          </Text>
          {item.isRead && isOwnMessage && (
            <Text style={styles.readIndicator}>Read</Text>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Anonymous Chat</Text>
        <Text style={styles.subHeaderText}>Messages disappear after 24 hours</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubText}>Start a private conversation</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e88e5',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  readIndicator: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#1e88e5',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#666',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#666',
    fontSize: 14,
  },
});

export default AnonymousChatScreen; 