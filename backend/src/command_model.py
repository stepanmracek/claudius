import string
from typing import Any
from pydantic import BaseModel

class CommandModel(BaseModel):
    command: string
    args: list[Any]
    kwargs: dict[str, Any]
