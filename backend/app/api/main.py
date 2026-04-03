from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from backend.app.anime_profile.final_reccomendations_dict import prepare_dictionary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recommendations_data/")
async def get_recommendations(
    show_sequels: bool = Query(True),
    experimental_mode: bool = Query(False),
    show_18_rated: bool = Query(True),

    tag_importance: str = Query("medium"),
    popularity_importance: str = Query("medium"),

    min_number_episodes: int = Query(1, ge=1),
    max_number_episodes: int = Query(9999),

    min_release_year: int = Query(1900),
    max_release_year: int = Query(datetime.now().year),

    min_mean_score: int = Query(0),

    show_selected_studios: Optional[List[str]] = Query(None),
    show_selected_tags: Optional[List[str]] = Query(None),
    hide_selected_tags: Optional[List[str]] = Query(None),
    show_selected_genres: Optional[List[str]] = Query(None),
    hide_selected_genres: Optional[List[str]] = Query(None),

    media_types: Optional[List[str]] = Query(["TV", "MOVIE", "OVA", "SPECIAL"])
):
    filters = {
        "show_sequels" : show_sequels,
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
    }
    data = prepare_dictionary(filters)

    return data
# by uruchomic w folderze anime-recommender: python -m uvicorn backend.app.api.main:app --reload
#dane sa w: http://127.0.0.1:8000/recommendations_data