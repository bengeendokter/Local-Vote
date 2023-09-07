"use client";
import * as React from "react";
import styles from "./emoji-input.module.css";
import emojiRegex from "emoji-regex";
import { InputProps } from "../../page";

function EmojiInput({ emoji, countryName, setCountryObjectIdList, index, updateInputValue }: InputProps)
{
    const [emojiText, setEmojiText] = React.useState(emoji);
    const containsEmojiRegex = emojiRegex();

    const handleEmojiInput = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newEmojiText = event.target.value;
        if(newEmojiText.length === 0 || emojiText.includes(newEmojiText))
        {
            setEmojiText("");
            setCountryObjectIdList((countries) =>
            {
                const newCountries = Array.from(countries);
                newCountries.splice(index, 1, { country: countryName, id: countries[index].id });

                updateInputValue(newCountries);
                return newCountries;
            });
            return;
        }

        const matchArray = newEmojiText.match(containsEmojiRegex);
        if(matchArray === null)
        {
            return;
        }

        const newEmoji = matchArray.at(-1) ?? "";
        setEmojiText(newEmoji);
        setCountryObjectIdList((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.splice(index, 1, { country: [newEmoji, countryName].join(" ").trim(), id: countries[index].id });

            updateInputValue(newCountries);
            return newCountries;
        });
    }, [containsEmojiRegex, countryName, emojiText, index, setCountryObjectIdList, updateInputValue]);

    return <input className={styles.emoji_input} placeholder='🇪🇺' value={emojiText} onChange={handleEmojiInput} type='text'></input>;
}

export default EmojiInput;
