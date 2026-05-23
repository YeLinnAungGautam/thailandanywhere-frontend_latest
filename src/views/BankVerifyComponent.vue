<template>
  <div class="bg-gray-50 py-6 min-h-screen font-sans">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#FF613c] inline-block"></span>
        <h1 class="text-xl font-bold text-[#FF613c] tracking-tight">
          Bank Verify
        </h1>
        <!-- <span
          class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
        >
          {{ cashImages?.total ?? 0 }} records
        </span> -->
      </div>
      <div class="flex items-center gap-2">
        <YearPickerVue @year-change="handleYearChange" />
        <select
          v-model="selectedMonth"
          @change="handleMonthChange(selectedMonth)"
          class="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none cursor-pointer"
        >
          <option :value="m.id" v-for="m in monthArray" :key="m.id">
            {{ m.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-2 mb-4 flex-wrap relative">
      <!-- Search -->
      <div class="relative flex-shrink-0 w-64">
        <MagnifyingGlassIcon
          class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
        />
        <input
          type="search"
          v-model="searchKey.crm_id"
          placeholder="Search CRM ID or Amount…"
          @keyup.enter="searchAction"
          class="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-[#FF613c] transition-colors"
        />
      </div>

      <!-- Filter button -->
      <div class="relative">
        <button
          @click="filterShow = !filterShow"
          class="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white hover:border-[#FF613c] hover:text-[#FF613c] transition-colors"
        >
          <FunnelIcon class="w-3.5 h-3.5" />
          Filter
          <span
            v-if="searchCount > 0"
            class="bg-[#FF613c] text-white text-[10px] px-1.5 rounded-full leading-5"
          >
            {{ searchCount }}
          </span>
        </button>

        <!-- Dropdown -->
        <transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="filterShow"
            class="absolute top-full left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-3 flex flex-col gap-2.5"
          >
            <div
              class="flex justify-between items-center pb-2 border-b border-gray-100"
            >
              <span class="text-xs font-semibold text-gray-700">Filters</span>
              <button
                @click="clearFilter"
                class="text-[11px] text-[#FF613c] hover:underline"
              >
                Clear all
              </button>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Sender</label
              >
              <input
                type="text"
                v-model="searchKey.sender"
                placeholder="Sender name"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Receiver</label
              >
              <input
                type="text"
                v-model="searchKey.receiver"
                placeholder="Receiver name"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Currency</label
              >
              <select
                v-model="searchKey.currency"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
              >
                <option value="">All</option>
                <option value="THB">THB</option>
                <option value="MMK">MMK</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Interact Bank</label
              >
              <select
                v-model="searchKey.interact_bank"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
              >
                <option value="">Interact All</option>
                <option value="personal">Personal</option>
                <option value="company">Company</option>
                <option value="cash_at_office">Cash at Office</option>
                <option value="to_money_changer">To Money Changer</option>
                <option value="deposit_management">Deposit Management</option>
                <option value="pay_to_driver">Pay to Driver</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Data Verify</label
              >
              <select
                v-model="searchKey.data_verify"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
              >
                <option value="">Choose Status</option>
                <option value="1">Verify</option>
                <option value="0">Un verify</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Bank Verify</label
              >
              <select
                v-model="searchKey.bank_verify"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
              >
                <option value="">Choose Bank Status</option>
                <option value="1">Verify</option>
                <option value="0">Un verify</option>
              </select>
            </div>
            <div class="pt-1.5 border-t border-gray-100">
              <button
                @click="searchAction"
                class="w-full py-2 bg-[#FF613c] text-white text-xs font-semibold rounded-lg hover:bg-[#e84e2a] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Active chips -->
      <div class="flex gap-1.5 flex-wrap items-center">
        <span
          v-if="searchKey.sender"
          class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full"
        >
          Sender: {{ searchKey.sender }}
          <XMarkIcon
            class="w-3 h-3 cursor-pointer"
            @click="removeFilter('sender')"
          />
        </span>
        <span
          v-if="searchKey.receiver"
          class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full"
        >
          Receiver: {{ searchKey.receiver }}
          <XMarkIcon
            class="w-3 h-3 cursor-pointer"
            @click="removeFilter('receiver')"
          />
        </span>
        <span
          v-if="searchKey.currency"
          class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full"
        >
          {{ searchKey.currency }}
          <XMarkIcon
            class="w-3 h-3 cursor-pointer"
            @click="removeFilter('currency')"
          />
        </span>
        <span
          v-if="searchKey.interact_bank"
          class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full capitalize"
        >
          {{ searchKey.interact_bank }}
          <XMarkIcon
            class="w-3 h-3 cursor-pointer"
            @click="removeFilter('interact_bank')"
          />
        </span>
        <span
          v-if="searchKey.data_verify"
          class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full capitalize"
        >
          {{ searchKey.data_verify == 1 ? "Data Verify" : "Data Un Verify" }}
          <XMarkIcon
            class="w-3 h-3 cursor-pointer"
            @click="removeFilter('data_verify')"
          />
        </span>
        <span
          v-if="searchKey.bank_verify"
          class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full capitalize"
        >
          {{ searchKey.bank_verify == 1 ? "Bank Verify" : "Bank Un Verify" }}
          <XMarkIcon
            class="w-3 h-3 cursor-pointer"
            @click="removeFilter('bank_verify')"
          />
        </span>
      </div>
    </div>

    <!-- Table card -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- Skeleton -->
      <template v-if="loading">
        <div class="divide-y divide-gray-100">
          <div
            v-for="i in 8"
            :key="i"
            class="flex gap-4 px-5 py-3.5 items-center"
          >
            <div class="h-3 bg-gray-100 rounded-full w-20 animate-pulse"></div>
            <div class="h-3 bg-gray-100 rounded-full w-36 animate-pulse"></div>
            <div class="h-3 bg-gray-100 rounded-full w-28 animate-pulse"></div>
            <div
              class="h-3 bg-gray-100 rounded-full w-20 animate-pulse ml-auto"
            ></div>
            <div class="h-3 bg-gray-100 rounded-full w-16 animate-pulse"></div>
            <div class="h-7 bg-gray-100 rounded-lg w-20 animate-pulse"></div>
          </div>
        </div>
      </template>

      <table v-else class="w-full text-sm">
        <thead>
          <tr
            class="bg-gray-50 border-b divide-x divide-gray-500 border-gray-200"
          >
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Date
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Time/ Eff.Date
            </th>
            <!-- <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Cash Unit
            </th> -->
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Sender → Receiver
            </th>
            <th
              colspan="2"
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Withdrawal / Deposit
            </th>

            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
            >
              Currency
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Interact Bank
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
            >
              Status
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="item in cashImages?.data ?? []"
            :key="item.id"
            :class="
              item.bank_verify == 1
                ? 'bg-green-50/60 hover:bg-green-100/60'
                : 'bg-white hover:bg-gray-50'
            "
            class="transition-colors divide-x divide-gray-500"
          >
            <!-- <td class="px-5 py-3.5">
              <span class="font-semibold text-gray-800 text-xs">{{
                `${item.unit}`
              }}</span>
            </td> -->
            <td class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
              {{ item.date.split(" ")[0] }}
            </td>
            <td class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
              {{ item.date.split(" ")[1] }}
            </td>
            <td class="px-5 py-3.5 w-[200px]">
              <div class="flex items-center gap-1.5 text-xs">
                <span class="font-medium text-gray-700">{{ item.sender }}</span>
                <ArrowRightIcon class="w-3 h-3 text-gray-400 shrink-0" />
                <span class="text-gray-500">{{ item.receiver }}</span>
              </div>
            </td>

            <td class="px-5 py-3.5 text-xs font-bold text-red-600 tabular-nums">
              <p v-if="item.relatable_type != 'App\\Models\\Booking'">
                {{ item.amount }}
              </p>
              <p v-if="item.relatable_type == 'App\\Models\\Booking'"></p>
            </td>
            <td
              class="px-5 py-3.5 text-xs font-bold text-green-600 tabular-nums"
            >
              <p v-if="item.relatable_type == 'App\\Models\\Booking'">
                {{ item.amount }}
              </p>
              <p v-if="item.relatable_type != 'App\\Models\\Booking'"></p>
            </td>

            <td class="px-5 py-3.5">
              <span
                class="inline-block text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
              >
                {{ item.currency }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <span
                class="inline-block text-[11px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md capitalize whitespace-nowrap"
              >
                {{ item.interact_bank }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <span
                :class="
                  item.bank_verify == 1
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                "
                class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
              >
                <span
                  :class="
                    item.bank_verify == 1 ? 'bg-green-500' : 'bg-yellow-500'
                  "
                  class="w-1.5 h-1.5 rounded-full"
                ></span>
                {{ item.bank_verify == 1 ? "Verified" : "Pending" }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <button
                @click="openModal(item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF613c] hover:bg-[#e84e2a] text-white text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0"
              >
                <CheckCircleIcon class="w-3.5 h-3.5" />
                Verify
              </button>
            </td>
          </tr>
          <tr v-if="(cashImages?.data ?? []).length === 0">
            <td colspan="8" class="text-center text-gray-400 text-sm py-16">
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-3" v-if="!loading">
      <Pagination :data="cashImages" @change-page="changePage" />
    </div>

    <!-- ───────── MODAL ───────── -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modalOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modalOpen"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0"
            >
              <div>
                <p
                  class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest"
                >
                  Bank Verification
                </p>
                <p class="text-lg font-bold text-gray-800 mt-0.5">
                  {{ modalItem?.crm_id || `#${modalItem?.id}` }}
                </p>
              </div>
              <button
                @click="closeModal"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon class="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <!-- Modal Loading -->
            <div
              v-if="loadingDetail"
              class="flex flex-col items-center justify-center gap-3 h-72 text-gray-400 text-sm"
            >
              <div
                class="w-8 h-8 border-2 border-gray-200 border-t-[#FF613c] rounded-full animate-spin"
              ></div>
              Loading details…
            </div>

            <!-- Modal Body -->
            <div v-else-if="detailVal" class="p-6 overflow-y-auto flex-1">
              <div class="grid grid-cols-2 gap-6">
                <!-- Image -->
                <div
                  class="col-span-1 rounded-xl overflow-hidden border border-gray-100 max-h-96 overflow-y-auto"
                >
                  <img
                    :src="detailVal.image"
                    class="w-full h-auto block"
                    alt="Cash slip"
                  />
                </div>

                <!-- Form -->
                <div class="col-span-1 flex flex-col gap-3">
                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Currency</label
                    >
                    <select
                      v-model="formData.currency"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white transition-colors"
                    >
                      <option value="THB">THB</option>
                      <option value="MMK">MMK</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>

                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Sender</label
                    >
                    <input
                      type="text"
                      v-model="formData.sender"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] transition-colors"
                    />
                  </div>

                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Receiver</label
                    >
                    <input
                      type="text"
                      v-model="formData.receiver"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] transition-colors"
                    />
                  </div>

                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Interact Bank</label
                    >
                    <select
                      v-model="formData.interact_bank"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white transition-colors"
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

                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Amount</label
                    >
                    <input
                      type="number"
                      v-model="formData.amount"
                      class="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] transition-colors"
                    />
                  </div>

                  <div class="flex items-center justify-between gap-3">
                    <label
                      class="text-xs font-medium text-gray-500 w-28 shrink-0"
                      >Date</label
                    >
                    <div class="flex-1">
                      <div
                        v-if="!showDate"
                        @click="showDate = true"
                        class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-[#FF613c] transition-colors"
                      >
                        <span
                          class="text-sm font-semibold flex-1 text-gray-700"
                          >{{ formattedDateTime(formData.date) }}</span
                        >
                        <PencilIcon
                          class="w-3.5 h-3.5 text-gray-400 shrink-0"
                        />
                      </div>
                      <input
                        v-else
                        type="datetime-local"
                        v-model="formData.date"
                        class="w-full px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] transition-colors"
                      />
                    </div>
                  </div>

                  <!-- Spacer -->
                  <div class="flex-1 min-h-4"></div>

                  <!-- Actions -->
                  <div
                    class="flex items-center gap-2 pt-3 border-t border-gray-100"
                  >
                    <button
                      @click="verifyStatus(false)"
                      :disabled="submitting"
                      class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-500 border border-red-200 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircleIcon class="w-4 h-4" />
                      Not Verified
                    </button>
                    <button
                      @click="submitUpdate"
                      :disabled="submitting"
                      class="flex items-center gap-1.5 flex-1 justify-center px-4 py-2 text-xs font-semibold text-white bg-[#FF613c] hover:bg-[#e84e2a] rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <CheckIcon class="w-4 h-4" />
                      {{ submitting ? "Saving…" : "Save & Verify" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Pagination from "../components/PaginationExpense.vue";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useCashImageStore } from "../stores/cashImage";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { formattedDateTime, formattedDateTimeDB } from "./help/FormatData";

const router = useRouter();
const route = useRoute();
const cashImageStore = useCashImageStore();
const { cashImages, loading } = storeToRefs(cashImageStore);
const toast = useToast();

const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);

const modalOpen = ref(false);
const modalItem = ref(null);
const detailVal = ref(null);
const loadingDetail = ref(false);
const submitting = ref(false);
const showDate = ref(false);

const filterShow = ref(false);
const searchKey = ref({
  crm_id: "",
  sender: "",
  receiver: "",
  currency: "",
  interact_bank: "",
  bank_verify: "",
  data_verify: "",
});
const saveUrl = ref("");

const formData = ref({
  id: "",
  date: "",
  sender: "",
  receiver: "",
  amount: 0,
  interact_bank: "personal",
  currency: "THB",
  relatable_id: "",
  relatable_type: "",
});

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

const searchCount = computed(
  () => Object.values(searchKey.value).filter((v) => v && v !== "").length,
);

const watchSystem = computed(() => {
  const result = {};
  result.interact_bank = "company";
  Object.keys(searchKey.value).forEach((k) => {
    if (searchKey.value[k]) result[k] = searchKey.value[k];
  });
  if (year.value && selectedMonth.value) {
    const start = new Date(year.value, selectedMonth.value - 1, 1);
    const end = new Date(year.value, selectedMonth.value, 0);
    const fmt = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;
    result.date = `${fmt(start)},${fmt(end)}`;
  }
  result.limit = 20;
  result.data_verify = 1;
  // result.relatable_type = "App\\Models\\Booking";
  result.sort_by = "date";
  result.sort_order = "asc";
  result.include_relatable = true;
  return result;
});

const getAction = async () => {
  if (saveUrl.value === "") {
    await cashImageStore.getListAction(watchSystem.value);
  } else {
    await changePage(saveUrl.value);
  }
};

const changePage = async (url) => {
  saveUrl.value = url;
  await cashImageStore.getChangePage(url, watchSystem.value);
};

const searchAction = async () => {
  filterShow.value = false;
  await getAction();
};

const clearFilter = () => {
  searchKey.value = {
    crm_id: "",
    sender: "",
    receiver: "",
    currency: "",
    interact_bank: "",
  };
  filterShow.value = false;
  getAction();
};

const removeFilter = (key) => {
  searchKey.value[key] = "";
  searchAction();
};
const handleYearChange = (y) => {
  year.value = y;
  getAction();
};
const handleMonthChange = (m) => {
  selectedMonth.value = m;
  getAction();
};
const formatCurrency = (amount) =>
  amount ? new Intl.NumberFormat().format(amount) : "0";

const convertToDatetimeLocal = (dateString) => {
  if (!dateString) return "";
  try {
    if (dateString.includes("T")) return dateString.slice(0, 16);
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, yearVal] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");
    return `${yearVal}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
};

const openModal = async (item) => {
  modalItem.value = item;
  modalOpen.value = true;
  showDate.value = false;
  loadingDetail.value = true;
  try {
    const res = await cashImageStore.getDetailAction(item.id);
    detailVal.value = res.result;
    formData.value = {
      id: detailVal.value.id,
      date: convertToDatetimeLocal(detailVal.value.date),
      sender: detailVal.value.sender,
      receiver: detailVal.value.receiver,
      amount: detailVal.value.amount,
      interact_bank: detailVal.value.interact_bank || "personal",
      currency: detailVal.value.currency,
      relatable_id: detailVal.value.relatable_id,
      relatable_type: detailVal.value.relatable_type,
    };
  } catch {
    toast.error("Failed to load details");
    closeModal();
  } finally {
    loadingDetail.value = false;
  }
};

const closeModal = () => {
  modalOpen.value = false;
  modalItem.value = null;
  detailVal.value = null;
};

const submitUpdate = async () => {
  submitting.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("amount", formData.value.amount);
    frmData.append("date", formattedDateTimeDB(formData.value.date));
    frmData.append("sender", formData.value.sender);
    frmData.append("reciever", formData.value.receiver);
    frmData.append("interact_bank", formData.value.interact_bank);
    frmData.append("currency", formData.value.currency);
    frmData.append("relatable_id", formData.value.relatable_id);
    frmData.append("relatable_type", formData.value.relatable_type);
    await cashImageStore.updateAction(frmData, formData.value.id);
    // toast.success("Updated successfully");
    await verifyStatus(true);
  } catch {
    toast.error("Update failed");
  } finally {
    submitting.value = false;
  }
};

const verifyStatus = async (status) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Mark this item as ${status ? "Verified" : "Not Verified"}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, confirm",
  });
  if (result.isConfirmed) {
    try {
      const frmData = new FormData();
      frmData.append("_method", "PUT");
      frmData.append("bank_verify", status ? 1 : 0);
      await cashImageStore.cashImageBankVerify(frmData, formData.value.id);
      toast.success(`Marked as ${status ? "Verified" : "Not Verified"}`);
      closeModal();
      await getAction();
    } catch {
      toast.error("Verification failed");
    }
  }
};

onMounted(async () => {
  if (route.query.month) selectedMonth.value = parseInt(route.query.month);
  if (route.query.year) year.value = parseInt(route.query.year);
  await getAction();
});
</script>
