export class PageRequest {
    public pageSize: number;

    constructor(
        public pageNumber: number ,
        pageSize: number | string 
    ) {
        if (typeof pageSize === "string") {
            this.pageSize = Number(pageSize);
        } else {
            this.pageSize = pageSize;
        }
    }

}
