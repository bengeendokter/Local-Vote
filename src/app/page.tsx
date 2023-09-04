"use client"

import * as React from 'react';
import styles from './home.module.css';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import useQueryParams from './hook/useQueryParams';

const DEFAULT_COUNTRIES = ["🇧🇪 Belgium", '🇸🇪 Sweden', '🇫🇮 Finland'];
const SCORE_VALUES: number[] = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
const SCORE_MAP = new Map<number, number>(SCORE_VALUES.map((score, index) => [index, score]));

interface QueryParams
{
    inputValue: string[];
}

function Home()
{
    const { queryParams, setQueryParams } = useQueryParams<QueryParams>();
    const [countries, setCountries] = React.useState<string[]>([]);

    const calculateTotalRanking = React.useCallback(() =>
    {
        const pointsMap = new Map<string, number>((countries).map((country) => [country, 0]));

        countries.forEach((country, index) =>
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
    }, [countries]);

    const updateInputValue = React.useCallback((newInputValue: string[]) =>
    {
        localStorage.setItem("inputValue", JSON.stringify(newInputValue));

        setQueryParams({ inputValue: newInputValue });
    }, [setQueryParams]);

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
        setCountries(nonNullInputValue);
    }, [queryParams, setQueryParams]);

    const handleReset = React.useCallback(() =>
    {
        localStorage.removeItem("inputValue");
        setQueryParams({ inputValue: [] })
        setCountries(DEFAULT_COUNTRIES);
    }, [setQueryParams]);

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

        setCountries((countries) =>
        {
            const newCountries = Array.from(countries);
            const country = newCountries.splice(source.index, 1)[0];
            newCountries.splice(destination.index, 0, country);
            updateInputValue(newCountries);
            return newCountries;
        });
    }, [updateInputValue]);

    const handleCalculateTotal = React.useCallback(() =>
    {
        calculateTotalRanking();
    }, [calculateTotalRanking]);

    return (
        <main className={styles.main}>
            <div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='countries'>
                        {
                            (provided) => (<div ref={provided.innerRef} {...provided.droppableProps} >
                                {countries.map((country, index) => <Draggable draggableId={country} index={index} key={country}>
                                    {(provided, snapshot) =>
                                    (
                                        <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef} >
                                            <p
                                                className={[styles.country_list_item, snapshot.isDragging ? styles.active : ""].join(" ")}
                                            >
                                                {country}
                                            </p>
                                        </div>
                                    )
                                    }
                                </Draggable>)}
                                {provided.placeholder}
                            </div>)
                        }
                    </Droppable>
                </DragDropContext>
            </div>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleCalculateTotal}>Calculate Total</button>
        </main>)
}

export default Home;
