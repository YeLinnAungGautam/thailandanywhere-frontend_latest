<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="flex justify-between items-center">
        <p class="font-medium pb-2">Invoice Upload</p>
        <p
          class="bg-[#FF613c] text-white cursor-pointer px-1.5 inline-block rounded-full"
          @click="openFileFeaturePicker"
        >
          +
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1 col-span-2">
          <input
            type="file"
            ref="featureImageInput"
            class="hidden"
            @change="handlerFeatureFileChange"
            accept="jpeg,png,jpg"
          />
        </div>
        <label
          for=""
          class="text-[12px] text-gray-500"
          v-if="featureImagePreview != null"
          >Invoice Preview</label
        >
        <div class="grid grid-cols-4 col-span-2 gap-3 mt-4">
          <div class="relative" v-if="featureImagePreview != null">
            <button
              @click.prevent="
                () => {
                  editData.car_photo = null;
                  featureImagePreview = null;
                }
              "
              class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
            >
              <XCircleIcon class="w-8 h-8 font-semibold" />
            </button>
            <img
              class="h-auto w-full rounded"
              :src="featureImagePreview"
              alt=""
            />
          </div>
        </div>
        <label
          for=""
          class="text-[12px] text-gray-500"
          v-if="detail?.booking_confirm_letters"
          >Invoice Receipt</label
        >
        <div class="grid grid-cols-4 col-span-2 gap-3 mt-4">
          <div
            class="relative"
            v-for="(image, index) in detail?.booking_confirm_letters"
            :key="index"
          >
            <button
              @click.prevent="removeFeatureDeleteImage(index, image.id)"
              class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
            >
              <XCircleIcon class="w-8 h-8 font-semibold" />
            </button>
            <img class="h-auto w-full rounded" :src="image.file" alt="" />
          </div>
        </div>
      </div>
      <div
        class="flex justify-end items-center gap-x-2 pt-2"
        v-if="editData.car_photo"
      >
        <button
          @click="addInvoiceAction"
          class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
        >
          Add Invoice
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import invoice from "../../assets/invoice_exp.jpg";

const reservationStore = useReservationStore();
const toast = useToast();

const editData = ref({
  car_photo: null,
});

const loading = ref(false);

const props = defineProps({
  detail: Object,
});

const featureImageInput = ref(null);

const featureImagePreview = ref(null);
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];

  editData.value.car_photo = e.target.files[0];
  featureImagePreview.value = URL.createObjectURL(selectedFile);
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const removeFeatureDeleteImage = async () => {
  console.log("hello");

  editData.value.car_photo = null;
  featureImagePreview.value = null;
  // console.log(editData.value.customer_passport, "this is remove");
  // await addInvoiceAction();
};

const addInvoiceAction = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");

  if (
    props.detail?.product_type == "App\\Models\\EntranceTicket" ||
    props.detail?.product_type == "App\\Models\\Hotel"
  ) {
    frmData.append("booking_confirm_letter", editData.value.car_photo);
  }

  const res = await reservationStore.updateInfoAction(
    frmData,
    props.detail?.id
  );

  console.log(res, "this is res");

  toast.success(res.message);

  // props.closeTravellerModal();
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

onMounted(() => {
  if (props.data) {
    loading.value = true;
    loading.value = false;
  }
});
</script>
