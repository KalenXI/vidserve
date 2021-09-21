<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn dark color="primary" v-bind="attrs" v-on="on"> Add Video </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Video</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="video.title"
                label="Title*"
                required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="video.description"
                label="Description"></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="video.categories"
                chips
                multiple
                :items="categories"
                label="Categories"></v-combobox>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto">
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="formattedRecDate"
                    label="Record Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"></v-text-field>
                </template>
                <v-date-picker
                  v-model="datePickerText"
                  @input="dateMenu = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                ref="menu"
                v-model="timeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px">
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="formattedRecTime"
                    label="Record Time"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"></v-text-field>
                </template>
                <v-time-picker
                  v-if="timeMenu"
                  v-model="timePickerText"
                  :allowed-minutes="(m) => m % 5 === 0"
                  @click:minute="timeMenu = false"></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancelSave"> Cancel </v-btn>
        <v-btn color="blue darken-1" @click="saveVideo"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  const { DateTime } = require('luxon')

  export default {
    name: 'EditVideo',
    data() {
      return {
        dialog: false,
        dateMenu: false,
        timeMenu: false,
        isLoading: false,
        categories: [],
        video: {
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
        recDateTime: DateTime.now(),
      }
    },
    computed: {
      formattedRecDate() {
        return this.recDateTime.toLocaleString(DateTime.DATE_SHORT)
      },
      formattedRecTime() {
        return this.recDateTime.toLocaleString(DateTime.TIME_SIMPLE)
      },
      datePickerText: {
        get() {
          return this.recDateTime.toISODate()
        },
        set(val) {
          this.recDateTime = DateTime.fromISO(
            val + 'T' + this.recDateTime.toISOTime()
          )
        },
      },
      timePickerText: {
        get() {
          return this.recDateTime.toLocaleString(DateTime.TIME_24_SIMPLE)
        },
        set(val) {
          this.recDateTime = DateTime.fromISO(
            this.recDateTime.toISODate() + 'T' + val
          )
        },
      },
    },
    mounted() {
      this.recDateTime = DateTime.now()

      fetch('http://10.0.0.238:8000/category/')
        .then((res) => res.clone().json())
        .then((res) => {
          this.categories = res
        })
    },
    methods: {
      async saveVideo() {
        this.video.recorded_date = this.recDateTime.setZone('UTC').toISO()
        await this.$axios.$put('/video/' + this.video._id, this.video)
        this.$nuxt.$emit('video-data-updated')
        this.dialog = false
      },
      cancelSave() {
        this.dialog = false
      },
    },
  }
</script>

<style scoped></style>
