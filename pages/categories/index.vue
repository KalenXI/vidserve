<template>
  <v-container>
    <v-card v-for="category in categories" :key="category">{{
      category
    }}</v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Categories',
  async asyncData({ $axios }) {
    const categories = await $axios.$get('/category/')
    return { categories }
  },
  data() {
    return {
      categories: [],
    }
  },
}
</script>

<style scoped></style>
