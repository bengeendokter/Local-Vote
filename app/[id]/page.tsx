"use client";

import * as React from "react";
import BackArrowIcon from "../_assets/icons/BackArrow.svg";
import EditIcon from "../_assets/icons/Edit.svg";
import DeleteIcon from "../_assets/icons/Delete.svg";
import { useRouter } from "next/navigation";
import { LocalStorageKeys } from "../(home)/page";
import Button from "../_components/Button";
import Header from "../_components/Header";
import styles from "./detail.module.css";
import { StoredRanking } from "./edit/page";
import splitCountryInEmojiAndName from "./splitCountryInEmojiAndName";

const SCORE_VALUES: number[] = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
const SCORE_MAP = new Map<number, number>(SCORE_VALUES.map((score, index) => [index, score]));

type RankingDetailProps = {
    params: { id: string }
}

function RankingDetail({ params }: RankingDetailProps)
{
    const router = useRouter();
    const [rankingObject, setRankingObject] = React.useState<StoredRanking>({ title: "Loading...", ranking: [] });

    React.useEffect(() =>
    {
        const storedRanking = localStorage.getItem(`${params.id}`);
        if(storedRanking === null)
        {
            router.replace(`/${params.id}/not-found`);
            return;
        }

        const storedRankingObject: StoredRanking = JSON.parse(storedRanking);
        setRankingObject(storedRankingObject);

    }, [params.id, router]);

    const calculateTotalRanking = React.useCallback(() =>
    {
        const pointsMap = new Map<string, number>((rankingObject.ranking).map((country) => [country, 0]));

        rankingObject.ranking.forEach((country, index) =>
        {
            if(index >= SCORE_VALUES.length)
            {
                return;
            }

            const oldPoints = pointsMap.get(country) ?? 0;
            const newPoints = oldPoints + (SCORE_MAP.get(index) ?? 0);
            pointsMap.set(country, newPoints);
        });

        const rankingArray = Array.from(pointsMap.entries()).sort(([, points1], [, points2]) => points2 - points1);
        return rankingArray;
    }, [rankingObject]);

    const handelDeleteRanking = React.useCallback(() =>
    {
        const isConfirmed = confirm("Do you want to delete this ranking?");

        if(!isConfirmed)
        {
            return;
        }

        const rankingIds: string[] = JSON.parse(localStorage.getItem(LocalStorageKeys.RANKING_IDS) ?? "[]");
        const rankingIndex = rankingIds.findIndex((id) => id === params.id);

        if(rankingIndex !== -1)
        {
            localStorage.setItem(LocalStorageKeys.RANKING_IDS, JSON.stringify(rankingIds.toSpliced(rankingIndex)));
        }

        localStorage.removeItem(params.id);
        router.push("/");
    }, [params.id, router]);

    return <>
        <Header>
            <Button href={`/`}><BackArrowIcon /></Button>
            <h1 className={styles.h1} >{rankingObject.title}</h1>
        </Header>
        <main>
            <ol className={styles.ranking_list} >
                {calculateTotalRanking().map(([country, points]) => { return { ...splitCountryInEmojiAndName(country), points }; }).map(({ emoji, name, points }, index) => <>
                <li key={index} >{index + 1}. {emoji} {name} {points}</li>
                </>)}
            </ol>
        </main>
        <div className={styles.button_container} >
            <Button href={`/${params.id}/edit`}><EditIcon /></Button>
            <Button onClick={handelDeleteRanking} ><DeleteIcon /></Button>
        </div>
    </>;
}

export default RankingDetail;
