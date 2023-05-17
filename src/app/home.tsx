import * as React from 'react';
import QRCode from 'react-qr-code';
import styles from './page.module.css';
import { BrowserRouter as Router, Routes, Route, Link, useSearchParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';

const Home = () =>
{
    const location = useLocation();
    const queryParams = queryString.parse(location.search)
    let [_, setSearchParams] = useSearchParams();

    const term = queryParams.term;

    console.log("queryParams", queryParams);

    const handleSetParams = React.useCallback(() =>
    {
        const test = { hello: "test", term: "nice" };
        // searchParams.set("term", "hello world");
        setSearchParams(test);

    }, [setSearchParams]);

    return (
        <main className={styles.main}>
            <QRCode value='https://bengeendokter.be/en'></QRCode>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
            <p>Value of term: {term}</p>
            <button onClick={handleSetParams}>Set param</button>
        </main>)
}

export default Home;