<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="flex justify-between items-center">
        <div class="flex justify-end w-full items-center gap-x-2 pt-0.5">
          <button
            @click="addConfirmationAction"
            class="bg-green-500 text-white border border-gray-300 px-3 py-1 rounded-lg text-[10px] cursor-pointer"
          >
            Update Confirmation
          </button>
        </div>
      </div>

      <!-- Common file upload section -->
      <div class="space-y-1 col-span-2 border p-3 rounded-lg mb-4">
        <label class="text-[12px] text-gray-500">Upload Images</label>
        <input
          type="file"
          ref="commonFileInput"
          multiple
          class="hidden"
          @change="handleCommonFileChange"
          accept="image/*"
        />

        <div class="grid grid-cols-4 gap-3 mt-3">
          <div
            class="w-full border rounded-lg min-h-[100px] max-h-[364px] border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
            @click="openCommonFileUpload"
          >
            +
          </div>

          <div
            class="relative"
            v-for="(image, index) in uploadedImages"
            :key="index"
          >
            <button
              @click.prevent="removeUploadedImage(index)"
              class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
            >
              <XCircleIcon class="w-8 h-8 font-semibold" />
            </button>
            <img class="h-auto w-full rounded" :src="image.preview" alt="" />

            <!-- Dropdown for reservations selection -->
            <div class="mt-2">
              <label class="text-[10px] text-gray-600">Assign to:</label>
              <select
                v-model="image.assignType"
                class="w-full text-xs border rounded-lg p-1"
                @change="handleAssignmentChange(index)"
              >
                <option value="all">All Reservations</option>
                <option value="selected">Selected Reservations</option>
              </select>

              <!-- Checkbox list if "selected" is chosen -->
              <div
                v-if="image.assignType === 'selected'"
                class="mt-1 bg-gray-50 p-1 rounded max-h-28 overflow-y-auto"
              >
                <div
                  v-for="(item, idx) in editDataArray.reservation_ids"
                  :key="idx"
                  class="flex items-center mb-1"
                >
                  <input
                    type="checkbox"
                    :id="`img-${index}-res-${idx}`"
                    v-model="image.assignedTo[item.id]"
                    class="mr-1"
                  />
                  <label
                    :for="`img-${index}-res-${idx}`"
                    class="text-[10px] truncate"
                  >
                    {{ item.name || item.crm_id }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservation Items List -->
      <p class="text-[12px] text-gray-600 py-4">
        အောက်ပါ Data များ Change ချင်ပါက Confirmation photo အနည်းဆုံး
        တစ်ပုံထည့်ရန် လိုအပ်ပါသည်။
      </p>
      <div
        v-for="(reservationItem, index) in editDataArray.reservation_ids"
        :key="index"
        class="border p-3 rounded-lg mb-4"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium text-xs">
            {{ reservationItem.name || "Item" }} ({{ reservationItem.crm_id }})
          </h3>
          <div class="form-check flex justify-center items-center">
            <input
              type="checkbox"
              :id="'select-' + index"
              v-model="reservationItem.selected"
              class="form-check-input mr-2"
            />
            <label :for="'select-' + index" class="text-xs">Select</label>
          </div>
        </div>

        <!-- Reservation Fields - Only show if selected -->
        <div
          v-if="reservationItem.selected"
          class="grid grid-cols-2 gap-4 mt-3"
        >
          <div class="space-y-2">
            <p class="text-gray-800 text-[10px]">Reservation Status :</p>
            <v-select
              v-model="
                getReservationData(reservationItem.id).reservation_status
              "
              class="style-chooser text-xs rounded-lg bg-white"
              :options="reservation_status"
              label="name"
              :clearable="false"
              :reduce="(d) => d.name"
              placeholder=""
            ></v-select>
          </div>

          <div class="space-y-1">
            <label class="text-[12px] text-gray-500"
              >Reservation Slip Code</label
            >
            <input
              type="text"
              v-model="
                getReservationData(reservationItem.id).reservation_slip_code
              "
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            />
          </div>

          <!-- Display existing images for this reservation -->
          <div
            class="col-span-2"
            v-if="
              getReservationData(reservationItem.id).existingFiles.length > 0
            "
          >
            <label class="text-[12px] text-gray-500 mb-2 block"
              >Existing Files:</label
            >
            <div class="grid grid-cols-4 gap-3">
              <div
                class="relative"
                v-for="(image, imgIndex) in getReservationData(
                  reservationItem.id
                ).existingFiles"
                :key="'existing-' + imgIndex"
              >
                <button
                  @click.prevent="
                    removeExistingFile(reservationItem.id, imgIndex, image.id)
                  "
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>
                <img class="h-auto w-full rounded" :src="image.file" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

// Main data structure
const editDataArray = ref({
  reservation_ids: [], // List of reservations with IDs and selection status
  reservationData: [], // Detailed data for each reservation
});

// Array to hold uploaded images with assignment info
const uploadedImages = ref([]);

const loading = ref(false);
const commonFileInput = ref(null);

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const reservation_status = [
  { id: "1", name: "confirmed" },
  { id: "2", name: "awaiting" },
  { id: "3", name: "declined" },
];

// Methods to manage reservation data
const getReservationData = (id) => {
  let data = editDataArray.value.reservationData.find(
    (item) => item.reservation_id === id
  );
  if (!data) {
    data = {
      reservation_id: id,
      reservation_status: "",
      reservation_slip_code: "",
      existingFiles: [],
    };
    editDataArray.value.reservationData.push(data);
  }
  return data;
};

// Common file upload handling
const openCommonFileUpload = () => {
  commonFileInput.value.click();
};

const handleCommonFileChange = (e) => {
  const selectedFiles = e.target.files;
  if (!selectedFiles || selectedFiles.length === 0) return;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];

    // Create empty assignment object for all reservations
    const assignedTo = {};
    editDataArray.value.reservation_ids.forEach((item) => {
      assignedTo[item.id] = false;
    });

    uploadedImages.value.push({
      file: file,
      preview: URL.createObjectURL(file),
      assignType: "all", // Default to all
      assignedTo: assignedTo,
    });
  }
};

const handleAssignmentChange = (imageIndex) => {
  const image = uploadedImages.value[imageIndex];

  // If changed to "all", set all reservation checkboxes to true
  if (image.assignType === "all") {
    Object.keys(image.assignedTo).forEach((id) => {
      image.assignedTo[id] = true;
    });
  }
};

const removeUploadedImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

const removeExistingFile = async (reservationId, index, fileId) => {
  try {
    const res = await reservationStore.deletePaidImage(fileId);
    if (res) {
      const data = getReservationData(reservationId);
      data.existingFiles.splice(index, 1);
      toast.success("File deleted successfully");
    }
  } catch (err) {
    toast.error("Failed to delete file");
    console.error(err);
  }
};

// Submit data to server
const addConfirmationAction = async () => {
  // Get only selected reservations
  const selectedReservations = editDataArray.value.reservation_ids
    .filter((item) => item.selected)
    .map((item) => item.id);

  if (selectedReservations.length === 0) {
    toast.warning("Please select at least one reservation");
    return;
  }

  // Process each selected reservation for status and slip code
  for (const reservationId of selectedReservations) {
    const reservationData = getReservationData(reservationId);

    // Update reservation status and slip code
    const updateData = new FormData();
    updateData.append("_method", "PUT");

    if (reservationData.reservation_status) {
      updateData.append(
        "reservation_status",
        reservationData.reservation_status
      );
    }

    if (reservationData.reservation_slip_code) {
      updateData.append("slip_code", reservationData.reservation_slip_code);
    }

    // Only make API call if we have data to update
    if (
      reservationData.reservation_status ||
      reservationData.reservation_slip_code
    ) {
      await reservationStore.updateAction(updateData, reservationId);
    }
  }

  // Process image uploads for each reservation
  for (const reservationId of selectedReservations) {
    // Get files assigned to this reservation
    const assignedFiles = uploadedImages.value.filter((img) => {
      return (
        img.assignType === "all" ||
        (img.assignType === "selected" && img.assignedTo[reservationId])
      );
    });

    if (assignedFiles.length > 0) {
      const formData = new FormData();
      formData.append("_method", "PUT");

      // Add files to form data
      for (let i = 0; i < assignedFiles.length; i++) {
        formData.append(`paid_slip[${i}][file]`, assignedFiles[i].file);
        formData.append(`paid_slip[${i}][amount]`, 0); // Default amount to 0
      }

      // Upload files for this reservation
      await reservationStore.updateInfoAction(formData, reservationId);
    }
  }

  toast.success("Reservations updated successfully");

  // Refresh data
  setTimeout(async () => {
    await props.getDetailAction(route.query.id, route.query.product_id);
  }, 1000);
};

onMounted(() => {
  if (props.detail) {
    loading.value = true;

    // Initialize reservation items with selection status
    editDataArray.value.reservation_ids = props.detail?.booking?.items.map(
      (item) => ({
        id: item.id,
        crm_id: item.crm_id,
        name:
          item.product_type == "App\\Models\\Hotel"
            ? item.room?.name
            : item?.variation?.name || "Unnamed Item",
        selected: true,
      })
    );

    // Initialize detailed data for each reservation
    editDataArray.value.reservationData = props.detail?.booking?.items.map(
      (item) => ({
        reservation_id: item.id,
        reservation_status: item.reservation_status || "",
        reservation_slip_code: item.slip_code || "",
        existingFiles: item.paid_slip || [],
      })
    );

    loading.value = false;
  }
});
</script>
