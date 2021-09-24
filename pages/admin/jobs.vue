<template>
  <v-card>
    <v-card-title class="text-h4">Encoding Jobs</v-card-title>
    <v-row>
      <v-col class="ma-10">
        <v-data-table :headers="headers" :items="jobs" :items-per-page="10">
          <template #[`item.progress`]="{ item }">
            <v-progress-linear height="25" :value="item.progress"
              >{{ Math.ceil(item.progress) }}%</v-progress-linear
            >
          </template>
          <template #[`item.duration`]="{ item }">
            {{ item.duration | formatTime }}
          </template>
          <template #[`item.remaining`]="{ item }">
            {{ item.remaining | formatTime }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  export default {
    name: 'JobsList',
    middleware: ['auth'],
    async asyncData({ $axios }) {
      const jobs = await $axios.$get('/jobs/')
      return { jobs }
    },
    data() {
      return {
        timer: '',
        headers: [
          { text: 'ID', value: '_id' },
          { text: 'Video File', value: 'video_file' },
          { text: 'Progress', value: 'progress' },
          { text: 'Duration', value: 'duration' },
          { text: 'Remaining', value: 'remaining' },
        ],
        jobs: [
          {
            _id: '',
            video_file: '',
            progress: 0,
            duration: 0,
            remaining: 0,
          },
        ],
      }
    },
    created() {
      this.timer = setInterval(this.$nuxt.refresh, 1000)
    },
  }
</script>

<style scoped></style>
