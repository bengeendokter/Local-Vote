"use client";
import * as React from 'react';
import styles from './country-input.module.css';
import { InputProps } from '../../page';

export function CountryInput({ emoji, countryName, setCountries, index, updateInputValue }: InputProps)
{
    const handleCountryNameInput = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newName = event.target.value;
        console.log("newName", newName);
        console.log("newCountry", [emoji, newName].join(" ").trim());

        setCountries((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.splice(index, 1, [emoji, newName].join(" ").trim());

            console.log("newCountries", newCountries);

            updateInputValue(newCountries);
            return newCountries;
        });
    }, [emoji, index, setCountries, updateInputValue]);

    return <input className={styles.country_input} type='text' onChange={handleCountryNameInput} value={countryName}></input>;
}
