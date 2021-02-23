<template>
  <q-card class="my-card q-ma-sm" bordered>
    <q-card-section horizontal>
      <div class="col-6 q-pa-sm">
        <div class="text-h5">
          {{ oatmilk.store }}
        </div>
        <div class="text-bold">
          {{ oatmilk.name }}
        </div>
        <div class="text-body">
          {{ oatmilk.price }}
        </div>
        <div class="text-body">
          {{ oatmilk.address }}
        </div>
      </div>

      <q-img class="col-6" :src="oatmilk.image_src" />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ['oatmilk']
}
</script>

<style></style>
