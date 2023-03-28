import { ConvertToCelsiusHandler } from "./convertToCelsiusHandler";
import { ConvertToFahrenheitHandler } from "./convertToFahrenheitHandler";
import { SoundsHandler } from "./soundsHandler";

export const handlers = [
  new ConvertToCelsiusHandler(),
  new ConvertToFahrenheitHandler(),
  new SoundsHandler(),
];
