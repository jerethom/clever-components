interface Addon {
  id: string;
  realId: string;
  name: string;
  provider: AddonProvider;
  plan: AddonPlan;
  creationDate: Date | number | string;
}

interface AddonProvider {
  name: string;
  logoUrl: string;
}

interface AddonPlan {
  name: string;
}
