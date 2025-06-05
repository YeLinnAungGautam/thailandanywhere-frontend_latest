<template>
  <div>
    <p class="text-sm font-semibold">Connect Page</p>
    <div
      v-if="!route.query.id"
      class="w-full h-[500px] flex items-center justify-center"
    >
      <p class="text-red-500 text-sm">Please select a tax to connect.</p>
    </div>
    <div v-if="route.query.id" class="w-full h-auto pt-4">
      <p class="text-blue-500 text-sm">
        Connect tax receipt from: {{ data?.company_legal_name }}
      </p>
      <div
        v-if="loading"
        class="w-full h-[500px] flex items-center justify-center"
      >
        <p class="text-gray-500 text-sm">Loading...</p>
      </div>
      <div class="grid grid-cols-2 pt-4 gap-4" v-if="!loading">
        <div>
          <div class="p-4 border rounded-lg">
            <div class="flex justify-between items-center mb-4">
              <p class="text-xs font-semibold">Group By List</p>
              <div class="flex gap-2" v-if="groupList && groupList.length > 0">
                <button
                  @click="selectAll"
                  class="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                >
                  Select All
                </button>
                <button
                  @click="clearAll"
                  class="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div
              v-if="groupList && groupList.length > 0"
              class="space-y-4 max-h-[600px] overflow-y-auto"
            >
              <!-- Loop through each group -->
              <div v-for="group in groupList" :key="group.crm_id" class="">
                <!-- Loop through bookings in each group -->
                <div
                  v-for="booking in group.bookings"
                  :key="booking.id"
                  class="mb-3"
                >
                  <div class="flex justify-between items-center mb-2">
                    <p class="text-sm font-semibold">{{ booking.crm_id }}</p>
                    <p
                      @click="
                        goToReservation(booking?.grouped_items[0]?.items[0])
                      "
                      class="text-xs text-[#FF613c] cursor-pointer bg-[#FF613c]/20 px-2 py-1 rounded"
                    >
                      Go To Fill
                    </p>
                  </div>
                  <div class="bg-white">
                    <!-- Loop through grouped_items -->
                    <div
                      v-if="
                        booking.grouped_items &&
                        booking.grouped_items.length > 0
                      "
                      class="space-y-2"
                    >
                      <div
                        v-for="item in booking.grouped_items[0]?.items"
                        :key="item.id"
                        class="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50"
                        :class="{
                          'bg-blue-50 border-blue-300': selectedItems.includes(
                            item.id
                          ),
                        }"
                      >
                        <input
                          type="checkbox"
                          :id="'item-' + item.id"
                          v-model="selectedItems"
                          :value="item.id"
                          class="mt-0.5 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          :for="'item-' + item.id"
                          class="flex-1 space-y-1 cursor-pointer"
                        >
                          <!-- {{ item.items[0].id }} -->
                          <p class="text-xs">
                            {{ item.variation?.name || item.room?.name }}
                          </p>
                          <p
                            class="text-[10px] text-gray-600"
                            v-if="
                              item.product_type == 'App\\Models\\EntranceTicket'
                            "
                          >
                            {{ item.quantity }} Adult ,
                            {{
                              item.individual_pricing != null
                                ? item.individual_pricing?.child?.quantity
                                : 0 || 0
                            }}
                            Child
                          </p>
                          <p
                            class="text-[10px] text-gray-600"
                            v-if="item.product_type == 'App\\Models\\Hotel'"
                          >
                            {{ item.quantity }} Room ,
                            {{
                              daysBetween(item.checkin_date, item.checkout_date)
                            }}
                            Night
                          </p>
                          <div
                            class="flex justify-start items-center space-x-2"
                          >
                            <p
                              :class="
                                item?.booking_confirm_letters.length > 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              "
                              class="text-[10px] flex justify-start items-center gap-x-2"
                            >
                              <CheckBadgeIcon class="w-4 h-4" />invoice
                            </p>
                            <p
                              :class="
                                item?.paid_slip.length > 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              "
                              class="text-[10px] flex justify-start items-center gap-x-2"
                            >
                              <CheckBadgeIcon class="w-4 h-4" />expense
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <!-- Fallback: If no grouped_items, show regular items -->
                    <div
                      v-else-if="booking.items && booking.items.length > 0"
                      class="space-y-2"
                    >
                      <div
                        v-for="item in booking.items"
                        :key="item.id"
                        class="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50"
                        :class="{
                          'bg-blue-50 border-blue-300': selectedItems.includes(
                            item.id
                          ),
                        }"
                      >
                        <input
                          type="checkbox"
                          :id="'item-' + item.id"
                          v-model="selectedItems"
                          :value="item.id"
                          class="mt-1 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          :for="'item-' + item.id"
                          class="flex-1 cursor-pointer"
                        >
                          <div class="text-xs">
                            <p class="font-medium">
                              {{ item.product_name || item.name }}
                            </p>
                            <p class="text-gray-600">
                              Qty: {{ item.quantity }} ×
                              {{ formatCurrency(item.rate) }} =
                              {{ formatCurrency(item.total) }}
                            </p>
                            <p class="text-gray-500">
                              Service:
                              {{ item.service_date || item.start_date }}
                              {{ item.end_date ? "- " + item.end_date : "" }}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No items found -->
            <div v-else-if="!loading" class="text-center py-8">
              <p class="text-gray-500 text-sm">No items found to connect.</p>
            </div>

            <!-- Selected items summary and save button -->
            <div v-if="selectedItems.length > 0" class="mt-4 pt-4 border-t">
              <div class="flex justify-between items-center">
                <p class="text-xs text-gray-600">
                  Selected {{ selectedItems.length }} item(s)
                </p>
                <button
                  @click="saveConnections"
                  :disabled="saving"
                  class="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 disabled:bg-gray-300"
                >
                  <span v-if="saving">Saving...</span>
                  <span v-else>Connect Items</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="p-4 border rounded-lg">
            <p class="text-xs font-semibold mb-4">Tax Receipt Details</p>
            <div class="">
              <img
                :src="data?.receipt_image"
                class="w-full h-full rounded-lg"
                alt="Tax Receipt"
              />
            </div>

            <p class="pt-3 text-xs font-medium pb-2 text-end">
              Tax Before: {{ data?.total_tax_amount }} THB
            </p>
            <p class="text-xs font-medium pb-2 text-end">
              Tax Withold: {{ data?.total_tax_withold }} THB
            </p>
            <p class="text-xs font-medium pb-2 text-end">
              Tax After: {{ data?.total_after_tax }} THB
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaxReceiptStore } from "../../stores/taxReceipt";
import { useGroupByStore } from "../../stores/groupby";
import { changeFormat } from "../help/FormatData";
import { daysBetween } from "../help/DateBetween";
import { CheckBadgeIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const taxReceiptStore = useTaxReceiptStore();
const groupByStore = useGroupByStore();

const loading = ref(false);
const saving = ref(false);
const data = ref(null);
const groupList = ref(null);
const selectedItems = ref([]);

const getDetail = async (id) => {
  loading.value = true;
  try {
    const res = await taxReceiptStore.getDetailAction(id);
    console.log(res);

    if (res && res.result) {
      data.value = res.result;
      // Fetch the list of hotel reservations if needed
      await getList();
    } else {
      data.value = null;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const getList = async () => {
  loading.value = true;
  try {
    // Assuming you want to fetch a list of hotel reservations
    let dataFilter = {
      page: 1,
      limit: 30,
      sort: "service_date",
      order: "desc",
    };
    if (data.value) {
      dataFilter.booking_daterange = `${data.value.service_start_date},${data.value.service_end_date}`;
      dataFilter.hotel_name = `${data.value.product?.name}`;
      dataFilter.product_type = `${data.value.product_type}`;
    }
    const res = await groupByStore.ReservationHotelList(dataFilter);
    console.log(res, "this is getlist group");
    if (res && res.result) {
      groupList.value = res.result?.data;
      console.log("groupList:", groupList.value);
    } else {
      groupList.value = null;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

// go to reservation
const goToReservation = (booking) => {
  const reservationId = booking.booking.id;
  console.log(booking, "booking data");

  // Navigate to the reservation details page
  // Assuming you have a route defined for reservation details
  if (booking.product_type === "App\\Models\\Hotel") {
    router.push(
      `/reservation-hotel?id=${reservationId}&product_id=${booking.product?.id}`
    );
  } else if (booking.product_type === "App\\Models\\EntranceTicket") {
    router.push(
      `/reservation-attraction?id=${reservationId}&product_id=${booking?.product?.id}&crm_id=${booking?.booking.crm_id}`
    );
  } else {
    console.warn(
      "Unsupported product type for navigation:",
      booking.product_type
    );
  }
};

// Get all item IDs for select all functionality
const getAllItemIds = () => {
  const itemIds = [];
  if (groupList.value && groupList.value.length > 0) {
    groupList.value.forEach((group) => {
      group.bookings.forEach((booking) => {
        // Check grouped_items first, then fallback to items
        const items = booking.grouped_items[0]?.items || [];
        items.forEach((item) => {
          itemIds.push(item.id);
        });
      });
    });
  }
  return itemIds;
};

// Select all items
const selectAll = () => {
  selectedItems.value = getAllItemIds();
};

// Clear all selections
const clearAll = () => {
  selectedItems.value = [];
};

// Save connections
const saveConnections = async () => {
  saving.value = true;
  try {
    const payload = {
      tax_receipt_id: route.query.id,
      item_ids: selectedItems.value,
    };

    console.log("Saving connections:", payload);

    // Replace with your actual API call
    // const res = await taxReceiptStore.connectItems(payload);

    // Simulate API call for now
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(
      `Successfully connected ${selectedItems.value.length} items to tax receipt!`
    );
    selectedItems.value = [];
  } catch (error) {
    console.error("Error saving connections:", error);
    alert("Error saving connections: " + error.message);
  } finally {
    saving.value = false;
  }
};

// You can add any additional logic or methods here if needed
onMounted(() => {
  if (route.query.id) {
    getDetail(route.query.id);
  }
});
</script>
