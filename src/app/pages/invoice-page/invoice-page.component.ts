import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceSearchComponent } from '../../components/invoice-search/invoice-search.component';
import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LayoutComponent } from '../../components/layout/layout.component';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceData } from '../../models/invoice';
import { catchError, finalize, of, tap } from 'rxjs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-page',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    InvoiceSearchComponent,
    InvoiceListComponent,
    PaginationComponent,
    MatSnackBarModule
  ],
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss']
})
export class InvoicePageComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private snackBar = inject(MatSnackBar);

  invoices: InvoiceData[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  pageSize: number = 10;
  loading: boolean = false;
  startDate: string | null = null;
  endDate: string | null = null;

  ngOnInit(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.startDate = this.formatDate(thirtyDaysAgo);
    this.endDate = this.formatDate(today);

    this.loadInvoices();
  }

  onSearch(criteria: { startDate: string, endDate: string }): void {
    this.startDate = criteria.startDate;
    this.endDate = criteria.endDate;
    this.loadInvoices();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

    onPageChange(page: number): void {
    if (page !== this.currentPage) {
      // Si ha cambiado la página, actualizar y cargar
      this.currentPage = page;
      this.loadInvoices();
    }
  }

  onPageSizeChange(size: number): void {
    if (size !== this.pageSize) {
      this.pageSize = size;
      // Al cambiar el tamaño de página, volver a la primera página
      this.currentPage = 1;
      
      this.snackBar.open(`Mostrando ${size} facturas por página`, '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['info-snackbar']
      });
      
      this.loadInvoices();
    }
  }


  loadInvoices(): void {
    this.loading = true;
    // Limpiar las facturas antes de cargar las nuevas para evitar duplicados
    this.invoices = [];

    this.invoiceService.getInvoices(this.startDate, this.endDate, this.currentPage, this.pageSize)
      .pipe(
        tap(response => {
          this.invoices = response.data;
          this.totalPages = response.meta.total_pages;
          this.totalItems = response.meta.total_count;
        }),
        catchError(err => {
          console.error('Error al cargar facturas:', err);
          this.snackBar.open('Error al cargar las facturas. Por favor, inténtalo de nuevo.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }
}
