<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn dark color="primary" v-bind="attrs" v-on="on"> Add Video </v-btn>
    </template>
    <v-card v-if="!uploading">
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
            <v-col cols="3" class="my-n6">
              <v-checkbox
                v-model="video.unlisted"
                label="Unlisted"></v-checkbox>
            </v-col>
            <v-col cols="3" class="my-n6">
              <v-checkbox v-model="video.private" label="Private"></v-checkbox>
            </v-col>
            <v-col v-if="video.private" cols="6" class="my-n6">
              <v-text-field
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                name="input-10-2"
                label="Password"
                value=""
                class="input-group--focused"
                @click:append="show = !show"></v-text-field>
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
            <v-col cols="12">
              <v-select
                v-model="video.libraries"
                chips
                multiple
                :items="libraries"
                item-text="name"
                item-value="_id"
                label="Libraries"></v-select>
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
            <v-col cols="12">
              <v-file-input show-size @change="selectFile"></v-file-input>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancelSave"> Cancel </v-btn>
        <v-btn color="blue darken-1" @click="saveVideo"> Upload </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="uploading">
      <v-card-title>
        <span class="text-h5">Uploading Video</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="message" border="left" color="blue-grey" dark>
            {{ message }}
          </v-alert>
          <v-row>
            <v-col cols="12">
              <v-progress-linear height="25" :value="progress"
                >{{ Math.ceil(progress) }}%</v-progress-linear
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
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
        show: false,
        dateMenu: false,
        timeMenu: false,
        isLoading: false,
        uploading: false,
        message: '',
        currentFile: '',
        progress: 0,
        categories: [],
        libraries: [],
        video: {
          title: '',
          description: '',
          url: 'master.m3u8',
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
          unlisted: false,
          private: false,
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

      fetch('http://10.0.0.238:8000/library/')
        .then((res) => res.clone().json())
        .then((res) => {
          this.libraries = res
        })
    },
    methods: {
      upload(file, id, onUploadProgress) {
        const formData = new FormData()

        formData.append('file', file)

        return this.$axios.post('video/upload?id=' + id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress,
        })
      },
      selectFile(file) {
        this.progress = 0
        this.currentFile = file
      },
      async saveVideo() {
        this.video.recorded_date = this.recDateTime.setZone('UTC').toISO()
        this.video.uploaded_date = DateTime.now().toISO()
        const newVideo = await this.$axios.$post('/video/', this.video)
        this.uploading = true
        this.upload(this.currentFile, newVideo._id, (event) => {
          this.progress = Math.round((100 * event.loaded) / event.total)
        })
          .then((response) => {
            this.message = response
            this.dialog = false
            this.uploading = false
          })
          .catch((err) => {
            this.message = 'Could not upload video: ' + err
            this.progress = 0
            this.currentFile = undefined
          })
        this.$nuxt.$emit('video-data-updated')
      },
      cancelSave() {
        this.dialog = false
      },
    },
  }
</script>

<style scoped></style>
