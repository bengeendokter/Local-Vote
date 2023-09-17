"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";

type RankingDetailProps = {
    params: { id: string }
}

function RankingDetail({ params }: RankingDetailProps)
{
    const router = useRouter();

    React.useEffect(() =>
    {
        if(localStorage.getItem(`${params.id}`) === null)
        {
            router.replace(`/${params.id}/not-found`);
        }
    }, [params.id, router]);

    // TODO remove list
    // prompt if user wants tot delete
    // find index of this id in list of id's if exist
    // remove from list
    // remove ranking entry from local storage
    // navigate back to home

    return <>
        <Link href={`/`}>Home</Link><br/><Link href={`/${params.id}/edit`}>Edit</Link><p>{localStorage.getItem(`${params.id}`)}</p></>;
}

export default RankingDetail;
