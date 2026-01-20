
export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  date: string;
  items: InvoiceItem[];
  maintenanceFee: number;
}
