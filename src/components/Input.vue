<script setup>
import { inject } from "vue";

const props = defineProps({
  id: String,
  modelValue: [String, Number],
  required: Boolean,
  invalid: Boolean,
  ariaDescribedBy: String,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const field = inject("field", props);
</script>

<template>
  <input
    :id="field.id"
    :disabled="props.disabled"
    :value="props.modelValue"
    @input="($event) => emit('update:modelValue', $event.target.value)"
    :required="field.required"
    :class="[
      'w-full border  px-4 py-2 rounded-md shadow focus:border-blue-100 focus:ring-blue-100',
      field.invalid ? 'border-red-500' : 'border-gray-300',
    ]"
  />
</template>
