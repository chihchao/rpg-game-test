# 《智械學園：AI 覺醒調查錄》美術圖片素材清單

本文件列出開發此 RPG 對話遊戲所需的全部視覺圖片素材，並提供可直接複製使用的 **AI 繪圖提示詞（Prompts）**（適用於 Midjourney、DALL-E 3 或 Stable Diffusion），確保整體美術風格統一為「日系清新校園科技風（Anime Visual Novel Style）」。

---

## 一、 關卡背景圖（Backgrounds）
* **建議尺寸比例**：16:9（例如 `1920x1080` 或 `1280x720`）
* **共通風格前綴**：`Anime visual novel background, clean digital art, bright futuristic Taiwanese high school, Makoto Shinkai lighting style, no characters, --ar 16:9`

| 編號 | 檔案名稱 | 關卡與場景名稱 | 畫面描述與用途 | AI 繪圖提示詞（可直接複製） |
| :--- | :--- | :--- | :--- | :--- |
| **BG_01** | `bg_school_gate.png` | 序章：新星實驗中學・校門口廣場 | 現代化的台灣高中校門口，有全息投影的歡迎看板與人臉辨識閘門，陽光灑落，充滿科技感。 | `Anime visual novel background, modern futuristic Taiwanese high school gate, holographic welcome sign, smart facial recognition turnstiles, cherry blossom trees, bright morning sunlight, clean digital art, no characters, --ar 16:9` |
| **BG_02** | `bg_tech_lobby.png` | 第一關：科技大樓・一樓大廳 | 寬敞明亮的建築大廳，有玻璃自動門、幾台自動販賣機、一台正在工作的圓盤型掃地機器人。 | `Anime visual novel background, bright futuristic school building lobby, automatic glass sliding doors, modern vending machines, a small round robot vacuum on the shiny floor, soft indoor lighting, clean digital art, no characters, --ar 16:9` |
| **BG_03** | `bg_cafeteria.png` | 第二關：智慧學生餐廳 | 乾淨的現代校園餐廳，取餐區有電子螢幕顯示菜單，桌上放著幾杯綠色香菜珍珠奶茶的誇張特寫元素。 | `Anime visual novel background, modern high school cafeteria, digital menu screens showing weird food, clean tables, bright daylight through large windows, anime background art, no characters, --ar 16:9` |
| **BG_04** | `bg_server_room.png` | 第三關：廣播室與中央機房 | 充滿藍色 LED 光條的伺服器機櫃室，中央有一個大型全息投影控制台，螢幕閃爍著微弱的紅色警告光。 | `Anime visual novel background, futuristic school server room and broadcasting studio, glowing blue server racks, central holographic control console with subtle red warning alerts, dramatic sci-fi lighting, no characters, --ar 16:9` |
| **BG_05** | `bg_rooftop.png` | 終章：學校頂樓・天文觀測台 | 傍晚黃昏時分的學校頂樓，有白色的圓頂天文觀測台與安全圍欄，遠方是現代化台灣城市的夕陽天際線。 | `Anime visual novel background, high school rooftop observatory at golden hour sunset, white astronomical dome, metal safety fence, futuristic Taipei city skyline in distance, warm emotional lighting, no characters, --ar 16:9` |

---

## 二、 角色立繪（Character Sprites）
* **建議尺寸比例**：3:4 或 1:1 透明背景 PNG（生成後需去背處理）
* **共通風格設定**：半身像（Bust-up / Half-body），日系動漫立繪風格，白底方便去背。

| 編號 | 檔案名稱 | 角色名稱與表情 | 畫面描述與用途 | AI 繪圖提示詞（可直接複製） |
| :--- | :--- | :--- | :--- | :--- |
| **CH_01A** | `char_emma_normal.png` | 艾瑪（Emma）- 一般微笑 | 台灣高中女學姊，高馬尾，戴藍色細框光學眼鏡，穿著白色與深藍色科技風制服，自信微笑。 | `Anime character sprite, half body, Taiwanese high school girl, high ponytail, thin blue futuristic glasses, sleek white and navy blue school uniform, confident friendly smile, isolated on solid white background, visual novel style` |
| **CH_01B** | `char_emma_think.png` | 艾瑪（Emma）- 思考推眼鏡 | 同上角色，單手輕推眼鏡，表情認真思考，用於解釋 AI 原理時。 | `Anime character sprite, half body, Taiwanese high school girl, high ponytail, adjusting thin blue futuristic glasses with one hand, serious analytical expression, white and navy school uniform, isolated on solid white background, visual novel style` |
| **CH_02A** | `char_azhe_normal.png` | 阿哲（A-Zhe）- 開朗 | 微胖可愛的台灣高中男生，脖子掛著耳機，領帶微歪，笑容燦爛。 | `Anime character sprite, half body, chubby cute Taiwanese high school boy, headphones around neck, slightly messy tie, school uniform, cheerful energetic smile, isolated on solid white background, visual novel style` |
| **CH_02B** | `char_azhe_panic.png` | 阿哲（A-Zhe）- 驚慌流汗 | 同上角色，張大嘴巴驚訝流汗，雙手舉起，用於誤以為機器人要統治世界時。 | `Anime character sprite, half body, chubby cute Taiwanese high school boy, headphones around neck, panicked shocked expression with anime sweat drops, hands raised, school uniform, isolated on solid white background, visual novel style` |
| **CH_03A** | `char_zhibot_normal.png` | 小智（Zhi-Bot）- 正常藍光 | 懸浮在空中的白色圓球型可愛 AI 機器人，臉部螢幕顯示藍色的微笑顏文字 `^_^`。 | `Cute floating spherical white AI robot mascot, sleek futuristic design, glowing blue LED screen face showing happy eyes, isolated on solid white background, anime game asset` |
| **CH_03B** | `char_zhibot_error.png` | 小智（Zhi-Bot）- 系統異常紅光 | 同上機器人，臉部螢幕變成紅色警告標誌與暈眩符號 `@_@`，周圍有微弱電流火花。 | `Cute floating spherical white AI robot mascot, malfunctioning, glowing red warning screen face with dizzy symbols, small electric sparks, isolated on solid white background, anime game asset` |
| **CH_04** | `char_teacher_lin.png` | 林老師（Teacher Lin）- 溫和 | 30多歲台灣男老師，戴黑框眼鏡，白襯衫配卡其色針織背心，拿著平板電腦，溫和微笑。 | `Anime character sprite, half body, kind Taiwanese male teacher in his 30s, black glasses, white shirt with khaki knit vest, holding a digital tablet, warm encouraging smile, isolated on solid white background, visual novel style` |
| **CH_05** | `char_hacker_senior.png` | 神秘駭客學長 - 神秘 | 穿著連帽外套、戴著半臉數位口罩的高中男生，雙手插口袋，眼神略帶挑釁但無惡意。 | `Anime character sprite, half body, mysterious high school boy wearing a dark tech hoodie over uniform, digital LED half-mask, hands in pockets, cool smirk, isolated on solid white background, visual novel style` |

---

## 三、 關鍵道具與證物圖示（Items & CG Illustrations）
* **建議尺寸比例**：1:1（正方形圖示，用於對話框中央彈出展示）

| 編號 | 檔案名稱 | 道具名稱 | 畫面描述與用途 | AI 繪圖提示詞（可直接複製） |
| :--- | :--- | :--- | :--- | :--- |
| **IT_01** | `item_dog_id.png` | 誤判的辨識紀錄 | 平板螢幕畫面，顯示一隻台灣黑狗的照片，旁邊標註「系統判定：校長（相似度 88%）」。 | `Game item icon, digital tablet screen showing a cute black dog photo with a futuristic green facial recognition box labeled PRINCIPAL 88%, clean anime UI art, isolated on white background` |
| **IT_02** | `item_cilantro_tea.png` | 恐怖的香菜珍珠奶茶 | 一杯裝滿綠色香菜葉與黑色珍珠的奶茶，散發詭異的綠光（第二關關鍵道具）。 | `Anime food illustration, a plastic cup of bubble tea overflowing with fresh green cilantro leaves and black tapioca pearls, comedic glowing aura, clean digital art, isolated on white background` |
| **IT_03** | `item_fake_notice.png` | 破綻百出的假公文 | 一份電子公文，上面蓋著模糊的印章，文字混雜著奇怪的亂碼與荒謬的年份。 | `Game item icon, futuristic holographic document showing official school notice with glitching text and a weird blurry red stamp, anime visual novel prop, isolated on white background` |
| **IT_04** | `item_ai_badge.png` | 數位素養認證徽章 | 閃耀著金藍色光芒的盾牌型數位徽章，中央有一個大腦與電路板結合的圖案。 | `Game achievement badge icon, glowing gold and cyber-blue shield emblem, brain circuit icon in the center, shiny metallic texture, isolated on white background` |