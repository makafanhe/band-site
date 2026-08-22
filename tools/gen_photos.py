import os
import json

FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'photos')
EXT = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'}

names = [f for f in os.listdir(FOLDER) if os.path.splitext(f)[1].lower() in EXT]
names.sort()

out = os.path.join(FOLDER, 'photos.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(names, f, ensure_ascii=False, indent=2)

print(f'已收录 {len(names)} 张照片 -> photos/photos.json')
