<template>
  <b-modal ref="confirmModalComponent" :scrollable="true" :no-close-on-backdrop="true" :keyboard="false">
    <template #modal-title>
      <div v-html="title"></div>
    </template>
    <b-card-text>
      <div class="row">
        <div class="col text-center" v-html="message"></div>
      </div>
    </b-card-text>
    <template #modal-footer>
      <div class="d-inline-block w-100 text-center">
        <button class="btn btn-secondary" data-bs-dismiss="modal" type="button" @click="cancel()"><i class="fa-solid fa-xmark mr-50"></i>{{ $t(cancelButton) }}</button>
        <button class="btn btn-primary ml-1" type="button" @click="confirm()"><i class="fa-solid fa-check mr-50"></i>{{ $t(okButton) }}</button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { BModal, BCardText } from 'bootstrap-vue';

export default {
  name: 'confirm-modal',
  components: {
    BModal,
    BCardText
  },
  data: () => ({
    title: '',
    icon: '',
    message: '',
    okButton: 'Continue',
    cancelButton: 'Cancel',
    resolvePromise: null,
    rejectPromise: null
  }),
  methods: {
    show (options = {}) {
      this.title = options.title;
      this.message = options.message;
      if (options.icon) {
        this.icon = options.icon;
      }
      if (options.okButton) {
        this.okButton = options.okButton;
      }
      if (options.cancelButton) {
        this.cancelButton = options.cancelButton;
      }
      this.$refs['confirmModalComponent'].show();
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
    confirm () {
      this.$refs['confirmModalComponent'].hide();
      this.resolvePromise(true);
    },
    cancel () {
      this.$refs['confirmModalComponent'].hide();
      this.resolvePromise(false);
    }
  }
};
</script>