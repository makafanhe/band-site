import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'photos')
ORIGIN = os.path.join(ROOT, 'origin')
MAX_EDGE = 1600
QUALITY = 80
EXTS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'}


def main():
    os.makedirs(ORIGIN, exist_ok=True)
    if not os.path.isdir(ORIGIN):
        print(f'找不到原图文件夹：{ORIGIN}')
        print('请先把原始照片放进 photos/origin/ 文件夹再运行。')
        return

    total = 0
    for name in sorted(os.listdir(ORIGIN)):
        ext = os.path.splitext(name)[1].lower()
        if ext not in EXTS:
            continue
        src = os.path.join(ORIGIN, name)
        img = Image.open(src)
        img = img.convert('RGB')
        if max(img.size) > MAX_EDGE:
            img.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        base = os.path.splitext(name)[0]
        out = os.path.join(ROOT, base + '.webp')
        before = os.path.getsize(src)
        img.save(out, 'WEBP', quality=QUALITY, method=6)
        after = os.path.getsize(out)
        total += 1
        print(f'{name}: {before // 1024}KB -> {after // 1024}KB')

    if total:
        gen = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gen_photos.py')
        os.system(f'python3 "{gen}"')
        print('压缩完成，photos.json 已更新')
    else:
        print('photos/origin/ 里没有可处理的照片（支持 jpg/png/bmp/tiff）。')


if __name__ == '__main__':
    main()
