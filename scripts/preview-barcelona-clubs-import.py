"""Preview the first SCM Barcelona club-directory import batch.

This script does not write to the database. It reads the curated XLSX file,
normalizes the public-safe fields, ranks the first useful 50 rows, and writes
a JSON preview that can be reviewed before a real Prisma import exists.
"""

from __future__ import annotations

import json
import math
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "SCM_Barcelona_Clubs_list_v1.xlsx"
OUTPUT = ROOT / "output" / "barcelona-clubs-import-preview.json"
BUNDLED_PYTHON = (
    Path.home()
    / ".cache"
    / "codex-runtimes"
    / "codex-primary-runtime"
    / "dependencies"
    / "python"
    / "python.exe"
)

EXPECTED_COLUMNS = {
    "Rank",
    "Club Name",
    "Neighborhood",
    "District",
    "Google Rating",
    "Number of Reviews",
    "Address",
    "Google Maps URL",
    "Google Place ID",
    "SCM Page Slug",
    "Meta Title",
    "Meta Description",
    "⚠ Suspicious?",
}

LATITUDE_COLUMNS = ("Latitude", "latitude", "Lat", "lat")
LONGITUDE_COLUMNS = ("Longitude", "longitude", "Lng", "lng", "Lon", "lon")
BARCELONA_BOUNDS = {
    "north": 41.47,
    "south": 41.32,
    "east": 2.25,
    "west": 2.05,
}

PROHIBITED_PATTERNS = [
    r"\bguaranteed access\b",
    r"\binstant entry\b",
    r"\bbest weed clubs?\b",
    r"\bbuy weed\b",
    r"\bbuy your pass\b",
    r"\bpass now\b",
    r"\baccess tips?\b",
    r"\bvisitor info\b",
]


def import_pandas():
    try:
        import pandas as pd  # type: ignore
        import openpyxl  # noqa: F401  # type: ignore
    except ImportError as exc:
        if BUNDLED_PYTHON.exists() and Path(sys.executable).resolve() != BUNDLED_PYTHON.resolve():
            import os

            os.execv(str(BUNDLED_PYTHON), [str(BUNDLED_PYTHON), *sys.argv])

        raise SystemExit(
            "Missing pandas/openpyxl runtime. Use the bundled spreadsheet Python runtime "
            "or install dependencies with: python -m pip install pandas openpyxl"
        ) from exc

    return pd


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    if text.lower() in {"nan", "none", "null"}:
        return ""
    return re.sub(r"\s+", " ", text)


def clean_number(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if isinstance(value, (int, float)):
        return float(value)

    text = clean_text(value).replace(",", ".")
    if not text:
        return None

    try:
        return float(text)
    except ValueError:
        return None


def first_number(row: dict[str, Any], candidates: tuple[str, ...]) -> float | None:
    for key in candidates:
        if key in row:
            number = clean_number(row.get(key))
            if number is not None:
                return number
    return None


def is_valid_coordinate(latitude: float | None, longitude: float | None) -> bool:
    return (
        latitude is not None
        and longitude is not None
        and -90 <= latitude <= 90
        and -180 <= longitude <= 180
    )


def is_within_barcelona(latitude: float, longitude: float) -> bool:
    return (
        BARCELONA_BOUNDS["south"] <= latitude <= BARCELONA_BOUNDS["north"]
        and BARCELONA_BOUNDS["west"] <= longitude <= BARCELONA_BOUNDS["east"]
    )


def resolve_coordinate_metadata(row: dict[str, Any]) -> dict[str, Any]:
    latitude = first_number(row, LATITUDE_COLUMNS)
    longitude = first_number(row, LONGITUDE_COLUMNS)

    if latitude is None and longitude is None:
        return {
            "latitude": None,
            "longitude": None,
            "coordinateSource": None,
            "coordinateStatus": "missing",
        }

    if not is_valid_coordinate(latitude, longitude):
        return {
            "latitude": latitude,
            "longitude": longitude,
            "coordinateSource": "xlsx",
            "coordinateStatus": "needs_review",
        }

    if not is_within_barcelona(latitude, longitude):
        return {
            "latitude": latitude,
            "longitude": longitude,
            "coordinateSource": "xlsx",
            "coordinateStatus": "needs_review",
        }

    return {
        "latitude": latitude,
        "longitude": longitude,
        "coordinateSource": "xlsx",
        "coordinateStatus": "accepted",
    }


def normalize_slug(value: str, fallback_name: str) -> str:
    base = value or fallback_name
    normalized = (
        base.encode("ascii", "ignore")
        .decode("ascii")
        .lower()
    )
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    if not normalized.endswith("-barcelona"):
        normalized = f"{normalized}-barcelona"
    return normalized


def safe_meta_title(name: str, neighborhood: str) -> str:
    location = f"{neighborhood} Barcelona" if neighborhood else "Barcelona"
    return f"{name} {location} | Public Club Profile"


def safe_meta_description(name: str, neighborhood: str) -> str:
    location = f" in {neighborhood}, Barcelona" if neighborhood else " in Barcelona"
    return (
        f"Public SCM listing for {name}{location}. Review neighborhood context, "
        "verification status, legal guidance, and safety-first directory notes."
    )


def safe_short_description(name: str, neighborhood: str) -> str:
    location = f" in {neighborhood}" if neighborhood else ""
    return (
        f"{name} is listed as a public Barcelona club profile{location}. "
        "SCM has not completed an on-site verification review for this listing."
    )


def contains_prohibited_language(*values: str) -> list[str]:
    combined = " ".join(values).lower()
    matches: list[str] = []
    for pattern in PROHIBITED_PATTERNS:
        if re.search(pattern, combined):
            matches.append(pattern)
    return matches


def read_directory_sheet() -> list[dict[str, Any]]:
    pd = import_pandas()
    raw = pd.read_excel(SOURCE, sheet_name="📋 Club Directory", header=None)

    header_index = None
    for index, row in raw.iterrows():
        values = [clean_text(value) for value in row.tolist()]
        if "Club Name" in values and "Google Place ID" in values:
            header_index = index
            break

    if header_index is None:
        raise SystemExit("Could not locate the Club Directory header row in the XLSX file.")

    header = [clean_text(value) for value in raw.iloc[header_index].tolist()]
    missing = sorted(EXPECTED_COLUMNS - set(header))
    if missing:
        raise SystemExit(f"XLSX schema mismatch. Missing columns: {', '.join(missing)}")

    df = raw.iloc[header_index + 1 :].copy()
    df.columns = header
    df = df.dropna(how="all")
    return df.to_dict(orient="records")


def build_preview_row(row: dict[str, Any]) -> dict[str, Any]:
    name = clean_text(row.get("Club Name"))
    neighborhood = clean_text(row.get("Neighborhood"))
    district = clean_text(row.get("District"))
    slug = normalize_slug(clean_text(row.get("SCM Page Slug")), name)
    rating = row.get("Google Rating")
    reviews = row.get("Number of Reviews")
    suspicious = clean_text(row.get("⚠ Suspicious?"))
    source_meta_title = clean_text(row.get("Meta Title"))
    source_meta_description = clean_text(row.get("Meta Description"))
    unsafe_matches = contains_prohibited_language(source_meta_title, source_meta_description)
    coordinate_metadata = resolve_coordinate_metadata(row)

    quality_score = 0
    quality_score += 20 if name else 0
    quality_score += 15 if neighborhood else 0
    quality_score += 15 if district else 0
    quality_score += 20 if clean_text(row.get("Google Place ID")) else 0
    quality_score += 15 if clean_text(row.get("Address")) else 0
    quality_score += 10 if clean_text(row.get("Google Maps URL")) else 0
    quality_score += 5 if not unsafe_matches else 0

    hold_reasons: list[str] = []
    if not name:
        hold_reasons.append("missing_name")
    if not neighborhood or not district:
        hold_reasons.append("missing_neighborhood_or_district")
    if "suspicious" in suspicious.lower() or suspicious.startswith("⚠"):
        hold_reasons.append("suspicious_row")

    return {
        "slug": slug,
        "name": name,
        "status": "UNVERIFIED",
        "listingTier": "STANDARD",
        "neighborhood": neighborhood,
        "district": district,
        "city": "Barcelona",
        "addressDisplay": clean_text(row.get("Address")),
        "googlePlaceId": clean_text(row.get("Google Place ID")),
        "googleMapsUrl": clean_text(row.get("Google Maps URL")),
        **coordinate_metadata,
        "website": clean_text(row.get("Website")) or None,
        "instagram": clean_text(row.get("Instagram Handle")) or None,
        "googleRatingSnapshot": float(rating) if str(rating).replace(".", "", 1).isdigit() else None,
        "googleReviewCountSnapshot": int(reviews) if str(reviews).replace(".", "", 1).isdigit() else None,
        "primaryKeyword": clean_text(row.get("Primary SEO Keyword")),
        "metaTitle": safe_meta_title(name, neighborhood),
        "metaDescription": safe_meta_description(name, neighborhood),
        "shortDescription": safe_short_description(name, neighborhood),
        "description": (
            f"{safe_short_description(name, neighborhood)} Public source data can change, "
            "and this profile should be treated as a starting point for research rather than a promise of access."
        ),
        "publicDataSource": "SCM Barcelona Clubs XLSX v1 + public map references",
        "publicDataReviewedAt": datetime.now(timezone.utc).isoformat(),
        "dataQualityScore": quality_score,
        "unsafeSourceMetadataMatches": unsafe_matches,
        "holdReasons": hold_reasons,
        "readyForImport": len(hold_reasons) == 0,
    }


def main() -> int:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source XLSX: {SOURCE}")

    rows = read_directory_sheet()
    previews = [build_preview_row(row) for row in rows]
    duplicate_slugs = sorted(
        slug
        for slug in {row["slug"] for row in previews}
        if sum(1 for row in previews if row["slug"] == slug) > 1
    )

    for row in previews:
        if row["slug"] in duplicate_slugs:
            row["holdReasons"].append("duplicate_slug")
            row["readyForImport"] = False

    ready = [row for row in previews if row["readyForImport"]]
    held = [row for row in previews if not row["readyForImport"]]
    selected = ready[:50]

    payload = {
        "source": str(SOURCE.relative_to(ROOT)),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "totalRows": len(previews),
        "readyRows": len(ready),
        "heldRows": len(held),
        "selectedBatchSize": len(selected),
        "duplicateSlugs": duplicate_slugs,
        "policy": {
            "defaultStatus": "UNVERIFIED",
            "onlyVerifiedAtLaunch": "club-311-barcelona",
            "googlePlacesPhotos": "not cached or stored",
            "publicCopy": "SCM-safe metadata generated from source rows",
        },
        "selected": selected,
        "held": held,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")
    print(f"Selected {len(selected)} ready rows; held {len(held)} rows; duplicate slugs: {len(duplicate_slugs)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
