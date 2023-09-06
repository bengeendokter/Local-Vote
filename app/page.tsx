"use client"

import * as React from 'react';
import styles from './home.module.css';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import useQueryParams from './_hooks/useQueryParams';
import EmojiInput from './_components/EmojiInput';
import DeleteIcon from './_assets/icons/Delete.svg';
import DragHandleIcon from './_assets/icons/DragHandle.svg';
import emojiRegex from 'emoji-regex';
import { CountryInput } from './_components/CountryInput';
import {v4} from 'uuid';

const DEFAULT_COUNTRIES = ["🇧🇪 Belgium", '🇸🇪 Sweden', '🇫🇮 Finland'];
const SCORE_VALUES: number[] = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
const SCORE_MAP = new Map<number, number>(SCORE_VALUES.map((score, index) => [index, score]));

interface QueryParams
{
    inputValue: string[];
}

type countryObjectId = {
    country: string;
    id: string;
}

function Home()
{
    const { queryParams, setQueryParams } = useQueryParams<QueryParams>();
    const [countryObjectList, setCountryObjectIdList] = React.useState<countryObjectId[]>([])
    const containsEmojiRegex = emojiRegex();

    const countriesToCountryObjectList = React.useCallback((countries: string[]): countryObjectId[] =>
    {
        const countryObjectList: countryObjectId[] = countries.map((country) => {return {country, id: v4()}});
        return countryObjectList;
    }, []);

    const countryObjectListToCountries = React.useCallback((countryObjectList: countryObjectId[]): string[] =>
    {
        const countryList: string[] = countryObjectList.map(({country}) => country);
        return countryList;
    }, []);

    const calculateTotalRanking = React.useCallback(() =>
    {
        const pointsMap = new Map<string, number>((countryObjectList).map(({country}) => [country, 0]));

        countryObjectList.forEach(({country}, index) =>
        {
            if(index >= SCORE_VALUES.length)
            {
                return;
            }

            const oldPoints = pointsMap.get(country) ?? 0;
            const newPoints = oldPoints + (SCORE_MAP.get(index) ?? 0);
            pointsMap.set(country, newPoints);
        })

        const rankingArray = Array.from(pointsMap.entries()).sort(([, points1], [, points2]) => points2 - points1);
        alert(rankingArray);
    }, [countryObjectList]);

    const updateInputValue = React.useCallback((countryObjectIdList: countryObjectId[]) =>
    {
        const newInputValue = countryObjectListToCountries(countryObjectIdList);
        localStorage.setItem("inputValue", JSON.stringify(newInputValue));

        setQueryParams({ inputValue: newInputValue });
    }, [countryObjectListToCountries, setQueryParams]);

    React.useEffect(() =>
    {
        const inputValueQueryParam = queryParams.inputValue;

        const initialInputValue = (() =>
        {
            if(inputValueQueryParam == null)
            {
                const inputValueLocalStorageString = localStorage.getItem("inputValue");
                const inputValueLocalStorage = inputValueLocalStorageString !== null ? JSON.parse(inputValueLocalStorageString) : null;

                if(inputValueLocalStorage !== null)
                {
                    setQueryParams({ inputValue: inputValueLocalStorage });
                }

                return inputValueLocalStorage;
            }

            return JSON.parse(String(inputValueQueryParam));
        })();

        const nonNullInputValue = initialInputValue === null ? DEFAULT_COUNTRIES : initialInputValue;
        const countryObjectList = countriesToCountryObjectList(nonNullInputValue);
        setCountryObjectIdList(countryObjectList);
    }, [countriesToCountryObjectList, queryParams, setQueryParams]);

    const handleReset = React.useCallback(() =>
    {
        localStorage.removeItem("inputValue");
        setQueryParams({ inputValue: [] });
        const countryObjectList = countriesToCountryObjectList(DEFAULT_COUNTRIES);
        setCountryObjectIdList(countryObjectList);
    }, [countriesToCountryObjectList, setQueryParams]);

    const onDragEnd: OnDragEndResponder = React.useCallback((result) =>
    {
        const { destination, source } = result;
        if(!destination)
        {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index)
        {
            return;
        }

        setCountryObjectIdList((countryObjectIdList) =>
        {
            const newCountries = Array.from(countryObjectIdList);
            const country = newCountries.splice(source.index, 1)[0];
            newCountries.splice(destination.index, 0, country);
            updateInputValue(newCountries);
            return newCountries;
        });
    }, [updateInputValue]);

    type countryObject = {
        emoji: string;
        name: string;
    }

    const splitCountryInEmojiAndName = React.useCallback((country: string): countryObject =>
    {
        const countrySplitArray = country.split(" ");
        const possibleEmoji = countrySplitArray[0];
        const matchArray = possibleEmoji.match(containsEmojiRegex);

        const containsEmoji = matchArray !== null;
        const emoji = containsEmoji ? matchArray[0] : "";
        const name = containsEmoji ? countrySplitArray.slice(1).join(" ") : country;

        return { emoji, name };
    }, [containsEmojiRegex]);

    const handleCalculateTotal = React.useCallback(() =>
    {
        calculateTotalRanking();
    }, [calculateTotalRanking]);

    const handleDelete = React.useCallback((index: number) =>
    {
        setCountryObjectIdList((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.splice(index, 1);

            updateInputValue(newCountries);
            return newCountries;
        });
    }, [updateInputValue]);

    const handelAddCountry = React.useCallback(() =>
    {
        setCountryObjectIdList((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.push({country: "", id: v4()});

            updateInputValue(newCountries);
            return newCountries;
        });
    }, [updateInputValue]);

    return (<>
        <header className={styles.header} >
            {/* TODO save title in query params ans local storage */}
            <input className={styles.title_input} type='text' value="Semi Final 1" ></input>
        </header>
        <main className={styles.main}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='countries'>
                    {
                        (provided) => (<div ref={provided.innerRef} {...provided.droppableProps} >
                            <ol className={styles.country_list}>
                                {countryObjectList.map(({country, id}) => {return {...splitCountryInEmojiAndName(country), id}}).map(({ emoji, name: countryName, id }, index) => <Draggable draggableId={countryName} index={index} key={id}>
                                    {(provided, snapshot) =>
                                    (
                                        <li
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                            className={styles.country_list_item} >
                                            <div className={[styles.country_list_item_content, snapshot.isDragging ? styles.active : ""].join(" ")}>
                                                <button className={styles.country_list_item_button} onClick={() => handleDelete(index)} >
                                                    <DeleteIcon />
                                                </button>
                                                <div className={styles.country_list_item_edit} ><p className={styles.rank_number}>
                                                    {index + 1}.</p>
                                                    <EmojiInput emoji={emoji} countryName={countryName} setCountryObjectIdList={setCountryObjectIdList} index={index} updateInputValue={updateInputValue} />
                                                    <CountryInput emoji={emoji} countryName={countryName} setCountryObjectIdList={setCountryObjectIdList} index={index} updateInputValue={updateInputValue} />
                                                    <div {...provided.dragHandleProps} className={styles.country_drag_handle} ><DragHandleIcon /></div>
                                                </div>
                                            </div>

                                        </li>
                                    )
                                    }
                                </Draggable>)}
                            </ol>

                            {provided.placeholder}
                        </div>)
                    }
                </Droppable>
            </DragDropContext>
            <button onClick={handelAddCountry}>Add country</button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleCalculateTotal}>Calculate Total</button>
        </main></>)
}

export default Home;

export type InputProps = {
    emoji: string;
    countryName: string;
    setCountryObjectIdList: React.Dispatch<React.SetStateAction<countryObjectId[]>>;
    index: number;
    updateInputValue: (newInputValue: countryObjectId[]) => void;
}
