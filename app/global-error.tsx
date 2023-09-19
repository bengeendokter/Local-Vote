"use client";

import * as React from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error
    reset: () => void
})
{
    React.useEffect(() =>
    {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);
    return (
        <html>
            <body>
                <h1>Something went wrong!</h1>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}
