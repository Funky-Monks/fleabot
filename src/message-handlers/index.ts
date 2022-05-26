import { LyricsTriviaMessageHandler } from "./lyricsTriviaMessageHandler";
import { ConvertToCelsiusHandler } from "./convertToCelsiusHandler";
import { ConvertToFahrenheitHandler } from "./convertToFahrenheitHandler";
import { SoundsHandler } from "./soundsHandler";

export const handlers = [
  new LyricsTriviaMessageHandler(),
  new ConvertToCelsiusHandler(),
  new ConvertToFahrenheitHandler(),
  new SoundsHandler(),
];
