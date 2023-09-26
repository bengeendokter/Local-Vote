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

        if(requestURL.pathname !== "/settings")
        {
            console.log("Fetch request is not for the settings page:", requestURL);
            return fetch(fetchEvent.request);
        }

        fetchEvent.respondWith(
            caches.match("/_next/static/chunks/app/settings/page-ed57b07c9493a9c6.js", { ignoreSearch: true }).then(function(response)
            {
                console.log("respondWith: ", response);
                if(response)
                {
                    // If the response is found in cache, extract the JavaScript code
                    return response.text().then((jsCode) =>
                    {

                        console.log("before eval : ", response);
                        // Evaluate the JavaScript code
                        eval(jsCode);

                        console.log("after eval : ", response);
                        return response;
                    });
                }

                console.log("last fetch");
                // If the response is not in cache, fetch it
                return fetch(fetchEvent.request);
            })
        );
    });
};

fetchEvent();
