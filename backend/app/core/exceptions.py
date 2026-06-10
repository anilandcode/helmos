class HelmOSError(Exception):
    status_code: int = 500
    detail: str = "Internal server error"


class NotFoundError(HelmOSError):
    status_code = 404
    detail = "Resource not found"
