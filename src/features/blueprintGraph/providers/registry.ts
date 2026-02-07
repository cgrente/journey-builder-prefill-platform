import { directDependencyFormsProvider } from "./directDependencyFormsProvider";
import { transitiveDependencyFormsProvider } from "./transitiveDependencyFormsProvider";
import { globalDataProvider } from "./globalDataProvider";
import { globalActionProvider } from "./globalActionProvider";

export const prefillSourceProviders = [
  directDependencyFormsProvider,
  transitiveDependencyFormsProvider,
  globalDataProvider,
  globalActionProvider,
] as const;