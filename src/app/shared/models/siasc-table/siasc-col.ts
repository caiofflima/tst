export class SiascCol {
	constructor(
		public id: string,
		public text: string,
		public width: number,
		public clazz: any,
		public style: any,
		public object: any,

		public showAlertIcon: boolean,
		public textAlert?: string,
		public classAlerIcon?: string,
		public classIcon?: string,
		public titleAlertIcon?: string,

		public callback?: (object?: SiascCol, thiz?: any) => any,
		public thiz?: any

	) { }
}
