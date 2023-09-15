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

    return <>
        <Link href={`/${params.id}/edit`}>Edit</Link><p>{localStorage.getItem(`${params.id}`)}</p></>;
}

export default RankingDetail;
