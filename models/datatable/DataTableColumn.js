export class DataTableColumn {

	constructor(name, label, sort = false, sortDirection = 'none') {

		this.name = name;
		this.label = label;
		this.sort = sort;
		this.sortDirection = sortDirection;
	}
}