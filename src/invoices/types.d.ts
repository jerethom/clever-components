export interface Amount {
  amount: Number,
  currency: string,
  foo: Bar,
}

interface Bar {
  hello: string,
  bibi: Baz,
}

interface Baz {
  there: string,
}

export interface Invoice {
  downloadUrl: string,
  emissionDate: string,
  invoiceHtml: string,
  number: string,
  paymentUrl: string,
  status: InvoiceStatusType,
  total: Amount,
  type: InvoiceType,
}



export type InvoiceStatusType = "PENDING" | "PROCESSING" | "PAID" | "PAYMENTHELD" | "CANCELED" | "REFUNDED" | "WONTPAY";

export type InvoiceType = "INVOICE" | "CREDITNOTE";

