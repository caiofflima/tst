import { SiascCol } from './siasc-col';
import { SiascRow } from './siasc-row';

export class SiascTable {
	constructor(
		public id: string,
		public title: string,
		public headers: SiascCol[],
		public rows: SiascRow[],
		public clazz: any,
		public style: any,
		public showPagination: boolean,
		public numberPage: number,
		public numberItems: number,
		public total: number,
		public listObject: any[]
	) { }
}
