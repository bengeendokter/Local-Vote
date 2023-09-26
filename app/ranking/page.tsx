"use client";

import * as React from "react";
import RankingDetail from "./[id]/page";

function Ranking()
{
    return RankingDetail({ params: { id: "" } });
}

export default Ranking;
