<template>
  <q-select v-model="model" :options="options"></q-select>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      model: 91202,
      options: []
    }
  },
  watch: {
    model(newVal, oldVal) {
      if (newVal !== oldVal) this.$emit('zip-code-changed', newVal)
    }
  },
  mounted() {
    axios
      .get('http://localhost:5000/api/locations')
      .then(res => {
        this.options = res.data.map(zip => zip.zip_code)
      })
      .catch(err => console.log(err))
  }
}
</script>

<style></style>
