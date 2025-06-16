(() => {
    "use strict";

    const {
        location: { hostname, pathname, search },
        navigator: { doNotTrack },
    } = window;

    const currentScript = document.currentScript;
    if (!currentScript) return;

    const getAttribute = (attr) => currentScript.getAttribute(attr);

    // New attributes
    const team = getAttribute("data-ping-team");
    const app = getAttribute("data-ping-app");
    const environment = getAttribute("data-ping-environment");
    const hostUrl = getAttribute("data-ping-endpoint");
    
    const includeQuery = getAttribute("data-ping-include-url-query") !== "false";
    const respectDoNotTrack = getAttribute("data-ping-respect-do-not-track") === "true";

    if (respectDoNotTrack && doNotTrack === "1") {
        console.log("Do Not Track is enabled. Tracking is disabled.");
        return;
    }

    if (!team || !app || !environment || !hostUrl) {
        console.error("Tracking script requires 'data-ping-team', 'data-ping-app', 'data-ping-environment', and 'data-ping-endpoint'.");
        return;
    }

    // URL-related data to be included in payload
    const urlData = {
        nettside: hostname,
        url_sti: pathname,
        url_parametre: includeQuery ? search : "",
    };

    const sendEvent = (eventName, additionalData = {}) => {
        if (!eventName) return;

        const eventPayload = {
            app_eier: team,
            app_navn: app,
            app_miljo: environment,
            hendelse_navn: eventName,
            ...urlData,
            payload: {
                ...additionalData,
            },
        };

        fetch(hostUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventPayload),
        }).catch((err) => {
            console.error("Failed to send tracking event:", err);
        });
    };

    // Example: Auto-track page views - disabled by default, enabled only if explicitly set to "true"
    const autoTrackPageViews = getAttribute("data-ping-track-pageviews") === "true";
    if (autoTrackPageViews) {
        sendEvent("sidevisning");
    }

    // Expose a global tracking function
    window.tracker = {
        track: sendEvent,
    };
})();