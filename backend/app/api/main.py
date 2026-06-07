from datetime import datetime
from typing import List, Optional
import requests
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.app.anime_profile.final_recommendations_dict import prepare_dictionary, fetch_raw_user_data
from backend.app.user_profile.create_user_interests_profile import create_user_interests_profile
from backend.app.api.exceptions import register_exception_handlers
from backend.config.MAL_api_key import MAL_KEY

app = FastAPI()

register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recommendations_data/")
async def get_recommendations(
    username: str = Query(None),
    platform: str = Query(None),

    show_sequels: bool = Query(False),
    experimental_mode: bool = Query(False),
    show_18_rated: bool = Query(True),

    tag_importance: str = Query("medium"),
    popularity_importance: str = Query("medium"),

    min_number_episodes: int = Query(0, ge=0),
    max_number_episodes: int = Query(9999),

    min_release_year: int = Query(1900),
    max_release_year: int = Query(datetime.now().year),

    min_mean_score: int = Query(0),

    show_selected_studios: Optional[List[str]] = Query(None),
    show_selected_tags: Optional[List[str]] = Query(None),
    hide_selected_tags: Optional[List[str]] = Query(None),
    show_selected_genres: Optional[List[str]] = Query(None),
    hide_selected_genres: Optional[List[str]] = Query(None),
    media_types: str = Query("TV"),
    show_streaming_service: str = Query("All"),
    show_planning: bool = Query(False),
    show_high_popularity: bool = Query(True),
):
    filters = {
        "show_sequels": show_sequels,
        "experimental_mode": experimental_mode,
        "show_18_rated": show_18_rated,
        "tag_importance": tag_importance,
        "popularity_importance": popularity_importance,
        "min_number_episodes": min_number_episodes,
        "max_number_episodes": max_number_episodes,
        "min_release_year": min_release_year,
        "max_release_year": max_release_year,
        "min_mean_score": min_mean_score,
        "show_selected_studios": show_selected_studios,
        "show_selected_tags": show_selected_tags,
        "hide_selected_tags": hide_selected_tags,
        "show_selected_genres": show_selected_genres,
        "hide_selected_genres": hide_selected_genres,
        "media_types": media_types,
        "show_streaming_service": show_streaming_service,
        "show_planning": show_planning,
        "show_high_popularity": show_high_popularity,
    }

    user_data = {
        "username": username,
        "platform": platform,
    }
    data = await prepare_dictionary(filters, user_data)
    return data

@app.get("/raw_data/")
async def get_raw_data(
    username: str = Query(None),
    platform: str = Query(None),
):
    user_data = {"username": username, "platform": platform}
    raw_data = await fetch_raw_user_data(user_data)
    return raw_data

@app.get("/user_interests/")
async def get_user_interests(
    username: str = Query(None),
    platform: str = Query(None),
):
    user_data = {"username": username, "platform": platform}
    raw_data = await fetch_raw_user_data(user_data)
    data = create_user_interests_profile(raw_data)
    return data

@app.get("/verify_user/")
async def verify_user(
    username: str = Query(None), 
    platform: str = Query(None)
):
    if platform == "AniList":
        query = '''
        query($userName: String) {
          User(name: $userName) { id }
          MediaListCollection(userName: $userName, type: ANIME, chunk: 1, perChunk: 1) {
            hasNextChunk
          }
        }
        '''
        try:
            response = requests.post(
                'https://graphql.anilist.co',
                json={'query': query, 'variables': {'userName': username}},
                timeout=10
            )
            
            try:
                res = response.json()
            except Exception:
                return {"exists": False, "is_private": False}

            if res.get("errors"):
                is_private = any("private" in str(error.get("message", "")).lower() for error in res["errors"])
                if is_private:
                    return {"exists": True, "is_private": True}
                
                not_found = any("not found" in str(error.get("message", "")).lower() for error in res["errors"])
                if not_found:
                    return {"exists": False, "is_private": False}
                    
            data = res.get("data") or {}
            
            if not data.get("User"):
                return {"exists": False, "is_private": False}
            if data.get("MediaListCollection") is None:
                return {"exists": True, "is_private": True}
                
            return {"exists": True, "is_private": False}
        except Exception:
            return {"exists": False, "is_private": False}

    elif platform == "MyAnimeList":
        try:
            headers = {'X-MAL-CLIENT-ID': MAL_KEY}
            url = f"https://api.myanimelist.net/v2/users/{username}/animelist"
            response = requests.get(url, headers=headers, params={"limit": 1}, timeout=10)
            
            if response.status_code == 404:
                return {"exists": False, "is_private": False}
            if response.status_code in [401, 403]:
                return {"exists": True, "is_private": True}
                
            if response.status_code == 200:
                return {"exists": True, "is_private": False}
                
            return {"exists": False, "is_private": False}
        except Exception:
            return {"exists": False, "is_private": False}
            
    return {"exists": False, "is_private": False}

# Uruchomienie: python -m uvicorn backend.app.api.main:app --reload