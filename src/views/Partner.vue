<template>
  <Layout>
    <div
      class="bg-white/60 p-6 rounded-lg shadow-sm mb-5 md:col-span-3 hidden md:block"
    >
      <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
        Partner Management
      </h3>

      <!-- Search and Actions -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <input
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for partners.."
          />
        </div>
        <div class="space-x-3">
          <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
          <Button :leftIcon="PlusIcon" @click.prevent="partnerModalOpen = true">
            Add Partner
          </Button>
        </div>
      </div>

      <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
        <!-- Partners Table -->
        <div
          class="overflow-auto rounded-lg shadow mb-5"
          v-if="!partnerStore.loading"
        >
          <table class="w-full">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  No.
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Name
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Email
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Created
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Login Counts
                </th>
                <th class="p-4 text-xs font-medium tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="partner in partnerStore.partners?.data"
                :key="partner.id"
                class="bg-white even:bg-gray-50 hover:bg-gray-50"
              >
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ partner.id }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ partner.name }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ partner.email }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ formatDate(partner.created_at) }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  {{ partner.login_count }}
                </td>
                <td class="p-4 text-xs text-gray-700 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click.prevent="editModalOpenHandler(partner)"
                      class="hover:bg-yellow-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                      :disabled="partnerStore.isUpdating"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click.prevent="assignProductHandler(partner)"
                      class="hover:bg-green-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                      :disabled="partnerStore.isAssigning"
                    >
                      <TicketIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click.prevent="onDeleteHandler(partner.id)"
                      class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                      :disabled="partnerStore.isDeleting"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading State -->
        <div v-if="partnerStore.loading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
          ></div>
          <p class="mt-2 text-gray-500">Loading partners...</p>
        </div>

        <!-- Empty State -->
        <div
          v-if="
            !partnerStore.loading &&
            (!partnerStore.partners?.data ||
              partnerStore.partners.data.length === 0)
          "
          class="text-center py-8"
        >
          <p class="text-gray-500">
            No partners found. Create your first partner!
          </p>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="
            !partnerStore.loading && partnerStore.partners?.data?.length > 0
          "
          :data="partnerStore.partners"
          @change-page="changePage"
        />
      </div>

      <!-- Create/Edit Partner Modal -->
      <Modal :isOpen="partnerModalOpen" @closeModal="closePartnerModal">
        <DialogPanel
          class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-gray-900 mb-5"
          >
            {{ formData.id ? "Edit Partner" : "Add New Partner" }}
          </DialogTitle>

          <form @submit.prevent="onSubmitHandler" class="mt-2">
            <div class="space-y-1 mb-2">
              <label for="name" class="text-gray-800 text-sm">Name *</label>
              <input
                type="text"
                v-model="formData.name"
                id="name"
                required
                maxlength="225"
                class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                :disabled="partnerStore.isCreating || partnerStore.isUpdating"
              />
              <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.name[0] }}
              </p>
            </div>

            <div class="space-y-1 mb-2">
              <label for="email" class="text-gray-800 text-sm">Email *</label>
              <input
                type="email"
                v-model="formData.email"
                id="email"
                required
                maxlength="225"
                class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                :disabled="partnerStore.isCreating || partnerStore.isUpdating"
              />
              <p v-if="errors?.email" class="mt-1 text-sm text-red-600">
                {{ errors.email[0] }}
              </p>
            </div>

            <div class="space-y-1 mb-2">
              <label for="password" class="text-gray-800 text-sm">
                Password
                {{ formData.id ? "(Leave empty to keep current)" : "*" }}
              </label>
              <input
                type="password"
                v-model="formData.password"
                id="password"
                :required="!formData.id"
                maxlength="225"
                class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                :disabled="partnerStore.isCreating || partnerStore.isUpdating"
              />
              <p v-if="errors?.password" class="mt-1 text-sm text-red-600">
                {{ errors.password[0] }}
              </p>
            </div>

            <div class="space-y-1 mb-2">
              <label for="password_confirmation" class="text-gray-800 text-sm"
                >Confirm Password</label
              >
              <input
                type="password"
                v-model="formData.password_confirmation"
                id="password_confirmation"
                maxlength="225"
                class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                :disabled="partnerStore.isCreating || partnerStore.isUpdating"
              />
              <p
                v-if="errors?.password_confirmation"
                class="mt-1 text-sm text-red-600"
              >
                {{ errors.password_confirmation[0] }}
              </p>
            </div>

            <div class="text-end">
              <Button
                type="submit"
                :disabled="partnerStore.isCreating || partnerStore.isUpdating"
              >
                <span
                  v-if="partnerStore.isCreating || partnerStore.isUpdating"
                  class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></span>
                {{ formData.id ? "Update" : "Create" }}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </Modal>

      <!-- Product Assignment Modal -->
      <Modal :isOpen="productModalOpen" @closeModal="closeProductModal">
        <DialogPanel
          class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="h3"
            class="text-lg font-medium leading-6 text-gray-900 mb-5"
          >
            Manage Products for {{ selectedPartner?.name }}
          </DialogTitle>

          <!-- Current Assignments Display -->
          <div v-if="selectedPartner" class="mb-6 p-4 bg-gray-50 rounded-md">
            <h4 class="text-sm font-medium text-gray-700 mb-3">
              Currently Assigned Products:
            </h4>

            <!-- Current Hotels -->
            <div
              v-if="selectedPartner.hotels && selectedPartner.hotels.length > 0"
              class="mb-3"
            >
              <p class="text-xs font-medium text-blue-600 mb-2">
                Hotels ({{ selectedPartner.hotels.length }}):
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="hotel in selectedPartner.hotels"
                  :key="`current-hotel-${hotel.id}`"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {{ hotel.name }}
                </span>
              </div>
            </div>

            <!-- Current Entrance Tickets -->
            <div
              v-if="
                selectedPartner.entranceTickets &&
                selectedPartner.entranceTickets.length > 0
              "
              class="mb-3"
            >
              <p class="text-xs font-medium text-green-600 mb-2">
                Entrance Tickets ({{ selectedPartner.entranceTickets.length }}):
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="ticket in selectedPartner.entranceTickets"
                  :key="`current-ticket-${ticket.id}`"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                >
                  {{ ticket.name }}
                </span>
              </div>
            </div>

            <!-- No assignments message -->
            <div
              v-if="
                (!selectedPartner.hotels ||
                  selectedPartner.hotels.length === 0) &&
                (!selectedPartner.entranceTickets ||
                  selectedPartner.entranceTickets.length === 0)
              "
              class="text-sm text-gray-500"
            >
              No products currently assigned to this partner.
            </div>
          </div>

          <form @submit.prevent="assignProducts" class="mt-2">
            <div class="space-y-1 mb-4">
              <label for="product_type" class="text-gray-800 text-sm"
                >Product Type *</label
              >
              <select
                v-model="productForm.product_type"
                id="product_type"
                required
                class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                :disabled="partnerStore.isAssigning"
                @change="loadCurrentAssignments"
              >
                <option value="">Select Product Type</option>
                <option value="hotel">Hotel</option>
                <option value="entrance_ticket">Entrance Ticket</option>
              </select>
              <p v-if="errors?.product_type" class="mt-1 text-sm text-red-600">
                {{ errors.product_type[0] }}
              </p>
            </div>

            <!-- Product Selection Section -->
            <div v-if="productForm.product_type" class="space-y-1 mb-4">
              <label class="text-gray-800 text-sm">Select Products *</label>

              <!-- Search Input -->
              <input
                type="search"
                v-model="searchKey"
                placeholder="Search by product name..."
                class="h-12 w-full bg-white/50 border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300 mb-3"
                :disabled="partnerStore.isAssigning"
              />

              <!-- Product List with Checkboxes -->
              <div
                class="max-h-48 overflow-y-auto border-2 border-gray-300 rounded-md bg-white/50"
              >
                <!-- Hotels -->
                <div v-if="productForm.product_type === 'hotel'" class="p-2">
                  <div
                    v-for="product in filteredHotels"
                    :key="product.id"
                    class="flex items-center space-x-3 py-2 px-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      :id="`hotel-${product.id}`"
                      :value="product.id"
                      v-model="productForm.product_ids"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      :disabled="partnerStore.isAssigning"
                    />
                    <label
                      :for="`hotel-${product.id}`"
                      class="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      {{ product.name }}
                    </label>
                  </div>
                  <div
                    v-if="filteredHotels.length === 0"
                    class="p-4 text-center text-gray-500"
                  >
                    No hotels found
                  </div>
                </div>

                <!-- Entrance Tickets -->
                <div
                  v-if="productForm.product_type === 'entrance_ticket'"
                  class="p-2"
                >
                  <div
                    v-for="product in filteredEntrances"
                    :key="product.id"
                    class="flex items-center space-x-3 py-2 px-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      :id="`entrance-${product.id}`"
                      :value="product.id"
                      v-model="productForm.product_ids"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      :disabled="partnerStore.isAssigning"
                    />
                    <label
                      :for="`entrance-${product.id}`"
                      class="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      {{ product.name }}
                    </label>
                  </div>
                  <div
                    v-if="filteredEntrances.length === 0"
                    class="p-4 text-center text-gray-500"
                  >
                    No entrance tickets found
                  </div>
                </div>
              </div>

              <!-- Selected Products Summary -->
              <div
                v-if="productForm.product_ids.length > 0"
                class="mt-3 p-3 bg-blue-50 rounded-md"
              >
                <p class="text-sm font-medium text-blue-800 mb-2">
                  Selected Products ({{ productForm.product_ids.length }}):
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="productId in productForm.product_ids"
                    :key="productId"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ getProductName(productId) }}
                    <button
                      type="button"
                      @click="removeProduct(productId)"
                      class="ml-1 text-blue-600 hover:text-blue-800"
                      :disabled="partnerStore.isAssigning"
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>

              <p v-if="errors?.product_ids" class="mt-1 text-sm text-red-600">
                {{ errors.product_ids[0] }}
              </p>
            </div>

            <div class="text-end">
              <Button
                type="submit"
                :disabled="
                  partnerStore.isAssigning ||
                  productForm.product_ids.length === 0
                "
              >
                <span
                  v-if="partnerStore.isAssigning"
                  class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></span>
                Assign Products
              </Button>
            </div>
          </form>
        </DialogPanel>
      </Modal>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { usePartnerStore } from "../stores/partner"; // Adjust path as needed
import Layout from "./Layout.vue";
import Button from "../components/Button.vue";
import Pagination from "../components/Pagination.vue";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  PlusIcon,
  TicketIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance";

const partnerStore = usePartnerStore();
const hotelStore = useHotelStore();
const entranceStore = useEntranceStore();
const { hotels } = storeToRefs(hotelStore);
const { entrances } = storeToRefs(entranceStore);
const toast = useToast();

// Reactive data
const partnerModalOpen = ref(false);
const productModalOpen = ref(false);
const selectedPartner = ref(null);

const search = ref("");
const searchKey = ref("");
const errors = ref(null);

// Forms
const formData = reactive({
  id: "",
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const productForm = reactive({
  product_type: "",
  product_ids: [], // Changed to array for multiple selection
});

// Use the actual data from stores (no local filtering)
const filteredHotels = computed(() => {
  return hotels.value?.data || [];
});

const filteredEntrances = computed(() => {
  return entrances.value?.data || [];
});

// Methods
const changePage = async (url) => {
  await partnerStore.getChangePage(url);
};

const loadPartners = async (params = {}) => {
  try {
    await partnerStore.getListAction(params);
  } catch (error) {
    console.error("Error loading partners:", error);
    toast.error("Failed to load partners");
  }
};

const addNewHandler = async () => {
  try {
    const response = await partnerStore.addNewAction(formData);
    resetForm();
    errors.value = null;
    partnerModalOpen.value = false;
    await loadPartners();
    toast.success(response.message);
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "Failed to create partner");
  }
};

const updateHandler = async () => {
  try {
    const updateData = { ...formData };
    // Remove password fields if empty
    if (!updateData.password) {
      delete updateData.password;
      delete updateData.password_confirmation;
    }

    const response = await partnerStore.updateAction(updateData, formData.id);
    resetForm();
    errors.value = null;
    partnerModalOpen.value = false;
    await loadPartners();
    toast.success(response.message);
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "Failed to update partner");
  }
};

const onSubmitHandler = async () => {
  if (formData.id) {
    await updateHandler();
  } else {
    await addNewHandler();
  }
};

const editModalOpenHandler = (partner) => {
  formData.id = partner.id;
  formData.name = partner.name;
  formData.email = partner.email;
  formData.password = "";
  formData.password_confirmation = "";
  errors.value = null;
  partnerModalOpen.value = true;
};

const assignProductHandler = async (partner) => {
  selectedPartner.value = partner;
  resetProductForm();
  errors.value = null;
  productModalOpen.value = true;

  // Don't load products here - wait for product type selection
};

const assignProducts = async () => {
  try {
    // Convert array to comma-separated string for API
    const assignmentData = {
      ...productForm,
      product_ids: productForm.product_ids.join(","),
    };

    const response = await partnerStore.assignProductAction(
      selectedPartner.value.id,
      assignmentData
    );
    resetProductForm();
    errors.value = null;
    productModalOpen.value = false;
    toast.success(response.message);
    await loadPartners();
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "Failed to assign products");
  }
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
        const response = await partnerStore.deleteAction(id);
        toast.success(response.message);
        await loadPartners();
      } catch (error) {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(
          error.response?.data?.message || "Failed to delete partner"
        );
      }
    }
  });
};

const resetForm = () => {
  formData.id = "";
  formData.name = "";
  formData.email = "";
  formData.password = "";
  formData.password_confirmation = "";
};

const resetProductForm = () => {
  productForm.product_type = "";
  productForm.product_ids = [];
};

const loadCurrentAssignments = async () => {
  // Reset product IDs first
  productForm.product_ids = [];
  searchKey.value = "";

  if (!productForm.product_type || !selectedPartner.value) return;

  // Load products for the selected type
  await loadProducts();

  // Pre-select currently assigned products
  if (productForm.product_type === "hotel" && selectedPartner.value.hotels) {
    productForm.product_ids = selectedPartner.value.hotels.map(
      (hotel) => hotel.id
    );
  } else if (
    productForm.product_type === "entrance_ticket" &&
    selectedPartner.value.entranceTickets
  ) {
    productForm.product_ids = selectedPartner.value.entranceTickets.map(
      (ticket) => ticket.id
    );
  }
};

const resetProductIds = () => {
  productForm.product_ids = [];
  searchKey.value = "";
};

const closePartnerModal = () => {
  partnerModalOpen.value = false;
  resetForm();
  errors.value = null;
};

const closeProductModal = () => {
  productModalOpen.value = false;
  selectedPartner.value = null;
  resetProductForm();
  errors.value = null;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const loadProducts = async (params = {}) => {
  try {
    if (productForm.product_type == "hotel") {
      await hotelStore.getListAction(params);
    } else if (productForm.product_type == "entrance_ticket") {
      await entranceStore.getListAction(params);
    }
  } catch (error) {
    toast.error("Failed to load products");
  }
};

const getProductName = (productId) => {
  if (productForm.product_type === "hotel") {
    const hotel = hotels.value?.data?.find((h) => h.id === productId);
    return hotel ? hotel.name : `Hotel #${productId}`;
  } else if (productForm.product_type === "entrance_ticket") {
    const entrance = entrances.value?.data?.find((e) => e.id === productId);
    return entrance ? entrance.name : `Entrance #${productId}`;
  }
  return `Product #${productId}`;
};

const removeProduct = (productId) => {
  const index = productForm.product_ids.indexOf(productId);
  if (index > -1) {
    productForm.product_ids.splice(index, 1);
  }
};

// Watchers
watch(
  search,
  debounce(async (newValue) => {
    await loadPartners({ search: newValue });
  }, 500)
);

// Watch searchKey for API calls to filter products
watch(
  searchKey,
  debounce(async (newValue) => {
    if (productForm.product_type) {
      await loadProducts({ search: newValue });
    }
  }, 500)
);

// Watch for product type changes to load appropriate products
watch(
  () => productForm.product_type,
  async (newValue) => {
    if (newValue) {
      searchKey.value = ""; // Reset search when changing product type
      await loadProducts();
    }
  }
);

// Lifecycle
onMounted(async () => {
  await loadPartners();
});
</script>
