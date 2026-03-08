from __future__ import annotations

from pathlib import Path
from subprocess import run
import re

from PIL import Image, ImageOps
import imageio_ffmpeg


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / 'public' / 'images' / 'FOTOS 311'
OUTPUT_DIR = ROOT / 'public' / 'images' / 'clubs' / 'club-311'

IMAGE_SPECS = [
    ('MAT00513.jpg', 'hero.webp', 1800, 80),
    ('MAT00492.jpg', 'gallery-lounge.webp', 1400, 78),
    ('MAT00493.jpg', 'gallery-cinema.webp', 1400, 78),
    ('MAT00532.jpg', 'gallery-mural.webp', 1400, 78),
    ('MAT00506.jpg', 'gallery-main-room.webp', 1400, 78),
    ('MAT00560.jpg', 'gallery-sofas.webp', 1400, 78),
    ('MAT00554.jpg', 'gallery-corner.webp', 1400, 78),
    ('MAT00551.jpg', 'gallery-table.webp', 1400, 78),
    ('MAT00518.jpg', 'gallery-art.webp', 1400, 78),
]

AUTO_IMAGE_MAX_WIDTH = 1400
AUTO_IMAGE_QUALITY = 76

# Skip auto-added source photos that are perceptually near-identical to a kept photo.
AUTO_DEDUPE_DHASH_THRESHOLD = 1

VIDEO_SOURCE = SOURCE_DIR / 'IMG_4511.MP4'
VIDEO_WEBM = OUTPUT_DIR / 'club-tour.webm'
VIDEO_MP4 = OUTPUT_DIR / 'club-tour.mp4'
VIDEO_POSTER = OUTPUT_DIR / 'poster.webp'


def optimize_image(source_name: str, target_name: str, max_width: int, quality: int) -> None:
    source_path = SOURCE_DIR / source_name
    target_path = OUTPUT_DIR / target_name

    with Image.open(source_path) as img:
        image = ImageOps.exif_transpose(img).convert('RGB')
        if image.width > max_width:
            ratio = max_width / image.width
            image = image.resize(
                (max_width, int(image.height * ratio)),
                Image.Resampling.LANCZOS,
            )
        image.save(
            target_path,
            format='WEBP',
            quality=quality,
            method=6,
        )


def slugify_image_stem(stem: str) -> str:
    normalized = re.sub(r'[^a-zA-Z0-9]+', '-', stem.lower()).strip('-')
    return normalized or 'image'


def compute_source_dhash(source_path: Path, size: int = 8) -> int:
    with Image.open(source_path) as img:
        image = ImageOps.exif_transpose(img).convert('L').resize((size + 1, size), Image.Resampling.LANCZOS)
        pixels = list(image.getdata())

    result = 0
    bit = 0
    row_width = size + 1

    for y in range(size):
        row = y * row_width
        for x in range(size):
            if pixels[row + x] > pixels[row + x + 1]:
                result |= 1 << bit
            bit += 1

    return result


def hamming_distance(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def build_full_image_specs() -> tuple[list[tuple[str, str, int, int]], list[str]]:
    curated_sources = {source_name for source_name, *_ in IMAGE_SPECS}
    full_specs = list(IMAGE_SPECS)

    kept_hashes: list[int] = []
    for source_name in curated_sources:
        kept_hashes.append(compute_source_dhash(SOURCE_DIR / source_name))

    skipped_sources: list[str] = []

    for source_path in sorted(SOURCE_DIR.glob('*.jpg'), key=lambda path: path.name.lower()):
        if source_path.name in curated_sources:
            continue

        source_hash = compute_source_dhash(source_path)
        is_duplicate = any(
            hamming_distance(source_hash, existing_hash) <= AUTO_DEDUPE_DHASH_THRESHOLD
            for existing_hash in kept_hashes
        )

        if is_duplicate:
            skipped_sources.append(source_path.name)
            continue

        target_name = f"gallery-{slugify_image_stem(source_path.stem)}.webp"
        full_specs.append((source_path.name, target_name, AUTO_IMAGE_MAX_WIDTH, AUTO_IMAGE_QUALITY))
        kept_hashes.append(source_hash)

    return full_specs, skipped_sources


def run_ffmpeg(args: list[str]) -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    completed = run([ffmpeg, *args], check=False, cwd=str(ROOT))
    if completed.returncode != 0:
        raise SystemExit(completed.returncode)


def optimize_video() -> None:
    run_ffmpeg([
        '-y',
        '-i', str(VIDEO_SOURCE),
        '-vf', "scale='min(720,iw)':-2",
        '-c:v', 'libvpx-vp9',
        '-b:v', '0',
        '-crf', '44',
        '-row-mt', '1',
        '-deadline', 'good',
        '-cpu-used', '4',
        '-an',
        str(VIDEO_WEBM),
    ])

    run_ffmpeg([
        '-y',
        '-i', str(VIDEO_SOURCE),
        '-vf', "scale='min(720,iw)':-2",
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '32',
        '-movflags', '+faststart',
        '-an',
        str(VIDEO_MP4),
    ])

    run_ffmpeg([
        '-y',
        '-ss', '00:00:02',
        '-i', str(VIDEO_SOURCE),
        '-frames:v', '1',
        '-vf', "scale='min(1400,iw)':-2",
        str(VIDEO_POSTER),
    ])


def main() -> None:
    if not SOURCE_DIR.exists():
        raise SystemExit(f'Missing source directory: {SOURCE_DIR}')

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    full_image_specs, skipped_sources = build_full_image_specs()

    for source_name, target_name, max_width, quality in full_image_specs:
        optimize_image(source_name, target_name, max_width, quality)

    optimize_video()

    total_size = sum(path.stat().st_size for path in OUTPUT_DIR.glob('*') if path.is_file())
    print(f'Optimized assets written to {OUTPUT_DIR}')
    print(f'Image assets optimized: {len(full_image_specs)}')
    print(f'Auto-deduped sources skipped: {len(skipped_sources)}')
    print(f'Total output size: {total_size / (1024 * 1024):.2f} MB')


if __name__ == '__main__':
    main()
