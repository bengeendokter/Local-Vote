// caches.match("/_next/static/chunks/app/settings/page-9c69dc597e6e324e.js?__WB_REVISION__=yV6_dFGC4SJOS9n0MQ_Sm");

const installEvent = () =>
{
    self.addEventListener("install", () =>
    {
        console.log("service worker installed");
    });
};
installEvent();

const activateEvent = () =>
{
    self.addEventListener("activate", () =>
    {
        console.log("service worker activated");
    });
};
activateEvent();

interface CustomFetchEvent extends Event
{
    request: Request;
    respondWith(response: Promise<Response> | Response): Promise<Response>;
}

const fetchEvent = () =>
{
    self.addEventListener("fetch", (evt) =>
    {
        const fetchEvent = evt as CustomFetchEvent;

        console.log("EventListener evt: ", fetchEvent);
        console.log("EventListener url fetch: ", fetchEvent.request.url);

        const requestURL = new URL(fetchEvent.request.url);

        if(requestURL.pathname.startsWith("/ranking"))
        {
            console.log("startsWith /ranking");
            const frontStrippedPathName = requestURL.pathname.replace("/ranking/", "").replace("/ranking", "");


            if(frontStrippedPathName.length === 0)
            {
                console.log("frontStrippedPathName.length === 0");
                return fetch(fetchEvent.request);
            }

            if(requestURL.pathname.includes("edit"))
            {
                console.log("pathname.includes(edit)");
                // TODO fetch generic cached edit page
            }


            fetchEvent.respondWith(
                caches.match("/ranking").then((response) =>
                {
                    return response || fetch(fetchEvent.request);
                })
            );
        }
    });
};

fetchEvent();
