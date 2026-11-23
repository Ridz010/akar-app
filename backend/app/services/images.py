import base64
import io
from dataclasses import dataclass

from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.errors import AppError

ACCEPTED_FORMATS = {"JPEG", "PNG", "WEBP", "MPO"}
STORAGE_MAX_SIDE = 1600
MODEL_MAX_SIDE = 1024


def invalid_image() -> AppError:
    return AppError(400, "invalid_image", "Format foto harus JPG, PNG, atau WebP.")


CENTER_CROP_RATIO = 0.8


@dataclass(frozen=True)
class PreparedImage:
    storage_jpeg: bytes
    model_data_urls: list[str]


def _to_jpeg(image: Image.Image, max_side: int, quality: int) -> bytes:
    copy = image.copy()
    copy.thumbnail((max_side, max_side))
    buffer = io.BytesIO()
    copy.save(buffer, format="JPEG", quality=quality, optimize=True)
    return buffer.getvalue()


def _center_crop(image: Image.Image) -> Image.Image:
    width, height = image.size
    crop_w, crop_h = int(width * CENTER_CROP_RATIO), int(height * CENTER_CROP_RATIO)
    left, top = (width - crop_w) // 2, (height - crop_h) // 2
    return image.crop((left, top, left + crop_w, top + crop_h))


def _data_url(image: Image.Image) -> str:
    jpeg = _to_jpeg(image, MODEL_MAX_SIDE, 85)
    return "data:image/jpeg;base64," + base64.b64encode(jpeg).decode("ascii")


def prepare_image(data: bytes) -> PreparedImage:
    try:
        with Image.open(io.BytesIO(data)) as probe:
            if probe.format not in ACCEPTED_FORMATS:
                raise invalid_image()
            probe.verify()
        with Image.open(io.BytesIO(data)) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
    except (UnidentifiedImageError, OSError, SyntaxError) as exc:
        raise invalid_image() from exc

    return PreparedImage(
        storage_jpeg=_to_jpeg(image, STORAGE_MAX_SIDE, 85),
        model_data_urls=[_data_url(image), _data_url(_center_crop(image))],
    )
