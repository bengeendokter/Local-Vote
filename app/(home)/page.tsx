"use client";

import * as React from "react";

import Link from "next/link";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { StoredRanking } from "../[id]/edit/page";

const DEFAULT_COUNTRIES = ["🇦🇱 Albania", "🇦🇩 Andorra", "🇦🇲 Armenia", "🇦🇺 Australia", "🇦🇹 Austria", "🇦🇿 Azerbaijan", "🇧🇪 Belgium", "🇧🇦 Bosnia and Herzegovina", "🇧🇬 Bulgaria", "🇭🇷 Croatia", "🇨🇾 Cyprus", "🇨🇿 Czechia", "🇩🇰 Denmark", "🇪🇪 Estonia", "🇫🇮 Finland", "🇫🇷 France", "🇬🇪 Georgia", "🇩🇪 Germany", "🇬🇷 Greece", "🇭🇺 Hungary", "🇮🇸 Iceland", "🇮🇪 Ireland", "🇮🇱 Israel", "🇮🇹 Italy", "🇱🇻 Latvia", "🇱🇹 Lithuania", "🇱🇺 Luxembourg", "🇲🇹 Malta", "🇲🇩 Moldova", "🇲🇨 Monaco", "🇲🇪 Montenegro", "🇲🇦 Morocco", "🇳🇱 Netherlands", "🇲🇰 North Macedonia", "🇳🇴 Norway", "🇵🇱 Poland", "🇵🇹 Portugal", "🇷🇴 Romania", "🇸🇲 San Marino", "🇷🇸 Serbia", "🇸🇰 Slovakia", "🇸🇮 Slovenia", "🇪🇸 Spain", "🇸🇪 Sweden", "🇨🇭 Switzerland", "🇹🇷 Turkey", "🇺🇦 Ukraine", "🇬🇧 United Kingdom"];

export enum LocalStorageKeys
{
    RANKING_IDS = "ranking-ids"
}

function Home()
{
    const router = useRouter();

    const handelAddRanking = React.useCallback(() =>
    {
        const isConfirmed = confirm("Press 'OK' for Empty ranking and 'Cancel' for All Eurovision countries");

        const template = isConfirmed ? [] : DEFAULT_COUNTRIES;
        const rankingObject: StoredRanking = { title: "New Ranking", ranking: template };
        const rankingId = v4();

        localStorage.setItem(rankingId, JSON.stringify(rankingObject));
        const oldIds: string[] = JSON.parse(localStorage.getItem(LocalStorageKeys.RANKING_IDS) ?? "[]");
        const newIds = oldIds.concat(rankingId);
        localStorage.setItem(LocalStorageKeys.RANKING_IDS, JSON.stringify(newIds));
        router.push(`/${rankingId}/edit`);
    }, [router]);

    return <>
        <Link href={`/settings`}>Settings</Link>
        <br />{JSON.parse(localStorage.getItem(LocalStorageKeys.RANKING_IDS) ?? "[]")
            .map((id: string) => <><Link key={id} href={`/${id}`}>{id}</Link><br /></>)}
        <br /><button onClick={handelAddRanking} >Add</button> </>;
}

export default Home;


