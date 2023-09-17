"use client";

import * as React from "react";

import Link from "next/link";

type countryObjectId = {
    country: string;
    id: string;
}

function Home()
{

    // TODO add ranking button
    // prompt for which template, [empty, all Eurovision...]
    // generate id
    // store ranking entry in local storage
    // store id in list of ids
    // navigate to edit

    return <>
        <Link href={`/settings`}>Settings</Link><br />{JSON.parse(localStorage.getItem(`ranking-ids`) ?? "[]")
            .map((id: string) => <><Link key={id} href={`/${id}`}>{id}</Link><br /></>)}</>;
}

export default Home;

// TODO move to Input superclass and inherit there (no export/import needed?)
export type InputProps = {
    emoji: string;
    countryName: string;
    setCountryObjectIdList: React.Dispatch<React.SetStateAction<countryObjectId[]>>;
    index: number;
    updateRanking: (newRanking: countryObjectId[]) => void;
}
