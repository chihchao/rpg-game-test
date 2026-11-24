#!/usr/bin/env python3
"""
《智械學園：AI 覺醒調查錄》- 自動化批次生圖腳本
透過 colab-text-to-image 依序生成背景、角色立繪（自動去背）與關鍵道具。
"""

import subprocess
import json
import os
import shutil
import sys

T2I_SCRIPT = os.path.expanduser("~/.claude/skills/colab-text-to-image/scripts/t2i.py")

TASKS = [
  # -----------------------------------------------------------------
  # 1. 場景背景 (Backgrounds - 768x432, 16:9)
  # -----------------------------------------------------------------
  {
    "type": "bg",
    "name": "bg_tech_lobby",
    "prompt": "Anime visual novel background, bright futuristic school building lobby, automatic glass sliding doors, modern vending machines, a small round robot vacuum on the shiny floor, soft indoor lighting, clean digital art, no characters",
    "width": 768,
    "height": 432,
    "remove_bg": False,
    "dest_dir": "assets/images/backgrounds",
    "dest_filename": "bg_tech_lobby.png"
  },
  {
    "type": "bg",
    "name": "bg_cafeteria",
    "prompt": "Anime visual novel background, modern high school cafeteria, digital menu screens showing weird food, clean tables, bright daylight through large windows, anime background art, no characters",
    "width": 768,
    "height": 432,
    "remove_bg": False,
    "dest_dir": "assets/images/backgrounds",
    "dest_filename": "bg_cafeteria.png"
  },
  {
    "type": "bg",
    "name": "bg_server_room",
    "prompt": "Anime visual novel background, futuristic school server room and broadcasting studio, glowing blue server racks, central holographic control console with subtle red warning alerts, dramatic sci-fi lighting, no characters",
    "width": 768,
    "height": 432,
    "remove_bg": False,
    "dest_dir": "assets/images/backgrounds",
    "dest_filename": "bg_server_room.png"
  },
  {
    "type": "bg",
    "name": "bg_rooftop",
    "prompt": "Anime visual novel background, high school rooftop observatory at golden hour sunset, white astronomical dome, metal safety fence, futuristic Taipei city skyline in distance, warm emotional lighting, no characters",
    "width": 768,
    "height": 432,
    "remove_bg": False,
    "dest_dir": "assets/images/backgrounds",
    "dest_filename": "bg_rooftop.png"
  },

  # -----------------------------------------------------------------
  # 2. 角色立繪 (Character Sprites - 512x640, 去背)
  # -----------------------------------------------------------------
  {
    "type": "char",
    "name": "char_emma_normal",
    "prompt": "Anime character sprite, half body, Taiwanese high school girl, high ponytail, thin blue futuristic glasses, sleek white and navy blue school uniform, confident friendly smile, isolated on solid white background, visual novel style, full body, centered",
    "width": 512,
    "height": 640,
    "remove_bg": True,
    "dest_dir": "assets/images/characters",
    "dest_filename": "char_emma_normal.png"
  },
  {
    "type": "char",
    "name": "char_emma_think",
    "prompt": "Anime character sprite, half body, Taiwanese high school girl, high ponytail, adjusting thin blue futuristic glasses with one hand, serious analytical expression, white and navy school uniform, isolated on solid white background, visual novel style, full body, centered",
    "width": 512,
    "height": 640,
    "remove_bg": True,
    "dest_dir": "assets/images/characters",
    "dest_filename": "char_emma_think.png"
  },
  {
    "type": "char",
    "name": "char_azhe_normal",
    "prompt": "Anime character sprite, half body, chubby cute Taiwanese high school boy, headphones around neck, slightly messy tie, school uniform, cheerful energetic smile, isolated on solid white background, visual novel style, full body, centered",
    "width": 512,
    "height": 640,
    "remove_bg": True,
    "dest_dir": "assets/images/characters",
    "dest_filename": "char_azhe_normal.png"
  },
  {
    "type": "char",
    "name": "char_azhe_panic",
    "prompt": "Anime character sprite, half body, chubby cute Taiwanese high school boy, headphones around neck, panicked shocked expression with anime sweat drops, hands raised, school uniform, isolated on solid white background, visual novel style, full body, centered",
    "width": 512,
    "height": 640,
    "remove_bg": True,
    "dest_dir": "assets/images/characters",
    "dest_filename": "char_azhe_panic.png"
  },
  {
    "type": "char",
    "name": "char_zhibot_normal",
    "prompt": "Cute floating spherical white AI robot mascot, sleek futuristic design, glowing blue LED screen face showing happy eyes, isolated on solid white background, anime game asset, full body, centered",
    "width": 512,
    "height": 512,
    "remove_bg": True,
    "dest_dir": "assets/images/characters",
    "dest_filename": "char_zhibot_normal.png"
  },
  {
    "type": "char",
    "name": "char_zhibot_error",
    "prompt": "Cute floating spherical white AI robot mascot, malfunctioning, glowing red warning screen face with dizzy symbols, small electric sparks, isolated on solid white background, anime game asset, full body, centered",
    "width": 512,
    "height": 512,
    "remove_bg": True,
    "dest_dir": "assets/images/characters",
    "dest_filename": "char_zhibot_error.png"
  },
  {
    "type": "char",
    "name": "char_teacher_lin",
    "prompt": "Anime character sprite, half body, kind Taiwanese male teacher in his 30s, black glasses, white shirt with khaki knit vest, holding a digital tablet, warm encouraging smile, isolated on solid white background, visual novel style, full body, centered",
    "width": 512,
    "height": 640,
    "remove_bg": True,
    "dest_dir": "assets/images/characters",
    "dest_filename": "char_teacher_lin.png"
  },
  {
    "type": "char",
    "name": "char_hacker_senior",
    "prompt": "Anime character sprite, half body, mysterious high school boy wearing a dark tech hoodie over uniform, digital LED half-mask, hands in pockets, cool smirk, isolated on solid white background, visual novel style, full body, centered",
    "width": 512,
    "height": 640,
    "remove_bg": True,
    "dest_dir": "assets/images/characters",
    "dest_filename": "char_hacker_senior.png"
  },

  # -----------------------------------------------------------------
  # 3. 關鍵道具與證物 (Items - 512x512, 去背)
  # -----------------------------------------------------------------
  {
    "type": "item",
    "name": "item_dog_id",
    "prompt": "Game item icon, digital tablet screen showing a cute black dog photo with a futuristic green facial recognition box labeled PRINCIPAL 88%, clean anime UI art, isolated on white background",
    "width": 512,
    "height": 512,
    "remove_bg": True,
    "dest_dir": "assets/images/items",
    "dest_filename": "item_dog_id.png"
  },
  {
    "type": "item",
    "name": "item_cilantro_tea",
    "prompt": "Anime food illustration, a plastic cup of bubble tea overflowing with fresh green cilantro leaves and black tapioca pearls, comedic glowing aura, clean digital art, isolated on white background",
    "width": 512,
    "height": 512,
    "remove_bg": True,
    "dest_dir": "assets/images/items",
    "dest_filename": "item_cilantro_tea.png"
  },
  {
    "type": "item",
    "name": "item_fake_notice",
    "prompt": "Game item icon, futuristic holographic document showing official school notice with glitching text and a weird blurry red stamp, anime visual novel prop, isolated on white background",
    "width": 512,
    "height": 512,
    "remove_bg": True,
    "dest_dir": "assets/images/items",
    "dest_filename": "item_fake_notice.png"
  },
  {
    "type": "item",
    "name": "item_ai_badge",
    "prompt": "Game achievement badge icon, glowing gold and cyber-blue shield emblem, brain circuit icon in the center, shiny metallic texture, isolated on white background",
    "width": 512,
    "height": 512,
    "remove_bg": True,
    "dest_dir": "assets/images/items",
    "dest_filename": "item_ai_badge.png"
  }
]

def run_task(task):
  os.makedirs(task["dest_dir"], exist_ok=True)
  target_file = os.path.join(task["dest_dir"], task["dest_filename"])
  if os.path.exists(target_file):
    print(f"[SKIP] 檔案已存在：{target_file}")
    return True

  print(f"\n==========================================")
  print(f"[GENERATE] 正在繪製：{task['name']} ({task['type']})")
  print(f"提示詞: {task['prompt']}")
  print(f"尺寸: {task['width']}x{task['height']}, 去背: {task['remove_bg']}")
  print(f"==========================================")

  cmd = [
    "python3", T2I_SCRIPT, "generate",
    "-p", task["prompt"],
    "-m", "sdxl-turbo",
    "-W", str(task["width"]),
    "-H", str(task["height"]),
    "-o", task["dest_dir"],
    "--json"
  ]
  if task["remove_bg"]:
    cmd.append("--remove-bg")

  res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
  
  if res.returncode != 0:
    print(f"[ERROR] 執行失敗 (exit {res.returncode}): {res.stderr}")
    return False

  try:
    data = json.loads(res.stdout)
    if not data.get("ok"):
      print(f"[ERROR] 生成失敗: {data}")
      return False

    img_info = data["images"][0]
    # 若有去背，優先使用 nobg_path
    if task["remove_bg"] and "nobg_path" in img_info:
      src_path = img_info["nobg_path"]
    else:
      src_path = img_info["path"]

    shutil.copy2(src_path, target_file)
    print(f"[SUCCESS] 成功儲存為：{target_file} (CLIP Score: {img_info.get('checks', {}).get('clip_score', 'N/A')})")
    return True
  except Exception as e:
    print(f"[EXCEPTION] 解析結果失敗: {e}\nstdout: {res.stdout}")
    return False

def main():
  total = len(TASKS)
  success_count = 0
  for i, task in enumerate(TASKS, 1):
    print(f"\n進度: [{i}/{total}]")
    if run_task(task):
      success_count += 1
    else:
      print(f"[WARN] 任務 {task['name']} 失敗，稍後可手動重試")

  print(f"\n==========================================")
  print(f"批次生成完成！成功：{success_count}/{total}")
  print(f"關閉 Colab 閒置 Session...")
  subprocess.run(["python3", T2I_SCRIPT, "stop", "--json"])
  print(f"Session 已順利釋放！")

if __name__ == "__main__":
  main()
