import * as React from 'react';
import QRCode from 'react-qr-code';
import styles from './home.module.css';
import { Link, useSearchParams } from 'react-router-dom';

const Home = () =>
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

    return (
        <main className={styles.main}>
            <QRCode value={inputValue}></QRCode>
            <input type='text' onChange={handleInputChange} value={inputValue} ></input>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
            <p>Value of term: {inputValue}</p>
            <button onClick={handleReset}>Reset</button>
        </main>)
}

export default Home;