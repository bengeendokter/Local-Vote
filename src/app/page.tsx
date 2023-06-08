"use client"

import * as React from 'react';
import QRCode from 'react-qr-code';
import styles from './home.module.css';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import QrScanner from "qr-scanner";
import useQueryParams from './hook/useQueryParams';

const DEFAULT_COUNTRIES = ["🇧🇪 Belgium", '🇸🇪 Sweden', '🇫🇮 Finland'];
const SCORE_VALUES: number[] = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
const SCORE_MAP = new Map<number, number>(SCORE_VALUES.map((score, index) => [index, score]));

interface QueryParams {
    inputValue: string[];
  }

function Home()
{
    const { queryParams, setQueryParams } = useQueryParams<QueryParams>();
    const [inputValue, setInputValue] = React.useState("");
    const [countries, setCountries] = React.useState<string[]>([]);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [scanner, setScanner] = React.useState<QrScanner>();
    const [scannerRunning, setScannerRunning] = React.useState(false);
    const [total, setTotal] = React.useState<string[][]>([]);

    console.log("countries", countries);

    const calculateTotalRanking = React.useCallback(() =>
    {
        const pointsMap = new Map<string, number>((total[0] ?? []).map((country) => [country, 0]));

        total.forEach((ranking) => ranking.forEach((country, index) =>
        {
            if(index >= SCORE_VALUES.length)
            {
                return;
            }

            const oldPoints = pointsMap.get(country) ?? 0;
            const newPoints = oldPoints + (SCORE_MAP.get(index) ?? 0);
            pointsMap.set(country, newPoints);
        }))

        const rankingArray = Array.from(pointsMap.entries()).sort(([, points1], [, points2]) => points2 - points1);
        alert(rankingArray);
    }, [total]);

    const setInitialTotal = React.useCallback(() =>
    {
        setTotal([countries]);
    }, [countries]);

    const updateInputValue = React.useCallback((newInputValue: string[]) =>
    {
        setInputValue(JSON.stringify(newInputValue));
        localStorage.setItem("inputValue", JSON.stringify(newInputValue));

        setQueryParams({ inputValue: newInputValue });
    }, [setQueryParams]);

    const isUsingCurrentTemplate = React.useCallback((inputValueList: string[]) =>
    {
        const currentTemplateSet = new Set(countries);
        const inputValueSet = new Set(inputValueList);
        const joinedSet = new Set(countries.concat(inputValueList));

        return currentTemplateSet.size === inputValueSet.size && joinedSet.size === currentTemplateSet.size;
    }, [countries]);

    const addQrCodeToTotal = React.useCallback((qrCodeString: string) =>
    {
        let qrCodeInputValue: string | null;
        try
        {
            const url = new URL(qrCodeString);
            qrCodeInputValue = url.searchParams.get('inputValue');
        }
        catch(error)
        {
            qrCodeInputValue = null;
        }

        if(qrCodeInputValue !== null)
        {
            const inputValueList = JSON.parse(qrCodeInputValue);

            if(!isUsingCurrentTemplate(inputValueList))
            {
                alert("not using current template");
                return;
            }

            setTotal((oldTotal) =>
            {
                const newTotal = Array.from(oldTotal);
                newTotal.push(inputValueList);
                return newTotal;
            });
        }
    }, [isUsingCurrentTemplate]);

    React.useEffect(() =>
    {
        const videoElement = videoRef.current;
        if(videoElement === null)
        {
            return;
        }

        const qrScanner = new QrScanner(videoElement, result =>
        {
            alert("code is scanned");
            addQrCodeToTotal(result.data);
        }, {});

        setScanner(qrScanner);
    }, [addQrCodeToTotal, setScanner]);

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
        setInputValue(JSON.stringify(nonNullInputValue));
        setCountries(nonNullInputValue);
    }, [queryParams, setQueryParams]);

    const toggleScanner = React.useCallback(() =>
    {
        if(scannerRunning)
        {
            scanner?.stop();
        }
        else
        {
            setInitialTotal();
            scanner?.start()
        }
        setScannerRunning(!scannerRunning);
    }, [scanner, scannerRunning, setInitialTotal]);

    const handleReset = React.useCallback(() =>
    {
        localStorage.removeItem("inputValue");
        setQueryParams({ inputValue: [] })
        setInputValue(JSON.stringify(DEFAULT_COUNTRIES));
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



        setCountries( (countries) => {
            const newCountries = Array.from(countries);
            const country = newCountries.splice(source.index, 1)[0];
            newCountries.splice(destination.index, 0, country);
            updateInputValue(newCountries);
            return newCountries;
        });
    }, [updateInputValue]);

    const handleToggleScanner = React.useCallback(() =>
    {
        toggleScanner();
    }, [toggleScanner]);

    const handleCalculateTotal = React.useCallback(() =>
    {
        calculateTotalRanking();
    }, [calculateTotalRanking]);

    return (
        <main className={styles.main}>
                <video ref={videoRef} ></video>
                <QRCode value={`http://localhost:3000/?inputValue=${inputValue}`}></QRCode>
            <p>http://localhost:3000/?inputValue={inputValue}</p>
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
                                                    // style={{ backgroundColor: snapshot.isDragging ? "red" : "green" }}
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
            <br/>
                <button onClick={handleReset}>Reset</button>
            <br/>
                <button onClick={handleToggleScanner}>Toggle Scanner</button>
            <br/>
                <button onClick={handleCalculateTotal}>Calculate Total</button>
        </main>)
}

export default Home;