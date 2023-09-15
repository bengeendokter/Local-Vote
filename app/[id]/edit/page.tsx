"use client";

import Link from "next/link";
import * as React from "react";
import styles from "./edit.module.css";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import useQueryParams from "../../_hooks/useQueryParams";
import EmojiInput from "../../_components/EmojiInput";
import DeleteIcon from "../../_assets/icons/Delete.svg";
import DragHandleIcon from "../../_assets/icons/DragHandle.svg";
import AddIcon from "../../_assets/icons/Add.svg";
import emojiRegex from "emoji-regex";
import { CountryInput } from "../../_components/CountryInput";
import { v4 } from "uuid";
import LoadingIcon from "../../_components/LoadingIcon";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";

const DEFAULT_COUNTRIES = ["🇦🇱 Albania", "🇦🇩 Andorra", "🇦🇲 Armenia", "🇦🇺 Australia", "🇦🇹 Austria", "🇦🇿 Azerbaijan", "🇧🇪 Belgium", "🇧🇦 Bosnia and Herzegovina", "🇧🇬 Bulgaria", "🇭🇷 Croatia", "🇨🇾 Cyprus", "🇨🇿 Czechia", "🇩🇰 Denmark", "🇪🇪 Estonia", "🇫🇮 Finland", "🇫🇷 France", "🇬🇪 Georgia", "🇩🇪 Germany", "🇬🇷 Greece", "🇭🇺 Hungary", "🇮🇸 Iceland", "🇮🇪 Ireland", "🇮🇱 Israel", "🇮🇹 Italy", "🇱🇻 Latvia", "🇱🇹 Lithuania", "🇱🇺 Luxembourg", "🇲🇹 Malta", "🇲🇩 Moldova", "🇲🇨 Monaco", "🇲🇪 Montenegro", "🇲🇦 Morocco", "🇳🇱 Netherlands", "🇲🇰 North Macedonia", "🇳🇴 Norway", "🇵🇱 Poland", "🇵🇹 Portugal", "🇷🇴 Romania", "🇸🇲 San Marino", "🇷🇸 Serbia", "🇸🇰 Slovakia", "🇸🇮 Slovenia", "🇪🇸 Spain", "🇸🇪 Sweden", "🇨🇭 Switzerland", "🇹🇷 Turkey", "🇺🇦 Ukraine", "🇬🇧 United Kingdom"];
const SCORE_VALUES: number[] = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
const SCORE_MAP = new Map<number, number>(SCORE_VALUES.map((score, index) => [index, score]));

enum ErrorCause
{
    BAD_RESPONSE = "BAD_RESPONSE",
}
interface QueryParams
{
    inputValue: string[];
}

type countryObjectId = {
    country: string;
    id: string;
}

type RankingEditProps = {
    params: { id: string }
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
    const containsEmojiRegex = emojiRegex();
    const [title, setTitle] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [isFormLoading, setFormLoading] = React.useState(false);
    const [isPageLoading, setPageLoading] = React.useState(true);
    const [hue, setHue] = React.useState<number>();

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

    const calculateTotalRanking = React.useCallback(() =>
    {
        const pointsMap = new Map<string, number>((countryObjectList).map(({ country }) => [country, 0]));

        countryObjectList.forEach(({ country }, index) =>
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
        alert(rankingArray);
    }, [countryObjectList]);

    const updateInputValue = React.useCallback((countryObjectIdList: countryObjectId[]) =>
    {
        const newInputValue = countryObjectListToCountries(countryObjectIdList);
        localStorage.setItem(`${params.id}`, JSON.stringify(newInputValue));

        setQueryParams({ inputValue: newInputValue });
    }, [countryObjectListToCountries, params.id, setQueryParams]);

    React.useEffect(() =>
    {
        const inputValueQueryParam = queryParams.inputValue;

        const initialInputValue = (() =>
        {
            if(inputValueQueryParam == null)
            {
                const inputValueLocalStorageString = localStorage.getItem(`${params.id}`);
                const inputValueLocalStorage = inputValueLocalStorageString !== null ? JSON.parse(inputValueLocalStorageString) : null;

                if(inputValueLocalStorage !== null)
                {
                    setQueryParams({ inputValue: inputValueLocalStorage });
                }

                return inputValueLocalStorage;
            }

            return JSON.parse(String(inputValueQueryParam));
        })();

        const nonNullInputValue = initialInputValue === null ? DEFAULT_COUNTRIES : initialInputValue;
        const countryObjectList = countriesToCountryObjectList(nonNullInputValue);
        setCountryObjectIdList(countryObjectList);
        setTitle(localStorage.getItem("title") ?? "");
        const storedHue = parseInt(localStorage.getItem("hue") ?? "54");
        setHue(storedHue);
        document.documentElement.style.setProperty("--hue", storedHue.toString());
        setPageLoading(false);
    }, [countriesToCountryObjectList, params.id, queryParams, setQueryParams]);

    const handleReset = React.useCallback(() =>
    {
        localStorage.removeItem(`${params.id}`);
        setQueryParams({ inputValue: [] });
        const countryObjectList = countriesToCountryObjectList(DEFAULT_COUNTRIES);
        setCountryObjectIdList(countryObjectList);
    }, [countriesToCountryObjectList, params.id, setQueryParams]);

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
            updateInputValue(newCountries);
            return newCountries;
        });
    }, [updateInputValue]);

    type countryObject = {
        emoji: string;
        name: string;
    }

    const splitCountryInEmojiAndName = React.useCallback((country: string): countryObject =>
    {
        const countrySplitArray = country.split(" ");
        const possibleEmoji = countrySplitArray[0];
        const matchArray = possibleEmoji.match(containsEmojiRegex);

        const containsEmoji = matchArray !== null;
        const emoji = containsEmoji ? matchArray[0] : "";
        const name = containsEmoji ? countrySplitArray.slice(1).join(" ") : country;

        return { emoji, name };
    }, [containsEmojiRegex]);

    const handleCalculateTotal = React.useCallback(() =>
    {
        calculateTotalRanking();
    }, [calculateTotalRanking]);

    const handleDelete = React.useCallback((index: number) =>
    {
        setCountryObjectIdList((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.splice(index, 1);

            updateInputValue(newCountries);
            return newCountries;
        });
    }, [updateInputValue]);

    const handelAddCountry = React.useCallback(() =>
    {
        setCountryObjectIdList((countries) =>
        {
            const newCountries = Array.from(countries);
            newCountries.push({ country: "", id: v4() });

            updateInputValue(newCountries);
            return newCountries;
        });
    }, [updateInputValue]);

    const handleTitleInput = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newTitle = event.target.value;
        setTitle(newTitle);
        localStorage.setItem("title", newTitle);
    }, []);

    const handleHueInput = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newHue = event.target.value;
        const parsedHue = newHue.length === 0 ? 0 : parseInt(newHue);
        if(isNaN(parsedHue))
        {
            return;
        }

        setHue(parsedHue);
        localStorage.setItem("hue", parsedHue.toString());
        document.documentElement.style.setProperty("--hue", parsedHue.toString());
    }, []);

    const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) =>
    {
        setFormLoading(true);
        setMessage("");

        event.preventDefault();

        const myForm = event.target as HTMLFormElement;
        const formData = new FormData(myForm);

        const record: Record<string, string> = {};

        formData.forEach((value, key) =>
        {
            record[key] = value.toString();
        });

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(record).toString(),
        })
            .then((response) =>
            {
                if(response.status !== 200)
                {
                    throw new Error(":( Oops, I probably broke something. Please try again later.", { cause: ErrorCause.BAD_RESPONSE });
                }
                alert("Message send successfully, thank you for your feedback!");
            })
            .catch((error: Error) =>
            {
                if(error.cause === ErrorCause.BAD_RESPONSE)
                {
                    alert(error.message);
                    return;
                }
                alert("Could not send the request. Please check your internet connection.");
            })
            .finally(() => setFormLoading(false));
    }, []);

    const handleMessageInput = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        const newMessage = event.target.value;
        setMessage(newMessage);
    }, []);

    const imageRef = React.useRef<HTMLOListElement>(null);

    const onButtonClick = React.useCallback(() =>
    {
        if(imageRef.current === null)
        {
            return;
        }

        toPng(imageRef.current, { cacheBust: true })
            .then((dataUrl) =>
            {
                const link = document.createElement("a");
                link.download = "my-image-name.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) =>
            {
                console.log(err);
            });
    }, [imageRef]);

    return (<>
        <Link href={`/${params.id}`}>Detail</Link><p>{`Edit ${params.id}`}</p>
        <header className={styles.header} >
            <input className={styles.title_input} onChange={handleTitleInput} type='text' placeholder="Title" value={title} ></input>
        </header>
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
                                <ol ref={imageRef} className={styles.country_list}>
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
                                                        <EmojiInput emoji={emoji} countryName={countryName} setCountryObjectIdList={setCountryObjectIdList} index={index} updateInputValue={updateInputValue} />
                                                        <CountryInput emoji={emoji} countryName={countryName} setCountryObjectIdList={setCountryObjectIdList} index={index} updateInputValue={updateInputValue} />
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
            <button className={styles.add_button} aria-label="Add ranking item" onClick={handelAddCountry}><AddIcon /></button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleCalculateTotal}>Calculate Total</button>
            <button onClick={onButtonClick}>Download</button>
            <label className={styles.form_label} htmlFor="hue" >Change app color</label>
            <input id="hue" type="range" min={0} max={360} value={hue} onChange={handleHueInput} />
            <input aria-label='App color value' type="number" min={0} max={360} value={hue === 0 ? "" : hue} onChange={handleHueInput} />
            <form className={styles.form} name="contact local vote" method="POST" data-netlify="true" onSubmit={handleSubmit} >
                <input type="hidden" name="form-name" value="contact local vote" />
                {isFormLoading
                    ? <><p className={styles.loading_label} >Sending message</p> <LoadingIcon /></>
                    : <>
                        <label className={styles.form_label} htmlFor="message" >Leave a suggestion or message:</label>
                        <textarea rows={3} className={styles.form_textarea} id="message" name="message" placeholder="Type your message here" value={message} onChange={handleMessageInput} ></textarea></>}
                <button type="submit" disabled={isFormLoading} >Send</button>
            </form>
        </main></>);
}

export default RankingEdit;
