import json
import os

# Create heroes directory
os.makedirs('heroes', exist_ok=True)

with open('data/satorimeta_heroes_full.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

heroes = data.get('heroes', [])

for hero in heroes:
    slug = hero['slug']
    ja_name = hero.get('nameJapanese', hero['name'])
    
    html_content = f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=../hero_detail.html?id={slug}">
  <title>{ja_name} ({hero['name']}) 個別英雄図鑑 | Last Asylum Wiki</title>
  <script>
    window.location.href = "../hero_detail.html?id={slug}";
  </script>
</head>
<body>
  <p><a href="../hero_detail.html?id={slug}">{ja_name} の詳細ページに移動します...</a></p>
</body>
</html>
"""
    with open(f"heroes/{slug}.html", 'w', encoding='utf-8') as out:
        out.write(html_content)

print(f"Generated {len(heroes)} hero static pages in heroes/")
