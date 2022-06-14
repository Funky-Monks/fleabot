import { imageCommand } from "./images";
import { passCommand } from "./pass";
import { lyricsCommand } from "./lyrics";
import { timeCommand } from "./time";
import { jaxToMetricCommand } from "./jax-to-metric";
import { metricToJaxCommand } from "./metric-to-jax-command";
import { jaxToCustomaryCommand } from "./jax-to-customary";
import { customaryToJaxCommand } from "./customary-to-jax-command";

export const commands = [
  imageCommand,
  passCommand,
  lyricsCommand,
  timeCommand,
  jaxToMetricCommand,
  metricToJaxCommand,
  jaxToCustomaryCommand,
  customaryToJaxCommand,
];
