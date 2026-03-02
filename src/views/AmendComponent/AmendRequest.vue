<template>
  <div>
    <div class="">
      <div class="text-2xl font-bold">Amend Request</div>

      <div>
        <div class="pt-4">
          <div class="font-semibold">
            Amendment Changes by {{ detail?.amend_history[0]?.user_name }}
          </div>
          <div class="pt-2">
            <div class="flex justify-start items-center gap-x-3 pt-4">
              <select
                name=""
                class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:border-transparent"
                id=""
                v-model="amend_request"
              >
                <option value="">Select</option>
                <option :value="true">Request Sent</option>
                <option :value="false">Request Not Sent</option>
              </select>
              <button
                class="bg-[#ff613c] text-white rounded-lg px-4 py-2 text-sm"
                @click="updateAmendAction()"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import { useAmendStore } from "../../stores/amend";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const amendStore = useAmendStore();
const toast = useToast();
const route = useRoute();

const amend_request = ref(false);

const updateAmendAction = async () => {
  const frmData = new FormData();
  frmData.append("amend_request", amend_request.value ? 1 : 0);
  frmData.append("_method", "PUT");
  const res = await amendStore.updateAction(frmData, props.detail.id);
  //   props.getDetailAction();
  if (res.status) {
    toast.success("Amend Request Updated Successfully");
    props.getDetailAction(route.query.id);
  } else {
    toast.error("Amend Request Update Failed");
  }
};

onMounted(() => {
  if (props.detail) {
    amend_request.value = props.detail.amend_request;
  }
});
</script>
