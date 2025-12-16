<template>
  <div>
    <div
      v-if="loading"
      class="w-full h-[88vh] rounded-2xl bg-white flex justify-center items-center"
    >
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-orange-200 border-t-[#FF613c] rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-slate-600 text-sm">Loading property...</p>
      </div>
    </div>
    <div
      v-if="!loading"
      class="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg shadow-orange-500/10 h-[calc(100vh-150px)]"
    >
      <div
        class="flex justify-between items-start border-b border-gray-200 pb-6"
      >
        <div>
          <p class="text-lg font-semibold text-slate-800">
            Availabilities for {{ detail?.name }}
          </p>
          <div>
            <p class="text-xs text-gray-500 mt-1">
              {{ detail?.city?.name }}, Thailand
            </p>
          </div>
        </div>
        <div class="gap-x-2 flex flex-nowrap">
          <div @click="closeModal" class="cursor-pointer">
            <i class="fa-solid fa-xmark text-2xl text-black"></i>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 pt-6">
        <!-- Left Side - Room Selection -->
        <div
          class="col-span-1 h-[70vh] pb-20 overflow-y-auto border-r border-gray-200 pr-4"
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
        <div class="col-span-2 h-[70vh] overflow-y-auto pb-20 px-4">
          <div
            v-if="showSuccess"
            class="flex items-center justify-center h-full"
          >
            <div class="text-center">
              <!-- Animated Success Icon -->
              <div class="relative inline-block mb-6">
                <!-- Pulsing background circles -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="w-20 h-20 bg-green-500/20 rounded-full animate-ping"
                  ></div>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="w-16 h-16 bg-green-500/30 rounded-full animate-pulse"
                  ></div>
                </div>

                <!-- Main icon with scale animation -->
                <div
                  class="relative bg-white rounded-full p-4 shadow-lg animate-scale-in"
                >
                  <CheckIcon
                    class="w-12 h-12 text-green-500 animate-check-draw"
                  />
                </div>
              </div>

              <!-- Success Message with fade-in -->
              <div
                class="mb-8 animate-fade-in-up"
                style="animation-delay: 0.2s"
              >
                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                  All Set! 🎉
                </h3>
                <p class="text-sm text-gray-600">
                  Your availability has been created successfully
                </p>
              </div>

              <!-- Action Buttons with staggered animation -->
              <div
                class="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up"
                style="animation-delay: 0.4s"
              >
                <button
                  @click="showSuccess = false"
                  class="group relative px-4 py-2 text-xs font-medium text-[#ff613c] bg-white border-2 border-[#ff613c] rounded-lg hover:bg-[#ff613c] hover:text-white transition-all duration-300 overflow-hidden"
                >
                  <span
                    class="relative z-10 flex items-center justify-center gap-2"
                  >
                    <svg
                      class="w-4 h-4 transition-transform group-hover:rotate-180 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Another
                  </span>
                  <div
                    class="absolute inset-0 bg-[#ff613c] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                  ></div>
                </button>

                <button
                  @click="viewAllAvailabilities"
                  class="group px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#ff613c] to-[#ff4d28] rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <span class="flex items-center justify-center gap-2">
                    View All Availabilities
                    <svg
                      class="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="!formData.variation_id && !showSuccess"
            class="flex items-center justify-center h-full"
          >
            <div class="text-center text-gray-400">
              <BuildingOfficeIcon class="w-16 h-16 mx-auto mb-4" />
              <p class="text-sm">Select a room to create availability</p>
            </div>
          </div>

          <div v-if="formData.variation_id && !showSuccess" class="space-y-4">
            <div>
              <p class="text-sm font-semibold text-[#FF613c] mb-3">
                {{ selectedRoom?.name || "No room selected" }}
              </p>
            </div>

            <!-- Check-in Date -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">
                Check-in Date <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <!-- Day Input -->
                <input
                  type="number"
                  v-model.number="dateFormatData.day"
                  @input="updateCheckinDate"
                  placeholder="DD"
                  min="1"
                  max="31"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Month Input -->
                <input
                  type="number"
                  v-model.number="dateFormatData.month"
                  @input="updateCheckinDate"
                  placeholder="MM"
                  min="1"
                  max="12"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Year Input -->
                <input
                  type="number"
                  v-model.number="dateFormatData.year"
                  @input="updateCheckinDate"
                  placeholder="YYYY"
                  min="1900"
                  max="2100"
                  class="w-24 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Calendar Button -->
                <div class="relative">
                  <button
                    type="button"
                    @click="openCheckinDatePicker"
                    class="w-36 h-10 flex items-center justify-center bg-[#FF613c] text-white border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="text-sm ml-2">Choose Date</span>
                  </button>

                  <!-- Hidden Date Input -->
                  <input
                    ref="checkinDatePickerInput"
                    type="date"
                    v-model="formData.checkin_date"
                    @change="updateFromCheckinDatePicker"
                    class="absolute opacity-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <!-- Check-out Date -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">
                Check-out Date <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <!-- Day Input -->
                <input
                  type="number"
                  v-model.number="dateFormatData.day_checkout"
                  @input="updateCheckoutDate"
                  placeholder="DD"
                  min="1"
                  max="31"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Month Input -->
                <input
                  type="number"
                  v-model.number="dateFormatData.month_checkout"
                  @input="updateCheckoutDate"
                  placeholder="MM"
                  min="1"
                  max="12"
                  class="w-20 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Year Input -->
                <input
                  type="number"
                  v-model.number="dateFormatData.year_checkout"
                  @input="updateCheckoutDate"
                  placeholder="YYYY"
                  min="1900"
                  max="2100"
                  class="w-24 border border-gray-300 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent text-center"
                />

                <!-- Calendar Button -->
                <div class="relative">
                  <button
                    type="button"
                    @click="openCheckoutDatePicker"
                    class="w-36 h-10 flex items-center justify-center bg-[#FF613c] text-white border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="text-sm ml-2">Choose Date</span>
                  </button>

                  <!-- Hidden Date Input -->
                  <input
                    ref="checkoutDatePickerInput"
                    type="date"
                    v-model="formData.checkout_date"
                    @change="updateFromCheckoutDatePicker"
                    class="absolute opacity-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-2">
                Number Of Rooms <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                v-model.number="formData.quantity"
                min="1"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
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
                rows="4"
                class="w-full px-4 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent resize-none"
                placeholder="Add any notes or comments..."
              ></textarea>
            </div>

            <!-- Selected Room Summary -->
            <!-- <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-xs font-semibold text-gray-600 mb-2">
                Selected Room
              </p>
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
            </div> -->

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
import { useHotelStore } from "../../../stores/hotel";

const props = defineProps({
  detailId: {
    type: Number,
    required: true,
  },
  closeModal: {
    type: Function,
    required: true,
  },
});

const detail = ref(null);
const hotelStore = useHotelStore();
const loading = ref(false);

const getDetailAction = async (id) => {
  loading.value = true;
  const res = await hotelStore.getDetailAction(id);
  if (res.status == 1) {
    detail.value = res.result;
    console.log(detail.value, "detail");
    selectRoom(detail.value.rooms[0]);
  } else {
    router.push("/");
  }
  loading.value = false;
};

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

const dateFormatData = ref({
  day: null,
  month: null,
  year: null,
  day_checkout: null,
  month_checkout: null,
  year_checkout: null,
});

// Check-in date functions
const updateFromCheckinDatePicker = () => {
  if (
    formData.value.checkin_date &&
    formData.value.checkin_date.includes("-")
  ) {
    const [y, m, d] = formData.value.checkin_date.split("-");
    dateFormatData.value.year = parseInt(y);
    dateFormatData.value.month = parseInt(m);
    dateFormatData.value.day = parseInt(d);
  }
};

const updateCheckinDate = () => {
  if (
    dateFormatData.value.day &&
    dateFormatData.value.month &&
    dateFormatData.value.year
  ) {
    const paddedDay = String(dateFormatData.value.day).padStart(2, "0");
    const paddedMonth = String(dateFormatData.value.month).padStart(2, "0");
    formData.value.checkin_date = `${dateFormatData.value.year}-${paddedMonth}-${paddedDay}`;
  }
};

const checkinDatePickerInput = ref(null);
const openCheckinDatePicker = () => {
  if (checkinDatePickerInput.value) {
    checkinDatePickerInput.value.showPicker();
  }
};

// Check-out date functions
const updateFromCheckoutDatePicker = () => {
  if (
    formData.value.checkout_date &&
    formData.value.checkout_date.includes("-")
  ) {
    const [y, m, d] = formData.value.checkout_date.split("-");
    dateFormatData.value.year_checkout = parseInt(y);
    dateFormatData.value.month_checkout = parseInt(m);
    dateFormatData.value.day_checkout = parseInt(d);
  }
};

const updateCheckoutDate = () => {
  if (
    dateFormatData.value.day_checkout &&
    dateFormatData.value.month_checkout &&
    dateFormatData.value.year_checkout
  ) {
    const paddedDay = String(dateFormatData.value.day_checkout).padStart(
      2,
      "0"
    );
    const paddedMonth = String(dateFormatData.value.month_checkout).padStart(
      2,
      "0"
    );
    formData.value.checkout_date = `${dateFormatData.value.year_checkout}-${paddedMonth}-${paddedDay}`;
  }
};

const checkoutDatePickerInput = ref(null);
const openCheckoutDatePicker = () => {
  if (checkoutDatePickerInput.value) {
    checkoutDatePickerInput.value.showPicker();
  }
};

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

const viewAllAvailabilities = () => {
  window.open("/availabilities", "_blank");
};

const resetForm = () => {
  formData.value = {
    product_type: "hotel",
    product_id: formData.value.product_id,
    variation_id: null,
    checkin_date: null,
    checkout_date: null,
    quantity: 1,
    comment: "",
    status: "pending",
  };
  dateFormatData.value = {
    day: null,
    month: null,
    year: null,
    day_checkout: null,
    month_checkout: null,
    year_checkout: null,
  };
  selectedRoom.value = null;
};

const showSuccess = ref(false);

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
      showSuccess.value = true;
      // Reset form but keep the hotel selected
      const currentProductId = formData.value.product_id;
      resetForm();
      formData.value.product_id = currentProductId;
    }
  } catch (error) {
    console.error("Error creating availability:", error);
    toast.error(
      error.response?.data?.message || "Failed to create availability"
    );
  }
};

onMounted(async () => {
  console.log(
    "Availability create component mounted with detail:",
    props.detailId
  );
  await getDetailAction(props.detailId);
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

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fade-in-up {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes check-draw {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

.animate-check-draw {
  animation: check-draw 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
  opacity: 0;
}
</style>
