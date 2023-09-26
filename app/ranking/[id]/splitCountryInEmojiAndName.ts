import emojiRegex from "emoji-regex";

type countryObject = {
    emoji: string;
    name: string;
}

const containsEmojiRegex = emojiRegex();

const splitCountryInEmojiAndName = (country: string): countryObject =>
{
    const countrySplitArray = country.split(" ");
    const possibleEmoji = countrySplitArray[0];
    const matchArray = possibleEmoji.match(containsEmojiRegex);

    const containsEmoji = matchArray !== null;
    const emoji = containsEmoji ? matchArray[0] : "";
    const name = containsEmoji ? countrySplitArray.slice(1).join(" ") : country;

    return { emoji, name };
};

export default splitCountryInEmojiAndName;
