<template>
  <v-card>
    <v-card-title class="text-h5"> Downloads </v-card-title>

    <v-card-text> 340p - Download mp4 </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DownloadDialog',
  data() {
    return {
      dialog: false,
    }
  },
}
</script>

<style scoped></style>
