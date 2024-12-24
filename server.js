const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const httpGet = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getLiveUrl = async (user) => {
    try {
        console.log(`[>] Getting roomId for user ${user}`);
        const roomId = await getRoomIdFromUser(user);
        console.log(`[>] RoomId: ${roomId}`);
        const responseText = await httpGet(`https://webcast.tiktok.com/webcast/room/info/?aid=1988&room_id=${roomId}`);
        const data = responseText;
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

app.get('/api/liveStreamUrls', async (req, res) => {
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

    try {
        const liveUrls = await Promise.all(users.map(async (user) => {
            const liveUrl = await getLiveUrl(user);
            return { user, live_stream_link: liveUrl };
        }));

        res.json(liveUrls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
