<script setup>

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

</script>

<template>
    <div class=" mb-4 bg-white rounded-lg shadow grid grid-cols-3 divide-x divide-gray-300 overflow-hidden uppercase">
        <div @click="router.push('/account_head')" class="col-span-1 text-center text-sm cursor-pointer font-medium py-2" :class="route.name == 'accountHead' ? 'bg-[#FF613c] text-white' : 'text-gray-500'">
            Account Head
        </div>
        <div @click="router.push('/account_class')" class="col-span-1 text-center text-sm cursor-pointer font-medium py-2" :class="route.name == 'accountClass' ? 'bg-[#FF613c] text-white' : 'text-gray-500'">
            Account Class
        </div>
        <div @click="router.push('/chart_of_account')" class="col-span-1 text-center text-sm cursor-pointer font-medium py-2" :class="route.name == 'chartOfAccount' ? 'bg-[#FF613c] text-white' : 'text-gray-500'">
            Chart Of Account
        </div>
    </div>
</template>


