from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
CITY_DIR = ROOT / 'public' / 'images' / 'cities'
QUALITY = 80


def human_size(size_bytes: int) -> str:
    units = ['B', 'KB', 'MB', 'GB']
    value = float(size_bytes)
    for unit in units:
        if value < 1024 or unit == units[-1]:
            return f'{value:.2f} {unit}'
        value /= 1024
    return f'{size_bytes} B'


def convert_image(source: Path, quality: int) -> tuple[Path, int, int]:
    target = source.with_suffix('.webp')

    with Image.open(source) as image:
        normalized = ImageOps.exif_transpose(image).convert('RGB')
        normalized.save(
            target,
            format='WEBP',
            quality=quality,
            method=6,
        )

    return target, source.stat().st_size, target.stat().st_size


def main() -> None:
    if not CITY_DIR.exists():
        raise SystemExit(f'Missing city images directory: {CITY_DIR}')

    sources = sorted(CITY_DIR.glob('*-city.jpg'), key=lambda p: p.name.lower())
    if not sources:
        raise SystemExit(f'No matching files found in {CITY_DIR} (expected *-city.jpg)')

    total_before = 0
    total_after = 0

    print(f'Converting {len(sources)} city image(s) to WebP at quality={QUALITY}')

    for source in sources:
        target, before, after = convert_image(source, QUALITY)
        total_before += before
        total_after += after

        delta_pct = ((after - before) / before) * 100 if before > 0 else 0.0
        print(
            f'- {source.name} -> {target.name} | '
            f'{human_size(before)} -> {human_size(after)} ({delta_pct:+.1f}%)'
        )

    total_delta_pct = ((total_after - total_before) / total_before) * 100 if total_before > 0 else 0.0
    print('---')
    print(f'Total: {human_size(total_before)} -> {human_size(total_after)} ({total_delta_pct:+.1f}%)')


if __name__ == '__main__':
    main()
