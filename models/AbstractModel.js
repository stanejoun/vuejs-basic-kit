export class AbstractModel {

	static generateId () {
		return Math.round(new Date().getTime() + (Math.random() * 100));
	}

	hydrate (definition) {
		if (definition) {
			const properties = Object.getOwnPropertyNames(this);
			for (const index in properties) {
				const property = properties[index];
				if (typeof definition[property] !== 'undefined') {
					this[property] = definition[property];
				}
			}
		}
	}
}