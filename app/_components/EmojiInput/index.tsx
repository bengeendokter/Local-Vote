"use client";
import * as React from 'react';
import styles from './emoji-input.module.css';
import emojiRegex from 'emoji-regex';
import { InputProps } from '../../page';

function EmojiInput({ emoji, countryName, setCountries, index }: InputProps)
{
    const [emojiText, setEmojiText] = React.useState(emoji);
    const containsEmojiRegex = emojiRegex();

    const handleEmojiInput = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newEmoji = event.target.value;
        if(newEmoji.length === 0 || emojiText.includes(newEmoji))
        {
            setEmojiText("");
            return;
        }

        const matchArray = newEmoji.match(containsEmojiRegex);
        if(matchArray === null)
        {
            return;
        }

        const emoji = matchArray.at(-1) ?? "";
        setEmojiText(emoji);
    }, [containsEmojiRegex, emojiText]);

    return <input className={styles.emoji_input} placeholder='🇪🇺' value={emojiText} onChange={handleEmojiInput} type='text'></input>;
}

export default EmojiInput;