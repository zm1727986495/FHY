<template>
	<section class="app-main" style="min-height: 100%; margin: 0 10px">
		<transition name="fade" mode="out-in" v-if="$route.meta.keepAlive">
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
		</transition>
    <transition name="fade" mode="out-in" v-if="!$route.meta.keepAlive">
      <router-view ></router-view>
		</transition>
	</section>
</template>
<script>
	export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
