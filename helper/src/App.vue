<script>
import { ref } from 'vue'
import Home from './views/Home.vue'

export default {
  components: { Home },
  name: 'LayoutDefault',
  setup () {
    return {
      list:ref([]),
      leftDrawerOpen: ref(false)
    }
  },
  async mounted(){
    const req = await fetch('/api/getDir',{method:"POST"})
    this.list = await req.json();
  }
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item clickable v-for="e in list" :key="e">
          <q-item-section avatar>
            <q-icon name="description"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{e}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <home/>
    </q-page-container>
  </q-layout>
</template>
