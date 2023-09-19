"use client";
import * as React from "react";
import styles from "./button.module.css";
import Link, { LinkProps } from "next/link";

type ActionButton = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type NavigationButton =
{
    href: string;
    children: React.ReactNode;
    className?: string;
} & LinkProps;

type ButtonProps = ActionButton | NavigationButton;

function Button(props: ButtonProps)
{

    if("href" in props)
    {
        const { href, children, className, ...rest } = props;
        return <><Link href={href} className={[styles.button, className].join(" ")} {...rest}>{children}</Link></>;
    }

    if("onClick" in props)
    {
        const { onClick, children, ...rest } = props;
        return <><button onClick={onClick} className={styles.button} {...rest}>{children}</button>
        </>;
    }
}

export default Button;
