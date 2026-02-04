<template>
  <div>
    <div v-if="matchStatus.type === 'exact'" class="flex items-center gap-2">
      <span
        class="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
      >
        ✓ Exact Match
      </span>
      <span class="text-xs text-gray-600">{{ matchStatus.room?.name }}</span>
    </div>

    <div
      v-else-if="matchStatus.type === 'fuzzy'"
      class="flex items-center gap-2"
    >
      <span
        class="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium"
      >
        ~ {{ matchStatus.score }}% Match
      </span>
      <span class="text-xs text-gray-600">{{ matchStatus.room?.name }}</span>
    </div>

    <div v-else class="flex items-center gap-2">
      <span
        class="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
      >
        ➕ New Room
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  room: Object,
  currentRooms: Array,
});

// Fuzzy matching algorithm
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;

  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 100;

  // Simple word matching
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);

  let matchCount = 0;
  words1.forEach((word) => {
    if (words2.some((w) => w.includes(word) || word.includes(w))) {
      matchCount++;
    }
  });

  return Math.round(
    (matchCount / Math.max(words1.length, words2.length)) * 100,
  );
};

const matchStatus = computed(() => {
  if (!props.currentRooms || props.currentRooms.length === 0) {
    return { type: "new" };
  }

  // Try exact match first
  const exactMatch = props.currentRooms.find(
    (r) =>
      r.name?.toLowerCase().trim() ===
      props.room.room_type?.toLowerCase().trim(),
  );

  if (exactMatch) {
    return { type: "exact", room: exactMatch };
  }

  // Try fuzzy match
  let bestMatch = null;
  let bestScore = 0;

  props.currentRooms.forEach((currentRoom) => {
    const score = calculateSimilarity(props.room.room_type, currentRoom.name);
    if (score > bestScore && score >= 60) {
      bestScore = score;
      bestMatch = currentRoom;
    }
  });

  if (bestMatch) {
    return { type: "fuzzy", room: bestMatch, score: bestScore };
  }

  return { type: "new" };
});
</script>
