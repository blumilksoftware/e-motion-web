<script setup lang="ts">
import { ref, onMounted, nextTick, watch, defineProps, defineOptions } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import fStore from '@/store/FilterStore'

defineOptions({
  inheritAttrs: false
})
interface City {
  id: number
  name: string
  latitude: number
  longitude: number
  country: {
    id: number
    name: string
    iso: string
  }
  cityProviders: Array<{
    provider_name: string
  }>
}
interface Country {
  id: number
  name: string
  iso: string
  latitude: number
  longitude: number
}
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const markers = ref<L.FeatureGroup | null>(null)

const props = defineProps({
  cities: {
    type: Array,
    required: true
  },
  isCityPage: {
    type: Boolean,
    default: false
  }
})

onMounted(async () => {
  await nextTick()
  buildMap()
  fillMap()
  centerToSelectedCountry()
  centerToSelectedCity()
  centerToSingleCity()

  watch(
    () => fStore.state.selectedCountry,
    () => {
      centerToSelectedCountry()
      clearMap()
      fillMap()
    }
  )

  watch(
    () => fStore.state.selectedCity,
    () => {
      centerToSelectedCity()
    }
  )
})

function buildMap() {
  if (mapContainer.value) {
    map.value = L.map(mapContainer.value)
    map.value.setView([0, 0], 2)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map.value as L.Map)
  }
}

function clearMap() {
  if (markers.value) {
    markers.value.clearLayers()
  }
}

function centerToSelectedCity() {
  centerToLocation(fStore.state.selectedCity, 12)
}

function centerToSelectedCountry() {
  if (fStore.state.selectedCountry) {
    switch ((fStore.state.selectedCountry as Country).name) {
      case 'Australia':
      case 'Canada':
      case 'China':
      case 'Russia':
        centerToLocation(fStore.state.selectedCountry, 2)
        break
      default:
        centerToLocation(fStore.state.selectedCountry, 6)
    }
  }
}

function centerToLocation(location: any, zoom: number) {
  if (location) {
    if (map.value) {
      map.value.setView([location.latitude, location.longitude], zoom)
    }
  } else {
    if (fStore.state.selectedCountry) {
      centerToSelectedCountry()
    } else {
      if (map.value) {
        map.value.setView([0, 0], 2)
      }
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

  const selectedCountry = fStore.state.selectedCountry
  const selectedProviderName = fStore.state.selectedProviderName
  const filteredCities = filterCities(
    props.cities,
    selectedCountry || '',
    selectedProviderName || ''
  )

  filteredCities.forEach((city) => {
    const marker = L.circleMarker([city.latitude, city.longitude], {
      radius: 5,
      weight: 1,
      color: '#6F90C6',
      fillColor: '#527ABA',
      fillOpacity: 1
    })

    marker
      .addTo(markers.value! as L.FeatureGroup<any>)
      .on('click', () => {
        const selectedCity: City | null = fStore.state.selectedCity ?? null

        if (!selectedCity || (selectedCity as City).id !== city.id) {
          fStore.commit('changeSelectedCity', city)
        } else {
          fStore.commit('changeSelectedCity', null)
        }
      })
      .bindTooltip(
        `<i class="fi-${city.country.iso} flat fi shadow"></i> ${city.name}, ${city.country.name}`
      )
  })

  if (map.value) {
    markers.value.addTo(map.value as L.Map)
  }
}

function filterCities(cities: any[], selectedCountry: any, selectedProviderName: string) {
  return cities.filter((city) => {
    const matchCountry = !selectedCountry || city.country.id === selectedCountry.id
    const matchProvider =
      !selectedProviderName ||
      city.cityProviders.some(
        (cityProvider: any) => cityProvider.provider_name === selectedProviderName
      )

    return matchCountry && matchProvider
  })
}
</script>

<template>
  <div id="mapContainer" ref="mapContainer" class="absolute z-0 size-full" />
</template>
