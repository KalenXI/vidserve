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

    <div v-if="libraryLoaded">
      <v-card v-for="sub in library.children" :key="sub" class="mx-auto my-5">
        {{ sub }}
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Libraries',
  async asyncData({ $axios, params }) {
    let unauthorized = false
    const library = await $axios
      .$get('/library/' + params.pathMatch)
      .catch(({ response }) => {
        if (response.status === 401) {
          unauthorized = true
        }
      })
    return { library, unauthorized }
  },
  data() {
    return {
      library: {
        _id: '',
        name: '',
        children: [],
      },
      unauthorized: false,
      libraryLoaded: false,
      password: '',
      dialog: false,
      show1: false,
      wrongPassword: false,
    }
  },
  computed: {},
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
        this.library = response
      }
    },
  },
}
</script>

<style scoped></style>
