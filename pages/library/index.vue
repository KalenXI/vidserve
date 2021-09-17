<template>
  <v-container>
    <h1 class="mb-4">Public Libraries</h1>
    <v-row>
      <v-col v-for="sub in library" :key="sub._id">
        <v-btn x-large block max-width="344" class="rounded-lg">
          <v-icon left>mdi-folder</v-icon>
          {{ sub.name }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'LibraryIndex',
  async asyncData({ $axios }) {
    const library = await $axios.$get('/library/')
    return { library }
  },
  data() {
    return {
      library: {
        _id: '',
        name: '',
        children: [],
      },
    }
  },
}
</script>

<style scoped></style>
