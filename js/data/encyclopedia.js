/**
 * 《智械學園：AI 覺醒調查錄》AI 百科圖鑑與關鍵證物資料庫
 */
const GAME_ENCYCLOPEDIA = {
  concepts: [
    {
      id: "concept_cv",
      title: "電腦視覺 (Computer Vision)",
      category: "核心技術",
      icon: "👁️",
      summary: "讓電腦學會「看」的技術，透過演算法分析影像像素並識別物體。",
      detail: "電腦視覺是人工智慧的重要分支。電腦看到的圖片本質上是紅綠藍（RGB）數值矩陣，透過卷積神經網路（CNN）等模型，系統能從像素中找出邊緣、輪廓進而辨識出物件或人臉。",
      chapterUnlocked: 0
    },
    {
      id: "concept_feature",
      title: "特徵提取 (Feature Extraction)",
      category: "機器學習",
      icon: "🔍",
      summary: "從龐大資料中找出最關鍵的特徵屬性以進行辨識判斷。",
      detail: "在影像辨識中，系統會提取顏色、眼睛間距、形狀等特徵。若特徵提取過於片面（例如把黑毛與項圈當作校長西裝與領帶），就會導致嚴重的誤判。",
      chapterUnlocked: 0
    },
    {
      id: "concept_rule_vs_ai",
      title: "規則驅動 vs 數據驅動",
      category: "基礎觀念",
      icon: "⚖️",
      summary: "傳統程式仰賴人工撰寫的 If-Else 規則；AI 則從海量數據中自主歸納模式。",
      detail: "傳統自動化（如紅外線自動門、計算機）只執行預設條件，沒有學習與預測能力；現代 AI 系統（如辨識手寫字、智慧助理）則是透過統計學習模型進行推論。",
      chapterUnlocked: 1
    },
    {
      id: "concept_gigo",
      title: "垃圾進，垃圾出 (GIGO)",
      category: "資料品質",
      icon: "🗑️",
      summary: "Garbage In, Garbage Out。餵給模型有偏見或錯誤的資料，就會得到荒謬的預測結果。",
      detail: "AI 本身沒有道德觀念與常識直覺，它完全反映訓練資料庫的分布。若資料庫充滿惡作劇極端值（如香菜珍奶大量五星好評），AI 就會判定其為最優解。",
      chapterUnlocked: 2
    },
    {
      id: "concept_data_bias",
      title: "資料偏見 (Dataset Bias)",
      category: "資料品質",
      icon: "📊",
      summary: "訓練資料集缺乏代表性或多樣性時，導致模型產生歧視或系統性誤差。",
      detail: "如果訓練人臉辨識模型只用特定族群的照片，系統對其他族群的辨識率就會大幅降低。資料的均衡與客觀性至關重要。",
      chapterUnlocked: 2
    },
    {
      id: "concept_generative_ai",
      title: "生成式 AI (Generative AI)",
      category: "尖端技術",
      icon: "🎨",
      summary: "能夠主動創造文字、圖片、音樂與影片的人工智慧模型。",
      detail: "利用大型語言模型（LLM）或擴散模型（Diffusion Models），根據使用者的提示詞（Prompt）預測下一個最可能的字詞或像素，產生全新內容。",
      chapterUnlocked: 3
    },
    {
      id: "concept_hallucination",
      title: "AI 幻覺 (Hallucination)",
      category: "生成風險",
      icon: "😵‍💫",
      summary: "AI 產生看起來言之鑿鑿、合乎語法，但實際上完全虛構且違背事實的內容。",
      detail: "大型語言模型本質是機率文本生成器，並非真正理解世界。因此可能會引用不存在的法條、虛構歷史事件（如「1895 年太空總署公文」）。",
      chapterUnlocked: 3
    },
    {
      id: "concept_deepfake",
      title: "深偽技術 (Deepfake)",
      category: "資訊倫理",
      icon: "🎭",
      summary: "利用深度學習技術合成高度逼真的虛假人臉、聲音與影片。",
      detail: "深偽技術常被用於換臉與語音仿冒，容易被不法人士用來散布假訊息或進行詐騙。我們必須透過多方管道與事實查核工具來驗證真相。",
      chapterUnlocked: 3
    },
    {
      id: "concept_ai_ethics",
      title: "人機協作與 AI 倫理",
      category: "核心素養",
      icon: "🤝",
      summary: "AI 是人類智慧的延伸與輔助工具，決策主導權與道德責任仍在人類身上。",
      detail: "在使用 AI 時，人類應保持同理心、審慎查證，並遵循公平性、透明性與隱私保護原則，讓科技真正造福社會。",
      chapterUnlocked: 4
    }
  ],

  items: [
    {
      id: "item_dog_id",
      name: "誤判的辨識紀錄",
      chapter: 0,
      icon: "🐕",
      image: "assets/images/items/item_dog_id.png",
      description: "校門口人臉辨識閘門的日誌截圖。系統把校狗小黑的項圈辨識為領帶，相似度高達 88%，並顯示「歡迎校長」。",
      clue: "證明 AI 特徵提取如果缺乏足夠的多樣性樣本，會產生嚴重的過度推論。"
    },
    {
      id: "item_cilantro_tea",
      name: "香菜珍珠奶茶分析報告",
      chapter: 2,
      icon: "🧋",
      image: "assets/images/items/item_cilantro_tea.png",
      description: "AI 營養師根據近期點餐回饋產生的「最佳推薦飲品」。檢視資料集發現有人連續灌入 5000 筆香菜珍奶滿分評分。",
      clue: "典型 GIGO（垃圾進，垃圾出）現象的實體證物，可用於反駁 AI 營養師的錯誤決策。"
    },
    {
      id: "item_fake_notice",
      name: "破綻百出的假公文",
      chapter: 3,
      icon: "📜",
      image: "assets/images/items/item_fake_notice.png",
      description: "宣稱取消體育課改為發呆課的校長公告。內文引用了「1895年太空總署法規」，且蓋有模糊扭曲的偽造電子章。",
      clue: "生成式 AI 幻覺與語音 Deepfake 攻擊的確鑿證據，充滿時間邏輯破綻。"
    },
    {
      id: "item_ai_badge",
      name: "數位素養認證徽章",
      chapter: 4,
      icon: "🛡️",
      image: "assets/images/items/item_ai_badge.png",
      description: "林老師頒發給完成所有調查任務學生的榮譽徽章，代表具備批判性思維與人機協作能力。",
      clue: "通過智慧校園考核的終極象徵。"
    }
  ]
};
