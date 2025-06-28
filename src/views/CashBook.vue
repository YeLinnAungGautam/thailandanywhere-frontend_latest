<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Cash Book
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-5">
        <!-- header -->
        <div>
          <CashHeader />
        </div>

        <!-- Filters -->
        <div class="pb-4 grid grid-cols-6 gap-4">
          <div class="col-span-1">
            <select
              v-model="filters.type"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div class="col-span-1">
            <select
              v-model="filters.cash_structure_id"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
            >
              <option value="">All Structures</option>
              <option
                v-for="structure in cash_structures?.data ?? []"
                :key="structure.id"
                :value="structure.id"
              >
                {{ structure.name }}
              </option>
            </select>
          </div>
          <div class="col-span-1">
            <input
              v-model="filters.start_date"
              type="date"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
              placeholder="Start Date"
            />
          </div>
          <div class="col-span-1">
            <input
              v-model="filters.end_date"
              type="date"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
              placeholder="End Date"
            />
          </div>
          <div class="col-span-1">
            <input
              v-model="filters.limit"
              type="number"
              min="1"
              max="100"
              class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
              placeholder="Limit"
            />
          </div>
          <div class="col-span-1">
            <button
              @click="clearFilters"
              class="w-full bg-gray-500 text-white px-3 py-2 text-xs rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div class="grid grid-cols-8 gap-4">
          <div class="overflow-x-auto col-span-5">
            <table
              class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
              >
                <tr>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Reference
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Date
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Type
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Structure
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Amount
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Bank
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Images
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20"
                  ></th>
                </tr>
              </thead>

              <tbody class="border border-gray-400/20">
                <tr
                  v-for="item in cashBooks?.data ?? []"
                  :key="item.id"
                  class="border border-gray-400/20 even:bg-gray-50"
                >
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.reference_number }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ formatDate(item?.date) }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium px-3 py-3 border-l border-gray-400/20"
                  >
                    <span
                      :class="
                        item?.income_or_expense === 'income'
                          ? 'text-green-600 bg-green-100'
                          : 'text-red-600 bg-red-100'
                      "
                      class="px-2 py-1 rounded-full text-[10px]"
                    >
                      {{ item?.income_or_expense }}
                    </span>
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.cash_structure?.name ?? "-" }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ getTotalAmount(item?.chart_of_accounts) }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.interact_bank ?? "-" }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <span
                      v-if="item?.cash_images?.length > 0"
                      class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-[10px]"
                    >
                      {{ item.cash_images.length }} images
                    </span>
                    <span v-else class="text-gray-400">No images</span>
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] flex justify-end items-center gap-x-8 font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <PencilSquareIcon
                      class="w-4 h-4 cursor-pointer text-blue-600"
                      @click="editGetFormData(item)"
                    />
                    <TrashIcon
                      class="w-4 h-4 cursor-pointer text-red-600"
                      @click="onDeleteHandler(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <!-- pagination -->
              <Pagination
                v-if="!loading"
                :data="cashBooks"
                @change-page="changePage"
              />
            </div>
          </div>

          <!-- Form Section -->
          <div class="col-span-3">
            <div class="col-span-1 p-4 rounded-lg shadow space-y-4">
              <!-- Basic Information -->
              <div class="space-y-3">
                <h3 class="font-medium text-gray-800">Basic Information</h3>

                <div class="space-y-2">
                  <label class="text-[11px]">Reference Number</label>
                  <input
                    v-model="formData.reference_number"
                    type="text"
                    class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    placeholder="Auto-generated if empty"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div class="space-y-2">
                    <label class="text-[11px]">Date</label>
                    <input
                      v-model="formData.date_only"
                      type="date"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[11px]">Time</label>
                    <input
                      v-model="formData.time_only"
                      type="time"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[11px]">Type</label>
                  <select
                    v-model="formData.income_or_expense"
                    class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="">Select Type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-[11px]">Cash Structure</label>
                  <select
                    v-model="formData.cash_structure_id"
                    class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="">Select Structure</option>
                    <option
                      v-for="structure in cash_structures?.data ?? []"
                      :key="structure.id"
                      :value="structure.id"
                    >
                      {{ structure.name }}
                    </option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-[11px]">Interact Bank</label>
                  <input
                    v-model="formData.interact_bank"
                    type="text"
                    class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    placeholder="Bank name"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-[11px]">Description</label>
                  <textarea
                    v-model="formData.description"
                    class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    rows="3"
                    placeholder="Description"
                  ></textarea>
                </div>
              </div>

              <!-- Accounts Section -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <h3 class="font-medium text-gray-800">Accounts</h3>
                  <button
                    @click="addAccount"
                    class="bg-green-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Add Account
                  </button>
                </div>

                <div
                  v-for="(account, index) in formData.accounts"
                  :key="index"
                  class="border border-gray-200 rounded p-3 space-y-2"
                >
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-medium"
                      >Account {{ index + 1 }}</span
                    >
                    <button
                      @click="removeAccount(index)"
                      class="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="space-y-2">
                    <SelectAccount
                      v-model="account.id"
                      :accounts="chartOfAccounts?.data ?? []"
                      @change="onAccountChange($event, index)"
                    />

                    <input
                      v-model="account.allocated_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                      placeholder="Amount"
                    />

                    <textarea
                      v-model="account.note"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                      rows="2"
                      placeholder="Note (optional)"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Images Section -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <h3 class="font-medium text-gray-800">Images</h3>
                  <button
                    @click="addImage"
                    class="bg-blue-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Add Image
                  </button>
                </div>

                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="border border-gray-200 rounded p-3 space-y-2"
                >
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-medium"
                      >Image {{ index + 1 }}</span
                    >
                    <button
                      @click="removeImage(index)"
                      class="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="space-y-2">
                    <input
                      @change="handleImageUpload($event, index)"
                      type="file"
                      accept="image/*"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    />

                    <div class="grid grid-cols-2 gap-2">
                      <input
                        v-model="image.sender"
                        type="text"
                        class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                        placeholder="Sender"
                      />
                      <input
                        v-model="image.receiver"
                        type="text"
                        class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                        placeholder="Receiver"
                      />
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <input
                        v-model="image.amount"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                        placeholder="Amount"
                      />
                      <select
                        v-model="image.currency"
                        class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                      >
                        <option value="">Currency</option>
                        <option value="MMK">MMK</option>
                        <option value="THB">THB</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>

                    <input
                      v-model="image.interact_bank"
                      type="text"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                      placeholder="Bank"
                    />

                    <input
                      v-model="image.date"
                      type="datetime-local"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-4 flex justify-between items-center gap-x-2">
                <button
                  @click="formData.id ? updateHandler() : addNewHandler()"
                  class="bg-[#FF613c] text-white px-4 py-2 text-xs w-full rounded-lg"
                  :disabled="loading"
                >
                  {{ formData?.id ? "Update" : "Save" }}
                </button>
                <button
                  @click="clearAction()"
                  class="bg-white border border-gray-400 text-black px-4 py-2 text-xs w-full rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import CashHeader from "../components/CashHeader.vue";
import { useCashBookStore } from "../stores/cashBook";
import { useCashStructureStore } from "../stores/cashStructure";
import { useChartOfAccountStore } from "../stores/chartofAccount";
import SelectAccount from "../components/SelectAccount.vue";

const sideBarStore = useSidebarStore();
const cashBookStore = useCashBookStore();
const cashStructureStore = useCashStructureStore();
const chartOfAccountStore = useChartOfAccountStore();

const { isShowSidebar } = storeToRefs(sideBarStore);
const { cashBooks, loading } = storeToRefs(cashBookStore);
const { cash_structures } = storeToRefs(cashStructureStore);
const { chartOfAccounts } = storeToRefs(chartOfAccountStore);

const toast = useToast();

// Filters
const filters = ref({
  type: "",
  cash_structure_id: "",
  start_date: "",
  end_date: "",
  limit: 10,
});

// Form Data
const formData = ref({
  id: "",
  reference_number: "",
  date_only: "",
  time_only: "",
  income_or_expense: "",
  cash_structure_id: "",
  interact_bank: "",
  description: "",
  accounts: [],
  images: [],
});

const changePage = (page) => {
  cashBookStore.getChangePage(page, filters.value);
};

const clearAction = () => {
  formData.value = {
    id: "",
    reference_number: "",
    date_only: "",
    time_only: "",
    income_or_expense: "",
    cash_structure_id: "",
    interact_bank: "",
    description: "",
    accounts: [],
    images: [],
  };
};

const clearFilters = () => {
  filters.value = {
    type: "",
    cash_structure_id: "",
    start_date: "",
    end_date: "",
    limit: 10,
  };
  getAction();
};

const editGetFormData = (data) => {
  formData.value.id = data.id;
  formData.value.reference_number = data.reference_number;

  // Parse date
  if (data.date) {
    const date = new Date(data.date);
    formData.value.date_only = date.toISOString().split("T")[0];
    formData.value.time_only = date
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5); // Get HH:mm format
  }

  formData.value.income_or_expense = data.income_or_expense;
  formData.value.cash_structure_id = data.cash_structure_id;
  formData.value.interact_bank = data.interact_bank || "";
  formData.value.description = data.description || "";

  // Map accounts
  formData.value.accounts =
    data.chart_of_accounts?.map((account) => ({
      id: account.id,
      allocated_amount: account.pivot?.allocated_amount || 0,
      note: account.pivot?.note || "",
    })) || [];

  // Map images
  formData.value.images =
    data.cash_images?.map((img) => ({
      id: img.id,
      sender: img.sender,
      receiver: img.receiver,
      amount: img.amount,
      currency: img.currency,
      interact_bank: img.interact_bank || "",
      date: formatDateTimeForInput(img.date),
      image: null, // For file upload
    })) || [];
};

const getAction = async () => {
  await cashBookStore.getListAction(filters.value);
};

const addNewHandler = async () => {
  if (!formData.value.income_or_expense) {
    toast.error("Please select income or expense type");
    return;
  }

  if (!formData.value.cash_structure_id) {
    toast.error("Please select cash structure");
    return;
  }

  if (formData.value.accounts.length === 0) {
    toast.error("Please add at least one account");
    return;
  }

  try {
    const payload = prepareFormData();
    await cashBookStore.addNewAction(payload);
    clearAction();
    toast.success("Cash book entry created successfully");
    await getAction();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create entry");
  }
};

const updateHandler = async () => {
  if (!formData.value.income_or_expense) {
    toast.error("Please select income or expense type");
    return;
  }

  if (!formData.value.cash_structure_id) {
    toast.error("Please select cash structure");
    return;
  }

  try {
    const payload = prepareFormData();
    await cashBookStore.updateAction(payload, formData.value.id);
    clearAction();
    toast.success("Cash book entry updated successfully");
    await getAction();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update entry");
  }
};

const prepareFormData = () => {
  const frmData = new FormData();

  if (formData.value.id) {
    frmData.append("_method", "PUT");
  }

  frmData.append("reference_number", formData.value.reference_number);

  // Combine date and time and format properly
  if (formData.value.date_only && formData.value.time_only) {
    const datetime = `${formData.value.date_only} ${formData.value.time_only}:00`;
    frmData.append("date", datetime);
  } else if (formData.value.date_only) {
    // If only date is provided, add default time
    const datetime = `${formData.value.date_only} 00:00:00`;
    frmData.append("date", datetime);
  }

  frmData.append("income_or_expense", formData.value.income_or_expense);
  frmData.append("cash_structure_id", formData.value.cash_structure_id);
  frmData.append("interact_bank", formData.value.interact_bank);
  frmData.append("description", formData.value.description);

  // Add accounts
  formData.value.accounts.forEach((account, index) => {
    frmData.append(`accounts[${index}][id]`, account.id);
    frmData.append(
      `accounts[${index}][allocated_amount]`,
      account.allocated_amount
    );
    frmData.append(`accounts[${index}][note]`, account.note);
  });

  // Add images with proper datetime formatting
  formData.value.images.forEach((image, index) => {
    if (image.image) {
      frmData.append(`images[${index}][image]`, image.image);
    }
    frmData.append(`images[${index}][sender]`, image.sender);
    frmData.append(`images[${index}][receiver]`, image.receiver);
    frmData.append(`images[${index}][amount]`, image.amount);
    frmData.append(`images[${index}][currency]`, image.currency);
    frmData.append(`images[${index}][interact_bank]`, image.interact_bank);

    // Format image date properly
    if (image.date) {
      const formattedDate = formatDateTimeForServer(image.date);
      frmData.append(`images[${index}][date]`, formattedDate);
    }
  });

  return frmData;
};

const onDeleteHandler = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await cashBookStore.deleteAction(id);
        toast.success(response.message);
        await getAction();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete");
      }
    }
  });
};

const onAccountChange = (account, index) => {
  // Optional: You can perform additional actions when account is selected
  console.log("Account selected:", account);
  // The v-model will automatically update the account.id
};

// Account management
const addAccount = () => {
  formData.value.accounts.push({
    id: "",
    allocated_amount: 0,
    note: "",
  });
};

const removeAccount = (index) => {
  formData.value.accounts.splice(index, 1);
};

// Image management
const addImage = () => {
  // Get current datetime in the format expected by datetime-local input
  const now = new Date();
  const formattedNow = formatDateTimeForInput(now);

  formData.value.images.push({
    image: null,
    sender: "",
    receiver: "",
    amount: 0,
    currency: "THB",
    interact_bank: "",
    date: formattedNow,
  });
};

const removeImage = (index) => {
  formData.value.images.splice(index, 1);
};

const handleImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    // Store the file object directly
    formData.value.images[index].image = file;
  }
};

// Utility functions
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTimeForServer = (dateTimeString) => {
  if (!dateTimeString) return "";

  // If it's already in the correct format, return as is
  if (dateTimeString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
    return dateTimeString;
  }

  // Convert datetime-local format (YYYY-MM-DDTHH:mm) to Y-m-d H:i:s
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatDateTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return "";

  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return "";

  // Format for datetime-local input (YYYY-MM-DDTHH:mm)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getTotalAmount = (accounts) => {
  if (!accounts || accounts.length === 0) return "0.00";
  const total = accounts.reduce((sum, account) => {
    return sum + (parseFloat(account.pivot?.allocated_amount) || 0);
  }, 0);
  return total.toFixed(2);
};

// Watch filters for auto-refresh
watch(
  filters,
  debounce(async () => {
    await getAction();
  }, 500),
  { deep: true }
);

onMounted(async () => {
  await Promise.all([
    getAction(),
    cashStructureStore.getSimpleListAction(),
    chartOfAccountStore.getSimpleListAction(),
  ]);

  console.log("chartofAccount", chartOfAccounts.value);
});
</script>
