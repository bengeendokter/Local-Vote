import * as React from "react";
import { countryObjectId } from "../../[id]/edit/page";

export type InputProps = {
    emoji: string;
    countryName: string;
    setCountryObjectIdList: React.Dispatch<React.SetStateAction<countryObjectId[]>>;
    index: number;
    updateRanking: (newRanking: countryObjectId[]) => void;

};
