import { passCommand } from "./pass";
import { jaxToMetricCommand } from "./jax-to-metric";
import { metricToJaxCommand } from "./metric-to-jax-command";
import { jaxToCustomaryCommand } from "./jax-to-customary";
import { customaryToJaxCommand } from "./customary-to-jax-command";

export const commands = [
  passCommand,
  jaxToMetricCommand,
  metricToJaxCommand,
  jaxToCustomaryCommand,
  customaryToJaxCommand,
];
