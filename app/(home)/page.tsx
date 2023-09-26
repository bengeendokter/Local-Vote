"use client";

import * as React from "react";

import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { StoredRanking } from "../_types/storedRanking";
import styles from "./home.module.css";
import Button from "../_components/Button";
import AddIcon from "../_assets/icons/Add.svg";
import SettingsIcon from "../_assets/icons/Settings.svg";
import Header from "../_components/Header";
import LocalStorageKeys from "../_types/localStorageKeys";

const DEFAULT_COUNTRIES = ["🇦🇱 Albania", "🇦🇩 Andorra", "🇦🇲 Armenia", "🇦🇺 Australia", "🇦🇹 Austria", "🇦🇿 Azerbaijan", "🇧🇪 Belgium", "🇧🇦 Bosnia and Herzegovina", "🇧🇬 Bulgaria", "🇭🇷 Croatia", "🇨🇾 Cyprus", "🇨🇿 Czechia", "🇩🇰 Denmark", "🇪🇪 Estonia", "🇫🇮 Finland", "🇫🇷 France", "🇬🇪 Georgia", "🇩🇪 Germany", "🇬🇷 Greece", "🇭🇺 Hungary", "🇮🇸 Iceland", "🇮🇪 Ireland", "🇮🇱 Israel", "🇮🇹 Italy", "🇱🇻 Latvia", "🇱🇹 Lithuania", "🇱🇺 Luxembourg", "🇲🇹 Malta", "🇲🇩 Moldova", "🇲🇨 Monaco", "🇲🇪 Montenegro", "🇲🇦 Morocco", "🇳🇱 Netherlands", "🇲🇰 North Macedonia", "🇳🇴 Norway", "🇵🇱 Poland", "🇵🇹 Portugal", "🇷🇴 Romania", "🇸🇲 San Marino", "🇷🇸 Serbia", "🇸🇰 Slovakia", "🇸🇮 Slovenia", "🇪🇸 Spain", "🇸🇪 Sweden", "🇨🇭 Switzerland", "🇹🇷 Turkey", "🇺🇦 Ukraine", "🇬🇧 United Kingdom"];

type StoredRankingWithId =
    {
        id: string
    } & StoredRanking;

function Home()
{
    const router = useRouter();

    const [rankings, setRankings] = React.useState<string[]>([]);

    React.useEffect(() =>
    {
        setRankings(JSON.parse(localStorage.getItem(LocalStorageKeys.RANKING_IDS) ?? "[]"));
    }, []);

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
        router.push(`/ranking/${rankingId}/edit`);
    }, [router]);

    return <>
        <Header>
            <h1  >Your rankings</h1>
            <Button href={`/settings`}><SettingsIcon /></Button>
        </Header>
        <main className={styles.main} >
            {
                rankings.map((id: string) => { return { id, ...JSON.parse(localStorage.getItem(id) ?? "{}") }; }).filter((rankingObject: StoredRankingWithId) => rankingObject.title !== undefined).map(({ id, title }: StoredRankingWithId) => <><Button className={styles.ranking_link} key={id} href={`/ranking/${id}`}>{title}</Button></>)}
            <Button onClick={handelAddRanking} ><AddIcon /></Button>
        </main> </>;
}

export default Home;
