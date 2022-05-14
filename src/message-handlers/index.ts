import {LyricsTriviaMessageHandler} from "./lyricsTriviaMessageHandler";
import {ConvertToCelsiusHandler} from "./convertToCelsiusHandler";
import {ConvertToFahrenheitHandler} from "./convertToFahrenheitHandler";
import {SoundsHandler} from "./soundsHandler";
import {SquareHandler} from "./squareHandler";

export const handlers = [
    new LyricsTriviaMessageHandler(), new ConvertToCelsiusHandler(), new ConvertToFahrenheitHandler(), new SoundsHandler(), new SquareHandler()
]
