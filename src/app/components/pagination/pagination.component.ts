import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  onPageChange(event: PageEvent): void {
    const newPageIndex = event.pageIndex + 1;

    if (event.pageSize !== this.pageSize) {
      this.pageSizeChange.emit(event.pageSize);
    }

    if (newPageIndex !== this.currentPage) {
      this.pageChange.emit(newPageIndex);
    }
  }
}
