"use client";
import * as React from "react";
import styles from "./header.module.css";

interface HeaderProps
{
    children: React.ReactNode;
}

function Header({ children, ...rest }: HeaderProps)
{
    return <header className={styles.header} {...rest}>
        {children}
    </header>;
}

export default Header;
