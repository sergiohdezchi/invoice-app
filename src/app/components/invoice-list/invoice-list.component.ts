import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceData } from '../../models/invoice';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('tableAnimation', [
      transition('* => *', [
        query('tr', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('countAnimation', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class InvoiceListComponent implements AfterViewInit {
  @Input() set invoices(value: InvoiceData[]) {
    this._invoices = value;
    this.dataSource.data = value;
  }
  get invoices(): InvoiceData[] {
    return this._invoices;
  }

  @Input() totalInvoices: number = 0;
  @Input() loading: boolean = false;

  private _invoices: InvoiceData[] = [];

  displayedColumns: string[] = ['id', 'invoice_number', 'total', 'status', 'formatted_date'];
  dataSource = new MatTableDataSource<InvoiceData>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'vigente':
        return 'status-active';
      case 'cancelada':
        return 'status-canceled';
      case 'pendiente':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }
}
