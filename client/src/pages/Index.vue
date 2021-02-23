<template>
  <q-page padding class="container">
    <div class="row justify-center q-mb-lg">
      <div class="col-xs-auto text-h2">
        <custom-q-select @zip-code-changed="getOatmilks"></custom-q-select>
      </div>
    </div>
    <div class="row">
      <div class="col-4" v-for="oatmilk in oatmilks" :key="oatmilk.uuid">
        <custom-q-card :oatmilk="oatmilk"></custom-q-card>
      </div>
    </div>
    <div class="row justify-center items-center q-ma-lg">
      <div
        class="col-xs-auto q-mx-lg cursor-pointer add-zip-code"
        @click="toggle = true"
        v-if="!toggle"
      >
        Add a Zip Code
      </div>
      <div
        class="col-xs-auto q-mx-lg cursor-pointer add-zip-code"
        @click="toggle = false"
        v-if="toggle"
      >
        close
      </div>
      <div class="col-1" v-show="toggle">
        <q-input v-model="text" rounded outlined dense>
          <template v-slot:append>
            <q-icon
              name="add"
              class="cursor-pointer text-primary"
              @click="addZipCode"
            ></q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script>
import CustomQCard from '../components/CustomQCard'
import CustomQSelect from '../components/CustomQSelect'
import axios from 'axios'
export default {
  name: 'PageIndex',
  data() {
    return {
      zip: 91202,
      oatmilks: [],
      locations: [],
      toggle: false,
      text: ''
    }
  },
  methods: {
    getOatmilks(value) {
      axios.get(`http://localhost:5000/api/oatmilks/${value}`).then(res => {
        console.log(res.data.oatmilks)
        this.oatmilks = res.data.oatmilks
      })
    },
    addZipCode() {
      axios
        .post('http://localhost:5000/api/locations', {
          zip_code: this.text,
          area_name: 'Beverly Hills'
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  },
  components: {
    'custom-q-card': CustomQCard,
    'custom-q-select': CustomQSelect
  },
  mounted() {
    axios.get(`http://localhost:5000/api/oatmilks/${this.zip}`).then(res => {
      console.log(res.data.oatmilks)
      this.oatmilks = res.data.oatmilks
    })
  }
}
</script>

<style lang="scss">
.add-zip-code:hover {
  color: $primary;
}
</style>
