interface Amount {
  amount: Number;
  currency: string;
}

interface Invoice {
  downloadUrl: string;
  emissionDate: string;
  invoiceHtml: string;
  number: string;
  paymentUrl: string;
  status: InvoiceStatusType;
  total: Amount;
  type: InvoiceType;
}

type InvoiceStatusType = "PENDING" | "PROCESSING" | "PAID" | "PAYMENTHELD" | "CANCELED" | "REFUNDED" | "WONTPAY";

type InvoiceType = "INVOICE" | "CREDITNOTE";

