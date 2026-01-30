import { directDependencyFormsProvider } from "./directDependencyFormsProvider";
import { transitiveDependencyFormsProvider } from "./transitiveDependencyFormsProvider";
import { globalDataProvider } from "./globalDataProvider";

export const prefillSourceProviders = [
  directDependencyFormsProvider,
  transitiveDependencyFormsProvider,
  globalDataProvider,
] as const;