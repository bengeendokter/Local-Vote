"use client";
import * as React from "react";
import styles from "./button.module.css";
import Link, { LinkProps } from "next/link";

type ActionButton = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type NavigationButton =
{
    href: string;
    children: React.ReactNode;
} & LinkProps;

type ButtonProps = ActionButton | NavigationButton;

function Button(props: ButtonProps)
{

    if("href" in props)
    {
        const { href, children, ...rest } = props;
        return <><Link href={href} className={styles.button} {...rest}>{children}</Link></>;
    }

    if("onClick" in props)
    {
        const { onClick, children, ...rest } = props;
        return <><button onClick={onClick} className={styles.button} {...rest}>{children}</button>
        </>;
    }
}

export default Button;
