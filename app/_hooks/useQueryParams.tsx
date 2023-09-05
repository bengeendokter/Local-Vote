"use client"

import * as React from 'react';
import { usePathname, useSearchParams } from "next/navigation";

export default function useQueryParams<T = {}>()
{
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [queryParams] = React.useState(Object.fromEntries(searchParams.entries()) as Partial<T>);
    const urlSearchParams = React.useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

    const setQueryParams = React.useCallback((params: Partial<T>) =>
    {
        Object.entries(params).forEach(([key, value]) =>
        {
            urlSearchParams.set(key, JSON.stringify(value));
        });

        const search = urlSearchParams.toString();
        const query = search ? `?${search}` : "";

        history.replaceState(null, "", `${pathname}${query}`);
    }, [pathname, urlSearchParams]); 

    return { queryParams, setQueryParams };
}