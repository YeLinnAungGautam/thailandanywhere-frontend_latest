<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="flex justify-between items-center">
        <!-- <p class="font-medium pb-2">Reservation Confirmation</p> -->
        <!-- <p
          class="bg-[#FF613c] text-white px-1.5 inline-block rounded-full"
          @click="openFileFeaturePicker"
        >
          +
        </p> -->
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <p class="text-gray-800 text-[10px]">Reservation Status :</p>

          <v-select
            v-model="editData.reservation_status"
            class="style-chooser text-xs rounded-lg bg-white"
            :options="reservation_status"
            label="name"
            :clearable="false"
            :reduce="(d) => d.name"
            placeholder=""
          ></v-select>
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500"
            >Reservation Slip Code</label
          >
          <input
            type="text"
            v-model="editData.reservation_slip_code"
            name=""
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          />
        </div>
        <div class="space-y-1 col-span-2">
          <label for="" class="text-[12px] text-gray-500"
            >Reservation Confirmation</label
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
        <!-- <label
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

            <img class="h-auto w-full rounded" :src="image.file" alt="" />
          </div>
        </div> -->
        <div class="grid grid-cols-4 col-span-2 gap-3">
          <div
            class="w-full border rounded-lg h-[364px] border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
          >
            +
          </div>
          <div
            class="relative"
            v-for="(image, index) in editData.slips_have ?? []"
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
          @click="addConfirmationAction"
          class="bg-[#ff613c] text-white border border-gray-300 px-3 py-2.5 rounded-lg text-xs"
        >
          Add Confirmation
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
  reservation_status: "",
  reservation_slip_code: "",
  slips: [],
  slips_have: [],
});

const loading = ref(false);

const props = defineProps({
  detail: Object,
});

const reservation_status = [
  { id: "1", name: "confirmed" },
  { id: "2", name: "awaiting" },
  { id: "3", name: "declined" },
];

const featureImageInput = ref(null);

const featureImagePreview = ref([]);
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      let inputValue = {
        file: selectedFile[index],
        amount: 0,
      };
      editData.value.slips.push(inputValue);
      let expData = {
        file: URL.createObjectURL(selectedFile[index]),
        amount: 0,
      };
      featureImagePreview.value.push(expData);
    }
  }
  console.log(editData.value.paid_slip, "this is paid slip");
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const removeFeatureDeleteImage = async (index, id) => {
  const res = await reservationStore.deletePaidImage(id);
  if (res) {
    editData.value.slips_have.splice(index, 1);
    // featureImagePreview.value.splice(index, 1);
  }
  // console.log(editData.value.customer_passport, "this is remove");
};

const removeFeatureSelectImage = (index) => {
  editData.value.slips.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  // console.log(editData.value.slips, "this is remove");
};

const addConfirmationAction = async () => {
  const secfrm = new FormData();
  secfrm.append("_method", "PUT");

  if (editData.value.slips.length != 0) {
    if (editData.value.slips.length > 0) {
      for (let i = 0; i < editData.value.slips.length; i++) {
        let file = editData.value.slips[i].file;
        let amount = editData.value.slips[i].amount;
        secfrm.append("paid_slip[" + i + "][file]", file);
        secfrm.append("paid_slip[" + i + "][amount]", amount);
      }
    }
  }

  await reservationStore.updateInfoAction(secfrm, props.detail?.id);
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  editData.value.reservation_status &&
    frmData.append("reservation_status", editData.value.reservation_status);
  editData.value.reservation_slip_code &&
    frmData.append("slip_code", editData.value.reservation_slip_code);

  const res = await reservationStore.updateAction(frmData, props.detail?.id);

  console.log(res, "this is res");
  toast.success(res.message);

  // props.closeTravellerModal();
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

onMounted(() => {
  if (props.detail) {
    loading.value = true;
    editData.value.reservation_status = props.detail.reservation_status;
    editData.value.reservation_slip_code = props.detail.slip_code;
    editData.value.slips_have =
      props.detail?.paid_slip.length > 0 ? props.detail?.paid_slip : [];

    loading.value = false;
  }
});
</script>
