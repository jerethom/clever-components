type EnvType = "addon" | "app";

interface Service {
  name: string;
  variables?: Variable[];
}

interface Variable {
  name: string;
  value: string;
}

