import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { chatApiService } from "../api/chat";

export const useChatStore = defineStore("chat", () => {
  // State
  const conversations = ref([]);
  const currentConversation = ref(null);
  const messages = ref([]);
  const loading = ref(false);
  const messagesLoading = ref(false);
  const onlineUsers = ref([]);
  const error = ref(null);
  const isFetching = ref(false);
  const isInitialized = ref(false); // ✅ Add this

  // Getters
  const sortedConversations = computed(() => {
    return [...conversations.value].sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return dateB - dateA;
    });
  });

  const unreadCount = computed(() => {
    return conversations.value.reduce((total, conv) => {
      return total + (conv.unreadCount || 0);
    }, 0);
  });

  const currentMessages = computed(() => {
    return [...messages.value].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA - dateB;
    });
  });

  // ✅ Updated - Only load if not already initialized
  async function loadInitialData() {
    if (isFetching.value || isInitialized.value) {
      console.log("ℹ️ Already initialized or loading");
      return;
    }

    try {
      console.log("📦 Loading initial chat data...");
      isFetching.value = true;

      const [conversationsResult, onlineUsersResult] = await Promise.allSettled(
        [chatApiService.getConversations(), chatApiService.getOnlineUsers()],
      );

      if (conversationsResult.status === "fulfilled") {
        const response = conversationsResult.value;
        if (response.success) {
          conversations.value = response.conversations || [];
          console.log(`✅ Loaded ${conversations.value.length} conversations`);
        }
      }

      if (onlineUsersResult.status === "fulfilled") {
        const response = onlineUsersResult.value;
        if (response.success) {
          onlineUsers.value = response.users || [];
          console.log(`✅ Loaded ${onlineUsers.value.length} online users`);
        }
      }

      isInitialized.value = true; // ✅ Mark as initialized
    } catch (error) {
      console.error("❌ Failed to load initial data:", error);
    } finally {
      isFetching.value = false;
    }
  }

  async function fetchConversations() {
    if (isFetching.value || loading.value) {
      console.log("⚠️ Already fetching conversations, skipping...");
      return;
    }

    loading.value = true;
    isFetching.value = true;
    error.value = null;

    try {
      console.log("📥 Fetching conversations...");
      const response = await chatApiService.getConversations();

      if (response.success) {
        conversations.value = response.conversations;
        console.log(`✅ Loaded ${response.conversations.length} conversations`);
      }
    } catch (err) {
      console.error("❌ Fetch conversations error:", err);
      error.value = err.message || "Failed to load conversations";
    } finally {
      loading.value = false;
      isFetching.value = false;
    }
  }

  async function selectConversation(conversationId) {
    if (currentConversation.value?._id === conversationId) {
      console.log("⚠️ Conversation already selected");
      return;
    }

    console.log("📋 Selecting conversation:", conversationId);
    currentConversation.value = conversations.value.find(
      (c) => c._id === conversationId,
    );

    if (currentConversation.value) {
      await fetchMessages(conversationId);
    }
  }

  async function fetchMessages(conversationId) {
    if (messagesLoading.value) {
      console.log("⚠️ Already loading messages, skipping...");
      return;
    }

    messagesLoading.value = true;

    try {
      console.log("📥 Fetching messages for:", conversationId);
      const response = await chatApiService.getMessages(conversationId);

      if (response.success) {
        messages.value = response.messages;
        console.log(`✅ Loaded ${response.messages.length} messages`);
      }
    } catch (err) {
      console.error("❌ Fetch messages error:", err);
      error.value = err.message || "Failed to load messages";
    } finally {
      messagesLoading.value = false;
    }
  }

  async function createConversation(type, participants, name = null) {
    try {
      console.log("📝 Creating conversation:", type);
      const response = await chatApiService.createConversation({
        type,
        participants,
        name,
      });

      if (response.success) {
        if (response.isNew) {
          conversations.value.unshift(response.conversation);
          console.log("✅ New conversation created");
        } else {
          console.log("ℹ️ Conversation already exists");
        }
        return response.conversation;
      }
    } catch (err) {
      console.error("❌ Create conversation error:", err);
      throw err;
    }
  }

  function addNewConversation(conversation) {
    const exists = conversations.value.some((c) => c._id === conversation._id);

    if (exists) {
      console.log("ℹ️ Conversation already exists, updating...");
      const index = conversations.value.findIndex(
        (c) => c._id === conversation._id,
      );
      if (index !== -1) {
        conversations.value[index] = conversation;
      }
    } else {
      console.log("✅ Adding new conversation to list");
      conversations.value.unshift(conversation);
    }

    conversations.value.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }

  function addMessage(message) {
    const exists = messages.value.some((m) => m._id === message._id);
    if (exists) {
      console.log("⚠️ Message already exists, skipping");
      return;
    }

    console.log("💬 Adding new message:", message._id);
    messages.value.push(message);

    const conversation = conversations.value.find(
      (c) => c._id === message.conversationId,
    );

    if (conversation) {
      conversation.lastMessage = {
        message: message.message,
        senderId: message.senderId,
        senderName: message.senderName,
        timestamp: message.createdAt,
      };
      conversation.updatedAt = message.createdAt;

      const index = conversations.value.findIndex(
        (c) => c._id === message.conversationId,
      );

      if (index > 0) {
        const conv = conversations.value.splice(index, 1)[0];
        conversations.value.unshift(conv);
      }

      console.log("✅ Conversation updated and moved to top");
    }
  }

  function updateMessageReadStatus(conversationId, userId, userName) {
    console.log("✓ Marking messages as read:", conversationId);

    messages.value.forEach((msg) => {
      if (msg.conversationId === conversationId && msg.senderId !== userId) {
        const alreadyRead = msg.readBy?.some((r) => r.userId === userId);
        if (!alreadyRead) {
          msg.readBy = msg.readBy || [];
          msg.readBy.push({
            userId,
            userName,
            readAt: new Date(),
          });
        }
      }
    });

    const conversation = conversations.value.find(
      (c) => c._id === conversationId,
    );
    if (conversation) {
      conversation.unreadCount = 0;
    }
  }

  function setOnlineUsers(users) {
    console.log(`👥 Online users updated: ${users.length}`);
    onlineUsers.value = users;
  }

  function updateUserStatus(userId, isOnline) {
    const user = onlineUsers.value.find((u) => u._id === userId);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
    } else if (isOnline) {
      onlineUsers.value.push({
        _id: userId,
        isOnline: true,
        lastSeen: new Date(),
      });
    }
  }

  function reset() {
    console.log("🔄 Resetting chat store");
    conversations.value = [];
    currentConversation.value = null;
    messages.value = [];
    onlineUsers.value = [];
    error.value = null;
    isFetching.value = false;
    isInitialized.value = false; // ✅ Reset initialization flag
  }

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    messagesLoading,
    onlineUsers,
    error,
    isInitialized, // ✅ Expose this
    sortedConversations,
    unreadCount,
    currentMessages,
    addNewConversation,
    loadInitialData,
    fetchConversations,
    selectConversation,
    fetchMessages,
    createConversation,
    addMessage,
    updateMessageReadStatus,
    setOnlineUsers,
    updateUserStatus,
    reset,
  };
});
