<template>
  <div>
    <Layout>
      <div class="flex justify-start items-center gap-x-2">
        <div
          v-for="i in cart"
          :key="i"
          @click="changeStep(i.key)"
          class="border border-gray-200 px-5 py-2 rounded-lg space-y-1 shadow-lg"
          :class="i.key == step ? 'bg-[#FF613c] text-white' : ''"
        >
          <p class="font-semibold">{{ i.name }}</p>
          <p class="text-xs font-light">{{ i.des }}</p>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Layout from "./Layout.vue";

const step = ref("bank_verify");

const changeStep = (data) => {
  step.value = data;
  console.log("====================================");
  console.log(data);
  console.log("====================================");
};

const cart = ref([
  {
    name: "Bank Verify",
    key: "bank_verify",
    des: "cash slip check with bank",
  },
  {
    name: "Incoming",
    key: "incoming",
    des: "print pdf for incoming",
  },
  {
    name: "Outgoing",
    key: "out_going",
    des: "check out going slip",
  },
]);
</script>
