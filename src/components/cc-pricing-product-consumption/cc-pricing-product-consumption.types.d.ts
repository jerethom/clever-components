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

interface Interval {
  minRange: number; // byte
  maxRange: number; // byte
  price: number;    // "euros / byte / 30 days" or just "euros / byte" for timeless sections like traffic
}

interface Plan {
  productName: string;
  name: string;
  price: number; // price in euros for 1 hour
  features: Feature[];
  quantity: number;
}

interface Section {
  type: SectionType;
  intervals?: Interval[];
}

type SectionType = "storage" | "inbound-traffic" | "outbound-traffic";
