from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.app.anime_profile.final_recommendations_dict import prepare_dictionary, fetch_raw_user_data
from backend.app.user_profile.create_user_interests_profile import create_user_interests_profile
from backend.app.api.exceptions import register_exception_handlers

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

# Uruchomienie: python -m uvicorn backend.app.api.main:app --reload