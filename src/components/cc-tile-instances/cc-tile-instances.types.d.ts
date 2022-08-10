interface Instance {
  flavourName: string;
  count: number;
}

interface InstancesState {
  running: Instance[];
  deploying: Instance[];
}
