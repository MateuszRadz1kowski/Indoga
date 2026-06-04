from fastapi import Request
from fastapi.responses import JSONResponse



class AniRecException(Exception):
    def __init__(self, error_code: str, detail: str, status_code: int = 400):
        self.error_code = error_code
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class UserNotFoundException(AniRecException):
    def __init__(self, username: str, platform: str = ""):
        super().__init__(
            error_code="user_not_found",
            detail=f"User '{username}' was not found on {platform}.",
            status_code=404,
        )


class PrivateProfileException(AniRecException):
    def __init__(self, username: str):
        super().__init__(
            error_code="private_profile",
            detail=f"The profile of '{username}' is private.",
            status_code=403,
        )


class EmptyListException(AniRecException):
    def __init__(self, username: str):
        super().__init__(
            error_code="empty_list",
            detail=f"'{username}' has no watchable entries in their list.",
            status_code=422,
        )


class DatabaseException(AniRecException):
    def __init__(self, detail: str = "Database is unavailable."):
        super().__init__(
            error_code="db_error",
            detail=detail,
            status_code=503,
        )


class RateLimitException(AniRecException):
    def __init__(self, source: str = "AniList"):
        super().__init__(
            error_code="rate_limit",
            detail=f"{source} is rate limiting requests. Please wait a moment.",
            status_code=429,
        )



def register_exception_handlers(app):
    @app.exception_handler(AniRecException)
    async def anirec_exception_handler(request: Request, exc: AniRecException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error_code": exc.error_code,
                "detail": exc.detail,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        print(f"[UNHANDLED ERROR] {type(exc).__name__}: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "error_code": "server_error",
                "detail": "An unexpected server error occurred.",
            },
        )