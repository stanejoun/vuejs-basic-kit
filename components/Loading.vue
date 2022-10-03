<template>
  <div v-if="$store.getters['app/displayLoading']">
    <div class="loading-backdrop"></diV>
    <div class="loading-container">
      <div class="loading-logo-background"></div>
      <div class="loading-logo-container">
        <div class="loading-logo">
          <img src="@/assets/images/logo/logo.svg" alt="Logo"/>
        </div>
        <div class="loading">
          <div class="effect-1 effects"></div>
          <div class="effect-2 effects"></div>
          <div class="effect-3 effects"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'loading-component'
};
</script>

<style lang="scss" scoped>

.loading-container, .loading-backdrop {
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: wait;
}

.loading-container {
  z-index: 9999;
}

.loading-backdrop {
  z-index: 9998;
  opacity: 0.5;
  background-color: white;
}

.loading-logo-background {
  position: fixed;
  display: block;
  z-index: 1;
  top: calc(50% - 80px);
  left: calc(50% - 82px);
  width: 160px;
  height: 145px;
  background-color: white;
  border-radius: 20px;
  opacity: 0.5;
  //box-shadow: 0 2px 20px 0 rgb(34 41 47 / 10%) !important;
}

.loading-logo, .loading {
  z-index: 2;
}

.loading-logo img {
  width: 150px;
}
</style>