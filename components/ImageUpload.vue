<template>
  <div class="d-flex image-upload-container justify-content-center align-items-center">

    <input ref="inputFile" accept="image/*" class="d-none" name="image_upload" type="file" v-on:change="onFileChange($event)">

    <div v-if="image" class="image-upload-actions d-flex flex-column">
      <div class="d-flex flex-row justify-content-around" v-bind:style="{width: width}">
        <a v-if="!cropper" class="d-flex align-items-center justify-content-center image-upload-btn" :title="$t('Crop')" type="button" v-on:click="crop()">
          <i class="fa-solid fa-crop"></i>
        </a>
        <a v-if="!cropper" class="d-flex align-items-center justify-content-center image-upload-btn remove-image-btn align-self-end" :title="$t('Remove')" type="button" v-on:click="removeImage()">
          <i class="fa-solid fa-xmark"></i>
        </a>
        <a v-if="cropper" class="d-flex align-items-center justify-content-center image-upload-btn" :title="$t('Zoom out')" type="button" v-on:click="zoomOut()">
          <i class="fas fa-search-minus"></i>
        </a>
        <a v-if="cropper" class="d-flex align-items-center justify-content-center image-upload-btn" :title="$t('Zoom in')" type="button" v-on:click="zoomIn()">
          <i class="fas fa-search-plus"></i>
        </a>
        <a v-if="cropper" class="d-flex align-items-center justify-content-center image-upload-btn" :title="$t('Reset')" type="button" v-on:click="reset()">
          <i class="fa-solid fa-arrow-rotate-left"></i>
        </a>
        <a v-if="cropper" class="d-flex align-items-center justify-content-center image-upload-btn" :title="$t('Validate')" type="button" v-on:click="cropValidate()">
          <i class="fa-solid fa-check"></i>
        </a>
      </div>
      <div ref="preview" class="d-flex image-upload-preview shadow rounded" v-bind:style="{width: width, height: height}">
        <img ref="image" :src="image" alt="Picture" class="d-flex m-auto" v-bind:class="{'d-none' : !image}">
      </div>
    </div>

    <div v-if="!image" :class="{'has-error': message}" class="d-flex flex-column image-upload-button m-auto" v-on:click="onClickImageUpload()" v-bind:style="{width: width, height: height}">
      <div class="d-flex flex-column align-items-center justify-content-center image-upload-background-icon">
        <i class="d-flex fa-solid fa-image"></i>
        <p class="d-flex">{{ $t('Click here') }}</p>
      </div>
      <div v-if="message" class="invalid-feedback text-center mt-2">{{ message }}</div>
    </div>

  </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  name: 'image-upload',
  data () {
    return {
      image: null,
      cropper: null,
      message: ''
    };
  },
  props: {
    value: null,
    height: {
      type: String,
      required: false,
      default: '150px'
    },
    width: {
      type: String,
      required: false,
      default: '150px'
    }
  },
  watch: {
    value (value) {
      if (typeof value !== undefined) {
        this.image = value;
      }
    }
  },
  mounted () {
    if (typeof this.value !== undefined) {
      this.image = this.value;
    }
  },
  methods: {
    initCropper () {
      if (this.cropper !== null) {
        this.cropper.destroy();
      }
      this.cropper = new Cropper(this.$refs.image, {
        viewMode: 0,
        dragMode: 'move',
        initialAspectRatio: NaN,
        aspectRatio: NaN,
        responsive: true,
        restore: true,
        checkCrossOrigin: true,
        checkOrientation: true,
        modal: true,
        guides: true,
        center: true,
        highlight: false,
        background: false,
        autoCrop: true,
        autoCropArea: 1,
        movable: true,
        rotatable: true,
        scalable: true,
        zoomable: true,
        zoomOnTouch: true,
        zoomOnWheel: true,
        wheelZoomRatio: 0.1,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        minContainerWidth: 150,
        minContainerHeight: 150,
        minCanvasWidth: 0,
        minCanvasHeight: 0,
        minCropBoxWidth: 0,
        minCropBoxHeight: 0
      });
    },
    onFileChange (event) {
      this.message = '';
      this.image = null;
      const files = event.target.files || event.dataTransfer.files;
      if (files.length) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
          this.$emit('input', this.image);
        };
        reader.readAsDataURL(files[0]);
      }
    },
    removeImage () {
      this.image = null;
      this.$emit('input', this.image);
      if (this.cropper !== null) {
        this.cropper.destroy();
      }
    },
    crop () {
      setTimeout(() => {
        this.initCropper();
      }, 100);
    },
    zoomIn () {
      this.cropper.zoom(0.1);
    },
    zoomOut () {
      this.cropper.zoom(-0.1);
    },
    reset () {
      this.cropper.reset();
    },
    onClickImageUpload () {
      this.$refs.inputFile.click();
    },
    cropValidate () {
      if (this.cropper !== null) {
        this.image = this.cropper.getCroppedCanvas().toDataURL();
        this.$emit('input', this.image);
        this.cropper.destroy();
        this.cropper = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables/variables";

.image-upload-button {
  border: 4px dashed $gray-300;
  border-radius: 15px;
  cursor: pointer;
  transition: color 0.5s ease, border-color 0.5s ease;

  .fa-image, p {
    transition: color 0.5s ease;
  }

  &:hover {
    border-color: $primary;
    transition: border-color 0.5s ease;

    .fa-image, p {
      color: $primary;
      transition: color 0.5s ease;
    }
  }

  &.has-error {
    border-color: $danger;

    &:hover {
      border-color: $danger;

      .fa-image, p {
        color: $danger;
      }
    }
  }

  .fa-image {
    color: $gray-300;
    font-size: 3.5rem;
  }

  p {
    color: $gray-500;
  }
}

.image-upload-preview {

  overflow: hidden;
  background-color: $gray-800;

  img {
    position: relative;
    background-color: $white;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}

.image-upload-background-icon {
  height: 100%;
}

.image-upload-btn {
  position: relative;
  z-index: 1;
  top: 10px;
  background-color: rgba($white, 0.9);
  color: $primary;
  border: 2px solid $primary;
  height: 30px;
  width: 30px;
  line-height: 0;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1rem;

  &:hover {
    background-color: rgba($primary, 0.9);
    color: $white;
  }
}

.remove-image-btn {
  color: $danger;
  border: 2px solid $danger;

  &:hover {
    background-color: rgba($danger, 0.9);
  }
}

.image-upload-actions {
  margin-top: -20px;
}
</style>