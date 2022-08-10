type ActionType = "add" | "none";

interface Currency {
  code: string;
  changeRate: number;
}

interface Feature {
  code: "connection-limit" | "cpu" | "databases" | "disk-size" | "gpu" | "has-logs" | "has-metrics" | "max-db-size" | "memory" | "version";
  type: "boolean" | "shared" | "bytes" | "number" | "runtime" | "string";
  value?: number | string; // Only required for a plan feature
}

interface Plan {
  productName: string;
  name: string;
  price: number; // price in euros for 1 hour
  features: Feature[];
  quantity: number;
}


interface Temporality {
  type: "second" | "minute" | "hour" | "day" | "30-days";
  digits: number; // how many fraction digits to display the price
}
