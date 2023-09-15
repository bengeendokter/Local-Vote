"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";

type RankingEditProps = {
    params: { id: string }
}

function RankingEdit({ params }: RankingEditProps)
{
    const router = useRouter();

    React.useEffect(() =>
    {
        if(params.id === "404")
        {
            router.replace(`/${params.id}/not-found`);
        }
    }, [params.id, router]);

    return <>
        <Link href={`/${params.id}`}>Detail</Link><p>{`Edit ${params.id}`}</p></>;
}

export default RankingEdit;
