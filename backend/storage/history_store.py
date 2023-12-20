from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List
from urllib.parse import urlparse
import hashlib

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _history_path(url: str) -> Path:
    parsed = urlparse(url)
    key_source = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    hashed = hashlib.sha256(key_source.encode("utf-8")).hexdigest()[:16]
    filename = f"history_{hashed}.json"
    return DATA_DIR / filename


def _read_history_file(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_history_file(path: Path, items: List[Dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(items, handle, indent=2)


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


async def append_history(record: Dict[str, Any]) -> None:
    url = record.get("url", "")
    path = _history_path(url)

    def _append() -> None:
        items = _read_history_file(path)
        record.setdefault("timestamp", _utc_now_iso())
        items.append(record)
        _write_history_file(path, items)

    await asyncio.to_thread(_append)


async def list_history() -> List[Dict[str, Any]]:
    def _list_all() -> List[Dict[str, Any]]:
        if not DATA_DIR.exists():
            return []
        items: List[Dict[str, Any]] = []
        for path in DATA_DIR.glob("history_*.json"):
            items.extend(_read_history_file(path))
        items.sort(key=lambda item: item.get("timestamp", ""), reverse=True)
        return items

    return await asyncio.to_thread(_list_all)


async def delete_history_item(test_id: str) -> bool:
    def _delete() -> bool:
        if not DATA_DIR.exists():
            return False
        deleted = False
        for path in DATA_DIR.glob("history_*.json"):
            items = _read_history_file(path)
            filtered = [item for item in items if item.get("id") != test_id]
            if len(filtered) != len(items):
                _write_history_file(path, filtered)
                deleted = True
        return deleted

    return await asyncio.to_thread(_delete)
