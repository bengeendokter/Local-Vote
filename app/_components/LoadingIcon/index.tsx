"use client";
import * as React from "react";
import styles from "./loading-icon.module.css";

function LoadingIcon()
{
    return (<><div className={styles.lds_ellipsis}><div></div><div></div><div></div><div></div></div></>);
};

export default LoadingIcon;
