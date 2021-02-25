<template>
  <q-select dense outlined v-model="model" :options="options"></q-select>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    model: {
      get() {
        return this.zip
      },
      set(newVal, oldVal) {
        if (newVal !== oldVal) this.$emit('zip-code-changed', newVal)
      }
    },
    options: {
      get() {
        return this.zips
      }
    }
  },
  watch: {},
  props: ['zip', 'zips']
}
</script>

<style></style>
