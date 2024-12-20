import axios from 'axios';

const getLiveUrl = async (user) => {
  const httpclient = axios.create();
  console.log(`[>] Getting roomId for user ${user}`);
  const roomId = await getRoomIdFromUser(user, httpclient);
  console.log(`[>] RoomId: ${roomId}`);
  const { data } = await httpclient.get(`https://webcast.tiktok.com/webcast/room/info/?aid=1988&room_id=${roomId}`);
  const liveUrlFlv = data?.data?.stream_url?.rtmp_pull_url;
  if (!liveUrlFlv && data.status_code === 4003110) throw new Error('LiveNotFound');
  console.info(`[>] LIVE URL: ${liveUrlFlv}`);
  return liveUrlFlv;
};

const getRoomIdFromUser = async (user, httpclient) => {
  const content = (await httpclient.get(`https://www.tiktok.com/@${user}/live`)).data;
  if (content.includes('Please wait...')) throw new Error('IPBlockedByWAF');
  const match = content.match(/<script id="SIGI_STATE" type="application\/json">(.*?)<\/script>/);
  if (!match) throw new Error("[-] Error extracting roomId");
  const data = JSON.parse(match[1]);
  const roomId = data?.LiveRoom?.liveRoomUserInfo?.user?.roomId;
  if (!roomId) throw new Error("RoomId not found.");
  return roomId;
};

const run = async () => {
  try {
    await getLiveUrl('ohsomefunhouse');
  } catch (e) {
    console.log(e.message);
  }
};

await run();
