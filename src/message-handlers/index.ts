import {LyricsTriviaMessageHandler} from "./lyricsTriviaMessageHandler";
import {ConvertToCelsiusHandler} from "./convertToCelsiusHandler";
import {ConvertToFahrenheitHandler} from "./convertToFahrenheitHandler";
import {TheSmellsHandler} from "./thesmellshandler";

export const handlers = [
    new LyricsTriviaMessageHandler(), new ConvertToCelsiusHandler(), new ConvertToFahrenheitHandler(), new TheSmellsHandler()
]