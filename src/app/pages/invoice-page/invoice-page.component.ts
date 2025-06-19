import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceSearchComponent } from '../../components/invoice-search/invoice-search.component';
import { LayoutComponent } from '../../components/layout/layout.component';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-page',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    InvoiceSearchComponent,
    MatSnackBarModule
  ],
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss']
})
export class InvoicePageComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) {}

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

  loadInvoices(): void {
    this.loading = true;
  }
}
