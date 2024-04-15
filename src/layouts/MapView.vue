<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import fStore from '@/store/FilterStore'
defineOptions({
  inheritAttrs: false,
})
const mapContainer = ref(null)
const map = ref(null)
const markers = ref(null)

const props = defineProps({
  cities: Array,
  isCityPage: Boolean,
})
onMounted(async () => {
  await nextTick()
  buildMap()
  fillMap()
  centerToSelectedCountry()
  centerToSelectedCity()
  centerToSingleCity()

  watch(() => fStore.selectedCountry, () => {
    centerToSelectedCountry()
    clearMap()
    fillMap()
  })

  watch(() => fStore.selectedCity, () => {
    centerToSelectedCity()
  })
})

function buildMap() {
  map.value = L.map(mapContainer.value)
  map.value.setView([0, 0], 2)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map.value)
}
function clearMap() {
  markers.value.clearLayers()
}
function centerToSelectedCity() {
  centerToLocation(fStore.selectedCity, 12)
}

function centerToSelectedCountry() {
  if (fStore.selectedCountry) {
    switch (fStore.selectedCountry.name) {
    case 'Australia':
    case 'Canada':
    case 'China':
    case 'Russia':
      centerToLocation(fStore.selectedCountry, 2)
      break
    default:
      centerToLocation(fStore.selectedCountry, 6)
    }
  }
}

function centerToLocation(location, zoom) {
  if (location) {
    map.value.setView([location.latitude, location.longitude], zoom)
  } else {
    if (fStore.selectedCountry) {
      centerToSelectedCountry()
    } else {
      map.value.setView([0, 0], 2)
    }
  }
}

function centerToSingleCity() {
  if (props.isCityPage && props.cities.length) {
    centerToLocation(props.cities[0], 12)
  }
}
function fillMap() {
  markers.value = L.featureGroup()

  const { selectedCountry, selectedProviderName } = fStore
  const filteredCities = filterCities(props.cities, selectedCountry, selectedProviderName)

  filteredCities.forEach(city => {
    const marker = L.circleMarker([city.latitude, city.longitude], {
      radius: 5,
      weight: 1,
      color: '#6F90C6',
      fillColor: '#527ABA',
      fillOpacity: 1,
    })

    marker
      .addTo(markers.value)
      .on('click', () => {
        const selectedCity = fStore.selectedCity

        if (selectedCity && selectedCity.id === city.id) {
          fStore.changeSelectedCity(null)
        } else {
          fStore.changeSelectedCity(city)
        }
      })
      .bindTooltip(`<i class="fi-${city.country.iso} flat fi shadow"></i> ${city.name}, ${city.country.name}`)
  })

  markers.value.addTo(map.value)
}

function filterCities(cities, selectedCountry, selectedProviderName) {
  return cities.filter(city => {
    const matchCountry = !selectedCountry || city.country.id === selectedCountry.id
    const matchProvider = !selectedProviderName || city.cityProviders.some(cityProvider => cityProvider.provider_name === selectedProviderName)

    return matchCountry && matchProvider
  })
}
</script>

<template>
  <div id="mapContainer" ref="mapContainer" class="absolute z-0 size-full" />
</template>
