<template>
  <div class="card w-100">

    <div v-if="title || createButtonText" class="d-flex flex-row pt-2 px-2 pb-0">
      <div v-if="title" class="d-flex flex-column justify-content-start mr-auto">
        <h3>{{ title }}</h3>
        <h5 v-if="subTitle" class="text-black-50">{{ subTitle }}</h5>
      </div>
      <div v-if="createButtonText" class="d-flex justify-content-end ml-auto">
        <button @click="clickAdd($event)" type="button" class="btn btn-primary align-self-center"><i class="fa-solid fa-plus mr-50"></i>{{ $t(createButtonText) }}</button>
      </div>
    </div>

    <div class="card-header d-flex flex-row">

      <div class="col col-entries">
        <div class="d-flex">
          <span class="d-flex align-items-center">{{ $t('Entries') }}</span>
          <select v-model="query.limit" class="form-control form-control-sm ml-1" @change="onChangeDisplay()">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div v-if="filters" class="col text-center">

        <template v-for="filter in filters">
          <template v-if="filter.type === 'button'">
            <b-form-checkbox-group
                v-if="filter.availableValues.length > 2"
                buttons
                button-variant="outline-primary"
                v-on:change="onFilterChange($event, filter)"
                v-model="filter.selectedValues"
                :options="filter.availableValues"
            />
            <b-form-radio-group
                v-else
                buttons
                button-variant="outline-primary"
                v-on:change="onFilterChange($event, filter)"
                v-model="filter.selectedValues"
                :options="filter.availableValues"
            />
          </template>
        </template>

        <div v-if="filters.length === 1" class="d-flex justify-content-center">
          <template v-for="filter in filters" >

            <template v-if="filter.type === 'list'">
              <span class="d-flex align-items-center mr-1">{{ filter.label }}</span>
              <template v-if="filter.multiple === true">
                <multi-select :search="filter.enableSearch" :select-all="filter.enableSelectAll" :options="filter.availableValues" v-model="filter.selectedValues" v-on:input="onFilterChange($event, filter)"/>
              </template>
              <template v-else>
                <single-select :search="filter.enableSearch" :options="filter.availableValues" v-model="filter.selectedValues" v-on:input="onFilterChange($event, filter)"/>
              </template>
            </template>

            <template v-if="filter.type === 'period'">
              <span class="d-flex align-items-center mr-1">{{ filter.label }}</span>
              <single-select :search="true" :options="periodOptions" v-model="filter.period" v-on:input="onFilterChange($event, filter)"/>
            </template>

            <template v-if="filter.type === 'date'">
              <span class="d-flex align-items-center mr-1">{{ filter.label }}</span>
              <div>
                <label class="form-label me-2">{{ $t('From') }}</label>
                <input v-model="filter.dateFrom" :max="filter.dateTo" class="input-date d-inline-flex form-control form-control-sm" type="date" v-on:change="onFilterChange(filter, filter)">
                <label class="form-label mx-2">{{ $t('To') }}</label>
                <input v-model="filter.dateTo" :min="filter.dateFrom" class="input-date d-inline-flex form-control form-control-sm" type="date" v-on:change="onFilterChange(filter, filter)">
              </div>
            </template>

          </template>
        </div>
      </div>

      <div class="col-5">
        <div class="d-flex flex-row">

          <div v-if="filters && filters.length > 1" class="d-flex align-self-center">
            <span v-if="query.filters.length" class="btn-filters-badge badge rounded-pill bg-secondary shadow-sm">
              {{ query.filters.length }}
            </span>
            <button class="btn-filters btn btn-sm mr-1" type="button" v-bind:class="{'btn-light': !query.filters.length, 'btn-primary': query.filters.length}" @click="clickFiltersButton()">
              <i class="fas fa-filter"></i>
            </button>
          </div>

          <div class="d-flex w-100">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
              </div>
              <input type="text" v-model="query.search" :placeholder="this.$t('Type to Search...')" class="form-control input-search" v-on:keyup="onSearchChange(null)" v-on:change="onSearchChange($event)">
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="card-body">

      <div v-if="filters" class="d-block panel-filters text-center" v-bind:class="{'show': displayFilters}">
        <div v-for="(filter, index) in filters" :key="index" class="d-inline-block mr-2 text-left">

          <template v-if="filter.type === 'list'">
            <label class="filter-label form-label">{{ filter.label }}</label>
            <template v-if="filter.multiple === true">
              <multi-select :search="filter.enableSearch" :select-all="filter.enableSelectAll" :options="filter.availableValues" v-model="filter.selectedValues" v-on:input="onFilterChange($event, filter)"/>
            </template>
            <template v-else>
              <single-select :search="filter.enableSearch" :options="filter.availableValues" v-model="filter.selectedValues" v-on:input="onFilterChange($event, filter)"/>
            </template>
          </template>

          <template v-if="filter.type === 'period'">
            <label class="filter-label form-label">{{ filter.label }}</label>
            <single-select :search="true" :options="periodOptions" v-model="filter.period" v-on:input="onFilterChange($event, filter)"/>
          </template>

          <template v-if="filter.type === 'date'">
            <label class="filter-label form-label">{{ filter.label }}</label>
            <div>
              <label class="form-label me-2">{{ $t('From') }}</label>
              <input v-model="filter.dateFrom" :max="filter.dateTo" class="input-date d-inline-flex form-control form-control-sm" type="date" v-on:change="onFilterChange(filter, filter)">
              <label class="form-label mx-2">{{ $t('To') }}</label>
              <input v-model="filter.dateTo" :min="filter.dateFrom" class="input-date d-inline-flex form-control form-control-sm" type="date" v-on:change="onFilterChange(filter, filter)">
            </div>
          </template>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped" :class="{'table-hover': tableHover}">
          <thead>
          <tr>
            <th v-for="column in columns" :key="column.name" v-bind:class="{'sort': column.sort}" v-on:click="onClickColumnHeader(column.name, column.sort)">
              {{ column.label }}
              <i v-if="column.sort && query.sort[column.name] === 'none'" class="fas fa-sort"></i>
              <i v-if="column.sort && query.sort[column.name] === 'asc'" class="fas fa-sort-down"></i>
              <i v-if="column.sort && query.sort[column.name] === 'desc'" class="fas fa-sort-up"></i>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in dataCollection.items" :key="item.id" @click="clickRow($event, item.id)" :class="{'row-hover': rowHover}">
            <slot :item="item" name="tbody"></slot>
          </tr>
          <tr v-if="!dataCollection.items.length">
            <td :colspan="columns.length" class="text-center">
              <h3 class="text-secondary mt-2">{{ $t(noDataFoundText) }}</h3>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="table-footer d-flex flex-row mb-1">
        <div v-if="dataCollection.total > 1" class="table-footer-infos d-flex mr-auto pt-2 pl-2">{{
            $t(footerInfosText, {
              'start': start,
              'limit': (limit > dataCollection.total) ? dataCollection.total : limit,
              'total': dataCollection.total
            })
          }}
        </div>
        <div v-if="dataCollection.total === 1" class="table-footer-infos d-flex mr-auto pt-2 pl-2">One item to display
        </div>
        <div v-if="dataCollection.total > 1" class="table-footer-pages d-flex pt-1 pr-2">
          <b-pagination
              v-model="dataCollection.page"
              @change="onPaginationChange($event)"
              :total-rows="dataCollection.total"
              :per-page="dataCollection.limit"
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ApiService } from '../services/ApiService';
import { BPagination } from 'bootstrap-vue/src/components/pagination';
import SingleSelect from './SingleSelect';
import MultiSelect from './MultiSelect';
import { BFormRadioGroup, BFormCheckboxGroup, BFormGroup } from 'bootstrap-vue';

export default {
  name: 'data-table-component',
  components: {
    MultiSelect,
    SingleSelect,
    BPagination,
    BFormRadioGroup,
    BFormCheckboxGroup,
    BFormGroup
  },
  data () {
    return {
      dataCollection: {
        items: [],
        limit: 10,
        numberOfPages: 0,
        page: 1,
        start: 1,
        total: 0
      },
      query: {
        page: 1,
        limit: 10,
        search: '',
        sort: {},
        filters: []
      },
      searchTimeout: null,
      displayFilters: false,
      filtersNumber: 0,
      periodOptions: [
        { value: 'today', text: this.$t('Today') },
        { value: 'yesterday', text: this.$t('Yesterday') },
        { value: 'currentWeek', text: this.$t('This week') },
        { value: 'lastWeek', text: this.$t('The last week') },
        { value: 'currentMonth', text: this.$t('This month') },
        { value: 'lastMonth', text: this.$t('The last month') },
        { value: 'currentYear', text: this.$t('This year') },
        { value: 'lastYear', text: this.$t('The last year') },
        { value: '-24 hours', text: this.$t('The last 24 hours') },
        { value: '-7 days', text: this.$t('The last 7 days') },
        { value: '-30 days', text: this.$t('The last 30 days') },
        { value: '-3 months', text: this.$t('The last 3 months') },
        { value: '-6 months', text: this.$t('The last 6 months') },
        { value: '-12 months', text: this.$t('The last 12 months') }
      ]
    };
  },
  props: {
    title: {
      type: String,
      required: false
    },
    subTitle: {
      type: String,
      required: false
    },
    createButtonText: {
      type: String,
      required: false
    },
    footerInfosText: {
      type: String,
      required: false,
      default: 'Displaying item {start} to {limit} of {total} items'
    },
    noDataFoundText: {
      type: String,
      required: false,
      default: 'No data found.'
    },
    columns: {
      type: Array,
      required: true
    },
    source: {
      type: String,
      required: false
    },
    filters: {
      type: Array,
      required: false
    },
    tableHover: {
      type: Boolean,
      required: false
    },
    rowHover: {
      type: Boolean,
      required: false
    }
  },
  watch: {
    columns (columns) {
      this.updateColumns(columns);
    }
  },
  mounted () {
    this.updateColumns(this.columns);
    this.getData();
  },
  computed: {
    start () {
      return this.dataCollection.start + 1;
    },
    limit () {
      return this.dataCollection.page * this.dataCollection.limit;
    }
  },
  methods: {
    async getData () {
      const response = await ApiService.post(this.source, this.query);
      if (
          response &&
          response.data &&
          typeof response.data.items !== 'undefined' &&
          typeof response.data.limit !== 'undefined' &&
          typeof response.data.numberOfPages !== 'undefined' &&
          typeof response.data.page !== 'undefined' &&
          typeof response.data.start !== 'undefined' &&
          typeof response.data.total !== 'undefined'
      ) {
        this.dataCollection = response.data;
      } else {
        this.dataCollection = {
          items: [],
          limit: 10,
          numberOfPages: 0,
          page: 1,
          start: 1,
          total: 0
        };
      }
    },
    updateColumns (columns) {
      let sort = {};
      for (const index in columns) {
        const column = columns[index];
        if (column.sortDirection) {
          sort[column.name] = column.sortDirection;
        }
      }
      this.query.sort = sort;
    },
    onPaginationChange ($event) {
      this.dataCollection.page = $event;
      this.query.page = $event;
      this.getData();
    },
    onChangeDisplay () {
      this.query.page = 1;
      this.getData();
    },
    onSearchChange ($event) {
      clearTimeout(this.searchTimeout);
      if (!$event || ($event && $event.target.value !== this.query.search)) {
        this.searchTimeout = setTimeout(() => {
          this.query.page = 1;
          this.getData();
        }, 1000);
      }
    },
    onClickColumnHeader (columnName, canSort) {
      if (canSort) {
        let direction = 'none';
        const currentDirection = this.query.sort[columnName];
        if (currentDirection === 'none') {
          direction = 'asc';
        } else if (currentDirection === 'asc') {
          direction = 'desc';
        } else if (currentDirection === 'desc') {
          direction = 'none';
        }
        this.query.sort[columnName] = direction;
        this.query.page = 1;
        this.getData();
      }
    },
    indexOfFilter (filterToFind) {
      for (const index in this.query.filters) {
        if (this.query.filters[index].name === filterToFind.name) {
          return index;
        }
      }
      return -1;
    },
    onFilterChange (value, filter) {
      const indexFilter = this.indexOfFilter(filter);
      if (((!value && value !== 0 && value !== '') || (Array.isArray(value) && !value.length)) && indexFilter !== -1) {
        this.query.filters.splice(indexFilter, 1);
      }
      if ((value || value === 0 || value === '') && !(Array.isArray(value) && !value.length)) {
        let filterCopy = { ...filter };
        delete filterCopy.availableValues;
        if (indexFilter !== -1) {
          this.query.filters[indexFilter] = filterCopy;
        } else {
          this.query.filters.push(filterCopy);
        }
      }
      this.getData();
    },
    clickFiltersButton () {
      this.displayFilters = !this.displayFilters;
    },
    clickRow (event, id) {
      if (event.target && (!event.target.tagName || (event.target.tagName && ['button', 'a', 'span', 'div', 'i'].indexOf(event.target.tagName.toLowerCase()) === -1))) {
        this.$emit('clickRow', id);
      }
    },
    clickAdd (event) {
      this.$emit('clickAdd', event);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables/variables";

.card-body {
  padding: 0;
}

.table-responsive {
  min-height: 400px;
}

.table .sort {
  cursor: pointer;

  &:hover {
    color: $primary;
  }
}

table tbody .row-hover td {
  cursor: pointer;
}

.col-entries {
  max-width: 150px;
  padding-left: 0.5rem !important;
}

.col-5 {
  padding-right: 0.5rem !important;
}

.btn-filters {
  padding: 0.486rem 0.5rem;
}

.btn-filters-badge {
  position: relative;
  z-index: 1;
  left: 10px;
  bottom: 10px;
  height: 20px;
  width: 20px;
}

.btn-reset-filter {
  position: relative;
  left: 5px;
}

.panel-filters {

  display: none;
  height: 0;
  padding: 0 !important;
  visibility: hidden;
  opacity: 0;
  transition: padding 0.3s ease;
  border-top: thin solid rgba(94, 86, 105, 0.14);

  &.show {
    display: block;
    padding: 1rem 2rem 1.5rem 2rem !important;
    visibility: visible;
    opacity: 1;
    height: 100%;
    transition: height 0.5s ease, padding 0.2s ease, opacity 0.5s ease;
  }
}
</style>