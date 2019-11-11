<template>
	<div>
		<div @click="toggleClick" class="wscn-icon hamburger" :class="{'is-active':isActive}">
			<img :src="home" alt="" class="imgIcon">
		</div>
	</div>
</template>

<script>
import gongneng from '@/assets/images/gongneng.png';
import home from '@/assets/images/home.png';
  export default {
		name: 'hamburger',
		data(){
			return {
				gongneng,
				home
			}
		},
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
      toggleClick: {
        type: Function,
        default: null
      }
    }
  }
</script>

<style scoped>
.hamburger {
	display: inline-block;
	cursor: pointer;
	width: 50px;
	height: 100%;
	background-color: #006ec6;
	color: #fff;
	font-size: 24px;
	text-align: center;
	line-height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	/* transform: rotate(0deg);
	transition: .38s;
	transform-origin: 50% 50%; */
}
.imgIcon{
	width: 30px;
	height: 30px;
	/* transform: rotate(0deg);
	transition: .38s;
	transform-origin: 50% 50%; */
}
.hamburger.is-active {
	/* transform: rotate(90deg); */
}

</style>
