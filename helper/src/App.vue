<script>
import { ref } from 'vue'
import Home from './views/Home.vue'
import { api } from './io'
import share from "./components/share.vue"

export default {
  components: { Home,share },
  name: 'LayoutDefault',
  setup () {
    return {
      leftDrawerOpen: ref(false),api,DATA
    }
  },
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
        <share ref="bar">
          <q-toolbar-title>
            Shopware plugin manager
          </q-toolbar-title>
        </share><q-space/>
        <span ref="tools"/>
        <q-btn round flat icon="build" @click="api('runCommand',{cmd:'make watch-admin',path:'../'})"/>
        <q-btn round flat icon="cached" @click="api('build',{data:DATA})"/>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item clickable v-for="r in $router.options.menu" :key="r.name" @click="$router.replace(r.path)">
          <q-item-section avatar>
            <q-icon v-if="r.icon" :name="r.icon"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{r.name}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>
