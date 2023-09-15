"use client";
import * as React from "react";
import styles from "./country-input.module.css";
import { InputProps } from "../../(home)/page";

export function CountryInput({ emoji, countryName, setCountryObjectIdList, index, updateRanking }: InputProps)
{
    const handleCountryNameInput = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newName = event.target.value;

        setCountryObjectIdList((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.splice(index, 1, { country: [emoji, newName].join(" ").trim(), id: countries[index].id });

            updateRanking(newCountries);
            return newCountries;
        });
    }, [emoji, index, setCountryObjectIdList, updateRanking]);

    return <input className={styles.country_input} type='text' onChange={handleCountryNameInput} placeholder="Name" value={countryName}></input>;
}
