import * as React from 'react';
import QRCode from 'react-qr-code';
import styles from './home.module.css';
import { Link, useSearchParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import QrScanner from "qr-scanner";

const defaultCountries = ["Belgium", 'Sweden', 'Finland'];

function Home()
{
    const [queryParams, setQueryParams] = useSearchParams();
    const [inputValue, setInputValue] = React.useState("");
    const [countries, setCountries] = React.useState<string[]>([]);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [scanner, setScanner] = React.useState<QrScanner>();
    const [scannerRunning, setScannerRunning] = React.useState(false);
    const [total, setTotal] = React.useState<string[][]>([]);

    const updateInputValue = React.useCallback((newInputValue: string) =>
    {
        setInputValue(newInputValue);
        localStorage.setItem("inputValue", newInputValue);

        setQueryParams({ inputValue: newInputValue });
    }, [setQueryParams]);

    const addQrCodeToTotal = React.useCallback((qrCodeString: string) => {
        let qrCodeInputValue: string | null;
        try{
            const url = new URL(qrCodeString);
            qrCodeInputValue = url.searchParams.get('inputValue');
        }
        catch(error)
        {
            qrCodeInputValue = null;
        }
        
        if(qrCodeInputValue !== null)
        {
            console.log("total before from array", total);
            const newTotal = Array.from(total);
            console.log("newTotal from total", newTotal);
            newTotal.push(JSON.parse(qrCodeInputValue));
            setTotal(newTotal);
            console.log("newTotal", newTotal);
            console.log("total",total);
        }
    }, [total]);

    React.useEffect(() =>
    {
        const videoElement = videoRef.current;
        if(videoElement === null)
        {
            return;
        }

        const qrScanner = new QrScanner(videoElement, result =>
        {
            addQrCodeToTotal(result.data);
            alert("code is scanned");
        }, {});

        setScanner(qrScanner);
    }, [addQrCodeToTotal, setScanner]);

    React.useEffect(() =>
    {
        const inputValueQueryParam = queryParams.get("inputValue");

        const InitialInputValue = (() =>
        {
            if(inputValueQueryParam === null)
            {
                const inputValueLocalStorage = localStorage.getItem("inputValue");

                if(inputValueLocalStorage !== null)
                {
                    setQueryParams({ inputValue: inputValueLocalStorage });
                }

                return inputValueLocalStorage;
            }

            return inputValueQueryParam;
        })();

        const nonNullInputValue = InitialInputValue === null ? defaultCountries : JSON.parse(InitialInputValue);

        setInputValue(JSON.stringify(nonNullInputValue));
        setCountries(nonNullInputValue);
    }, [queryParams, setQueryParams]);

    const toggleScanner = React.useCallback(() =>
    {
        console.log("togglescanner");
        if(scannerRunning)
        {
            scanner?.stop();
            console.log("scanner", scanner);
            console.log("stop");
        }
        else
        {
            setTotal([countries]);
            console.log("countries", countries);
            scanner?.start()
            console.log("start");
        }
        setScannerRunning(!scannerRunning);
    }, [countries, scanner, scannerRunning]);

    const handleReset = React.useCallback(() =>
    {
        localStorage.removeItem("inputValue");
        queryParams.delete("inputValue");
        setQueryParams(queryParams);
        setInputValue(JSON.stringify(defaultCountries));
        setCountries(defaultCountries);
    }, [queryParams, setQueryParams]);

    const onDragEnd: OnDragEndResponder = (result) =>
    {
        const { destination, source, draggableId } = result;
        if(!destination)
        {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index)
        {
            return;
        }

        const column = Array.from(countries);
        column.splice(source.index, 1);
        column.splice(destination.index, 0, draggableId);

        setCountries(column);
        updateInputValue(JSON.stringify(column));
    };

    const handleToggleScanner = React.useCallback(() =>
    {
        toggleScanner();
    }, [toggleScanner]);

    console.log("render");

    return (
        <main className={styles.main}>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
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
                                                style={{ backgroundColor: snapshot.isDragging ? "red" : "green" }}>
                                                {country}</p>
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
            <button onClick={handleToggleScanner}>Toggle Scanner</button>
        </main>)
}

export default Home;