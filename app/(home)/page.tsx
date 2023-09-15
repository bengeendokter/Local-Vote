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
        <Link href={`/settings`}>Settings</Link><br/>{JSON.parse(localStorage.getItem(`ranking-ids`) ?? "[]")
        .map((id: string) => <><Link key={id} href={`/${id}`}>{id}</Link><br/></>)}</>;
}

export default Home;

export type InputProps = {
    emoji: string;
    countryName: string;
    setCountryObjectIdList: React.Dispatch<React.SetStateAction<countryObjectId[]>>;
    index: number;
    updateInputValue: (newInputValue: countryObjectId[]) => void;
}
