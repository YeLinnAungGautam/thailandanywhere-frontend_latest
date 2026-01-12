<template>
  <!-- Modal Overlay -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
      >
        <h3 class="text-lg font-semibold text-gray-900">Start New Chat</h3>
        <button @click="closeModal" class="text-gray-600 hover:text-gray-900">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Search -->
      <div class="p-4 border-b border-gray-200">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search admins..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Admin List -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Loading -->
        <div v-if="loading" class="p-4 text-center text-gray-600">
          Loading...
        </div>

        <!-- Empty -->
        <div
          v-else-if="filteredAdmins.length === 0"
          class="p-4 text-center text-gray-600"
        >
          No admins found
        </div>

        <!-- Admins -->
        <div v-else>
          <div
            v-for="admin in filteredAdmins"
            :key="admin._id"
            @click="startChat(admin)"
            class="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition"
          >
            <div class="flex items-center space-x-3">
              <!-- Avatar -->
              <div
                class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold"
              >
                {{ getInitials(admin.name) }}
              </div>

              <!-- Info -->
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-gray-900">
                  {{ admin.name }}
                </h4>
                <p class="text-xs text-gray-600">{{ admin.email }}</p>
              </div>

              <!-- Online Status -->
              <div
                v-if="admin.isOnline"
                class="w-3 h-3 bg-green-500 rounded-full"
              ></div>
              <div v-else class="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useChatStore } from "../../stores/chat";
import { chatApiService } from "../../api/chat";

const emit = defineEmits(["close"]);

const chatStore = useChatStore();

const searchQuery = ref("");
const loading = ref(false);
const admins = ref([]);

const filteredAdmins = computed(() => {
  if (!searchQuery.value) {
    return admins.value;
  }

  const query = searchQuery.value.toLowerCase();
  return admins.value.filter((admin) => {
    return (
      admin.name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
  });
});

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

async function startChat(admin) {
  try {
    const conversation = await chatStore.createConversation("admin-to-admin", [
      {
        id: admin._id,
        type: "admin",
        name: admin.name,
        email: admin.email,
      },
    ]);

    // Select the conversation
    await chatStore.selectConversation(conversation._id);
    closeModal();
  } catch (err) {
    console.error("Failed to create conversation:", err);
  }
}

function closeModal() {
  emit("close");
}

onMounted(async () => {
  loading.value = true;
  try {
    const response = await chatApiService.getOnlineUsers("admin");
    if (response.success) {
      admins.value = response.users;
    }
  } catch (err) {
    console.error("Failed to load admins:", err);
  } finally {
    loading.value = false;
  }
});
</script>
