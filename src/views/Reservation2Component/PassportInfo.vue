<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="flex justify-between items-center">
        <p class="font-medium pb-2">Associated Customer Passport Information</p>
        <p
          class="bg-[#FF613c] text-white px-1.5 inline-block rounded-full"
          @click="openFileFeaturePicker"
        >
          +
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500">Full Name</label>
          <input
            type="text"
            v-model="editData.name"
            name=""
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          />
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500"
            >Passport or ID Number</label
          >
          <input
            type="text"
            v-model="editData.passport"
            name=""
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          />
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500">Phone Number</label>
          <input
            type="text"
            v-model="editData.phone"
            name=""
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          />
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500">Email</label>
          <input
            type="text"
            v-model="editData.email"
            name=""
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          />
        </div>
        <div class="space-y-1 col-span-2">
          <label for="" class="text-[12px] text-gray-500"
            >Customer Passports</label
          >
          <input
            type="file"
            ref="featureImageInput"
            multiple
            class="hidden"
            @change="handlerFeatureFileChange"
            accept="image/*"
          />
        </div>
        <label
          for=""
          class="text-[12px] text-gray-500"
          v-if="featureImagePreview.length > 0"
          >Preveiw Passports</label
        >
        <div class="grid grid-cols-4 col-span-2 gap-3 mt-4">
          <div
            class="relative"
            v-for="(image, index) in featureImagePreview"
            :key="index"
          >
            <button
              @click.prevent="removeFeatureSelectImage(index)"
              class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
            >
              <XCircleIcon class="w-8 h-8 font-semibold" />
            </button>

            <img class="h-auto w-full rounded" :src="image" alt="" />
          </div>
        </div>
        <div class="grid grid-cols-4 col-span-2 gap-3 mt-4">
          <div
            class="relative"
            v-for="(image, index) in editData.customer_passport_have"
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
      <div class="flex justify-end items-center gap-x-2 pt-2">
        <button
          @click="addTravellerAction"
          class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
        >
          Add Traveller
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
  name: "",
  passport: "",
  phone: "",
  email: "",
  customer_passport: [],
  customer_passport_have: [],
});

const loading = ref(false);

const props = defineProps({
  closeTravellerModal: Function,
  data: Object,
});

const featureImageInput = ref(null);

const featureImagePreview = ref([]);
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files;

  for (let index = 0; index < selectedFile.length; index++) {
    editData.value.customer_passport.push(selectedFile[index]);
    featureImagePreview.value.push(URL.createObjectURL(selectedFile[index]));
  }
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const removeFeatureDeleteImage = async (index, id) => {
  const res = await reservationStore.deleteTravellerImageAction(id);
  if (res) {
    editData.value.customer_passport_have.splice(index, 1);
    // featureImagePreview.value.splice(index, 1);
  }
  // console.log(editData.value.customer_passport, "this is remove");
};

const removeFeatureSelectImage = (index) => {
  editData.value.customer_passport.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  // console.log(editData.value.customer_passport, "this is remove");
};

const addTravellerAction = async () => {
  const frmData = new FormData();
  frmData.append("name", editData.value.name ? editData.value.name : "-");
  frmData.append(
    "passport",
    editData.value.passport ? editData.value.passport : "-"
  );
  frmData.append("phone", editData.value.phone ? editData.value.phone : "09");
  editData.value.email && frmData.append("email", editData.value.email);
  if (editData.value.customer_passport.length != 0) {
    for (let x = 0; x < editData.value.customer_passport.length; x++) {
      frmData.append(
        "customer_passport[" + x + "]",
        editData.value.customer_passport[x]
      );
    }
  }
  const res = await reservationStore.updateTravellerAction(
    frmData,
    props.data?.id
  );

  console.log(res, "this is res");
  if (res.message == "success") {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
  // props.closeTravellerModal();
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

onMounted(() => {
  if (props.data) {
    loading.value = true;
    editData.value.name =
      props.data?.associated_customer.length > 0
        ? props.data?.associated_customer[0]?.name
        : "";
    editData.value.passport =
      props.data?.associated_customer.length > 0
        ? props.data?.associated_customer[0]?.passport
        : "";
    editData.value.phone =
      props.data?.associated_customer.length > 0
        ? props.data?.associated_customer[0]?.phone
        : "";
    editData.value.email =
      props.data?.associated_customer.length > 0
        ? props.data?.associated_customer[0]?.email
        : "";
    editData.value.customer_passport_have =
      props.data?.customer_passports.length > 0
        ? props.data?.customer_passports
        : [];

    loading.value = false;
  }
});
</script>
