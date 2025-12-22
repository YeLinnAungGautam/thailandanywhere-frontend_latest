<template>
  <div class="space-y-2 col-span-2 w-full">
    <!-- Receipt Upload Section -->
    <div class="space-y-4 mb-2">
      <!-- Hidden File Input -->
      <input
        type="file"
        id="image"
        ref="fileInputThree"
        class="hidden"
        @change="recehandleFileChange"
        accept="image/*"
      />

      <!-- Title -->
      <p class="text-[10px] font-medium" v-if="editData.expenses?.length != 0">
        Receipt Slips
      </p>

      <!-- Add New Receipt Button -->
      <div class="grid grid-cols-4 gap-4">
        <div class="space-y-2 cursor-pointer" @click="openAddModal">
          <div
            class="w-full h-[210px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed hover:bg-[#FF613c]/5 transition-colors"
          >
            +
          </div>
          <div
            class="w-full px-4 pb-1 border-dashed border border-[#FF613c] space-y-2 text-[#FF613c] hover:shadow rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              Bank Name
            </p>
            <p class="text-[10px] flex justify-start items-center">Amount</p>
            <p class="text-[10px] flex justify-start items-center pb-2">Date</p>
          </div>
        </div>
      </div>

      <!-- Existing Receipts -->
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(image, index) in editData.expenses ?? []"
          :key="index"
          class="relative space-y-1"
        >
          <!-- Receipt ID Badge -->
          <p class="text-[10px] px-2 py-1 bg-[#FF613c] rounded-lg text-white">
            {{ image.id }}
          </p>

          <!-- Edit Button -->
          <button
            @click="openEditModal(image, index)"
            class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] hover:bg-[#e55139] px-2 py-0.5 rounded-lg transition-colors z-10"
          >
            <span class="text-[10px]">edit</span>
          </button>

          <!-- Receipt Image -->
          <a :href="image.image" target="_blank" class="w-full h-auto block">
            <img
              :src="image.image"
              alt="Receipt"
              class="rounded-lg w-full h-[210px] object-cover hover:opacity-90 transition-opacity"
            />
          </a>

          <!-- Receipt Details -->
          <div
            class="w-full px-4 pb-1 mt-2 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-md rounded-lg transition-shadow"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              {{ image?.bank_name || "N/A" }}
            </p>
            <p class="text-[10px] flex justify-start items-center">
              {{
                image?.amount
                  ? `${image.amount} ${image.currency || "THB"}`
                  : "N/A"
              }}
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              {{ formatDisplayDate(image?.date) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Receipt Modal -->
    <Modal :isOpen="carModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>{{ expenseData.id ? "Edit" : "Add" }} Expense Receipt</p>
          <XCircleIcon
            class="w-5 h-5 text-white cursor-pointer hover:text-gray-200"
            @click="closeModal"
          />
        </DialogTitle>

        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-8">
              <p class="text-[10px] text-gray-500 col-span-2">
                Before saving, please make sure all information is correct.
              </p>

              <!-- Image Upload Area -->
              <div>
                <!-- Upload Button -->
                <div
                  v-if="uploadRecePreview.length == 0 && !expenseData.file"
                  @click="openFilePickerThree"
                  class="w-full h-[400px] border rounded-lg border-dashed flex flex-col justify-center items-center text-[#FF613c] border-[#FF613c] cursor-pointer hover:bg-[#FF613c]/5 transition-colors"
                >
                  <svg
                    class="w-12 h-12 mb-2"
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
                  <p class="text-sm">Click to upload receipt</p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG (Max 10MB)</p>
                </div>

                <!-- Preview New Upload -->
                <div
                  v-if="uploadRecePreview.length != 0 && !expenseData.file"
                  class="w-full min-h-[400px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c] relative"
                >
                  <img
                    :src="uploadRecePreview[0]"
                    alt="Preview"
                    class="rounded-lg"
                  />
                  <button
                    @click="clearUploadPreview"
                    class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <XCircleIcon class="w-5 h-5" />
                  </button>
                </div>

                <!-- Preview Existing Image -->
                <div
                  v-if="expenseData.file"
                  class="rounded-lg min-h-[400px] w-full relative"
                >
                  <img
                    :src="expenseData.file"
                    alt="Current receipt"
                    class="rounded-lg"
                  />
                  <button
                    @click="openFilePickerThree"
                    class="absolute bottom-2 right-2 px-3 py-1 bg-[#FF613c] text-white text-xs rounded-lg hover:bg-[#e55139]"
                  >
                    Change Image
                  </button>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="space-y-4 relative pt-4 pb-14">
                <!-- Date -->
                <div>
                  <p class="text-[12px] font-medium pb-2">
                    Date <span class="opacity-0">......</span>
                  </p>
                  <div
                    class="flex justify-between items-center w-full bg-white pl-2 rounded-lg border border-gray-100"
                  >
                    <p class="text-start text-xs" v-if="expenseData?.date">
                      {{
                        expenseData.date.includes("T")
                          ? formatDate(expenseData.date)
                          : formatDateFromDb(expenseData.date)
                      }}
                    </p>
                    <input
                      type="datetime-local"
                      v-model="expenseData.date"
                      class="w-[35px] px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <!-- Sender -->
                <div>
                  <p class="text-[12px] font-medium pb-2">Sender</p>
                  <input
                    type="text"
                    v-model="expenseData.sender"
                    :class="
                      expenseData.sender != '' &&
                      expenseData.sender == 'MR. THIHA@KUMAR BHUSAL'
                        ? 'text-gray-400'
                        : ''
                    "
                    placeholder="Enter sender name"
                    class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#FF613c] text-xs"
                  />
                </div>

                <!-- Receiver -->
                <div>
                  <div class="flex justify-between items-center">
                    <p class="text-[12px] font-medium pb-2">Receiver</p>
                    <button
                      class="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800"
                      @click="goToProduct"
                    >
                      link to product
                    </button>
                  </div>
                  <input
                    type="text"
                    v-model="expenseData.reciever"
                    :class="
                      expenseData.reciever != '' &&
                      expenseData.reciever ==
                        detail?.items[0]?.product?.account_name
                        ? 'text-gray-400'
                        : ''
                    "
                    placeholder="Enter receiver name"
                    class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#FF613c] text-xs"
                  />
                </div>

                <!-- Amount -->
                <div>
                  <p class="text-[12px] font-medium pb-2">Amount</p>
                  <input
                    type="number"
                    v-model="expenseData.amount"
                    placeholder="Enter amount"
                    class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#FF613c] text-xs"
                  />
                </div>

                <!-- Interact Bank -->
                <div>
                  <p class="text-[12px] font-medium pb-2">
                    Interact Bank <span class="opacity-0">.....</span>
                  </p>
                  <select
                    v-model="expenseData.interact_bank"
                    class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#FF613c] text-xs"
                  >
                    <option value="personal">Personal</option>
                    <option value="company">Company</option>
                    <option value="cash_at_office">Cash at Office</option>
                    <option value="to_money_changer">To Money Changer</option>
                    <option value="deposit_management">
                      Deposit Management
                    </option>
                    <option value="pay_to_driver">Pay to Driver</option>
                  </select>
                </div>

                <!-- Currency -->
                <div class="flex justify-between items-center">
                  <label class="text-[12px] font-medium">Currency</label>
                  <select
                    v-model="expenseData.currency"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none focus:border-[#FF613c] text-xs"
                  >
                    <option value="MMK">MMK</option>
                    <option value="THB">THB</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <!-- Action Buttons -->
                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <button
                    v-if="!expenseData?.id"
                    @click="createExpense"
                    :disabled="loading"
                    class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-[12px] cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ loading ? "Saving..." : "Save" }}
                  </button>
                  <button
                    v-if="expenseData?.id"
                    @click="updateExpense"
                    :disabled="loading"
                    class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[12px] cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ loading ? "Updating..." : "Update" }}
                  </button>
                  <button
                    v-if="expenseData?.id"
                    @click="deleteExpense"
                    :disabled="loading"
                    class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[12px] cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    @click="closeModal"
                    class="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 text-[12px] cursor-pointer rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import Modal from "../../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute, useRouter } from "vue-router";
import { useCashImageStore } from "../../../stores/cashImage";
import { formattedDateTimeDB } from "../../help/FormatData";

const toast = useToast();
const cashImageStore = useCashImageStore();
const route = useRoute();
const router = useRouter();

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

// State
const loading = ref(false);
const carModalOpen = ref(false);
const fileInputThree = ref(null);
const uploadRecePreview = ref([]);

// Form Data
const formData = ref({
  receipt_image: [],
});

// Edit Data
const editData = ref({
  expenses: [],
});

// Expense Data
const expenseData = ref({
  index: "",
  id: "",
  file: null,
  amount: 0,
  date: "",
  bank_name: "",
  sender: "MR. THIHA@KUMAR BHUSAL",
  reciever: props?.detail?.items[0]?.product?.account_name,
  interact_bank: "personal",
  currency: "THB",
});

// Methods
const openFilePickerThree = () => {
  fileInputThree.value.click();
};

const recehandleFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    formData.value.receipt_image = [];
    uploadRecePreview.value = [];

    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.receipt_image.push(selectedFile[index]);
      uploadRecePreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const clearUploadPreview = () => {
  formData.value.receipt_image = [];
  uploadRecePreview.value = [];
};

const openAddModal = () => {
  clearExpenseData();
  carModalOpen.value = true;
};

const openEditModal = (data, index) => {
  carModalOpen.value = true;
  expenseData.value = {
    index: index,
    id: data.id,
    file: data.image,
    amount: data.amount,
    date: data.date,
    bank_name: data.bank_name,
    sender: data.sender ? data.sender : "MR. THIHA@KUMAR BHUSAL",
    reciever: data.reciever
      ? data.reciever
      : props?.detail?.items[0]?.product?.account_name,
    interact_bank: data.interact_bank || "personal",
    currency: data.currency ? data.currency : "THB",
  };
};

const closeModal = () => {
  carModalOpen.value = false;
  clearExpenseData();
  clearUploadPreview();
};

const clearExpenseData = () => {
  expenseData.value = {
    index: "",
    id: "",
    file: null,
    amount: 0,
    date: "",
    bank_name: "",
    sender: "MR. THIHA@KUMAR BHUSAL",
    reciever: props?.detail?.items[0]?.product?.account_name,
    interact_bank: "personal",
    currency: "THB",
  };
};

const goToProduct = () => {
  if (props.detail?.items[0]?.product_type == "App\\Models\\Hotel") {
    router.push(`/product/hotel/edit/${props.detail?.items[0]?.product_id}`);
  } else {
    router.push(`/products/6?edit=${props.detail?.items[0]?.product_id}`);
  }
};

const createExpense = async () => {
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("relatable_type", "App\\Models\\BookingItemGroup");
    frmData.append("relatable_id", route.query.id);
    frmData.append("amount", expenseData.value.amount);
    frmData.append("sender", expenseData.value.sender);
    frmData.append("reciever", expenseData.value.reciever);
    frmData.append(
      "interact_bank",
      expenseData.value.interact_bank ?? "personal"
    );
    frmData.append("currency", expenseData.value.currency ?? "THB");
    frmData.append("date", formattedDateTimeDB(expenseData.value.date));

    if (formData.value.receipt_image.length > 0) {
      let file = formData.value.receipt_image[0];
      frmData.append("image", file);
    }

    const res = await cashImageStore.addNewAction(frmData);

    if (res) {
      toast.success("Receipt created successfully");
      await props.getDetailAction(route.query.id);
      closeModal();
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to create receipt");
  } finally {
    loading.value = false;
  }
};

const updateExpense = async () => {
  loading.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("relatable_type", "App\\Models\\BookingItemGroup");
    frmData.append("relatable_id", route.query.id);
    frmData.append("amount", expenseData.value.amount);
    frmData.append("sender", expenseData.value.sender);
    frmData.append("reciever", expenseData.value.reciever);
    frmData.append(
      "interact_bank",
      expenseData.value.interact_bank ?? "personal"
    );
    frmData.append("currency", expenseData.value.currency ?? "THB");
    frmData.append("date", formattedDateTimeDB(expenseData.value.date));

    const res = await cashImageStore.updateAction(
      frmData,
      expenseData.value.id
    );

    if (res) {
      toast.success("Receipt updated successfully");
      await props.getDetailAction(route.query.id);
      closeModal();
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to update receipt");
  } finally {
    loading.value = false;
  }
};

const deleteExpense = async () => {
  if (!confirm("Are you sure you want to delete this receipt?")) {
    return;
  }

  loading.value = true;
  try {
    const res = await cashImageStore.deleteAction(expenseData.value.id);

    if (res.status == 1) {
      toast.success("Receipt deleted successfully");
      await props.getDetailAction(route.query.id);
      closeModal();
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete receipt");
  } finally {
    loading.value = false;
  }
};

// Date Formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const formatDateFromDb = (dateString) => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthName = monthNames[parseInt(month) - 1];
  return `${day}/${monthName}/${year} ${timePart}`;
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    if (dateString.includes("T")) {
      return formatDate(dateString);
    } else {
      return formatDateFromDb(dateString);
    }
  } catch (error) {
    return dateString;
  }
};

// Populate expenses from detail
const populateExpenses = () => {
  if (props.detail && props.detail.expense) {
    editData.value.expenses = props.detail.expense;
  }
};

// Watchers
watch(
  () => props.detail,
  (newValue) => {
    if (newValue) {
      populateExpenses();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.detail) {
    populateExpenses();
  }
});
</script>
