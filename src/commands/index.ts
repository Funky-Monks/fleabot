import { passCommand } from "./pass";
import { jaxToMetricCommand } from "./jax-to-metric";
import { metricToJaxCommand } from "./metric-to-jax-command";
import { jaxToCustomaryCommand } from "./jax-to-customary";
import { customaryToJaxCommand } from "./customary-to-jax-command";
import { selectRoleColorCommand } from "./select-role-color";
import { selectRoleIconCommand } from "./select-role-icon";

export const commands = [
  passCommand,
  jaxToMetricCommand,
  metricToJaxCommand,
  jaxToCustomaryCommand,
  customaryToJaxCommand,
  selectRoleColorCommand,
  selectRoleIconCommand
];
