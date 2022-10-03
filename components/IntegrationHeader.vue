<template>
  <div class="integration-header d-flex flex-row p-1 border-bottom">
    <div class="d-flex align-items-center w-100">
      <div class="d-flex flex integration-header-left align-items-center"
           :class="{'justify-content-start': leftAlign === 'start', 'justify-content-center': leftAlign === 'center', 'justify-content-end': leftAlign === 'end'}"
      >
        <slot name="left"></slot>
      </div>
      <div class="d-flex mx-auto integration-header-center align-items-center"
           :class="{'justify-content-start': centerAlign === 'start', 'justify-content-center': centerAlign === 'center', 'justify-content-end': centerAlign === 'end'}"
      >
        <slot name="center"></slot>
      </div>
      <div class="d-flex integration-header-right align-items-center"
           :class="{'justify-content-start': rightAlign === 'start', 'justify-content-center': rightAlign === 'center', 'justify-content-end': rightAlign === 'end'}"
      >
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IntegrationHeader',
  props: {
    leftAlign: {
      type: String,
      required: false,
      default: 'start'
    },
    centerAlign: {
      type: String,
      required: false,
      default: 'center'
    },
    rightAlign: {
      type: String,
      required: false,
      default: 'end'
    }
  }
};
</script>

<style scoped lang="scss">
.integration-header {
  margin-top: -19px;
  //background-image: url("../../src/assets/images/pages/integration-header-bg3.png");
  background-image: url("../../src/assets/images/banner/banner-faq4.png");
  background-position: 50% 75%;
  //background-color: rgba(240, 128, 0, 0.1);
  background-color: rgba(255,255,255, 0.7);
}

.integration-header-left {
  position: relative;
  width: 30%;
}
.integration-header-center {
  position: relative;
  width: 40%;
}
.integration-header-right {
  position: relative;
  width: 30%;
}
</style>