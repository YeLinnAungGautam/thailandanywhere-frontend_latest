<template>
  <Layout class="min-h-screen">
    <div
      class="mb-4 bg-white p-2 rounded-lg drop-shadow flex justify-between items-center"
    >
      <h1 class="text-base font-bold text-gray-800 pl-4">Cash Image Report</h1>

      <!-- Month Filter -->
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium text-gray-700">Select Month:</label>
        <input
          type="month"
          v-model="monthForGraph"
          class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5B00] mb-4"
        ></div>
        <p class="text-gray-600">Loading cash image report...</p>
      </div>
    </div>

    <!-- Main Content with Right Panel -->
    <div v-else class="flex gap-6">
      <!-- Left Side - Charts Container -->
      <div class="space-y-6 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Monthly Agent Summary Chart -->
          <div class="bg-white p-6 rounded-lg shadow-md col-span-1">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-base font-semibold text-gray-800">
                Monthly Agent Summary
                <span class="capitalize">({{ currentShow }})</span>
              </h2>
              <div class="flex items-center gap-2">
                <button
                  @click="currentShow = 'thb'"
                  :class="{
                    'bg-orange-500 text-white': currentShow === 'thb',
                    'bg-gray-200 text-gray-700': currentShow !== 'thb',
                  }"
                  class="px-3 py-1 rounded-md text-xs"
                >
                  THB
                </button>
                <button
                  @click="currentShow = 'mmk'"
                  :class="{
                    'bg-orange-500 text-white': currentShow === 'mmk',
                    'bg-gray-200 text-gray-700': currentShow !== 'mmk',
                  }"
                  class="px-3 py-1 rounded-md text-xs"
                >
                  MMK
                </button>
              </div>
            </div>

            <p class="text-xs text-gray-500 mb-2">
              Click a bar to view cash images for that agent on that day
            </p>

            <div class="min-h-80">
              <BarChart
                v-if="
                  monthlyChartData.labels.length > 0 && currentShow === 'thb'
                "
                :chartData="monthlyChartData"
                :options="monthlyChartOptions"
              />
              <BarChart
                v-if="
                  monthlyChartMMKData.labels.length > 0 && currentShow === 'mmk'
                "
                :chartData="monthlyChartMMKData"
                :options="monthlyChartMMKOptions"
              />
              <div
                v-if="
                  monthlyChartData.labels.length === 0 &&
                  monthlyChartMMKData.labels.length === 0
                "
                class="flex items-center justify-center h-full text-gray-500"
              >
                No data available
              </div>
            </div>
          </div>
          <!-- Right Side Panel - Cash Images List -->
          <div
            v-if="showCashImagesPanel"
            class="col-span-1 bg-white rounded-lg"
          >
            <!-- Panel Header -->
            <div
              class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex justify-between items-center"
            >
              <div>
                <h3 class="text-lg font-bold">Cash Images</h3>
                <p class="text-xs opacity-90 mt-1">
                  {{ selectedAgentName }} - {{ monthlyData?.month }}
                  <span v-if="selectedCurrency" class="ml-2"
                    >({{ selectedCurrency }})</span
                  >
                </p>
              </div>
              <button
                @click="closeCashImagesPanel"
                class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Filters -->
            <div class="p-4 border-b bg-gray-50 space-y-3">
              <!-- Verification Filter -->
              <div>
                <div class="flex gap-2">
                  <button
                    @click="verificationFilter = 'all'"
                    :class="{
                      'bg-orange-500 text-white': verificationFilter === 'all',
                      'bg-gray-200 text-gray-700': verificationFilter !== 'all',
                    }"
                    class="px-3 py-1 rounded-md text-xs flex-1"
                  >
                    All
                  </button>
                  <button
                    @click="verificationFilter = 'verified'"
                    :class="{
                      'bg-green-500 text-white':
                        verificationFilter === 'verified',
                      'bg-gray-200 text-gray-700':
                        verificationFilter !== 'verified',
                    }"
                    class="px-3 py-1 rounded-md text-xs flex-1"
                  >
                    Verified
                  </button>
                  <button
                    @click="verificationFilter = 'unverified'"
                    :class="{
                      'bg-red-500 text-white':
                        verificationFilter === 'unverified',
                      'bg-gray-200 text-gray-700':
                        verificationFilter !== 'unverified',
                    }"
                    class="px-3 py-1 rounded-md text-xs flex-1"
                  >
                    Unverified
                  </button>
                </div>
              </div>

              <!-- Duplicate Filter -->
              <div>
                <div class="flex gap-2">
                  <button
                    @click="duplicateFilter = 'all'"
                    :class="{
                      'bg-orange-500 text-white': duplicateFilter === 'all',
                      'bg-gray-200 text-gray-700': duplicateFilter !== 'all',
                    }"
                    class="px-3 py-1 rounded-md text-xs flex-1"
                  >
                    All
                  </button>
                  <button
                    @click="duplicateFilter = 'duplicate'"
                    :class="{
                      'bg-yellow-500 text-white':
                        duplicateFilter === 'duplicate',
                      'bg-gray-200 text-gray-700':
                        duplicateFilter !== 'duplicate',
                    }"
                    class="px-3 py-1 rounded-md text-xs flex-1"
                  >
                    Show Duplicates
                  </button>
                </div>
              </div>

              <!-- Filter Summary -->
              <div class="text-xs text-gray-500">
                Showing {{ filteredImages.length }} of
                {{ allCashImages.length }} images
              </div>
            </div>

            <!-- Loading State -->
            <div
              v-if="loadingCashImages"
              class="flex-1 flex justify-center items-center p-8"
            >
              <div class="text-center">
                <div
                  class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"
                ></div>
                <p class="text-sm text-gray-600">Loading cash images...</p>
              </div>
            </div>

            <!-- Images List -->
            <div
              v-else
              class="flex-1 overflow-y-auto h-[310px] overflow-scroll p-4 space-y-3"
            >
              <div
                v-for="image in filteredImages"
                :key="image.id"
                class="border rounded-lg p-3 hover:shadow-md transition bg-white"
              >
                <div class="flex gap-3">
                  <!-- Thumbnail -->
                  <div
                    class="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                    @click="openImagePreview(image.image_url)"
                  >
                    <img
                      :src="image.image_url"
                      alt="Cash Image"
                      class="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>

                  <!-- Details -->
                  <div class="flex-1 space-y-1">
                    <div class="flex justify-between items-start">
                      <div>
                        <span class="font-bold text-orange-600">
                          {{ image.currency }} {{ formatAmount(image.amount) }}
                        </span>
                        <span
                          :class="{
                            'bg-green-100 text-green-800': image.data_verify,
                            'bg-red-100 text-red-800': !image.data_verify,
                          }"
                          class="ml-2 px-2 py-0.5 rounded text-xs font-medium"
                        >
                          {{ image.data_verify ? "Verified" : "Unverified" }}
                        </span>
                        <span
                          v-if="image.isDuplicate"
                          class="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium"
                        >
                          ⚠️ Duplicate
                        </span>
                      </div>
                    </div>

                    <div
                      v-if="image.booking_number"
                      class="text-xs text-gray-600"
                    >
                      📄 {{ image.booking_number }}
                    </div>

                    <div v-if="image.crm_id" class="text-xs text-gray-600">
                      🔖 CRM: {{ image.crm_id }}
                    </div>

                    <div
                      v-if="image.interact_bank"
                      class="text-xs text-gray-600"
                    >
                      🏦 {{ formatBankName(image.sender) }}
                    </div>

                    <div class="text-xs text-gray-400">
                      📅 {{ new Date(image.date).toLocaleString() }}
                    </div>
                  </div>

                  <div @click="cashImageDetail(image.id)">
                    <PencilSquareIcon class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- No Data State -->
              <div
                v-if="filteredImages.length === 0"
                class="text-center py-8 text-gray-500"
              >
                <svg
                  class="w-12 h-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p class="text-sm">No cash images found</p>
              </div>
            </div>
          </div>
          <div v-else>
            <p>click graph to see list</p>
          </div>

          <!-- Income & Expense by Bank/Account Type -->
          <div
            class="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-base font-semibold text-gray-800">
                Income & Expense by Bank/Account Type
              </h2>
              <div class="flex items-center gap-2">
                <button
                  @click="showByType = !showByType"
                  :class="{
                    'bg-orange-500 text-white': showByType,
                    'bg-gray-200 text-gray-700': !showByType,
                  }"
                  class="px-3 py-1 rounded-md text-xs"
                >
                  {{ showByType ? "Hide By Type" : "Show By Type" }}
                </button>
              </div>
            </div>

            <div v-if="showByType">
              <div class="gap-4 grid grid-cols-2">
                <div
                  v-for="bankName in getAllBankNames()"
                  :key="bankName"
                  class="bg-gray-50 p-5 rounded-lg border border-gray-200"
                >
                  <!-- Bank Name Header -->
                  <div
                    class="text-base font-bold text-gray-800 mb-4 capitalize border-b pb-2"
                  >
                    {{ formatBankName(bankName) }}
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <!-- Income Column -->
                    <div>
                      <h4
                        class="text-sm font-semibold text-green-700 mb-3 flex items-center"
                      >
                        <span class="mr-2">💰</span> Income
                      </h4>
                      <div class="space-x-2 flex justify-between items-center">
                        <!-- THB Income -->
                        <div
                          v-if="
                            monthlyData?.income_by_interact_bank?.[bankName]
                              ?.thb?.amount > 0
                          "
                          class="p-3 bg-white w-1/2 rounded border-l-4 border-green-500"
                        >
                          <div>
                            <div class="text-xs text-gray-600">THB</div>
                            <div class="text-lg font-bold text-green-600">
                              {{
                                formatAmount(
                                  monthlyData.income_by_interact_bank[bankName]
                                    .thb.amount,
                                )
                              }}
                            </div>
                          </div>
                          <div class="text-[10px] text-gray-500">
                            {{
                              monthlyData.income_by_interact_bank[bankName].thb
                                .count
                            }}
                            images
                          </div>
                        </div>

                        <!-- MMK Income -->
                        <div
                          v-if="
                            monthlyData?.income_by_interact_bank?.[bankName]
                              ?.mmk?.amount > 0
                          "
                          class="p-3 bg-white w-1/2 rounded border-l-4 border-green-500"
                        >
                          <div>
                            <div class="text-xs text-gray-600">MMK</div>
                            <div class="text-lg font-bold text-green-600">
                              {{
                                formatAmount(
                                  monthlyData.income_by_interact_bank[bankName]
                                    .mmk.amount,
                                )
                              }}
                            </div>
                          </div>
                          <div class="text-[10px] text-gray-500">
                            {{
                              monthlyData.income_by_interact_bank[bankName].mmk
                                .count
                            }}
                            images
                          </div>
                        </div>

                        <!-- No income message -->
                        <div
                          v-if="!hasIncome(bankName)"
                          class="text-center text-gray-400 py-3 text-sm w-full"
                        >
                          No income
                        </div>
                      </div>
                    </div>

                    <!-- Expense Column -->
                    <div>
                      <h4
                        class="text-sm font-semibold text-red-700 mb-3 flex items-center"
                      >
                        <span class="mr-2">💸</span> Expense
                      </h4>
                      <div class="space-x-2 flex justify-between items-center">
                        <!-- THB Expense -->
                        <div
                          v-if="
                            monthlyData?.expense_by_interact_bank?.[bankName]
                              ?.thb?.amount > 0
                          "
                          class="p-3 bg-white w-1/2 rounded border-l-4 border-red-500"
                        >
                          <div>
                            <div class="text-xs text-gray-600">THB</div>
                            <div class="text-lg font-bold text-red-600">
                              {{
                                formatAmount(
                                  monthlyData.expense_by_interact_bank[bankName]
                                    .thb.amount,
                                )
                              }}
                            </div>
                          </div>
                          <div class="text-[10px] text-gray-500">
                            {{
                              monthlyData.expense_by_interact_bank[bankName].thb
                                .count
                            }}
                            images
                          </div>
                        </div>

                        <!-- MMK Expense -->
                        <div
                          v-if="
                            monthlyData?.expense_by_interact_bank?.[bankName]
                              ?.mmk?.amount > 0
                          "
                          class="p-3 bg-white w-1/2 rounded border-l-4 border-red-500"
                        >
                          <div>
                            <div class="text-xs text-gray-600">MMK</div>
                            <div class="text-lg font-bold text-red-600">
                              {{
                                formatAmount(
                                  monthlyData.expense_by_interact_bank[bankName]
                                    .mmk.amount,
                                )
                              }}
                            </div>
                          </div>
                          <div class="text-[10px] text-gray-500">
                            {{
                              monthlyData.expense_by_interact_bank[bankName].mmk
                                .count
                            }}
                            images
                          </div>
                        </div>

                        <!-- No expense message -->
                        <div
                          v-if="!hasExpense(bankName)"
                          class="text-center text-gray-400 py-3 text-sm w-full"
                        >
                          No expense
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Show message if no data at all -->
                <div
                  v-if="getAllBankNames().length === 0"
                  class="text-center text-gray-500 py-8 col-span-2"
                >
                  No bank transaction data available
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Stats -->
          <div class="bg-white p-6 rounded-lg shadow-md col-span-2">
            <h2 class="text-base font-semibold text-gray-800 mb-4">
              Today Output & Input
            </h2>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                <div
                  class="text-lg font-bold text-green-600"
                  v-if="cashImageData?.today_summary?.booking_summary"
                >
                  THB
                  {{
                    formattedNumber(
                      cashImageData?.today_summary?.booking_summary.thb,
                    ) || 0
                  }}
                </div>
                <div
                  class="text-lg font-bold text-red-600"
                  v-if="cashImageData?.today_summary?.other_summary"
                >
                  THB -
                  {{
                    formattedNumber(
                      cashImageData?.today_summary?.other_summary.thb,
                    ) || 0
                  }}
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                <div
                  class="text-lg font-bold text-green-600"
                  v-if="cashImageData?.today_summary?.booking_summary"
                >
                  MMK
                  {{
                    formattedNumber(
                      cashImageData?.today_summary?.booking_summary.mmk,
                    ) || 0
                  }}
                </div>

                <div
                  class="text-lg font-bold text-red-600"
                  v-if="cashImageData?.today_summary?.other_summary"
                >
                  MMK -
                  {{
                    formattedNumber(
                      cashImageData?.today_summary?.other_summary.mmk,
                    ) || 0
                  }}
                </div>
              </div>
            </div>

            <!-- Currency Breakdown -->
            <div class="mt-3">
              <h3 class="text-md font-semibold text-gray-700 mb-3">
                Monthly Output & Input
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="(
                    currencyData, currency
                  ) in monthlyData?.grand_totals_by_currency"
                  :key="currency"
                  class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400"
                >
                  <div class="text-lg font-bold text-green-600">
                    {{ currency }}
                    {{ formatAmount(currencyData.total_cash_amount) }}
                  </div>
                  <div class="text-[10px] text-red-800">
                    {{ currencyData.total_cash_images }} images
                  </div>
                  <div class="text-lg font-bold text-red-600">
                    {{ currency }}
                    {{
                      formatAmount(
                        monthlyData?.expense_summary?.[
                          currency == "THB" ? "thb" : "mmk"
                        ]?.amount || 0,
                      )
                    }}
                  </div>
                  <div class="text-[10px] text-red-800">
                    {{
                      monthlyData?.expense_summary?.[
                        currency == "THB" ? "thb" : "mmk"
                      ]?.count || 0
                    }}
                    images
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Performer -->
            <div
              v-if="topPerformer"
              class="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"
            >
              <div class="text-xs pb-2 font-medium text-yellow-800">
                🏆 Top Performer
              </div>
              <div class="text-base font-bold text-yellow-900">
                {{ topPerformer.name }}
              </div>
              <div class="text-[10px] text-yellow-700 mt-1">
                {{ topPerformer.total_cash_images }} images total
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="(currencyData, currency) in topPerformer.currencies"
                  :key="currency"
                  class="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
                >
                  {{ currency }}:
                  {{ formatAmount(currencyData.total_cash_amount) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Daily Cash Amount Charts (THB & MMK) -->
          <div
            class="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-base font-semibold text-gray-800">
                Daily Cash Amount by Currency
              </h2>
              <div class="text-xs text-gray-600">
                {{ monthlyData?.month || "" }}
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- THB Chart -->
              <div class="min-h-80">
                <h3 class="text-xs font-medium text-gray-700 mb-2 text-center">
                  THB Daily Amount
                </h3>
                <LineChart
                  v-if="dailyTHBChartData.labels.length > 0"
                  :chartData="dailyTHBChartData"
                  :options="dailyTHBChartOptions"
                />
                <div
                  v-else
                  class="flex items-center justify-center h-full text-gray-500"
                >
                  No THB data available
                </div>
              </div>

              <!-- MMK Chart -->
              <div class="h-80">
                <h3 class="text-xs font-medium text-gray-700 mb-2 text-center">
                  MMK Daily Amount
                </h3>
                <LineChart
                  v-if="dailyMMKChartData.labels.length > 0"
                  :chartData="dailyMMKChartData"
                  :options="dailyMMKChartOptions"
                />
                <div
                  v-else
                  class="flex items-center justify-center h-full text-gray-500"
                >
                  No MMK data available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="previewImageUrl"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]"
      @click="closeImagePreview"
    >
      <img
        :src="previewImageUrl"
        alt="Preview"
        class="max-w-full max-h-full object-contain"
      />
      <button
        @click="closeImagePreview"
        class="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
      >
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <Modal :isOpen="openModal" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white/95 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-3 px-4 rounded-t-xl"
        >
          <p>Data Verify</p>
          <div class="flex justify-end items-center gap-x-2">
            <p
              @click="verifyStatus(true)"
              class="bg-green-200 text-green-800 px-2 py-1 rounded-lg"
            >
              Verify
            </p>
            <p
              @click="verifyStatus(false)"
              class="bg-red-200 text-red-800 px-2 py-1 rounded-lg"
            >
              Unverify
            </p>
          </div>
        </DialogTitle>
        <div class="p-4">
          <ReceiptEdit :updateData="detail" @update="onChangeUpdate" />
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import { onMounted, ref, watch, computed, reactive } from "vue";
import { useHomeStore } from "../../stores/home";
import { useCashImageStore } from "../../stores/cashImage";
import { BarChart, LineChart } from "vue-chart-3";
import { formattedNumber } from "../help/FormatData";
import Layout from "../Layout.vue";
import { Chart, registerables } from "chart.js";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle, Tab } from "@headlessui/vue";
import ReceiptEdit from "../ReceiptEdit.vue";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

Chart.register(...registerables);

const homeStore = useHomeStore();
const cashImageStore = useCashImageStore();
const toast = useToast();

const monthForGraph = ref("");
const loading = ref(false);
const cashImageData = ref(null);

// Panel states
const showCashImagesPanel = ref(false);
const loadingCashImages = ref(false);
const allCashImages = ref([]);
const selectedAgentName = ref("");
const selectedAgentId = ref(null);
const selectedCurrency = ref("");
const previewImageUrl = ref("");

// Filter states
const verificationFilter = ref("all");
const duplicateFilter = ref("all");

// Initialize
const currentShow = ref("thb");
const showByType = ref(false);

// Chart data
const monthlyChartData = reactive({
  labels: [],
  datasets: [
    {
      label: "Total Cash Amount (THB)",
      data: [],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#C9CBCF",
        "#4BC0C0",
      ],
      borderColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#C9CBCF",
        "#4BC0C0",
      ],
      borderWidth: 1,
    },
  ],
});

const monthlyChartMMKData = reactive({
  labels: [],
  datasets: [
    {
      label: "Total Cash Amount (MMK)",
      data: [],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#C9CBCF",
        "#4BC0C0",
      ],
      borderColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#FF6384",
        "#C9CBCF",
        "#4BC0C0",
      ],
      borderWidth: 1,
    },
  ],
});

const dailyTHBChartData = reactive({
  labels: [],
  datasets: [],
});

const dailyMMKChartData = reactive({
  labels: [],
  datasets: [],
});

// Detect duplicates based on same amount, same date (ignoring time), same sender (crm_id),
const detectDuplicates = (images) => {
  const duplicateMap = new Map();

  images.forEach((image, index) => {
    // Extract only the date part (YYYY-MM-DD) ignoring time
    const dateOnly = image.date.split("T")[0];
    // Create unique key from amount, date, and crm_id
    const key = `${image.amount}_${dateOnly}_${image.sender}`;

    if (!duplicateMap.has(key)) {
      duplicateMap.set(key, []);
    }
    duplicateMap.get(key).push(index);
  });

  // Mark duplicates (images that share the same key with another image)
  const duplicateIndices = new Set();
  for (const indices of duplicateMap.values()) {
    if (indices.length > 1) {
      indices.forEach((idx) => duplicateIndices.add(idx));
    }
  }

  return images.map((image, index) => ({
    ...image,
    isDuplicate: duplicateIndices.has(index),
  }));
};

// Filtered images computed property
const filteredImages = computed(() => {
  let filtered = [...allCashImages.value];

  // Apply verification filter
  if (verificationFilter.value === "verified") {
    filtered = filtered.filter((img) => img.data_verify === true);
  } else if (verificationFilter.value === "unverified") {
    filtered = filtered.filter((img) => img.data_verify === false);
  }

  // Apply duplicate filter
  if (duplicateFilter.value === "duplicate") {
    filtered = filtered.filter((img) => img.isDuplicate === true);
  } else if (duplicateFilter.value === "unique") {
    filtered = filtered.filter((img) => img.isDuplicate === false);
  }

  return filtered;
});

// Chart click handler
const handleChartClick = async (event, elements) => {
  if (elements && elements.length > 0) {
    const clickedElement = elements[0];
    const agentName = monthlyChartData.labels[clickedElement.index];

    // Find agent by name
    const agent = monthlyData.value?.agents?.find((a) => a.name === agentName);

    if (agent) {
      selectedAgentId.value = agent.agent_id;
      selectedAgentName.value = agent.name;
      selectedCurrency.value = currentShow.value.toUpperCase();

      await fetchCashImagesList();
      showCashImagesPanel.value = true;
    }
  }
};

// Fetch cash images list (not detail)
const fetchCashImagesList = async () => {
  if (!monthForGraph.value || !selectedAgentId.value) return;

  loadingCashImages.value = true;
  showCashImagesPanel.value = true;

  try {
    const response = await cashImageStore.cashImageAgentDetail(
      monthForGraph.value + "-01",
      {
        agent_id: selectedAgentId.value,
        currency: selectedCurrency.value,
      },
    );

    if (response.result && response.result.all_images) {
      // Process images to add image_url and detect duplicates
      const imagesWithUrl = response.result.all_images.map((img) => ({
        ...img,
        image_url: img.image ? `/storage/${img.image}` : null,
      }));
      allCashImages.value = detectDuplicates(imagesWithUrl);
    } else {
      allCashImages.value = [];
    }
  } catch (error) {
    console.error("Error fetching cash images:", error);
    allCashImages.value = [];
  } finally {
    loadingCashImages.value = false;
  }
};

// Panel functions
const closeCashImagesPanel = () => {
  showCashImagesPanel.value = false;
  allCashImages.value = [];
  selectedAgentId.value = null;
  selectedAgentName.value = "";
  selectedCurrency.value = "";
  verificationFilter.value = "all";
  duplicateFilter.value = "all";
};

const openImagePreview = (url) => {
  if (url) {
    previewImageUrl.value = url;
  }
};

const closeImagePreview = () => {
  previewImageUrl.value = "";
};

// Chart options with click handler
const monthlyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  onClick: handleChartClick,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Amount (THB)",
      },
      ticks: {
        callback: function (value) {
          return value.toLocaleString() + " ฿";
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `Amount: ${context.parsed.y.toLocaleString()} ฿`;
        },
      },
    },
  },
};

const monthlyChartMMKOptions = {
  responsive: true,
  maintainAspectRatio: false,
  onClick: handleChartClick,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Amount (MMK)",
      },
      ticks: {
        callback: function (value) {
          return value.toLocaleString() + " K";
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `Amount: ${context.parsed.y.toLocaleString()} K`;
        },
      },
    },
  },
};

const dailyTHBChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Amount (THB)",
      },
      ticks: {
        callback: function (value) {
          return value.toLocaleString() + " ฿";
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${
            context.dataset.label
          }: ${context.parsed.y.toLocaleString()} ฿`;
        },
      },
    },
  },
};

const dailyMMKChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Amount (MMK)",
      },
      ticks: {
        callback: function (value) {
          return value.toLocaleString() + " K";
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${
            context.dataset.label
          }: ${context.parsed.y.toLocaleString()} K`;
        },
      },
    },
  },
};

// Computed properties
const monthlyData = computed(() => {
  return cashImageData.value?.monthly_summary || null;
});

const topPerformer = computed(() => {
  if (!monthlyData.value?.agents?.length) return null;

  return monthlyData.value.agents
    .slice()
    .sort(
      (a, b) =>
        (b.currencies?.THB?.total_cash_amount || 0) -
        (a.currencies?.THB?.total_cash_amount || 0),
    )[0];
});

// Helper functions
const formatAmount = (amount) => {
  if (!amount && amount !== 0) return "0";
  return parseFloat(amount).toLocaleString();
};

const formatBankName = (bankName) => {
  if (!bankName) return "Unknown";
  return bankName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getAgentData = (agentName) => {
  return monthlyData.value?.agents?.find((a) => a.name === agentName);
};

const currentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  monthForGraph.value = `${year}-${month}`;
};

const getCashImageReport = async (month) => {
  loading.value = true;
  try {
    console.log("Fetching cash image report for:", month);
    const res = await homeStore.generalCashImageReport(month);
    console.log("Cash image report response:", res);
    cashImageData.value = res.result;
    updateCharts();
  } catch (error) {
    console.error("Error fetching cash image report:", error);
  } finally {
    loading.value = false;
  }
};

const getAllBankNames = () => {
  const bankNames = new Set();

  if (monthlyData.value?.income_by_interact_bank) {
    Object.keys(monthlyData.value.income_by_interact_bank).forEach((bank) => {
      bankNames.add(bank);
    });
  }

  if (monthlyData.value?.expense_by_interact_bank) {
    Object.keys(monthlyData.value.expense_by_interact_bank).forEach((bank) => {
      bankNames.add(bank);
    });
  }

  const sortOrder = [
    "company",
    "personal",
    "to_money_changer",
    "cash_at_office",
    "pay_to_driver",
    "deposit_management",
  ];

  return Array.from(bankNames).sort((a, b) => {
    const indexA = sortOrder.indexOf(a);
    const indexB = sortOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) {
      return -1;
    }

    if (indexB !== -1) {
      return 1;
    }

    return a.localeCompare(b);
  });
};

const hasIncome = (bankName) => {
  const income = monthlyData.value?.income_by_interact_bank?.[bankName];
  return income && (income.thb?.amount > 0 || income.mmk?.amount > 0);
};

const hasExpense = (bankName) => {
  const expense = monthlyData.value?.expense_by_interact_bank?.[bankName];
  return expense && (expense.thb?.amount > 0 || expense.mmk?.amount > 0);
};

const updateCharts = () => {
  if (!cashImageData.value) {
    console.log("No cash image data available");
    return;
  }

  // Update monthly chart
  if (monthlyData.value?.agents) {
    const activeAgents = monthlyData.value.agents.filter(
      (agent) => agent.total_cash_images > 0,
    );

    monthlyChartData.labels = activeAgents.map((agent) => agent.name);
    monthlyChartData.datasets[0].data = activeAgents.map(
      (agent) => agent?.currencies?.THB?.total_cash_amount || 0,
    );

    monthlyChartMMKData.labels = activeAgents.map((agent) => agent.name);
    monthlyChartMMKData.datasets[0].data = activeAgents.map(
      (agent) => agent?.currencies?.MMK?.total_cash_amount || 0,
    );

    console.log("Monthly chart data updated:", {
      thb: monthlyChartData,
      mmk: monthlyChartMMKData,
    });
  }

  // Update daily charts
  if (cashImageData.value.daily_summary) {
    const dailyData = cashImageData.value.daily_summary;

    const agentsWithTHB = [
      ...new Set(
        dailyData.flatMap((day) =>
          day.agents
            .filter((agent) => agent.currencies?.THB?.total_cash_amount > 0)
            .map((agent) => agent.name),
        ),
      ),
    ];

    const agentsWithMMK = [
      ...new Set(
        dailyData.flatMap((day) =>
          day.agents
            .filter((agent) => agent.currencies?.MMK?.total_cash_amount > 0)
            .map((agent) => agent.name),
        ),
      ),
    ];

    const dateLabels = dailyData.map((day) => {
      const date = new Date(day.date);
      return date.getDate().toString();
    });

    // THB Chart Data
    dailyTHBChartData.labels = dateLabels;
    dailyTHBChartData.datasets = agentsWithTHB.map((agentName, index) => ({
      label: agentName,
      data: dailyData.map((day) => {
        const agent = day.agents.find((a) => a.name === agentName);
        return agent?.currencies?.THB?.total_cash_amount || 0;
      }),
      borderColor: monthlyChartData.datasets[0].backgroundColor[index % 9],
      backgroundColor:
        monthlyChartData.datasets[0].backgroundColor[index % 9] + "20",
      tension: 0.1,
      fill: false,
    }));

    // MMK Chart Data
    dailyMMKChartData.labels = dateLabels;
    dailyMMKChartData.datasets = agentsWithMMK.map((agentName, index) => ({
      label: agentName,
      data: dailyData.map((day) => {
        const agent = day.agents.find((a) => a.name === agentName);
        return agent?.currencies?.MMK?.total_cash_amount || 0;
      }),
      borderColor: monthlyChartData.datasets[0].backgroundColor[index % 9],
      backgroundColor:
        monthlyChartData.datasets[0].backgroundColor[index % 9] + "20",
      tension: 0.1,
      fill: false,
    }));

    console.log("Daily chart data updated:", {
      thb: dailyTHBChartData,
      mmk: dailyMMKChartData,
    });
  }
};

const detail = ref(null);
const openModal = ref(false);
const cashImageDetail = async (id) => {
  console.log(id, "this is id");
  const res = await cashImageStore.getDetailAction(id);
  console.log(res, "this is detail");
  detail.value = res.result;
  openModal.value = true;
};

const closeModal = () => {
  openModal.value = false;
  detail.value = null;
};

const onChangeUpdate = () => {
  closeModal();
  // Refresh the cash images list after update
  refreshCurrentAgentImages();
};

const verifyStatus = async (status) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Mark this item as ${status}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#d33",
    confirmButtonText: `Yes, ${status}!`,
  });

  if (result.isConfirmed) {
    try {
      const frmData = new FormData();
      frmData.append("_method", "PUT");
      frmData.append("data_verify", status ? 1 : 0);

      await cashImageStore.cashImageVerify(frmData, detail.value.id);

      toast.success(`Item marked as ${status}`);
      closeModal();
      // Refresh the cash images list after verification
      await refreshCurrentAgentImages();
    } catch (error) {
      toast.error("Verification failed");
      console.log(error);
    }
  }
};

const refreshCurrentAgentImages = async () => {
  if (selectedAgentId.value && monthForGraph.value) {
    await fetchCashImagesList();
  }
};

watch(monthForGraph, async (newValue) => {
  if (newValue) {
    await getCashImageReport(newValue);
    // Close panel when month changes
    closeCashImagesPanel();
  }
});

onMounted(() => {
  currentMonth();
});
</script>
