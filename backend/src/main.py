import asyncio
import base64
import logging

import mpd
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from mpd.asyncio import MPDClient
from pydantic import BaseModel

app = FastAPI()
logger = logging.getLogger()
logging.basicConfig()
logger.setLevel(logging.INFO)
mpd_client = MPDClient()
mpd_status = None
mpd_currentsong = None
mpd_lock = asyncio.Lock()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


async def get_status():
    global mpd_status
    global mpd_currentsong
    while True:
        async with mpd_lock:
            try:
                mpd_status = await mpd_client.status()
                mpd_currentsong = await mpd_client.currentsong()
            except mpd.ConnectionError:
                logger.error("Can't obtain MPD status - not connected")
                mpd_status = None
                mpd_currentsong = None
        await asyncio.sleep(1.0)


async def send_status(websocket: WebSocket):
    while True:
        try:
            await websocket.send_json({"status": mpd_status, "currentsong": mpd_currentsong})
            await asyncio.sleep(1.0)
        except WebSocketDisconnect:
            return


@app.on_event("startup")
async def startup():
    try:
        await mpd_client.connect("localhost", 6600)
        logger.info("MPD connected")
    except ConnectionRefusedError:
        logger.exception("Can't connect to MPD")

    asyncio.create_task(get_status())


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.websocket("/mpd/ws")
async def websocket_endpoint(websocket: WebSocket):
    # data = await websocket.receive_text()
    await websocket.accept()
    await send_status(websocket)


@app.get("/mpd/artists")
async def get_artists():
    async with mpd_lock:
        try:
            artists = await mpd_client.list("artist")
            return artists
        except mpd.ConnectionError:
            logger.error("Can't obtain list of artists - not connected")
            return None


@app.get("/mpd/albums/{artist}")
async def get_albums(artist: str):
    async with mpd_lock:
        try:
            albums = await mpd_client.list("album", "artist", artist, "group", "date")
            return albums
        except mpd.ConnectionError:
            logger.error("Can't obtain list of albums - not connected")
            return None


@app.get("/mpd/songs/{artist}/{album}")
async def get_songs(artist: str, album: str):
    async with mpd_lock:
        try:
            songs = await mpd_client.find("artist", artist, "album", album)
            return songs
        except mpd.ConnectionError:
            logger.error("Can't obtain list of songs - not connected")
            return None


@app.get("/mpd/cover")
async def get_cover(uri: str):
    logger.info("Getting cover art for %s", uri)
    async with mpd_lock:
        try:
            art = await mpd_client.albumart(uri)
            if "binary" in art and art["binary"]:
                return {"cover": base64.b64encode(art["binary"])}
            return None
        except mpd.CommandError:
            return None
        except mpd.ConnectionError:
            logger.error("Can't obtain list of songs - not connected")
            return None


class EnqeueModel(BaseModel):
    uris: list[str]


@app.post("/mpd/enqueue")
async def enqueue(cmd: EnqeueModel):
    async with mpd_lock:
        for uri in cmd.uris:
            await mpd_client.add(uri)


@app.get("/mpd/playlistInfo")
async def get_playlist_info():
    async with mpd_lock:
        try:
            playlist_info = await mpd_client.playlistinfo()
            return playlist_info
        except mpd.ConnectionError:
            logger.error("Can't obtain playlist - not connected")
            return None


@app.get("/mpd/play/{pos}")
async def play(pos: int):
    async with mpd_lock:
        try:
            await mpd_client.play(pos)
        except mpd.ConnectionError:
            logger.error("Can't play - not connected")


@app.get("/mpd/clear")
async def clear():
    async with mpd_lock:
        try:
            await mpd_client.clear()
        except mpd.ConnectionError:
            logger.error("Can't clear playlist - not connected")
