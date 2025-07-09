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
      transition(':leave', [
        query('tr', [
          animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
        ], { optional: true })
      ]),
      transition(':enter', [
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
    // Asegurarse de que el valor no sea nulo antes de asignarlo
    this._invoices = value || [];
    // Actualiza el dataSource con una nueva instancia para forzar una actualización completa
    this.dataSource = new MatTableDataSource<InvoiceData>(this._invoices);
    // Vuelve a aplicar el ordenamiento si ya está inicializado
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
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
    // Aplicar el ordenamiento al dataSource
    this.dataSource.sort = this.sort;
    
    // Aplicar configuraciones adicionales para mejorar el rendimiento de la tabla
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'id':
          return item.attributes.id;
        case 'invoice_number':
          return item.attributes.invoice_number;
        case 'total':
          return Number(item.attributes.total);
        case 'status':
          return item.attributes.status;
        case 'formatted_date':
          return item.attributes.formatted_date;
        default:
          return '';
      }
    };
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
