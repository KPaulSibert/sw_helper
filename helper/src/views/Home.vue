<script>
import {api} from "../io"
export default {
    setup(){
        return {api}
    }
}
</script>
<template>
  <q-page>
      <div class="q-pa-md">
          <q-btn color="primary" @click="api('runCommand',{cmd:'bin/console cache:clear'})" icon="cached">Clear Cache</q-btn>
      </div>
  </q-page>
</template>
