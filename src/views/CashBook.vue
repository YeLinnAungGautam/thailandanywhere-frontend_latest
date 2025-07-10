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
                    {{ item?.reference }}
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
                    <div class="flex flex-col gap-1">
                      <span
                        v-if="item?.cash_images?.length > 0"
                        class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-[10px]"
                      >
                        {{ item.cash_images.length }} detailed
                      </span>
                      <span
                        v-if="item?.cash_book_images?.length > 0"
                        class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-[10px]"
                      >
                        {{ item.cash_book_images.length }} simple
                      </span>
                      <span
                        v-if="
                          !item?.cash_images?.length &&
                          !item?.cash_book_images?.length
                        "
                        class="text-gray-400"
                        >No images</span
                      >
                    </div>
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
                  <select
                    v-model="formData.interact_bank"
                    class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="">Select Interact Bank</option>
                    <option value="personal">Personal</option>
                    <option value="company">Company</option>
                    <option value="cash_at_office">Cash at Office</option>
                    <option value="to_money_changer">To Money Changer</option>
                    <option value="deposit_management">
                      Deposit Management
                    </option>
                  </select>
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

                    <select
                      name=""
                      id=""
                      v-model="account.note"
                      placeholder="select debit or credit"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="1">Debit ( + )</option>
                      <option value="2">Credit ( - )</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Detailed Images Section (CashImage - polymorphic) -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <h3 class="font-medium text-gray-800">Cash Images</h3>
                  <button
                    @click="addImage"
                    class="bg-blue-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Add Detailed Image
                  </button>
                </div>

                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="border border-blue-200 rounded p-3 space-y-2"
                >
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-medium">
                      Detailed Image {{ index + 1 }}
                      <span v-if="image.is_existing" class="text-green-600 ml-1"
                        >(Existing)</span
                      >
                      <span v-else class="text-blue-600 ml-1">(New)</span>
                    </span>
                    <button
                      @click="removeImage(index)"
                      class="text-red-500 text-xs hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <!-- Show existing image if available -->
                  <div
                    v-if="image.existing_image && image.is_existing"
                    class="mb-2"
                  >
                    <label class="text-[11px] text-gray-600 block mb-1"
                      >Current Image:</label
                    >
                    <div class="flex items-center gap-2">
                      <img
                        :src="image.existing_image"
                        alt="Current image"
                        class="w-16 h-16 object-cover rounded border"
                      />
                      <div class="text-[10px] text-gray-500">
                        <p>ID: {{ image.id }}</p>
                        <p>Upload new image to replace</p>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div>
                      <label class="text-[11px] block mb-1">
                        {{
                          image.is_existing
                            ? "Replace Image (Optional)"
                            : "Upload Image"
                        }}
                      </label>
                      <input
                        @change="handleImageUpload($event, index)"
                        type="file"
                        accept="image/*"
                        class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                        :class="{
                          'border-green-300': image.is_existing && !image.image,
                        }"
                      />
                      <p
                        v-if="image.is_existing && !image.image"
                        class="text-[10px] text-green-600 mt-1"
                      >
                        Leave empty to keep current image
                      </p>
                    </div>

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

                    <select
                      v-model="image.interact_bank"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="">Select Interact Bank</option>
                      <option value="personal">Personal</option>
                      <option value="company">Company</option>
                      <option value="cash_at_office">Cash at Office</option>
                      <option value="to_money_changer">To Money Changer</option>
                      <option value="deposit_management">
                        Deposit Management
                      </option>
                    </select>

                    <input
                      v-model="image.date"
                      type="datetime-local"
                      class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <!-- Show message when no detailed images -->
                <div
                  v-if="formData.images.length === 0"
                  class="text-center py-4 text-gray-500 text-xs"
                >
                  No detailed images added yet. Click "Add Detailed Image" to
                  upload images with transaction details.
                </div>
              </div>

              <!-- Simple Images Section (CashBookImage - one-to-many) -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <h3 class="font-medium text-gray-800">Cash Book Images</h3>
                  <button
                    @click="addCashBookImage"
                    class="bg-green-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Add Simple Image
                  </button>
                </div>

                <div
                  v-for="(image, index) in formData.cash_book_images"
                  :key="index"
                  class="border border-green-200 rounded p-3 space-y-2"
                >
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-medium">
                      Simple Image {{ index + 1 }}
                      <span v-if="image.is_existing" class="text-green-600 ml-1"
                        >(Existing)</span
                      >
                      <span v-else class="text-orange-600 ml-1">(New)</span>
                    </span>
                    <button
                      @click="removeCashBookImage(index)"
                      class="text-red-500 text-xs hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <!-- Show existing image if available -->
                  <div
                    v-if="image.existing_image && image.is_existing"
                    class="mb-2"
                  >
                    <label class="text-[11px] text-gray-600 block mb-1"
                      >Current Image:</label
                    >
                    <div class="flex items-center gap-2">
                      <img
                        :src="image.existing_image"
                        alt="Current simple image"
                        class="w-16 h-16 object-cover rounded border"
                      />
                      <div class="text-[10px] text-gray-500">
                        <p>ID: {{ image.id }}</p>
                        <p>Upload new image to replace</p>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div>
                      <label class="text-[11px] block mb-1">
                        {{
                          image.is_existing
                            ? "Replace Image (Optional)"
                            : "Upload Image"
                        }}
                      </label>
                      <input
                        @change="handleCashBookImageUpload($event, index)"
                        type="file"
                        accept="image/*"
                        class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                        :class="{
                          'border-green-300': image.is_existing && !image.image,
                        }"
                      />
                      <p
                        v-if="image.is_existing && !image.image"
                        class="text-[10px] text-green-600 mt-1"
                      >
                        Leave empty to keep current image
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Show message when no simple images -->
                <div
                  v-if="formData.cash_book_images.length === 0"
                  class="text-center py-4 text-gray-500 text-xs"
                >
                  No simple images added yet. Click "Add Simple Image" to upload
                  basic images.
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
  images: [], // Detailed images (CashImage)
  cash_book_images: [], // Simple images (CashBookImage)
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
    cash_book_images: [],
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
  console.log(data, "this is data for edit");

  formData.value.id = data.id;
  formData.value.reference_number = data.reference;

  // Parse date - handle DD-MM-YYYY HH:mm:ss format
  if (data.date) {
    const dateStr = data.date;
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("-");
    const isoDateStr = `${year}-${month}-${day} ${timePart}`;

    const date = new Date(isoDateStr);
    if (!isNaN(date.getTime())) {
      formData.value.date_only = date.toISOString().split("T")[0];
      formData.value.time_only = date
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5);
    }
  }

  formData.value.income_or_expense = data.income_or_expense;
  formData.value.cash_structure_id = data.cash_structure?.id;
  formData.value.interact_bank = data.interact_bank || "";
  formData.value.description = data.description || "";

  // Map accounts
  formData.value.accounts =
    data.chart_of_accounts?.map((account) => ({
      id: account.id,
      allocated_amount: account.pivot?.allocated_amount || 0,
      note: account.pivot?.note || "",
    })) || [];

  // Map detailed images (CashImage - polymorphic)
  formData.value.images =
    data.cash_images?.map((img) => ({
      id: img.id,
      sender: img.sender,
      receiver: img.receiver,
      amount: img.amount,
      currency: img.currency,
      interact_bank: img.interact_bank || "",
      date: formatDateTimeForInput(img.date),
      image: null,
      existing_image: img.image,
      is_existing: true,
    })) || [];

  // Map simple images (CashBookImage - one-to-many)
  formData.value.cash_book_images =
    data.cash_book_images?.map((img) => ({
      id: img.id,
      image: null,
      existing_image: img.image,
      is_existing: true,
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

  // Add detailed images (CashImage - polymorphic) with proper handling for existing vs new images
  formData.value.images.forEach((image, index) => {
    // If it's an existing image, include the ID
    if (image.id && image.is_existing) {
      frmData.append(`images[${index}][id]`, image.id);
    }

    // Only append image file if a new one was selected
    if (image.image) {
      frmData.append(`images[${index}][image]`, image.image);
    }

    frmData.append(`images[${index}][sender]`, image.sender || "");
    frmData.append(`images[${index}][receiver]`, image.receiver || "");
    frmData.append(`images[${index}][amount]`, image.amount || 0);
    frmData.append(`images[${index}][currency]`, image.currency || "");
    frmData.append(
      `images[${index}][interact_bank]`,
      image.interact_bank || ""
    );

    // Format image date properly
    if (image.date) {
      const formattedDate = formatDateTimeForServer(image.date);
      frmData.append(`images[${index}][date]`, formattedDate);
    }
  });

  // Add simple images (CashBookImage - one-to-many)
  formData.value.cash_book_images.forEach((image, index) => {
    // If it's an existing image, include the ID
    if (image.id && image.is_existing) {
      frmData.append(`cash_book_images[${index}][id]`, image.id);
    }

    // Only append image file if a new one was selected
    if (image.image) {
      frmData.append(`cash_book_images[${index}][image]`, image.image);
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

// Detailed Image management (CashImage)
const addImage = () => {
  // Get current datetime in the format expected by datetime-local input
  const now = new Date();
  const formattedNow = formatDateTimeForInput(now);

  formData.value.images.push({
    id: null, // New image won't have ID
    image: null,
    sender: "",
    receiver: "",
    amount: 0,
    currency: "THB",
    interact_bank: "",
    date: formattedNow,
    existing_image: null,
    is_existing: false, // Flag for new images
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
    // Remove existing image flag when new image is uploaded
    formData.value.images[index].is_existing = false;
  }
};

// Simple Image management (CashBookImage)
const addCashBookImage = () => {
  formData.value.cash_book_images.push({
    id: null, // New image won't have ID
    image: null,
    existing_image: null,
    is_existing: false, // Flag for new images
  });
};

const removeCashBookImage = (index) => {
  formData.value.cash_book_images.splice(index, 1);
};

const handleCashBookImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    // Store the file object directly
    formData.value.cash_book_images[index].image = file;
    // Remove existing image flag when new image is uploaded
    formData.value.cash_book_images[index].is_existing = false;
  }
};

// Utility functions
const formatDate = (date) => {
  if (!date) return "-";

  try {
    let dateObj;

    // Check if date is in DD-MM-YYYY HH:mm:ss format
    if (
      typeof date === "string" &&
      date.includes("-") &&
      date.split("-")[0].length === 2
    ) {
      // Convert DD-MM-YYYY HH:mm:ss to YYYY-MM-DD HH:mm:ss
      const [datePart, timePart] = date.split(" ");
      const [day, month, year] = datePart.split("-");
      const isoDateStr = `${year}-${month}-${day} ${timePart}`;
      dateObj = new Date(isoDateStr);
    } else {
      // Handle other date formats
      dateObj = new Date(date);
    }

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return "Invalid Date";
  }
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

  let dateObj;

  // Handle DD-MM-YYYY HH:mm:ss format from your API
  if (
    typeof dateTimeString === "string" &&
    dateTimeString.includes("-") &&
    dateTimeString.split("-")[0].length === 2
  ) {
    const [datePart, timePart] = dateTimeString.split(" ");
    const [day, month, year] = datePart.split("-");
    const isoDateStr = `${year}-${month}-${day} ${timePart}`;
    dateObj = new Date(isoDateStr);
  } else {
    // Handle other date formats
    dateObj = new Date(dateTimeString);
  }

  if (isNaN(dateObj.getTime())) return "";

  // Format for datetime-local input (YYYY-MM-DDTHH:mm)
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

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
