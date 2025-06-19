import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { InvoiceApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/invoices`;

  getInvoices(
    startDate: string | null,
    endDate: string | null,
    page: number = 1,
    perPage: number = 10
  ): Observable<InvoiceApiResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (startDate) {
      params = params.set('start_date', startDate);
    }

    if (endDate) {
      params = params.set('end_date', endDate);
    }

    return this.http.get<InvoiceApiResponse>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error obteniendo facturas:', error);
          return throwError(() => new Error('Error al obtener las facturas'));
        })
      );
  }
}
