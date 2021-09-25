<template>
  <v-card>
    <v-card-title class="text-h4">Videos</v-card-title>
    <v-row>
      <v-col class="ma-10">
        <v-data-table :headers="headers" :items="videos" :items-per-page="10">
          <template #top>
            <v-toolbar flat
              ><v-spacer></v-spacer><AddVideo></AddVideo
            ></v-toolbar>
          </template>
          <template #[`item.uploaded_date`]="{ item }">
            {{ item.uploaded_date | formatDateTime }}
          </template>
          <template #[`item.recorded_date`]="{ item }">
            {{ item.recorded_date | formatDateTime }}
          </template>
          <template #[`item.categories`]="{ item }">
            <v-chip
              v-for="category in item.categories"
              :key="category"
              small
              link
              nuxt
              :to="'/category/' + category"
              class="mx-1"
              >{{ category }}
            </v-chip>
          </template>
          <template #[`item.unlisted`]="{ item }">
            <v-simple-checkbox v-model="item.unlisted"></v-simple-checkbox>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn :to="'/video/' + item._id" icon x-small
              ><v-icon>mdi-eye</v-icon></v-btn
            >
            <v-dialog v-model="deleteDialog" persistent max-width="290">
              <template #activator="{ on, attrs }">
                <v-btn icon x-small v-bind="attrs" v-on="on"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </template>
              <v-card>
                <v-card-title class="text-h5"> Delete video? </v-card-title>
                <v-card-text
                  >Are you sure you want to delete this video?</v-card-text
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="deleteDialog = false">
                    Cancel
                  </v-btn>
                  <v-btn color="green darken-1" text @click="deleteVideo(item)">
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import AddVideo from '@/components/AddVideo'

  export default {
    name: 'VideosList',
    components: {
      AddVideo,
    },
    middleware: ['auth'],
    async asyncData({ $axios, params }) {
      const videos = await $axios.$get('/video/')
      return { videos }
    },
    data() {
      return {
        deleteDialog: false,
        headers: [
          { text: 'Title ', value: 'title' },
          { text: 'Uploaded Date', value: 'uploaded_date' },
          { text: 'Recorded Date', value: 'recorded_date' },
          { text: 'Categories', value: 'categories' },
          { text: 'Unlisted', value: 'unlisted' },
          { text: 'Actions', value: 'actions' },
        ],
        videos: [
          {
            _id: '',
            title: '',
            description: '',
            url: '',
            uploaded_date: '',
            recorded_date: '',
            files: [
              {
                name: '',
                size: '',
                resolution: '',
                type: '',
                url: '',
              },
            ],
            categories: [],
            unlisted: true,
            password: null,
          },
        ],
      }
    },
    created() {
      this.$nuxt.$on('video-data-updated', async function () {
        await this.$nuxt.refresh()
      })
    },
    methods: {
      async deleteVideo(item) {
        await this.$axios.$delete('/video/' + item._id)
        await this.$nuxt.refresh()
        this.deleteDialog = false
      },
    },
  }
</script>

<style scoped></style>
