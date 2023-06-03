import * as React from 'react';
import QRCode from 'react-qr-code';
import styles from './home.module.css';
import { Link, useSearchParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const data =
{
    inputValue: ["be", 'nl', 'en']
};

function Home()
{
    const [queryParams, setQueryParams] = useSearchParams();
    const [inputValue, setInputValue] = React.useState("");

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

        setInputValue(InitialInputValue ?? "");
    }, [queryParams, setQueryParams]);

    const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newInputValue = event.target.value;
        setInputValue(newInputValue);
        localStorage.setItem("inputValue", newInputValue);

        setQueryParams({ inputValue: newInputValue });
    }, [setQueryParams]);

    const handleReset = React.useCallback(() =>
    {
        localStorage.removeItem("inputValue");
        queryParams.delete("inputValue");
        setQueryParams(queryParams);
        setInputValue("");
    }, [queryParams, setQueryParams]);

    const onDragEnd = () => { };


    // TODO watch https://egghead.io/lessons/react-reorder-a-list-with-react-beautiful-dnd
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
            <input type='text' onChange={handleInputChange} value={inputValue} ></input>
            <div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='countries'>
                        {
                            (provided) => (<div ref={provided.innerRef} {...provided.droppableProps} >
                                {data.inputValue.map((country, index) => <Draggable draggableId={country} index={index} key={country}>
                                    {provided =>
                                        (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef} >
                                                <p>{country}</p>
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