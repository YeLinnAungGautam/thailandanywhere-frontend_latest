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
      <div class="gird grid-cols-2 gap-x-3">
        <p class="text-blue-500 text-sm">
          Connect tax receipt from: {{ data?.company_legal_name }}
        </p>
      </div>
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
              <div
                v-for="group in groupList"
                :key="group.id"
                class="border rounded-lg p-3"
                :class="{
                  'bg-blue-50 border-blue-300': selectedGroups.includes(
                    group.id
                  ),
                  'bg-white border-gray-200': !selectedGroups.includes(
                    group.id
                  ),
                }"
              >
                <!-- Group Header with Checkbox -->
                <div class="flex justify-between items-center mb-3">
                  <div class="flex justify-start items-center space-x-2">
                    <input
                      type="checkbox"
                      :id="'group-' + group.id"
                      v-model="selectedGroups"
                      :value="group.id"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      :for="'group-' + group.id"
                      class="font-medium text-sm cursor-pointer"
                    >
                      {{ group?.booking_crm_id }}
                    </label>
                    <span class="text-xs text-gray-500">
                      (Group ID: {{ group.id }})
                    </span>
                  </div>
                  <div class="cursor-pointer" @click="goToGroup(group)">
                    <p>
                      <ArrowTopRightOnSquareIcon
                        class="h-4 w-4 text-gray-500"
                      />
                    </p>
                  </div>
                </div>

                <!-- Group Items -->
                <div class="ml-6 space-y-1 mb-3">
                  <div v-for="item in group.items" :key="item.id">
                    <p
                      class="py-1 text-xs text-gray-700 bg-gray-50 px-2 rounded"
                    >
                      {{ item?.service_date }} / {{ item?.variant_name }} /
                      <span v-if="group?.product_type == 'EntranceTicket'">
                        ( {{ item?.quantity }}A {{ item?.child_quantity }}C )
                      </span>
                      <span v-else>
                        ( {{ item?.quantity }}R - {{ item?.days }}N )
                      </span>
                    </p>
                  </div>
                </div>

                <!-- Tax Details Section -->
                <div class="ml-6 bg-gray-50 p-2 rounded">
                  <p class="text-xs font-medium mb-2 text-gray-600">
                    Tax Details:
                  </p>

                  <!-- Loading state for each group -->
                  <div
                    v-if="loadingGroups[group.id]"
                    class="text-xs text-gray-500"
                  >
                    Loading tax details...
                  </div>

                  <!-- Tax details content -->
                  <div
                    v-else-if="
                      groupTaxDetails[group.id] &&
                      groupTaxDetails[group.id].length > 0
                    "
                    class="space-y-2"
                  >
                    <div
                      v-for="invoice in groupTaxDetails[group.id]"
                      :key="invoice.id"
                      class="bg-white p-2 rounded border text-xs"
                    >
                      <p class="text-green-600">
                        After Tax:
                        {{
                          formatCurrency(invoice?.meta?.total_after_tax || 0)
                        }}
                      </p>
                      <p class="text-blue-600">
                        Before Tax:
                        {{
                          formatCurrency(invoice?.meta?.total_tax_amount || 0)
                        }}
                      </p>
                      <p class="text-red-600">
                        Withold Tax:
                        {{
                          formatCurrency(invoice?.meta?.total_tax_withold || 0)
                        }}
                      </p>
                    </div>
                  </div>

                  <!-- No tax details found -->
                  <div
                    v-else-if="!loadingGroups[group.id]"
                    class="text-xs text-gray-400"
                  >
                    No tax details available
                  </div>
                </div>
              </div>
            </div>

            <!-- No items found -->
            <div v-else-if="!loading" class="text-center py-8">
              <p class="text-gray-500 text-sm">No items found to connect.</p>
            </div>

            <!-- Selected groups summary and save button -->
            <div v-if="selectedGroups.length > 0" class="mt-4 pt-4 border-t">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-xs text-gray-600">
                    Selected {{ selectedGroups.length }} group(s)
                  </p>
                  <p class="text-xs text-blue-600">
                    IDs: {{ selectedGroups.join(", ") }}
                  </p>
                </div>
                <button
                  @click="syncConnections"
                  :disabled="saving"
                  class="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 disabled:bg-gray-300"
                >
                  <span v-if="saving">Syncing...</span>
                  <span v-else
                    >Connect {{ selectedGroups.length }} Group(s)</span
                  >
                </button>
              </div>
            </div>

            <!-- Show currently connected groups -->
            <div
              v-if="currentlyConnectedGroups.length > 0"
              class="mt-4 pt-4 border-t"
            >
              <p class="text-xs font-semibold mb-2 text-green-600">
                Currently Connected Groups:
              </p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="groupId in currentlyConnectedGroups"
                  :key="groupId"
                  class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200"
                >
                  ID: {{ groupId }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="p-4 border rounded-lg">
            <p class="text-xs font-semibold mb-4">Tax Receipt Details</p>
            <div class="grid grid-cols-2 gap-x-2 border-b border-gray-500 pb-4">
              <div>
                <p class="text-[#FF613c] font-semibold text-xs">From Invoice</p>
                <p class="pt-3 text-xs font-medium pb-2">
                  Tax Before: {{ selectedGroupTotalTaxAmount.toFixed(2) }}
                </p>
                <p class="text-xs font-medium pb-2">
                  Tax Withold: {{ selectedGroupTotalTaxWithhold.toFixed(2) }}
                </p>
                <p class="text-xs font-medium pb-2">
                  Tax After: {{ selectedGroupTotalAfterTax.toFixed(2) }}
                </p>
              </div>
              <div>
                <p class="text-[#FF613c] font-semibold text-xs text-end">
                  From Tax Credit
                </p>
                <p class="pt-3 text-xs font-medium pb-2 text-end">
                  Tax Before: {{ formatCurrency(data?.total_tax_amount) }}
                </p>
                <p class="text-xs font-medium pb-2 text-end">
                  Tax Withold: {{ formatCurrency(data?.total_tax_withold) }}
                </p>
                <p class="text-xs font-medium pb-2 text-end">
                  Tax After: {{ formatCurrency(data?.total_after_tax) }}
                </p>
              </div>
            </div>
            <div class="">
              <img
                :src="data?.receipt_image"
                class="w-full h-full rounded-lg"
                alt="Tax Receipt"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaxReceiptStore } from "../../stores/taxReceipt";
import { changeFormat } from "../help/FormatData";
import { daysBetween } from "../help/DateBetween";
import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/vue/24/outline";
import { useGroupStore } from "../../stores/group";
import { watch } from "vue";
import { useToast } from "vue-toastification";

const route = useRoute();
const toast = useToast();
const router = useRouter();
const taxReceiptStore = useTaxReceiptStore();
const groupStore = useGroupStore();

const loading = ref(false);
const saving = ref(false);
const data = ref(null);
const groupList = ref(null);
const selectedGroups = ref([]); // Array of selected group IDs
const currentlyConnectedGroups = ref([]); // Currently connected group IDs

const getDetail = async (id) => {
  loading.value = true;
  try {
    const res = await taxReceiptStore.getDetailAction(id);
    console.log(res);

    if (res && res.result) {
      data.value = res.result;

      // Get currently connected groups
      if (res.result.groups) {
        currentlyConnectedGroups.value = res.result.groups.map(
          (group) => group.id
        );
        selectedGroups.value = [...currentlyConnectedGroups.value]; // Pre-select connected groups
      }

      // Fetch the list of groups
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
    let dataFilter = {
      page: 1,
      per_page: 30,
      sort: "service_date",
      order: "desc",
    };
    if (data.value) {
      dataFilter.booking_daterange = `${data.value.service_start_date},${data.value.service_end_date}`;
      dataFilter.product_name = `${data.value.product?.name}`;
      dataFilter.product_type = `${
        data.value.product_type == "App\\Models\\Hotel" ? "hotel" : "attraction"
      }`;
    }
    const res = await groupStore.getListAction(dataFilter);
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
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

// Tax details management
const groupTaxDetails = reactive({});
const loadingGroups = reactive({});

const fetchGroupTaxDetails = async (groupId) => {
  if (loadingGroups[groupId]) return; // Prevent duplicate requests

  loadingGroups[groupId] = true;

  try {
    const response = await groupStore.groupDocumentList(groupId, {
      document_type: "booking_confirm_letter",
    });

    console.log(response, "group tax details");

    if (response.status == 1) {
      groupTaxDetails[groupId] = response.result;
    } else {
      groupTaxDetails[groupId] = [];
    }
  } catch (error) {
    console.error(`Error fetching tax details for group ${groupId}:`, error);
    groupTaxDetails[groupId] = [];
  } finally {
    loadingGroups[groupId] = false;
  }
};

const goToGroup = (data) => {
  console.log(data, "this is data");

  if (data.product_type == "EntranceTicket") {
    // router.push(`/group-attraction?id=${data?.id}`);
    window.open(`/group-attraction?id=${data?.id}`, "_blank");
  } else if (data.product_type == "Hotel") {
    // router.push(`/group-hotel?id=${data?.id}`);
    window.open(`/group-hotel?id=${data?.id}`, "_blank");
  }
};

// FIXED: Get all group IDs for select all functionality
const getAllGroupIds = () => {
  const groupIds = [];
  if (groupList.value && groupList.value.length > 0) {
    groupList.value.forEach((group) => {
      groupIds.push(group.id);
    });
  }
  return groupIds;
};

const selectedGroupTotalAfterTax = computed(() => {
  let total = 0;
  if (selectedGroups.value && selectedGroups.value.length > 0) {
    selectedGroups.value.forEach((groupId) => {
      const taxDetails = groupTaxDetails[groupId];
      if (taxDetails && taxDetails.length > 0) {
        taxDetails.forEach((invoice) => {
          total += invoice?.meta?.total_after_tax * 1 || 0;
        });
      }
    });
  }
  return total;
});

const selectedGroupTotalTaxAmount = computed(() => {
  let total = 0;
  if (selectedGroups.value && selectedGroups.value.length > 0) {
    selectedGroups.value.forEach((groupId) => {
      const taxDetails = groupTaxDetails[groupId];
      if (taxDetails && taxDetails.length > 0) {
        taxDetails.forEach((invoice) => {
          total += invoice?.meta?.total_tax_amount * 1 || 0;
        });
      }
    });
  }
  return total;
});

const selectedGroupTotalTaxWithhold = computed(() => {
  let total = 0;
  if (selectedGroups.value && selectedGroups.value.length > 0) {
    selectedGroups.value.forEach((groupId) => {
      const taxDetails = groupTaxDetails[groupId];
      if (taxDetails && taxDetails.length > 0) {
        taxDetails.forEach((invoice) => {
          total += invoice?.meta?.total_tax_withold * 1 || 0;
        });
      }
    });
  }
  return total;
});

// FIXED: Select all groups
const selectAll = () => {
  selectedGroups.value = getAllGroupIds();
};

// FIXED: Clear all selections
const clearAll = () => {
  selectedGroups.value = [];
};

// FIXED: Sync connections using the syncReservations API
const syncConnections = async () => {
  // if (selectedGroups.value.length === 0) {
  //   alert("Please select at least one group to connect.");
  //   return;
  // }

  saving.value = true;
  try {
    const payload = {
      group_ids: selectedGroups.value,
    };

    console.log("Syncing connections:", payload);

    // Use the syncReservations API endpoint
    const res = await taxReceiptStore.asyncAction(route.query.id, payload);

    console.log("Sync response:", res);

    if (res && (res.success || res.status === "1")) {
      // Update currently connected groups
      currentlyConnectedGroups.value = [...selectedGroups.value];

      // Show success message
      const message = res.message || "Groups synced successfully";

      toast.success(message);

      // Optionally refresh the tax receipt details
      await getDetail(route.query.id);
    } else {
      // throw new Error(res?.message || "Failed to sync groups");
      const message = res?.message || "Failed to sync groups";
      toast.success(message);
    }
  } catch (error) {
    console.error("Error syncing connections:", error);
    // alert(
    //   "Error syncing connections: " +
    //     (error.response?.data?.message || error.message)
    // );
  } finally {
    saving.value = false;
  }
};

// Watch for changes in groupList and fetch tax details
watch(
  groupList,
  (newGroupList) => {
    if (newGroupList && newGroupList.length > 0) {
      newGroupList.forEach((group) => {
        if (!groupTaxDetails[group.id]) {
          fetchGroupTaxDetails(group.id);
        }
      });
    }
  },
  { immediate: true }
);

// Initialize on mount
onMounted(() => {
  if (route.query.id) {
    getDetail(route.query.id);
  }
});
</script>
