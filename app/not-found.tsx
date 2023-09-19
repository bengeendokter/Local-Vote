"use client";

import Link from "next/link";
import * as React from "react";


function NotFound()
{
    return <>
        <Link href={`/`}>Home</Link><p>Page not found</p></>;
}

export default NotFound;
