export type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: string;
  children?: NavItem[];
};

export type HealthResponse = {
  apps: Array<{
    id: string;
    available: boolean;
  }>;
};

