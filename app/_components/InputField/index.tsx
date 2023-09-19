import * as React from "react";
import { CountryObjectId } from "../../_types/countryObjectId";

export type InputProps = {
    emoji: string;
    countryName: string;
    setCountryObjectIdList: React.Dispatch<React.SetStateAction<CountryObjectId[]>>;
    index: number;
    updateRanking: (newRanking: CountryObjectId[]) => void;

};
