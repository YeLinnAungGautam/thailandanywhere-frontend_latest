<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import AccountanceHeader from "../components/AccountanceHeader.vue";
import { useAccountClassStore } from "../stores/accountClass";
import { onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import { useChartOfAccountStore } from "../stores/chartofAccount";
import AccountanceSide from "../components/AccountanceSide.vue";
import { useRouter } from "vue-router";
import { formattedDate, formattedNumber } from "./help/FormatData";

const sideBarStore = useSidebarStore();
const accountClassStore = useAccountClassStore();
const chartOfAccountStore = useChartOfAccountStore();
const { isShowSidebar } = storeToRefs(sideBarStore);
const { accountClasses } = storeToRefs(accountClassStore);
const { chartOfAccounts, loading } = storeToRefs(chartOfAccountStore);
const router = useRouter();
const toast = useToast();

const changePage = (page) => {
  let data = {
    search: search.value,
    search_code: search_code.value,
    limit: limit.value,
  };
  if (date_range.value) {
    data.month = date_range.value;
  }
  chartOfAccountStore.getChangePage(page, data);
};

const search = ref("");
const limit = ref(50);
const search_code = ref("");
const formData = ref({
  account_name: "",
  account_code: "",
  account_class_id: "",
  account_head_id: "",
  product_type: "",
  connection: "",
  connection_detail: "",
  id: "",
});

const onOptionSelected = (option) => {
  console.log(option);
  formData.value.account_head_id = option.account_head.id;
};

const typeOptions = [
  {
    id: 1,
    name: "product_type",
  },
  {
    id: 2,
    name: "expense",
  },
];

const connectionOptions = [
  {
    id: 1,
    name: "vantour",
  },
  {
    id: 2,
    name: "hotel",
  },
  {
    id: 3,
    name: "ticket",
  },
  {
    id: 4,
    name: "tour",
  },
  {
    id: 5,
    name: "airline",
  },
];
const connectionDetailOptions = [
  {
    id: 1,
    name: "price",
  },
  {
    id: 2,
    name: "expense",
  },
];

const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1); // Adding 1 since getMonth() returns 0-11

const monthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

// Function to generate date range string for a specific month
const generateDateRangeForMonth = (month, yearValue) => {
  // Ensure month is a number between 1-12
  const monthNum = parseInt(month, 10);

  // Format month as MM with leading zero if needed
  const formattedMonth = monthNum.toString().padStart(2, "0");

  // Return in YYYY-MM format
  return `${yearValue}-${formattedMonth}`;
};

const date_range = ref("");
// Set date range based on month and year
const setMonthDateRange = (month, yearValue) => {
  date_range.value = generateDateRangeForMonth(month, yearValue);
};

const handleYearChange = (message) => {
  year.value = message;
  // Update date range when year changes
  setMonthDateRange(selectedMonth.value, year.value);
};

// Method to handle month change
const handleMonthChange = (month) => {
  selectedMonth.value = month;
  // Update date range when month changes
  setMonthDateRange(month, year.value);
};

const clearAction = () => {
  formData.value = {
    account_name: "",
    account_code: "",
    account_class_id: "",
    account_head_id: "",
    product_type: "",
    connection: "",
    connection_detail: "",
    id: "",
  };
};

const editGetFormData = (data) => {
  formData.value = {
    account_name: data.account_name,
    account_code: data.account_code,
    account_class_id: data.account_class?.id,
    account_head_id: data.account_head?.id,
    product_type: data.product_type,
    connection: data.connection,
    connection_detail: data.connection_detail,
    id: data.id,
  };
};

const getAction = async () => {
  let data = {
    search: search.value,
    search_code: search_code.value,
    month: date_range.value,
    limit: limit.value,
  };
  await chartOfAccountStore.getListAction(data);
};

const productIcomeChecker = (type) => {
  if (
    type == "4-1000-01" ||
    type == "4-1000-02" ||
    type == "4-1000-03" ||
    type == "3-1000-01" ||
    type == "3-1000-02" ||
    type == "3-1000-03"
  ) {
    router.push({
      name: "productIncomeChecker",
      query: {
        type: type,
        month: selectedMonth.value,
        year: year.value,
      },
    });
  }
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("account_name", formData.value.account_name);
  frmData.append("account_code", formData.value.account_code);
  frmData.append("account_class_id", formData.value.account_class_id);
  frmData.append("product_type", formData.value.product_type);
  frmData.append("connection", formData.value.connection);
  frmData.append("connection_detail", formData.value.connection_detail);
  frmData.append("account_head_id", formData.value.account_head_id); // Add account_head_id to the form data
  // Now you can use frmData to send the data to your server
  await chartOfAccountStore.addNewAction(frmData);
  clearAction();
  toast.success("Add new account head successfully");
  await getAction();
};

const updateHandler = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("account_name", formData.value.account_name);
  frmData.append("account_code", formData.value.account_code);
  frmData.append("account_class_id", formData.value.account_class_id);
  frmData.append("product_type", formData.value.product_type);
  frmData.append("connection", formData.value.connection);
  frmData.append("connection_detail", formData.value.connection_detail);
  frmData.append("account_head_id", formData.value.account_head_id); // Add account_head_id to the form data
  // Now you can use frmData to send the data to your server
  await chartOfAccountStore.updateAction(frmData, formData.value.id);
  clearAction();
  toast.success("Update account head successfully");
  await getAction();
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
        const response = await chartOfAccountStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
      await getAction();
    }
  });
};

onMounted(async () => {
  await getAction();
  await accountClassStore.getSimpleListAction();
});

watch(
  [search, search_code, limit],
  debounce(async (newValue) => {
    await getAction();
  }, 500)
);

watch(
  [date_range],
  debounce(async (newValue) => {
    if (newValue) {
      await getAction();
    }
  }, 500)
);
</script>

<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Chart of Account
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ year }}</span>
        <span
          class="w-2 h-2 mx-3 bg-[#FF613c] rounded-full inline-block"
        ></span>
        <span>{{ monthArray.find((m) => m.id == selectedMonth).name }}</span>
      </p>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-5">
        <!-- header -->
        <div>
          <AccountanceHeader />
        </div>

        <div class="pb-4 flex justify-start items-center gap-x-2">
          <input
            v-model="search"
            type="text"
            class="w-1/4 border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
            placeholder="search"
          />
          <input
            v-model="search_code"
            type="text"
            class="w-1/4 border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
            placeholder="search by sub code"
          />
          <YearPickerVue @year-change="handleYearChange" />
          <select
            v-model="selectedMonth"
            @change="handleMonthChange(selectedMonth)"
            class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
          >
            <option :value="m.id" v-for="m in monthArray" :key="m.id">
              {{ m.name }}
            </option>
          </select>
          <select
            v-model="limit"
            name=""
            id=""
            class="w-1/8 border border-gray-400/20 focus:outline-none rounded-lg px-3 py-2 text-xs"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>

        <div class="grid grid-cols-8 gap-4">
          <div class="overflow-x-auto col-span-6">
            <table
              class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
              >
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Sub Code
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Acc Class
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Connect
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 whitespace-nowrap"
                  >
                    Detail
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 bg-black text-white whitespace-nowrap"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 bg-black text-white whitespace-nowrap"
                  >
                    Verified
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 bg-black text-white whitespace-nowrap"
                  >
                    Issue
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20 bg-black text-white whitespace-nowrap"
                  >
                    Pending
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20"
                  ></th>
                </tr>
              </thead>

              <tbody class="border border-gray-400/20">
                <tr
                  v-for="item in chartOfAccounts?.data ?? []"
                  :key="item"
                  class="border border-gray-400/20 even:bg-gray-50"
                >
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 whitespace-nowrap border-l border-gray-400/20"
                  >
                    {{ item?.account_code }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.account_name }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium whitespace-nowrap text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.account_class?.name ?? "-" }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      item?.product_type && item?.product_type != "null"
                        ? item?.product_type
                        : "-"
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      item?.connection && item?.connection != "null"
                        ? item?.connection
                        : "-"
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      item?.connection_detail &&
                      item?.connection_detail != "null"
                        ? item?.connection_detail
                        : "-"
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      item?.connection_detail == "price"
                        ? item?.total_amount
                          ? formattedNumber(item?.total_amount)
                          : ""
                        : item?.total_cost_price
                        ? formattedNumber(item?.total_cost_price)
                        : ""
                    }}
                    {{
                      (item?.account_code == "1-3000-01" ||
                        item?.account_code == "1-3000-02" ||
                        item?.account_code == "1-3000-03") &&
                      item?.over_balance_due_total
                        ? formattedNumber(item?.over_balance_due_total)
                        : ""
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      formattedNumber(
                        item?.connection_detail == "price"
                          ? item?.verified_amount ?? 0
                          : item?.verified_cost_price ?? 0
                      )
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      formattedNumber(
                        item?.connection_detail == "price"
                          ? item?.unverified_amount ?? 0
                          : item?.unverified_cost_price ?? 0
                      )
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{
                      formattedNumber(
                        item?.connection_detail == "price"
                          ? item?.pending_amount ?? 0
                          : item?.pending_cost_price ?? 0
                      )
                    }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] flex justify-end items-center gap-x-8 font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <EyeIcon
                      class="w-4 h-4 cursor-pointer text-blue-600"
                      @click="productIcomeChecker(item?.account_code)"
                    />
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
            <div class="w-full">
              <!-- pagination -->
              <Pagination
                v-if="!loading"
                :data="chartOfAccounts"
                @change-page="changePage"
              />
            </div>
          </div>
          <div class="col-span-2">
            <div class="p-4 rounded-lg shadow space-y-2">
              <div class="space-y-2">
                <label for="" class="text-[11px]">Account Name</label>
                <input
                  v-model="formData.account_name"
                  type="text"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                  placeholder="name "
                />
              </div>
              <div class="space-y-2">
                <label for="" class="text-[11px]">Account Code</label>
                <input
                  v-model="formData.account_code"
                  type="text"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                  placeholder="code "
                />
              </div>
              <div class="space-y-2">
                <label for="" class="text-[11px]">Account Class</label>
                <v-select
                  v-model="formData.account_class_id"
                  class="style-chooser text-sm"
                  :options="accountClasses?.data"
                  label="name"
                  :clearable="false"
                  :reduce="(a) => a.id"
                  @option:selected="onOptionSelected"
                  placeholder=""
                ></v-select>
              </div>
              <div class="space-y-2">
                <label for="" class="text-[11px]">Type</label>
                <v-select
                  v-model="formData.product_type"
                  class="style-chooser text-sm"
                  :options="typeOptions"
                  label="name"
                  :clearable="false"
                  :reduce="(a) => a.name"
                  placeholder=""
                ></v-select>
              </div>
              <div class="space-y-2">
                <label for="" class="text-[11px]">Connection</label>
                <v-select
                  v-model="formData.connection"
                  class="style-chooser text-sm"
                  :options="connectionOptions"
                  label="name"
                  :clearable="false"
                  :reduce="(a) => a.name"
                  placeholder=""
                ></v-select>
              </div>
              <div class="space-y-2">
                <label for="" class="text-[11px]">Connection Detail</label>
                <v-select
                  v-model="formData.connection_detail"
                  class="style-chooser text-sm"
                  :options="connectionDetailOptions"
                  label="name"
                  :clearable="false"
                  :reduce="(a) => a.name"
                  placeholder=""
                ></v-select>
              </div>

              <div class="mt-4 flex justify-between items-center gap-x-2">
                <button
                  @click="formData.id ? updateHandler() : addNewHandler()"
                  class="bg-[#FF613c] text-white px-4 py-2 text-xs w-full rounded-lg"
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
