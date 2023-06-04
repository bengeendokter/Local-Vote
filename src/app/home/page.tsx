import * as React from 'react';
import QRCode from 'react-qr-code';
import styles from './home.module.css';
import { Link, useSearchParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';

const defaultCountries = ["Belgium", 'Sweden', 'Finland'];

function Home()
{
    const [queryParams, setQueryParams] = useSearchParams();
    const [inputValue, setInputValue] = React.useState("");
    const [countries, setCountries] = React.useState<string[]>([]);

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

    const updateInputValue = React.useCallback((newInputValue: string) =>
    {
        setInputValue(newInputValue);
        localStorage.setItem("inputValue", newInputValue);

        setQueryParams({ inputValue: newInputValue });
    }, [setQueryParams]);

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
    </main>)
}

export default Home;