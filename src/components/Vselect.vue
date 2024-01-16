<template>
  <div>
    <v-select
      v-model="value"
      class="style-chooser"
      :options="list ?? []"
      label="name"
      multiple
      @open="onOpen"
      :clearable="false"
      :reduce="(d) => d.id"
      placeholder="Choose City"
    ></v-select>
  </div>
</template>

<script setup></script>
