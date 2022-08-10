interface Scalability {
  minFlavor: Flavor;
  maxFlavor: Flavor;
  minInstances: number;
  maxInstances: number;
}

interface Flavor {
  name: string;
  cpus: number;
  gpus: number;
  mem: number;
  microservice: boolean;
}
