import { SiascCol } from './siasc-col';

export class SiascRow {
	constructor(
		public id: string,
		public coluns: SiascCol[],
		public clazz: any,
		public style: any,
		public showEdit: boolean,
		public showDelete: boolean,
		public showDetail: boolean,
		public showSelect: boolean,
		public showHover: boolean,
		public showPdf: boolean,
		public showEmail: boolean,
		public disabledEmail: boolean,
		public idModalEmail: string,
		public idModal: string,
		public object: any
	) { }
}
