<template>
  <div>
    <div class="">
      <div class="text-2xl font-bold">Amend Approve</div>
      <div class="text-sm text-gray-500 pt-2">
        Amend approve is a request to change the details of a booking. This
        status is set by the reservation team.
      </div>
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
                v-model="amend_approve"
              >
                <option value="">Select</option>
                <option :value="true">Approve</option>
                <option :value="false">Pending</option>
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
      <div class="border border-gray-200 p-4 rounded-lg mt-6 mb-4">
        <h2 class="font-semibold mb-2">For Reject Amendment</h2>

        <div class="mb-4">
          <label
            for="rejection-reason"
            class="block text-sm font-medium text-gray-700 mb-4"
            >Rejection Reason</label
          >
          <textarea
            id="rejection-reason"
            v-model="rejectionReason"
            class="w-full px-3 py-2 border text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#FF613c] focus:border-[#FF613c]"
            rows="3"
            placeholder="Please provide a reason for rejection"
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button
            @click="cancelReject"
            class="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF613c]"
          >
            Cancel
          </button>
          <button
            @click="submitRejection"
            :disabled="isSubmitting"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF613c] hover:bg-[#e5502d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF613c] disabled:opacity-50"
          >
            Reject this Amend
          </button>
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

const amend_approve = ref(false);
const rejectionReason = ref("");
const isSubmitting = ref(false);

const updateAmendAction = async () => {
  const frmData = new FormData();
  frmData.append("amend_approve", amend_approve.value ? 1 : 0);
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

const submitRejection = async () => {
  isSubmitting.value = true;

  try {
    const frmData = new FormData();
    frmData.append("reason", rejectionReason.value);

    const res = await amendStore.rejectAction(props.detail?.id, frmData);

    if (res.status == 1) {
      toast.success("Amend Request Updated Successfully");
      props.getDetailAction(route.query.id);
    }
    console.log(res);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

onMounted(() => {
  if (props.detail) {
    amend_approve.value = props.detail.amend_approve;
    rejectionReason.value = props.detail?.amend_history[0].rejected_reason;
  }
});
</script>
