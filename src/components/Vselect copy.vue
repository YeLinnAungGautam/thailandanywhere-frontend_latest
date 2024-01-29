<template>
  <v-select
    :options="paginated"
    :filterable="false"
    @open="onOpen"
    @close="onClose"
    @search="(query) => (search = query)"
  >
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "InfiniteScroll",
  data: () => ({
    observer: null,
    limit: 10,
    search: "",
    countries: [],
  }),
  props: {
    data: Object,
    isMult: Boolean,
  },
  computed: {
    filtered() {
      return countries.filter((country) => country.includes(this.search));
    },
    paginated() {
      return this.filtered.slice(0, this.limit);
    },
    hasNextPage() {
      return this.paginated.length < this.filtered.length;
    },
  },
  mounted() {
    this.countries = this.props.data.data;
    this.observer = new IntersectionObserver(this.infiniteScroll);
  },
  methods: {
    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load);
      }
    },
    onClose() {
      this.observer.disconnect();
    },
    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        const ul = target.offsetParent;
        const scrollTop = target.offsetParent.scrollTop;
        this.limit += 10;
        await this.$nextTick();
        ul.scrollTop = scrollTop;
      }
    },
  },
};
</script>

<style scoped>
.loader {
  text-align: center;
  color: #bbbbbb;
}
</style>
