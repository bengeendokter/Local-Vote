"use client";

import * as React from "react";

import Link from "next/link";

type countryObjectId = {
    country: string;
    id: string;
}

function Home()
{
    return <>
        <Link href={`/settings`}>Edit</Link><p>{localStorage.getItem(`ranking-ids`)}</p></>;
}

export default Home;

export type InputProps = {
    emoji: string;
    countryName: string;
    setCountryObjectIdList: React.Dispatch<React.SetStateAction<countryObjectId[]>>;
    index: number;
    updateInputValue: (newInputValue: countryObjectId[]) => void;
}
