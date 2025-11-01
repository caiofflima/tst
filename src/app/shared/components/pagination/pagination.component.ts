import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
	@Input('data') data: string[] = [];
	@Input('config') config = {
		id: 'custom',
		itemsPerPage: 10,
		currentPage: 1,
		screenReaderPaginationLabel:null
	};
	@Input('pageChange') pageChange = function (event) {
		this.config.currentPage = event;
		return event;
	};


	/* v15 */
	directionLinks:any = null
	previousLabel:any = null
	nextLabel:any = null
	screenReaderPageLabel:any = null
	screenReaderPaginationLabel:any = null
}
