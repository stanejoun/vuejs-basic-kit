import { AbstractModel } from '../AbstractModel';

export class DataTableFilter extends AbstractModel {

  static BUTTON_TYPE = 'button';
  static LIST_TYPE = 'list';
  static DATE_TYPE = 'date';
  static PERIOD_TYPE = 'period';

  constructor (definition) {

    super();

    this.type = '';
    this.name = '';
    this.label = '';
    this.availableValues = [];
    this.selectedValues = null;
    this.period = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.multiple = true;
    this.enableSearch = true;
    this.enableSelectAll = true;
    this.isJsonData = false;

    this.hydrate(definition);
  }

  static filterValuesFormatting (columnNameForValue, columnNameForText, values = []) {
    let list = [];
    for (const key in values) {
      const value = values[key];
      if (typeof value[columnNameForValue] !== 'undefined' && typeof value[columnNameForText] !== 'undefined') {
        list.push({
          value: value[columnNameForValue],
          text: value[columnNameForText]
        });
      }
    }
    return list;
  }
}