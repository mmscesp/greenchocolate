from __future__ import annotations

from pathlib import Path
from subprocess import run

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

    for source_name, target_name, max_width, quality in IMAGE_SPECS:
        optimize_image(source_name, target_name, max_width, quality)

    optimize_video()

    total_size = sum(path.stat().st_size for path in OUTPUT_DIR.glob('*') if path.is_file())
    print(f'Optimized assets written to {OUTPUT_DIR}')
    print(f'Total output size: {total_size / (1024 * 1024):.2f} MB')


if __name__ == '__main__':
    main()
