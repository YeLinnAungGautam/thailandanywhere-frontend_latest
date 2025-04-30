<template>
  <div class="relative">
    <div class="grid grid-cols-1 gap-4 px-8">
      <div class="space-y-4" v-if="amendData != null">
        <!-- <p class="text-sm font-medium mb-2 pt-4">Amend Reservation</p> -->

        <!-- Service Date -->
        <div class="flex items-center gap-x-4 border-b py-3">
          <div class="w-1/3">
            <label class="text-[12px] text-gray-500"
              >Service date <span class="text-red-800">*</span></label
            >
            <p class="font-medium text-sm py-1">{{ amendData.service_date }}</p>
          </div>
          <div class="w-2/3">
            <input
              type="date"
              v-model="amendChangesData.service_date"
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- Quantity -->
        <div
          class="flex items-center gap-x-4 border-b pb-3"
          v-if="amendData.product_type != 7"
        >
          <div class="w-1/3">
            <label class="text-[12px] text-gray-500"
              >Quantity - selling : {{ amendData.selling_price }}
              <span class="text-red-800">*</span></label
            >
            <p class="text-sm py-1 font-medium">{{ amendData.quantity }}</p>
          </div>
          <div class="w-2/3">
            <input
              type="number"
              v-model="amendChangesData.quantity"
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- Child Quantity -->
        <div
          class="flex items-center gap-x-4 border-b pb-3"
          v-for="i in amendData.child_info ?? []"
          :key="i"
        >
          <div class="w-1/3 relative">
            <div class="flex justify-between items-center">
              <label class="text-xs text-gray-500 relative"
                >Child Qty - selling : {{ i.child_price
                }}<span class="text-red-800">*</span></label
              >
              <p
                :title="i?.info"
                class="absolute right-1 cursor-pointer text-[10px] bg-[#FF613c] shadow-xl border border-white px-1 text-white rounded-full w-5 h-5 flex justify-center items-center custom-tooltip"
              >
                ?
              </p>
            </div>
            <p class="text-sm py-1 font-medium">
              {{ amendData.individual_pricing.child.quantity }}
            </p>
          </div>
          <div class="w-2/3">
            <input
              type="number"
              v-model="amendChangesData.child_quantity"
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <!-- Ticket Quantity for product_type 7 -->
        <div
          class="flex items-center gap-x-4 border-b pb-3"
          v-if="amendData.product_type == 7"
        >
          <div class="w-1/3">
            <label class="text-xs text-gray-500"
              >Ticket Qty <span class="text-red-800">*</span></label
            >
            <p class="text-sm py-1 font-medium">{{ amendData.quantity }}</p>
          </div>
          <div class="w-2/3 relative">
            <input
              type="number"
              v-model="amendChangesData.quantity"
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
            <p
              @click="amendChangesData.quantity++"
              class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-2 right-8"
            >
              +
            </p>
            <p
              @click="
                amendChangesData.quantity > 1
                  ? amendChangesData.quantity--
                  : null
              "
              class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-2 right-1"
            >
              -
            </p>
          </div>
        </div>

        <!-- Hotel Specific Fields -->
        <div v-if="amendData.product_type == 6">
          <!-- Check in date -->
          <div class="flex items-center gap-x-4 border-b pb-3">
            <div class="w-1/3">
              <label class="text-[12px] text-gray-500"
                >Check in date <span class="text-red-800">*</span></label
              >
              <p class="text-sm py-1 font-medium">
                {{ amendData.service_date }}
              </p>
            </div>
            <div class="w-2/3">
              <input
                type="date"
                v-model="amendChangesData.service_date"
                class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          <!-- Check out date -->
          <div class="flex items-center gap-x-4 border-b py-3">
            <div class="w-1/3">
              <label class="text-[12px] text-gray-500"
                >Check out date <span class="text-red-800">*</span></label
              >
              <p class="text-sm py-1 font-medium">
                {{ amendData.checkout_date }}
              </p>
            </div>
            <div class="w-2/3">
              <input
                type="date"
                v-model="amendChangesData.checkout_date"
                class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          <!-- Total Rooms -->
          <div class="flex items-center gap-x-4 border-b py-3">
            <div class="w-1/3">
              <label class="text-[12px] text-gray-500"
                >Total Rooms <span class="text-red-800">*</span></label
              >
              <p class="text-sm py-1 font-medium">{{ amendData.quantity }}</p>
            </div>
            <div class="w-2/3">
              <input
                type="number"
                v-model="amendChangesData.quantity"
                class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          <!-- Duration -->
          <div class="flex items-center gap-x-4 border-b py-3">
            <div class="w-1/3">
              <label class="text-[12px] text-gray-500"
                >Duration <span class="text-red-800">*</span></label
              >
              <p class="text-sm py-1 font-medium">
                {{ amendData.days }} Night x {{ amendData.quantity }} Rooms
              </p>
            </div>
            <div class="w-2/3">
              <p class="bg-gray-300 w-full px-2 py-2 rounded-lg text-xs">
                {{
                  daysBetween(
                    amendChangesData.service_date,
                    amendChangesData.checkout_date
                  )
                }}
                Night x {{ amendChangesData.quantity }} Rooms
              </p>
            </div>
          </div>
        </div>

        <!-- Variation Selection -->
        <div
          class="flex items-center gap-x-4 border-b pb-3"
          v-if="amendData.car_list && amendData.car_list.length > 0"
        >
          <div class="w-1/3">
            <label class="text-[12px] text-gray-500"
              >Variation <span class="text-red-800">*</span></label
            >
            <p class="text-sm py-1 font-medium">{{ amendData.item_name }}</p>
          </div>
          <div class="w-2/3">
            <select
              v-model="amendChangesData.variation_id"
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              @change="onVariationChange"
            >
              <option
                v-for="car in amendData.car_list"
                :key="car.id"
                :value="car.id"
              >
                {{ car.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end items-center gap-x-2 pt-4">
      <button
        @click="amendRequestCreate"
        class="bg-[#ff613c] text-white px-4 py-1.5 rounded-lg text-xs"
      >
        Amend Request Create
      </button>
      <button
        @click="amendRequestDelete"
        class="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs"
      >
        Amend Delete Request
      </button>
      <button
        @click="amendCloseAction"
        class="bg-white text-[#FF613c] border border-[#FF613c] px-4 py-1.5 rounded-lg text-xs"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { daysBetween } from "../help/DateBetween";
import Swal from "sweetalert2";
import { useAmendStore } from "../../stores/amend";
import { useToast } from "vue-toastification";

const amendStore = useAmendStore();
const toast = useToast();

const props = defineProps({
  amendData: {
    type: Object,
    default: null,
  },
  amendCloseAction: {
    type: Function,
    default: () => {},
  },
});
const emit = defineEmits(["amendCloseAction"]);

const amendChangesData = ref({
  variation_id: null,
  current_variation_id: null,
  variation_name: null,
  current_variation_name: null,
  service_date: null,
  current_service_date: null,
  quantity: null,
  current_quantity: null,
  child_quantity: null,
  current_child_quantity: null,
  checkout_date: null,
  current_checkout_date: null,
});

const onVariationChange = () => {
  // Find the selected variation's name
  if (props.amendData && props.amendData.car_list) {
    const selectedCar = props.amendData.car_list.find(
      (car) => car.id === amendChangesData.value.variation_id
    );
    if (selectedCar) {
      amendChangesData.value.variation_name = selectedCar.name;
    }
  }
};

const amendHistoryData = computed(() => {
  let changes = [];

  // Check for variation change
  if (
    amendChangesData.value.variation_id !== null &&
    amendChangesData.value.variation_id !==
      amendChangesData.value.current_variation_id
  ) {
    changes.push(
      `Variation: <span class="old-value">${
        amendChangesData.value.current_variation_name || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.variation_name || "N/A"
      }</span>`
    );
  }

  // Check for service date change
  if (
    amendChangesData.value.service_date !== null &&
    amendChangesData.value.service_date !==
      amendChangesData.value.current_service_date
  ) {
    changes.push(
      `Service date: <span class="old-value">${
        amendChangesData.value.current_service_date || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.service_date || "N/A"
      }</span>`
    );
  }

  // Check for quantity change
  if (
    amendChangesData.value.quantity !== null &&
    amendChangesData.value.quantity !== amendChangesData.value.current_quantity
  ) {
    changes.push(
      `Quantity: <span class="old-value">${
        amendChangesData.value.current_quantity || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.quantity || "N/A"
      }</span>`
    );
  }

  // Check for child quantity change
  if (
    amendChangesData.value.child_quantity !== null &&
    amendChangesData.value.child_quantity !==
      amendChangesData.value.current_child_quantity
  ) {
    changes.push(
      `Child quantity: <span class="old-value">${
        amendChangesData.value.current_child_quantity || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.child_quantity || "N/A"
      }</span>`
    );
  }

  // Check for checkout date change
  if (
    amendChangesData.value.checkout_date !== null &&
    amendChangesData.value.checkout_date !==
      amendChangesData.value.current_checkout_date
  ) {
    changes.push(
      `Checkout date: <span class="old-value">${
        amendChangesData.value.current_checkout_date || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.checkout_date || "N/A"
      }</span>`
    );
  }

  if (changes.length === 0) {
    return "";
  }

  // Convert array of changes to an HTML list with Poppins font styling
  return `
    <ul style="font-family: 'Poppins', sans-serif; text-align: left; list-style-type: none; padding-left: 0;">
      ${changes
        .map(
          (
            change
          ) => `<li style="margin-bottom: 8px; padding-left: 20px; position: relative;">
        <span style="position: absolute; left: 0; top: 2px; color: #FF613C;">•</span>
        ${change}
      </li>`
        )
        .join("")}
    </ul>
    <style>
      .old-value { color: #D1D5DB; text-decoration: line-through; }
      .new-value { color: #FF613C; font-weight: 500; }
    </style>
  `;
});

const amendRequestCreate = () => {
  // Check if any changes were actually made
  const changesHTML = amendHistoryData.value;

  if (!changesHTML) {
    Swal.fire({
      title: "No changes detected",
      text: "Please make some changes before submitting an amendment request.",
      icon: "info",
    });
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    html: `
      <div style="font-family: 'Poppins', sans-serif;">
        <p style="margin-bottom: 12px;">Do you want to apply these changes?</p>
        ${changesHTML}
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, create it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        let changes = {};

        if (amendChangesData.value.variation_id) {
          changes.variation_id = amendChangesData.value.variation_id;
        }
        if (amendChangesData.value.current_variation_id) {
          changes.current_variation_id =
            amendChangesData.value.current_variation_id;
        }
        if (amendChangesData.value.variation_name) {
          changes.variation_name = amendChangesData.value.variation_name;
        }
        if (amendChangesData.value.current_variation_name) {
          changes.current_variation_name =
            amendChangesData.value.current_variation_name;
        }
        if (amendChangesData.value.service_date) {
          changes.service_date = amendChangesData.value.service_date;
        }
        if (amendChangesData.value.current_service_date) {
          changes.current_service_date =
            amendChangesData.value.current_service_date;
        }
        if (amendChangesData.value.quantity) {
          changes.quantity = amendChangesData.value.quantity;
        }
        if (amendChangesData.value.current_quantity) {
          changes.current_quantity = amendChangesData.value.current_quantity;
        }
        if (amendChangesData.value.child_quantity) {
          changes.child_quantity = amendChangesData.value.child_quantity;
        }
        if (amendChangesData.value.current_child_quantity) {
          changes.current_child_quantity =
            amendChangesData.value.current_child_quantity;
        }
        if (amendChangesData.value.checkout_date) {
          changes.checkout_date = amendChangesData.value.checkout_date;
        }
        if (amendChangesData.value.current_checkout_date) {
          changes.current_checkout_date =
            amendChangesData.value.current_checkout_date;
        }

        const frmData = new FormData();
        frmData.append("booking_item_id", props.amendData.reservation_id);
        frmData.append("changes", JSON.stringify(changes));

        const res = await amendStore.addNewAction(frmData);
        if (res.status == "Request was successful.") {
          toast.success("Amend request created successfully.");
          props.amendCloseAction();
        } else {
          toast.error("Failed to create amend request.");
        }
      } catch (error) {
        console.error("Error creating amend request:", error);
        toast.error("An error occurred while creating the amend request.");
      }
    }
  });
};

const amendRequestDelete = () => {
  Swal.fire({
    title: "Are you sure?",
    html: `
      <div style="font-family: 'Poppins', sans-serif;">
        <p style="margin-bottom: 12px;">Do you wanna remove this reservation?</p>
        <p style="margin-bottom: 12px;">Please confirm to proceed.</p>
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, create it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        let changes = {};
        changes.delete = true;

        const frmData = new FormData();
        frmData.append("booking_item_id", props.amendData.reservation_id);
        frmData.append("changes", JSON.stringify(changes));

        const res = await amendStore.addNewAction(frmData);
        if (res.status == "Request was successful.") {
          toast.success("Amend request created successfully.");
          props.amendCloseAction();
        } else {
          toast.error("Failed to create amend request.");
        }
      } catch (error) {
        console.error("Error creating amend request:", error);
        toast.error("An error occurred while creating the amend request.");
      }
    }
  });
};

// Add a watch on props.amendData to set current values
watch(
  () => props.amendData,
  (newData) => {
    if (newData) {
      amendChangesData.value.current_variation_id = newData.car_id;
      amendChangesData.value.current_variation_name = newData.item_name;
      amendChangesData.value.current_service_date = newData.service_date;
      amendChangesData.value.current_quantity = newData.quantity;
      amendChangesData.value.current_child_quantity =
        newData.individual_pricing?.child?.quantity || 0;
      amendChangesData.value.current_checkout_date = newData.checkout_date;

      // Set initial values for the form fields
      amendChangesData.value.service_date = newData.service_date;
      amendChangesData.value.quantity = newData.quantity;
      amendChangesData.value.child_quantity =
        newData.individual_pricing?.child?.quantity || 0;
      amendChangesData.value.checkout_date = newData.checkout_date;
      amendChangesData.value.variation_id = newData.car_id;
      amendChangesData.value.variation_name = newData.item_name;
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log("Amend Data: ", props.amendData);
});
</script>
