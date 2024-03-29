<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>Password Required</v-card-title>
        <v-form @submit.prevent="submitPassword">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert
                  v-if="wrongPassword"
                  type="error"
                  dense
                  class="mx-4 mb-6">
                  Invalid password.
                </v-alert>
                <v-text-field
                  v-model="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  class="mx-4"
                  @click:append="show1 = !show1"></v-text-field>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" class="mb-4" @click="submitPassword">
                Enter
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
    <h1 class="my-4">
      {{ res.library.name.substring(res.library.name.lastIndexOf('/') + 1) }}
    </h1>

    <div v-if="libraryLoaded">
      <div v-if="children.length > 0">
        <v-row>
          <v-col v-for="sub in children" :key="sub._id">
            <v-btn
              nuxt
              x-large
              block
              max-width="344"
              class="rounded-lg"
              :to="'/library/' + sub._id">
              <v-icon left>mdi-folder</v-icon>
              {{ sub.name.substring(sub.name.lastIndexOf('/') + 1) }}
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-pagination
        v-if="totalPages > 1"
        v-model="page"
        :length="totalPages"
        @input="handlePageChange"></v-pagination>
      <VideoBox v-for="vid in res.videos" :key="vid._id" :vid="vid"> </VideoBox>
      <v-pagination
        v-if="totalPages > 1"
        v-model="page"
        :length="totalPages"
        @input="handlePageChange"></v-pagination>
    </div>
  </v-container>
</template>

<script>
  import VideoBox from '@/components/VideoBox'

  export default {
    name: 'Libraries',
    components: {
      VideoBox,
    },
    async asyncData({ $axios, params }) {
      let unauthorized = false
      let libraryLoaded = false
      let videos = []
      let children = []
      const res = await $axios
        .$get('/library/' + params.pathMatch)
        .catch(({ response }) => {
          if (response.status === 401) {
            unauthorized = true
          }
        })
      if (res) {
        libraryLoaded = true

        videos = await $axios.$get('/library/' + params.pathMatch)
        children = await $axios
          .$get('/library/children/' + params.pathMatch)
          .catch(({ response }) => {
            if (response.status === 401) {
              unauthorized = true
            }
          })
      }
      return { res, unauthorized, libraryLoaded, videos, children }
    },
    data() {
      return {
        res: {
          library: {
            _id: '',
            name: '',
            children: [],
          },
          total: 0,
          video: {
            title: '',
            description: '',
            url: '',
            img: '',
            uploaded_date: '',
            recorded_date: '',
            files: {},
            categories: [],
            unlisted: true,
            password: null,
          },
        },
        children: [],
        page: 1,
        total: 0,
        limit: 10,
        unauthorized: false,
        libraryLoaded: false,
        password: '',
        dialog: false,
        show1: false,
        wrongPassword: false,
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(Math.ceil(this.res.total / this.limit))
      },
      breadcrumbs() {
        const items = []
        for (const i of this.res.library.name.split('/')) {
          const item = {
            text: i,
            disabled: false,
            href: '',
          }
          items.push(item)
        }
        return items
      },
    },
    mounted() {
      if (this.unauthorized) {
        this.dialog = true
      }
    },
    methods: {
      async submitPassword() {
        this.wrongPassword = false
        this.unauthorized = false
        const response = await this.$axios
          .$get(this.$route.path + '?passwd=' + this.password)
          .catch(({ response }) => {
            if (response.status !== '401') {
              this.unauthorized = true
              this.wrongPassword = true
              this.password = ''
            }
          })
        if (response) {
          this.unauthorized = false
          this.wrongPassword = false
          this.dialog = false
          this.libraryLoaded = true
          this.res = response
        }
      },
      async handlePageChange() {
        const skip = (this.page - 1) * this.limit
        this.res = await this.$axios.$get(
          this.$route.path +
            '?passwd=' +
            this.password +
            '?skip=' +
            skip +
            '&limit=' +
            this.limit
        )
      },
    },
  }
</script>

<style scoped></style>
