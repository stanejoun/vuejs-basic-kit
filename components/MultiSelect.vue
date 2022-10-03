<template>
  <div class="multi-select-component">
    <div v-if="!disabled && selectedValues.length" class="clear-value">
      <i class="fa fa-close" @click="onClickUnselectAll()"></i></div>
    <b-dropdown :disabled="disabled" ref="dropdown" class="w-100" :text="label" :title="selectedTexts.join(', ')" variant="outline-white" :class="{'nothing-selected': !this.selectedValues.length}">
      <template v-if="search">
        <input v-model="searchValue" class="form-control form-control-sm" name="multi-select-search" :placeholder="this.$t('Search...')" type="text" @keyup="searchChange()"/>
        <b-dropdown-divider class="divider-top"></b-dropdown-divider>
      </template>
      <template v-if="selectAll">
        <b-dropdown-item v-on:click="onClickSelectAll()" class="dropdown-item-select-all">Select all
          <i v-if="isAllSelected()" class="fas fa-check"></i></b-dropdown-item>
        <b-dropdown-item v-on:click="onClickUnselectAll()" class="dropdown-item-unselect-all">Unselect all
        </b-dropdown-item>
        <b-dropdown-divider class="divider-bottom"></b-dropdown-divider>
      </template>
      <b-dropdown-text v-for="(option, index) in options" :key="index" v-if="shouldDisplayOption(option[bindValue])" v-on:click="onClickOption(option[bindValue])" :class="{'checked': selectedValues.indexOf(option[bindValue]) !== -1}">
        {{ option[bindText] }} <i v-if="selectedValues.indexOf(option[bindValue]) !== -1" class="fas fa-check"></i>
      </b-dropdown-text>
    </b-dropdown>
  </div>
</template>

<script>
import { BDropdown, BDropdownItem, BDropdownDivider, BDropdownText } from 'bootstrap-vue';

export default {
  name: 'multi-select',
  components: {
    BDropdown,
    BDropdownItem,
    BDropdownText,
    BDropdownDivider
  },
  data () {
    return {
      searchValue: null,
      selectedValues: [],
      searchResult: [],
      bindValue: 'value',
      bindText: 'text'
    };
  },
  props: {
    options: Array,
    value: null,
    bindValueProperty: null,
    bindTextProperty: null,
    search: false,
    selectAll: false,
    disabled: false,
    nothingSelectedText: ''
  },
  watch: {
    value (selectedValues) {
      if (typeof selectedValues !== undefined) {
        this.selectedValues = selectedValues;
      }
    }
  },
  mounted () {
    this.bindValue = (this.bindValueProperty) ? this.bindValueProperty : 'value';
    this.bindText = (this.bindTextProperty) ? this.bindTextProperty : 'text';
    if (this.value && this.value.length) {
      this.selectedValues = this.value;
    }
  },
  computed: {
    selectedTexts () {
      if (this.selectedValues.length > 0) {
        const selectedValues = this.options.filter(option => this.selectedValues.indexOf(option[this.bindValue]) !== -1);
        let selectedTexts = [];
        for (const index in selectedValues) {
          selectedTexts.push(selectedValues[index][this.bindText]);
        }
        return selectedTexts;
      }
      return [];
    },
    label () {
      if (this.selectedValues.length > 1) {
        return this.selectedValues.length + ' ' + this.$t('selected items');
      } else if (this.selectedValues.length > 0) {
        const optionId = this.selectedValues[0];
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
      let selectedValues = [];
      for (const index in this.selectedValues) {
        selectedValues.push(this.selectedValues[index]);
      }
      this.selectedValues = [];
      const indexOf = selectedValues.indexOf(optionId);
      if (indexOf !== -1) {
        selectedValues.splice(indexOf, 1);
      } else {
        selectedValues.push(optionId);
      }
      this.selectedValues = selectedValues;
      this.$emit('input', this.selectedValues);
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
    onClickSelectAll () {
      let selectedValues = [];
      if (!this.isAllSelected()) {
        for (const index in this.options) {
          const option = this.options[index];
          selectedValues.push(option[this.bindValue]);
        }
      }
      this.selectedValues = selectedValues;
      this.$emit('input', this.selectedValues);
    },
    onClickUnselectAll () {
      this.selectedValues = [];
      this.$emit('input', this.selectedValues);
    },
    isAllSelected () {
      return this.options && this.options.length > 0 && this.selectedValues.length === this.options.length;
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/variables/variables";

.multi-select-component {

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
    min-width: 180px;
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
    max-height: 445px;
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

    .dropdown-item, .b-dropdown-text {
      color: #fff;

      &:hover {
        color: #fff;
        background-color: $primary;
      }
    }
  }

  .dropdown-item, .b-dropdown-text {
    cursor: pointer;
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

  .dropdown-item-select-all, .dropdown-item-unselect-all {
    background-color: #f8f8f8;

    &:hover {
      background-color: $primary-light;
    }

    .dropdown-item {
      //color: #989da1;
      font-size: 0.85rem;
      //font-style: italic;
      background-color: #f8f8f8;

      &:hover {
        color: $primary;
        background-color: $primary-light;
      }
    }
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

  .divider-top .dropdown-divider {
    margin-bottom: 0;
  }

  .divider-bottom .dropdown-divider {
    margin-top: 0;
  }

  &.is-invalid {
    .btn-outline-white {
      color: #ea5455;
      border-color: #ea5455;
    }
  }
}
</style>