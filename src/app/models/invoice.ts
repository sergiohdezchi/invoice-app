export interface InvoiceAttributes {
  id: number;
  invoice_number: string;
  total: string;
  status: string;
  formatted_date: string;
}

export interface InvoiceData {
  id: string;
  type: string;
  attributes: InvoiceAttributes;
}
