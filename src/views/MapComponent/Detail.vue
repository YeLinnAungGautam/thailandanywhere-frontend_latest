<template>
  <div>
    <div
      v-if="loading"
      class="w-full h-[88vh] rounded-2xl bg-white flex justify-center items-center"
    >
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-orange-200 border-t-[#FF613c] rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-slate-600 text-sm">Loading property...</p>
      </div>
    </div>
    <div
      v-if="!loading"
      class="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg shadow-orange-500/10 h-[calc(100vh-110px)]"
    >
      <div
        class="flex justify-between items-start border-b border-gray-200 pb-6"
      >
        <div>
          <p class="text-lg font-semibold text-slate-800">{{ detail?.name }}</p>
          <div>
            <p class="text-xs text-gray-500 mt-1">
              {{ detail?.city?.name }}, Thailand
            </p>
          </div>
        </div>
        <div class="gap-x-2 flex flex-nowrap">
          <div
            @click="closeModal"
            class="bg-red-400/50 flex justify-center items-center backdrop-blur-xl px-2 text-red-700 text-xs rounded-lg space-x-2"
          >
            <i class="fa-solid fa-xmark text-2xl text-red-600"></i>
          </div>
        </div>
      </div>

      <div class="">
        <Navigation :modelValue="part" @partChanged="setPart" />
      </div>

      <div v-if="part == 'detail'" class="mt-2 h-[62vh] overflow-y-auto">
        <Detail :detail="detail" @update="handleDetailUpdate" />
      </div>

      <div v-if="part == 'media'" class="mt-2 h-[62vh] overflow-y-auto">
        <Images :detail="detail" @refresh-detail="refreshHotelDetail" />
      </div>

      <div v-if="part == 'rooms'" class="mt-2 h-[62vh] overflow-y-auto">
        <Room :detail="detail" @update="handleRoomUpdate" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import Navigation from "./hotels/Navigation.vue";
import Detail from "./hotels/Detail.vue";
import Images from "./hotels/Images.vue";
import Room from "./hotels/Room.vue";
import { useHotelStore } from "../../stores/hotel";

const router = useRouter();
const toast = useToast();

const props = defineProps({
  hotelId: {
    type: [Number, String],
    required: true,
  },
  closeModal: {
    type: Function,
    required: false,
  },
});

const hotelStore = useHotelStore();
const detail = ref(null);
const loading = ref(false);
const part = ref("detail");

const setPart = (p) => {
  part.value = p;
};

const getDetailAction = async (id) => {
  loading.value = true;
  const res = await hotelStore.getDetailAction(id);
  if (res.status == 1) {
    detail.value = res.result;
    console.log(detail.value, "detail");
  } else {
    router.push("/");
  }
  loading.value = false;
};

// Update handlers for different components
const handleDetailUpdate = async (updateInfo) => {
  try {
    loading.value = true;

    // Prepare FormData for the API
    const formData = new FormData();

    // Add the specific fields being updated
    Object.keys(updateInfo.data).forEach((key) => {
      if (updateInfo.data[key] !== null && updateInfo.data[key] !== undefined) {
        if (key === "facilities") {
          const facilities = updateInfo.data[key];

          for (let i = 0; i < facilities.length; i++) {
            let facility = facilities[i];
            formData.append(`facilities[${i}]`, facility);
          }
        } else if (key === "nearby_places") {
          // Handle nearby_places with proper structure
          const nearbyPlaces = updateInfo.data[key];

          for (let i = 0; i < nearbyPlaces.length; i++) {
            const place = nearbyPlaces[i];

            // Append name and distance
            formData.append(`nearby_places[${i}][name]`, place.name || "");
            formData.append(
              `nearby_places[${i}][distance]`,
              place.distance || ""
            );

            // Handle image if it exists
            if (place.img) {
              // New image file
              formData.append(`nearby_places[${i}][image]`, place.img);
            } else if (place.image) {
              // Existing image URL/path
              formData.append(`nearby_places[${i}][image]`, place.image);
            }
          }
        } else {
          // Handle other fields normally
          formData.append(key, updateInfo.data[key]);
        }
      }
    });

    formData.append("_method", "PUT");

    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await hotelStore.updateAction(detail.value.id, formData);

    if (response.status === 1) {
      toast.success(response.message || "Hotel updated successfully");
      // Refresh the detail data
      await getDetailAction(detail.value.id);
    } else {
      toast.error(response.message || "Update failed");
    }
  } catch (error) {
    console.error("Update failed:", error);
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    loading.value = false;
  }
};

const refreshHotelDetail = async () => {
  // Refresh hotel details after contract changes
  await getDetailAction(detail.value.id);
};

const handleVatUpdate = async (vatData) => {
  try {
    loading.value = true;

    const formData = new FormData();
    formData.append("vat_id", vatData.vat_id);
    formData.append("vat_name", vatData.vat_name);
    formData.append("vat_address", vatData.vat_address);
    formData.append("_method", "PUT");

    const response = await hotelStore.updateAction(detail.value.id, formData);

    if (response.status === 1) {
      toast.success("VAT information updated successfully");
      await getDetailAction(detail.value.id);
    }
  } catch (error) {
    console.error("VAT update failed:", error);
    toast.error(error.response?.data?.message || "VAT update failed");
  } finally {
    loading.value = false;
  }
};

const handleContactUpdate = async (contactData) => {
  try {
    loading.value = true;

    const formData = new FormData();
    formData.append("official_phone_number", contactData.official_phone_number);
    formData.append("official_email", contactData.official_email);
    formData.append("official_address", contactData.official_address);
    formData.append("official_remark", contactData.official_remark);
    formData.append("_method", "PUT");

    const response = await hotelStore.updateAction(detail.value.id, formData);

    if (response.status === 1) {
      toast.success("Contact information updated successfully");
      await getDetailAction(detail.value.id);
    }
  } catch (error) {
    console.error("Contact update failed:", error);
    toast.error(error.response?.data?.message || "Contact update failed");
  } finally {
    loading.value = false;
  }
};

const handlePaymentUpdate = async (paymentData) => {
  try {
    loading.value = true;

    const formData = new FormData();
    formData.append("legal_name", paymentData.legal_name);
    formData.append("bank_name", paymentData.bank_name);
    formData.append("bank_account_number", paymentData.bank_account_number);
    formData.append("account_name", paymentData.account_name);
    formData.append("_method", "PUT");

    const response = await hotelStore.updateAction(detail.value.id, formData);

    if (response.status === 1) {
      toast.success("Payment information updated successfully");
      await getDetailAction(detail.value.id);
    }
  } catch (error) {
    console.error("Payment update failed:", error);
    toast.error(error.response?.data?.message || "Payment update failed");
  } finally {
    loading.value = false;
  }
};

const handleSlugUpdate = async (slugData) => {
  try {
    loading.value = true;

    const response = await hotelStore.slugAction(detail.value.id, slugData);

    if (response.status === 1) {
      toast.success("Keywords updated successfully");
      await getDetailAction(detail.value.id);
    }
  } catch (error) {
    console.error("Slug update failed:", error);
    toast.error(error.response?.data?.message || "Slug update failed");
  } finally {
    loading.value = false;
  }
};

const handleRoomUpdate = async (roomData) => {
  // Handle room updates if needed
  console.log("Room update:", roomData);
  toast.success("Room updated successfully");
};

onMounted(async () => {
  if (props.hotelId) {
    await getDetailAction(props.hotelId);
  }
});
</script>
