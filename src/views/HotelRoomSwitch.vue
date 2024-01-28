<template>
  <div>
    <div v-if="hotelShow">
      <Hotel />
    </div>
    <div v-if="!hotelShow">
      <Room />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Hotel from "../views/HotelView.vue";
import Room from "../views/RoomView.vue";

const hotelShow = ref(true);
</script>
