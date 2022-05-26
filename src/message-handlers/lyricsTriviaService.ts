import { logger } from "../logger";
import retry from "async-retry";
import { Client } from "genius-lyrics";
import fs from "fs";
import { getRandomInt, nth_occurrence } from "../utils";
import { Message } from "discord.js";

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
logger.info(`Setting up genius with token ${config.geniusToken}`);
const geniusClient = new Client(config.geniusToken);

type ArtistIdAndName = {
  artistId: number;
  artistName: string;
};

async function getArtistID(artist: string): Promise<ArtistIdAndName> {
  const searches = await geniusClient.songs.search(artist);
  if (searches.length === 0) {
    throw new Error(`No result found for artist ${artist}`);
  }
  const firstSong = searches[getRandomInt(1, 3)]; // max 10, coldplay returns coldplay and chainsmokers at 1 so we start at second entry.

  if (!firstSong?.artist) {
    throw new Error("No song or artist found");
  }

  return {
    artistId: firstSong.artist?.id,
    artistName: firstSong?.artist?.name,
  };
}

type SongTitleAndArtist = {
  songTitle: string;
  songArtist: string;
};

// Choose a song title from the most popular 50 songs from given ID
async function getSongNameAndTitle(
  artistObject: ArtistIdAndName
): Promise<SongTitleAndArtist> {
  const artist = await geniusClient.artists.get(artistObject.artistId);
  if (!artist) {
    throw new Error(`No artist found for id ${artistObject.artistId}`);
  }
  const totalPagesToLoad = 3;

  const foundSongs = [];

  for (let pageIndex = 1; pageIndex <= totalPagesToLoad; pageIndex++) {
    let popularSongs = await artist.songs({
      perPage: 50,
      sort: "popularity",
      page: pageIndex,
    });
    let filteredByArtist = popularSongs.filter(
      (song: any) =>
        song.artist.name.toLowerCase() === artistObject.artistName.toLowerCase()
    );
    foundSongs.push(...filteredByArtist);
    if (foundSongs.length >= 51) {
      break;
    }
  }

  if (foundSongs.length === 0) {
    throw new Error(`No songs found for id ${artistObject.artistId}`);
  }

  const randomNumb = await getRandomInt(0, foundSongs.length);
  return {
    songTitle: foundSongs[randomNumb].title,
    songArtist: foundSongs[randomNumb].artist.name,
  };
}

type SongDetails = {
  lyrics: string;
  title: string;
  art: string;
  url: string;
  artist: string;
};

async function getSongObject(sa: SongTitleAndArtist): Promise<SongDetails> {
  logger.info("Making search request to genius API");
  const searches = await geniusClient.songs.search(
    geniusClient.songs.sanitizeQuery(sa.songTitle + " " + sa.songArtist)
  );

  if (!searches || searches.length === 0) {
    throw new Error(
      `No result found for artist ${sa.songArtist} and title ${sa.songTitle}`
    );
  }

  // Pick first one
  const chosenSong = searches[0];

  logger.info("Making lyrics request to genius API");
  const songLyrics = await chosenSong.lyrics();
  const songTitle = chosenSong.title;
  const songArt = chosenSong.thumbnail;
  const songUrl = chosenSong.url;
  return {
    lyrics: songLyrics,
    title: songTitle,
    art: songArt,
    url: songUrl,
    artist: sa.songArtist,
  };
}

function getSectionFromSongObject(songObject: SongDetails): string {
  // purifies lyrics string a bit
  try {
    songObject.lyrics = songObject.lyrics.replace("]\n\n[", "");
    songObject.lyrics = songObject.lyrics.replace("Embed", "");
  } catch (error) {}

  // counts how many sections in the song with lyrics are there
  const count = (songObject.lyrics.match(/]\n/g) || []).length;

  const randomSectionNumber = getRandomInt(0, count);

  // locates and slices section
  const position1 =
    nth_occurrence(songObject.lyrics, "]\n", randomSectionNumber) + 1; // Plus one is needed to delete ']' character
  const position2 = nth_occurrence(
    songObject.lyrics,
    "\n[",
    randomSectionNumber
  );

  return songObject.lyrics.slice(position1, position2);
}

async function generateLyricsSectionForMessage(
  message: Message<boolean>,
  messageArguments: any
) {
  try {
    message.channel.sendTyping();
    logger.info(`Retrieving random song for message ${messageArguments}`);
    const artistId = await getArtistID(messageArguments);
    logger.info(
      `Artist ID for message ${messageArguments} is ${artistId.artistId}`
    );
    const songChosen = await getSongNameAndTitle(artistId);
    logger.info(
      `Song title found for artist id ${artistId.artistId}: ${songChosen.songTitle}`
    );
    const songObject = await getSongObject(songChosen);
    logger.info(`Retrieving section from song ${songChosen.songTitle}`);
    let section = getSectionFromSongObject(songObject);
    if (!section) {
      throw new Error(
        `Did not retrieve section for song ${songChosen.songTitle}`
      );
    }
    return {
      ...songObject,
      section,
    };
  } catch (e) {
    logger.error("Failed to load song section", e);
    throw e;
  }
}

type SongDetailsWithSection = SongDetails & { section: string };

export async function getRandomSongSectionByArtist(
  message: Message,
  messageArguments: any
): Promise<SongDetailsWithSection | null> {
  logger.info(`Getting random song for message ${messageArguments}`);

  const ps: Promise<SongDetailsWithSection | null>[] = [];

  for (let i = 0; i < 5; i++) {
    ps.push(generateLyricsSectionForMessage(message, messageArguments));
  }

  const settled: PromiseSettledResult<SongDetailsWithSection | null>[] =
    await Promise.allSettled(ps);

  const fulfilled: PromiseFulfilledResult<SongDetailsWithSection>[] =
    settled.filter(
      (r) => r.status === "fulfilled"
    ) as PromiseFulfilledResult<SongDetailsWithSection>[];
  if (fulfilled.length > 0) {
    logger.error("Retrieving songs failed");
    return fulfilled[0].value;
  } else {
    return null;
  }
}
