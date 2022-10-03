<template>
  <div class="single-select-component">
    <div v-if="!disabled && (selectedValue || selectedValue === 0 || selectedValue === '')" class="clear-value"><i class="fa fa-close" @click="clearValue()"></i></div>
    <b-dropdown :disabled="disabled" class="w-100" :text="label" :title="selectedValue" variant="outline-white" :class="{'nothing-selected': !this.selectedValue}">
      <template v-if="search">
        <input v-model="searchValue" class="form-control form-control-sm" name="multi-select-search" :placeholder="this.$t('Search...')" type="text" @keyup="searchChange()"/>
        <b-dropdown-divider></b-dropdown-divider>
      </template>
      <b-dropdown-item v-for="(option, index) in options" :key="index" v-if="shouldDisplayOption(option[bindValue])" v-on:click="onClickOption(option[bindValue])" :class="{'checked': selectedValue === option[bindValue]}">
        {{ option[bindText] }} <i v-if="selectedValue === option[bindValue]" class="fas fa-check"></i>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import { BDropdown, BDropdownItem, BDropdownDivider } from 'bootstrap-vue';

export default {
  name: 'single-select',
  components: {
    BDropdown,
    BDropdownItem,
    BDropdownDivider
  },
  data () {
    return {
      searchValue: null,
      selectedValue: null,
      searchResult: [],
      bindValue: 'value',
      bindText: 'text',
    };
  },
  props: {
    options: Array,
    value: null,
    bindValueProperty: null,
    bindTextProperty: null,
    search: false,
    disabled: false,
    nothingSelectedText: ''
  },
  watch: {
    value (selectedValue) {
      if (typeof selectedValue !== undefined) {
        this.selectedValue = selectedValue;
      }
    }
  },
  mounted () {
    this.bindValue = (this.bindValueProperty) ? this.bindValueProperty : 'value';
    this.bindText = (this.bindTextProperty) ? this.bindTextProperty : 'text';
    if (typeof this.value !== undefined && this.value !== null) {
      this.selectedValue = this.value;
    }
  },
  computed: {
    label () {
      if (this.selectedValue || this.selectedValue === 0 || this.selectedValue === '') {
        const optionId = this.selectedValue;
        if (this.options) {
          const options = this.options.filter(option => option[this.bindValue] === optionId);
          if (options && options.length) {
            return options[0][this.bindText];
          }
        }
      }
      return (this.nothingSelectedText) ? this.$t(this.nothingSelectedText) : this.$t('Nothing selected');
    }
  },
  methods: {
    onClickOption (optionId) {
      if (this.selectedValue === optionId) {
        this.selectedValue = null;
      } else {
        this.selectedValue = optionId;
      }
      this.$emit('input', this.selectedValue);
    },
    searchChange () {
      let searchResult = [];
      this.searchResult = [];
      if (this.searchValue) {
        for (const index in this.options) {
          const option = this.options[index];
          const label = option[this.bindText].toLowerCase();
          const indexOf = label.search(this.searchValue.toLowerCase());
          if (indexOf !== -1) {
            searchResult.push(option[this.bindValue]);
          }
        }
      }
      this.searchResult = searchResult;
    },
    shouldDisplayOption (optionId) {
      if (!this.searchValue || this.searchResult.indexOf(optionId) !== -1) {
        return true;
      }
      return false;
    },
    clearValue () {
      this.selectedValue = null;
      this.$emit('input', this.selectedValue);
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/variables/variables";

.single-select-component {

  .btn-outline-white {
    background-color: white;
  }

  .nothing-selected {
    .btn.dropdown-toggle {
      color: #d0d0d0;
    }
  }

  .dropdown {
    position: relative;
    min-width: 160px;
  }

  .dropdown-toggle {
    position: relative;
    z-index: 1;
    text-overflow: ellipsis;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 3.7rem;
  }

  .dropdown-menu {
    max-height: 420px;
    max-width: 480px;
    min-width: 240px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    &.show {
      animation: fadeIn 250ms;
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  li.checked {
    background-color: $primary;

    .dropdown-item {
      color: #fff;

      &:hover {
        color: #fff;
        background-color: $primary;
      }
    }
  }

  .dropdown-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    //max-width: 360px;
    padding: 0.65rem 1.7rem 0.65rem 1.28rem;

    &:hover {
      color: $primary;
      background-color: $primary-light;
    }
  }

  i.fa-check {
    position: absolute;
    right: 10px;
    margin-top: 5px;
  }

  .form-control {
    width: 90%;
    margin: auto;
  }

  .clear-value {
    display: block;
    position: relative;
    cursor: pointer;
    z-index: 2;
    left: calc(100% - 42px);
    top: 12px;
    font-size: 0.9rem;
    width: 10px;
    margin: 0 0 -18px;
  }

  &.is-invalid {
    .btn-outline-white {
      color: #ea5455;
      border-color: #ea5455;
    }
  }
}
</style>