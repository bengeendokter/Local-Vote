"use client";

import * as React from "react";
import styles from "./edit.module.css";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import useQueryParams from "../../_hooks/useQueryParams";
import EmojiInput from "../../_components/InputField/EmojiInput";
import DeleteIcon from "../../_assets/icons/Delete.svg";
import DragHandleIcon from "../../_assets/icons/DragHandle.svg";
import AddIcon from "../../_assets/icons/Add.svg";
import BackArrowIcon from "../../_assets/icons/BackArrow.svg";
import CountryInput from "../../_components/InputField/CountryInput";
import { v4 } from "uuid";
import LoadingIcon from "../../_components/LoadingIcon";
import { useRouter } from "next/navigation";
import Header from "../../_components/Header";
import Button from "../../_components/Button";
import splitCountryInEmojiAndName from "../splitCountryInEmojiAndName";

interface QueryParams
{
    title: string;
    ranking: string[];
}

export type countryObjectId = {
    country: string;
    id: string;
}

type RankingEditProps = {
    params: { id: string }
}

export type StoredRanking = {
    title: string;
    ranking: string[];
}

// TODO based on device type show emoji hint, windows: press windows + ; to open emoji keyboard, macos...
// TODO highlight or show emoji hint based on failed onChange input in EmojiInputField in the handleInput function
function RankingEdit({ params }: RankingEditProps)
{
    const router = useRouter();

    React.useEffect(() =>
    {
        if(localStorage.getItem(`${params.id}`) === null)
        {
            router.replace(`/${params.id}/not-found`);
        }
    }, [params.id, router]);


    const { queryParams, setQueryParams } = useQueryParams<QueryParams>();
    const [countryObjectList, setCountryObjectIdList] = React.useState<countryObjectId[]>([]);
    const [title, setTitle] = React.useState("Loading...");
    const [isPageLoading, setPageLoading] = React.useState(true);

    const countriesToCountryObjectList = React.useCallback((countries: string[]): countryObjectId[] =>
    {
        const countryObjectList: countryObjectId[] = countries.map((country) => { return { country, id: v4() }; });
        return countryObjectList;
    }, []);

    const countryObjectListToCountries = React.useCallback((countryObjectList: countryObjectId[]): string[] =>
    {
        const countryList: string[] = countryObjectList.map(({ country }) => country);
        return countryList;
    }, []);

    const updateRanking = React.useCallback((countryObjectIdList: countryObjectId[]) =>
    {
        const newRanking = countryObjectListToCountries(countryObjectIdList);
        const newStoredRanking: StoredRanking = { title, ranking: newRanking };
        localStorage.setItem(`${params.id}`, JSON.stringify(newStoredRanking));

        setQueryParams({ ranking: newRanking });
    }, [countryObjectListToCountries, params.id, setQueryParams, title]);

    React.useEffect(() =>
    {
        const rankingQueryParam = queryParams.ranking;
        const titleQueryParam = queryParams.title;

        const initialRanking = (() =>
        {
            if(rankingQueryParam === undefined && titleQueryParam === undefined)
            {
                const rankingLocalStorageString = localStorage.getItem(`${params.id}`);
                const rankingLocalStorage: StoredRanking = rankingLocalStorageString !== null ? JSON.parse(rankingLocalStorageString) : null;

                if(rankingLocalStorage !== null)
                {
                    setQueryParams({ title: rankingLocalStorage.title, ranking: rankingLocalStorage.ranking });
                }

                return rankingLocalStorage;
            }

            return { ranking: JSON.parse(String(rankingQueryParam ?? "[]")), title: JSON.parse(String(titleQueryParam ?? null)) };
        })();

        const nonNullRanking: StoredRanking = initialRanking === null ? { title: "", ranking: [] } : initialRanking;
        console.log("nonNullRanking", nonNullRanking);
        const countryObjectList = countriesToCountryObjectList(nonNullRanking.ranking);
        setCountryObjectIdList(countryObjectList);
        setTitle(nonNullRanking.title);
        setPageLoading(false);
    }, [countriesToCountryObjectList, params.id, queryParams, setQueryParams]);

    const onDragEnd: OnDragEndResponder = React.useCallback((result) =>
    {
        const { destination, source } = result;
        if(!destination)
        {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index)
        {
            return;
        }

        setCountryObjectIdList((countryObjectIdList) =>
        {
            const newCountries = Array.from(countryObjectIdList);
            const country = newCountries.splice(source.index, 1)[0];
            newCountries.splice(destination.index, 0, country);
            updateRanking(newCountries);
            return newCountries;
        });
    }, [updateRanking]);

    const handleDelete = React.useCallback((index: number) =>
    {
        setCountryObjectIdList((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.splice(index, 1);

            updateRanking(newCountries);
            return newCountries;
        });
    }, [updateRanking]);

    const handelAddCountry = React.useCallback(() =>
    {
        setCountryObjectIdList((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.push({ country: "", id: v4() });

            updateRanking(newCountries);
            return newCountries;
        });
    }, [updateRanking]);

    const handleTitleInput = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newTitle = event.target.value;
        setTitle(newTitle);
        const ranking = countryObjectListToCountries(countryObjectList);
        const newRanking: StoredRanking = { title: newTitle, ranking };
        localStorage.setItem(`${params.id}`, JSON.stringify(newRanking));
        setQueryParams({ title: newTitle });
    }, [countryObjectList, countryObjectListToCountries, params.id, setQueryParams]);

    return (<>
        <Header>
            <Button aria-label="Go back" href={`/${params.id}`}><BackArrowIcon /></Button>
            <input disabled={isPageLoading} className={styles.title_input} onChange={handleTitleInput} type='text' placeholder="Title" value={title}></input>
        </Header>
        <main className={styles.main}>
            {isPageLoading
                ?
                <div className={styles.page_loading_container}>
                    <p>Loading list...</p>
                    <LoadingIcon />
                </div>
                :
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='countries' >
                        {
                            (provided) => (<div ref={provided.innerRef} {...provided.droppableProps} >
                                <ol className={styles.country_list}>
                                    {countryObjectList.map(({ country, id }) => { return { ...splitCountryInEmojiAndName(country), id }; }).map(({ emoji, name: countryName, id }, index) => <Draggable draggableId={id} index={index} key={id}>
                                        {(provided, snapshot) =>
                                        (
                                            <li
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                className={styles.country_list_item} >
                                                <div className={[styles.country_list_item_content, snapshot.isDragging ? styles.active : ""].join(" ")}>
                                                    <button aria-label="Remove ranking item" className={styles.country_list_item_button} onClick={() => handleDelete(index)} >
                                                        <DeleteIcon />
                                                    </button>
                                                    <div className={styles.country_list_item_edit} ><p className={styles.rank_number}>
                                                        {index + 1}.</p>
                                                        <EmojiInput emoji={emoji} countryName={countryName} setCountryObjectIdList={setCountryObjectIdList} index={index} updateRanking={updateRanking} />
                                                        <CountryInput emoji={emoji} countryName={countryName} setCountryObjectIdList={setCountryObjectIdList} index={index} updateRanking={updateRanking} />
                                                        <div aria-label="Drag handle" {...provided.dragHandleProps} className={styles.country_drag_handle} ><DragHandleIcon /></div>
                                                    </div>
                                                </div>

                                            </li>
                                        )
                                        }
                                    </Draggable>)}
                                </ol>

                                {provided.placeholder}
                            </div>)
                        }
                    </Droppable>
                </DragDropContext>
            }
            <Button aria-label="Add ranking item" onClick={handelAddCountry}><AddIcon /></Button>
        </main></>);
}

export default RankingEdit;
