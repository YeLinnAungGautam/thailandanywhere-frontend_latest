<template>
  <div class="space-y-2">
    <label for="" class="text-[12px] font-medium block">Date Of Birth</label>
    <div class="flex space-x-2">
      <!-- Day input -->
      <div class="w-1/4">
        <input
          type="number"
          v-model="day"
          @input="updateDOB"
          min="1"
          max="31"
          placeholder="DD"
          class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
        />
      </div>

      <!-- Month input -->
      <div class="w-2/4">
        <!-- <input
          type="number"
          v-model="month"
          @input="updateDOB"
          min="1"
          max="12"
          placeholder="MM"
          class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
        /> -->
        <select
          v-model="month"
          @change="updateDOB"
          class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
        >
          <option value="" disabled selected>MM</option>
          <option v-for="m in monthOptions" :key="m" :value="m.value">
            {{ m.text }}
          </option>
        </select>
      </div>

      <!-- Year input -->
      <div class="w-2/4">
        <input
          type="number"
          v-model="year"
          @input="updateDOB"
          min="1900"
          max="2100"
          placeholder="YYYY"
          class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits(["update:formData"]);

// Reactive state
const day = ref("");
const month = ref("");
const year = ref("");

const monthOptions = [
  { value: "", text: "MM" },
  { value: 1, text: "Jan" },
  { value: 2, text: "Feb" },
  { value: 3, text: "Mar" },
  { value: 4, text: "Apr" },
  { value: 5, text: "May" },
  { value: 6, text: "Jun" },
  { value: 7, text: "Jul" },
  { value: 8, text: "Aug" },
  { value: 9, text: "Sep" },
  { value: 10, text: "Oct" },
  { value: 11, text: "Nov" },
  { value: 12, text: "Dec" },
];

// Function to parse date from formData.dob
const parseDateFromDOB = () => {
  if (props.formData.dob) {
    try {
      const date = new Date(props.formData.dob);
      if (!isNaN(date.getTime())) {
        day.value = date.getDate().toString();
        month.value = (date.getMonth() + 1).toString(); // getMonth() is 0-indexed
        year.value = date.getFullYear().toString();
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  }
};

// Function to update DOB in formData
const updateDOB = () => {
  if (day.value && month.value && year.value) {
    // Validate inputs
    const dayNum = parseInt(day.value, 10);
    const monthNum = parseInt(month.value, 10);
    const yearNum = parseInt(year.value, 10);

    // Ensure values are within valid ranges
    if (
      dayNum >= 1 &&
      dayNum <= 31 &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      yearNum >= 1900
    ) {
      // Format month and day to ensure they have leading zeros if needed
      const formattedMonth = monthNum.toString().padStart(2, "0");
      const formattedDay = dayNum.toString().padStart(2, "0");

      // Create a new formData object with the updated dob
      const updatedFormData = {
        ...props.formData,
        dob: `${yearNum}-${formattedMonth}-${formattedDay}`,
      };

      // Emit the updated formData
      emit("update:formData", updatedFormData);
    }
  }
};

// Watch for changes to formData.dob (external changes)
watch(
  () => props.formData.dob,
  () => {
    parseDateFromDOB();
  },
  { immediate: true }
);

// Initialize on component mount
onMounted(() => {
  parseDateFromDOB();
});
</script>
