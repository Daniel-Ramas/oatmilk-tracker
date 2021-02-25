<template>
  <q-page padding class="container">
    <div class="row justify-center items-center q-mb-lg">
      <div class="col-xs-auto">
        <custom-q-select
          :zip="zip"
          :zips="options"
          @zip-code-changed="getOatmilks"
        ></custom-q-select>
      </div>
    </div>
    <div class="row items-center justify-center">
      <div class="col-xs-auto" v-if="loading">
        <q-spinner color="primary" size="4em"></q-spinner>
        fetching oatmilks
      </div>
      <div v-else class="col-4" v-for="oatmilk in oatmilks" :key="oatmilk.uuid">
        <custom-q-card :oatmilk="oatmilk"></custom-q-card>
      </div>
    </div>
    <div class="row justify-center items-center q-ma-lg">
      <div class="col-xs-auto q-mx-sm">
        <q-btn color="primary" size="md" @click="toggle = !toggle">{{
          btnText
        }}</q-btn>
      </div>
      <div class="col-xs-auto">
        <q-btn outline color="primary" size="md" @click="deleteLocation"
          >Delete Zip</q-btn
        >
      </div>
    </div>
    <div class="row justify-center">
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
      options: [],
      toggle: false,
      text: '',
      loading: false
    }
  },
  methods: {
    getOatmilks(value) {
      this.zip = value
      axios.get(`http://localhost:5000/api/oatmilks/${value}`).then(res => {
        console.log(res.data.oatmilks)
        this.oatmilks = res.data.oatmilks
      })
    },
    addZipCode() {
      this.loading = true
      axios
        .post('http://localhost:5000/api/locations', {
          zip_code: this.text,
          area_name: 'Area Name'
        })
        .then(res => {
          this.zip = res.data.zip_code
          this.getOatmilks(this.zip)
          this.loading = false
          this.text = ''
          this.toggle = false
        })
        .catch(err => console.log(err))
    },
    deleteLocation() {
      axios
        .delete(`http://localhost:5000/api/locations/${this.zip}`)
        .then(() => {
          this.getLocations()
          console.log('success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    getLocations() {
      axios
        .get('http://localhost:5000/api/locations')
        .then(res => {
          this.options = res.data.map(zip => zip.zip_code)
          this.zip = this.options[0]
          this.getOatmilks(this.zip)
        })
        .catch(err => console.log(err))
    }
  },
  computed: {
    btnText() {
      return this.toggle ? 'Close' : 'Add Zip'
    }
  },
  components: {
    'custom-q-card': CustomQCard,
    'custom-q-select': CustomQSelect
  },
  mounted() {
    // get oatmilks by zip
    axios.get(`http://localhost:5000/api/oatmilks/${this.zip}`).then(res => {
      console.log(res.data.oatmilks)
      this.oatmilks = res.data.oatmilks
    })

    // get list of zips
    this.getLocations()
  }
}
</script>

<style lang="scss">
.add-zip-code:hover {
  color: $primary;
}
</style>
