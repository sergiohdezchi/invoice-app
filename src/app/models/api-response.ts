import { InvoiceData } from './invoice';

export interface ApiResponseMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta: ApiResponseMeta;
}

export type InvoiceApiResponse = ApiResponse<InvoiceData>;
