<template>
  <b-nav-item-dropdown
      id="dropdown-grouped"
      variant="link"
      class="dropdown-language"
      right
  >
    <template #button-content>
      <b-img
          :src="currentLocale.img"
          height="14px"
          width="22px"
          :alt="'locale'"
      />
      <span class="ml-50 text-body">{{ $t(currentLocale.name) }}</span>
    </template>
    <b-dropdown-item
        v-for="localeObj in locales"
        :key="localeObj.locale"
        @click="setLocale(localeObj)"
    >
      <b-img
          :src="localeObj.img"
          height="14px"
          width="22px"
          :alt="localeObj.locale"
      />
      <span class="ml-50">{{ $t(localeObj.name) }}</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { BNavItemDropdown, BDropdownItem, BImg } from 'bootstrap-vue';
import { I18n } from '../services/I18n';

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BImg
  },
  data () {
    return {
      currentLocale: {
        locale: 'en',
        img: require('@/assets/images/flags/en.png'),
        name: 'English'
      },
      locales: [
        {
          locale: 'en',
          img: require('@/assets/images/flags/en.png'),
          name: 'English'
        },
        {
          locale: 'fr',
          img: require('@/assets/images/flags/fr.png'),
          name: 'French'
        }
      ]
    };
  },
  mounted () {
    const locale = localStorage.getItem(I18n.KEY);
    if (locale) {
      for (const index in this.locales) {
        if (this.locales[index].locale === locale) {
          this.currentLocale = this.locales[index];
        }
      }
    }
  },
  methods: {
    setLocale (localeObj) {
      I18n.setLocale(localeObj.locale);
      this.currentLocale = localeObj;
      location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables/variables";

.dropdown-language:hover {
  .text-body {
    color: $primary !important;
  }
}

img {
  position: relative;
  top: -2px;
}
</style>