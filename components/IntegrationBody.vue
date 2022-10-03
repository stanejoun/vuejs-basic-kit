<template>
  <div class="integration-body d-flex flex-row" :class="{'edit': editMode, 'maximize': maximize}">
    <div class="d-flex flex-row align-items-start w-100">
      <div class="d-flex flex-column align-items-start integration-body-left">
        <slot name="left"></slot>
      </div>
      <div class="d-flex flex-grow-1 justify-content-center mx-auto integration-body-center overflow-auto">
        <slot name="center"></slot>
      </div>
      <div class="d-flex flex-column align-items-start integration-body-right ">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IntegrationBody',
  props: {
    editMode: {
      type: Boolean,
      required: false,
      default: false
    },
    maximize: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style scoped lang="scss">

.integration-body-left {
  position: relative;
  width: 15%;
  height: calc(100vh - 255px);
}

.integration-body-center {
  position: relative;
  background: white;
  height: calc(100vh - 255px);
}

.integration-body-right {
  position: relative;
  width: 15%;
  height: calc(100vh - 255px);
}

.integration-body.edit {
  .integration-body-left {
    display: none !important;
  }

  .integration-body-right {
    width: 33%;
  }

  &.maximize {

    .integration-body-left , .integration-body-center {
      width: 0;
    }

    .integration-body-right {
      width: 100%;
      transition: width 500ms ease;
    }
  }
}

</style>