// ==UserScript==
// @name         TikTok Live URL Extractor with Ready
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extract TikTok live stream URLs for multiple users and provide a ready mechanism for global access.
// @author       YourName
// @match        http://127.0.0.1:8888/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    // Axios-like GET request using GM_xmlhttpRequest
    const httpGet = (url) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => resolve(response.responseText),
                onerror: (err) => reject(err),
            });
        });
    };

    const getLiveUrl = async (user) => {
        try {
            console.log(`[>] Getting roomId for user ${user}`);
            const roomId = await getRoomIdFromUser(user);
            console.log(`[>] RoomId: ${roomId}`);
            const responseText = await httpGet(`https://webcast.tiktok.com/webcast/room/info/?aid=1988&room_id=${roomId}`);
            const data = JSON.parse(responseText);
            const liveUrlFlv = data?.data?.stream_url?.rtmp_pull_url;
            if (!liveUrlFlv && data.status_code === 4003110) throw new Error('LiveNotFound');
            console.info(`[>] LIVE URL: ${liveUrlFlv}`);
            return liveUrlFlv;
        } catch (e) {
            console.error(`Error getting live URL for user ${user}: ${e.message}`);
            return '';
        }
    };

    const getRoomIdFromUser = async (user) => {
        const content = await httpGet(`https://www.tiktok.com/@${user}/live`);
        if (content.includes('Please wait...')) throw new Error('IPBlockedByWAF');
        const match = content.match(/<script id="SIGI_STATE" type="application\/json">(.*?)<\/script>/);
        if (!match) throw new Error("[-] Error extracting roomId");
        const data = JSON.parse(match[1]);
        const roomId = data?.LiveRoom?.liveRoomUserInfo?.user?.roomId;
        if (!roomId) throw new Error("RoomId not found.");
        return roomId;
    };

    const run = async () => {
        const users = [
            'ohsomefunhouse',
            'ohsomescents',
            'ohsomebeautyofficial',
            'ohsomelovelytoys',
            'ohsometrends',
            'ohsomecollections',
            'ohsomeunboxfun',
            'ohsome.bricksworld',
            'ohsometravel'
        ];

        const liveUrls = await Promise.all(users.map(async (user) => {
            const liveUrl = await getLiveUrl(user);
            return { user, live_stream_link: liveUrl };
        }));

        // Inject live URLs into global context
        const scriptContent = `
            window.liveStreamUrls = ${JSON.stringify(liveUrls)};
            console.log("Live Stream URLs injected:", window.liveStreamUrls);
        `;
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.body.appendChild(script);
        script.remove();
    };

    // Execute the main logic
    run();
})();
