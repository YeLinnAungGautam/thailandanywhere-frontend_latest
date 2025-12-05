<template>
  <div class="grid grid-cols-3 gap-4">
    <!-- Left Side - Room Selection -->
    <div
      class="col-span-1 h-[60vh] overflow-y-auto border-r border-gray-200 pr-4"
    >
      <p class="text-sm font-semibold text-gray-700 mb-3">Select Room</p>
      <div class="space-y-2">
        <div
          v-for="room in detail?.rooms"
          :key="room.id"
          @click="selectRoom(room)"
          :class="[
            'p-3 border rounded-lg cursor-pointer transition-all',
            formData.variation_id === room.id
              ? 'border-[#ff613c] bg-[#ff613c]/10'
              : 'border-gray-300 hover:border-gray-400',
          ]"
        >
          <p class="text-xs font-medium text-gray-800">{{ room.name }}</p>
          <p class="text-xs text-gray-500 mt-1">
            ฿{{ room.room_price?.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side - Availability Details -->
    <div class="col-span-2 h-[60vh] overflow-y-auto pl-4">
      <div
        v-if="!formData.variation_id"
        class="flex items-center justify-center h-full"
      >
        <div class="text-center text-gray-400">
          <BuildingOfficeIcon class="w-16 h-16 mx-auto mb-4" />
          <p class="text-sm">Select a room to create availability</p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <!-- Check-in Date -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Check-in Date <span class="text-red-500">*</span>
          </label>
          <VueDatePicker
            v-model="formData.checkin_date"
            :format="'yyyy-MM-dd'"
            placeholder="Select check-in date"
            :min-date="new Date()"
          />
        </div>

        <!-- Check-out Date -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Check-out Date <span class="text-red-500">*</span>
          </label>
          <VueDatePicker
            v-model="formData.checkout_date"
            :format="'yyyy-MM-dd'"
            placeholder="Select check-out date"
            :min-date="formData.checkin_date || new Date()"
          />
        </div>

        <!-- Quantity -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Quantity <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            v-model="formData.quantity"
            min="1"
            class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
            placeholder="Enter quantity"
          />
        </div>

        <!-- Comment -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <textarea
            v-model="formData.comment"
            rows="3"
            class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent resize-none"
            placeholder="Add any notes or comments..."
          ></textarea>
        </div>

        <!-- Selected Room Summary -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p class="text-xs font-semibold text-gray-600 mb-2">Selected Room</p>
          <div class="space-y-1">
            <p class="text-xs text-gray-700">
              <span class="font-medium">Room:</span>
              {{ selectedRoom?.name }}
            </p>
            <p class="text-xs text-gray-700">
              <span class="font-medium">Price:</span>
              ฿{{ selectedRoom?.room_price?.toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200"
        >
          <button
            @click="resetForm"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <XCircleIcon class="w-4 h-4" />
            Reset
          </button>
          <button
            @click="createAvailability"
            :disabled="!isFormValid"
            :class="[
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2',
              isFormValid
                ? 'bg-[#ff613c] hover:bg-[#ff4d28] cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed',
            ]"
          >
            <CheckIcon class="w-4 h-4" />
            Create Availability
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from "vue";
import {
  BuildingOfficeIcon,
  XCircleIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import { useAvailableStore } from "../../../stores/available";

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const toast = useToast();
const availableStore = useAvailableStore();

const formData = ref({
  product_type: "hotel",
  product_id: null,
  variation_id: null,
  checkin_date: null,
  checkout_date: null,
  quantity: 1,
  comment: "",
  status: "pending",
});

const selectedRoom = ref(null);

const selectRoom = (room) => {
  formData.value.variation_id = room.id;
  formData.value.product_id = room.hotel_id;
  selectedRoom.value = room;
};

const dateFormat = (inputDateString) => {
  if (!inputDateString) return null;
  const inputDate = new Date(inputDateString);
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isFormValid = computed(() => {
  return (
    formData.value.variation_id &&
    formData.value.checkin_date &&
    formData.value.checkout_date &&
    formData.value.quantity > 0
  );
});

const resetForm = () => {
  formData.value = {
    product_type: "hotel",
    product_id: null,
    variation_id: null,
    checkin_date: null,
    checkout_date: null,
    quantity: 1,
    comment: "",
    status: "pending",
  };
  selectedRoom.value = null;
};

const createAvailability = async () => {
  if (!isFormValid.value) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    const frmData = new FormData();
    frmData.append("product_type", formData.value.product_type);
    frmData.append("product_id", formData.value.product_id);
    frmData.append("variations[0][variable_id]", formData.value.variation_id);
    frmData.append("variations[0][quantity]", formData.value.quantity);
    frmData.append(
      "variations[0][checkin_date]",
      dateFormat(formData.value.checkin_date)
    );
    frmData.append(
      "variations[0][checkout_date]",
      dateFormat(formData.value.checkout_date)
    );
    frmData.append("variations[0][status]", formData.value.status);

    if (formData.value.comment) {
      frmData.append("variations[0][commands]", formData.value.comment);
    }

    const res = await availableStore.addNewAction(frmData);

    if (res.result) {
      toast.success("Availability created successfully");
      resetForm();
    }
  } catch (error) {
    console.error("Error creating availability:", error);
    toast.error(
      error.response?.data?.message || "Failed to create availability"
    );
  }
};

onMounted(() => {
  console.log(
    "Availability create component mounted with detail:",
    props.detail
  );
});
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
