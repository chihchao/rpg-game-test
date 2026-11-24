/**
 * 《智械學園：AI 覺醒調查錄》完整劇情分支腳本
 */
const GAME_STORY = {
  // 章節目錄資訊
  chapters: [
    {
      index: 0,
      name: "序章",
      title: "失控的智慧校園",
      location: "校門口廣場",
      bg: "bg_school_gate",
      summary: "人臉辨識閘門把校狗當成校長？初探電腦視覺與特徵提取！"
    },
    {
      index: 1,
      name: "第一關",
      title: "自動門還是人工智慧？",
      location: "科技大樓・一樓大廳",
      bg: "bg_tech_lobby",
      summary: "阿哲驚慌大喊自動門要統治世界！學會區分傳統規則與數據驅動。"
    },
    {
      index: 2,
      name: "第二關",
      title: "香菜珍奶的秘密",
      location: "智慧學生餐廳",
      bg: "bg_cafeteria",
      summary: "午餐全是香菜珍珠奶茶？揭開 GIGO 與資料偏見的荒謬真相！"
    },
    {
      index: 3,
      name: "第三關",
      title: "真假難辨的校長廣播",
      location: "廣播室與中央機房",
      bg: "bg_server_room",
      summary: "明天起全校只准發呆？識破生成式 AI 幻覺與 Deepfake 假公文！"
    },
    {
      index: 4,
      name: "終章",
      title: "人機協作的未來",
      location: "學校頂樓・天文觀測台",
      bg: "bg_rooftop",
      summary: "校園系統恢復正常！在夕陽下與夥伴共同確立人機共存的原則。"
    }
  ],

  // 劇本節點
  nodes: {
    // -------------------------------------------------------------
    // 【序章：失控的智慧校園】
    // -------------------------------------------------------------
    "start": {
      chapter: 0,
      bg: "bg_school_gate",
      speaker: "旁白",
      speakerRole: "系統",
      avatar: null,
      text: "西元 2035 年，新星智慧實驗中學。今天是新學期的第一天，身為「科技糾察隊」實習生的你，正懷著期待的心情走向校門...",
      next: "prologue_gate_glitch"
    },
    "prologue_gate_glitch": {
      chapter: 0,
      bg: "bg_school_gate",
      speaker: "校門口智慧閘門",
      speakerRole: "中央管理系統",
      avatar: "zhibot_normal",
      position: "center",
      sfx: "sfx_alert",
      text: "【嘟——系統掃描中】嗶！人臉特徵比對完成！\n特徵匹配：全黑毛髮、炯炯有神圓眼、脖頸配戴黑色飾品（判定為黑色領帶）。\n歡迎！尊敬的校長先生，請進！",
      next: "prologue_dog_bark"
    },
    "prologue_dog_bark": {
      chapter: 0,
      bg: "bg_school_gate",
      speaker: "校狗小黑",
      speakerRole: "吉祥物",
      avatar: null,
      text: "汪！汪汪！（校狗小黑搖著尾巴，大搖大擺地穿過自動感應門，嘴裡還叼著半根熱狗）",
      next: "prologue_emma_intro"
    },
    "prologue_emma_intro": {
      chapter: 0,
      bg: "bg_school_gate",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_normal",
      position: "right",
      text: "哎呀呀，一開學中央系統就鬧出這種大烏龍！學弟/學妹，你注意到了嗎？閘門的「人臉辨識系統」竟然把校狗認成校長了！",
      next: "prologue_choice_1"
    },
    "prologue_choice_1": {
      chapter: 0,
      bg: "bg_school_gate",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_think",
      position: "right",
      text: "身為科技糾察隊的成員，以你的觀察，為什麼高科技的 AI 視覺系統會犯下這種荒謬的錯誤呢？",
      choices: [
        {
          text: "因為系統只提取了片面特徵（黑毛、項圈像領帶），缺乏足夠樣本與多樣性驗證！",
          logic: 15,
          ethics: 5,
          feedback: "艾瑪推了推眼鏡：「完全正確！AI 依靠『特徵提取』來做模式比對，如果訓練資料庫裡只有戴領帶的校長，模型就容易把項圈誤判為領帶！」",
          next: "prologue_unlock_dog"
        },
        {
          text: "因為相機解析度太差，AI 被小黑的可愛給迷惑了！",
          logic: 0,
          ethics: 5,
          feedback: "艾瑪忍不住笑了：「哈哈，小黑確實很可愛！不過 AI 是冰冷的數學模型，它沒有審美觀，純粹是因為特徵比對的權重出了偏差喔！」",
          next: "prologue_unlock_dog"
        },
        {
          text: "一定是校長平常長得太像小黑了...",
          logic: -5,
          ethics: -5,
          feedback: "艾瑪輕輕敲了你的頭：「噓！這話要是被訓導主任聽到，你開學第一天就要去勞動服務了啦！」",
          next: "prologue_unlock_dog"
        }
      ]
    },
    "prologue_unlock_dog": {
      chapter: 0,
      bg: "bg_school_gate",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_normal",
      position: "right",
      unlockConcept: "concept_cv",
      unlockItem: "item_dog_id",
      sfx: "sfx_evidence_get",
      text: "我已經把這筆誤判的系統日誌擷取下來了，收錄進你的【AI 百科圖鑑】與【證物欄】裡。這項技術屬於「電腦視覺」，記住，AI 的『看』本質上只是矩陣數值運算！",
      next: "prologue_zhibot_appearance"
    },
    "prologue_zhibot_appearance": {
      chapter: 0,
      bg: "bg_school_gate",
      speaker: "小智 (Zhi-Bot)",
      speakerRole: "校園中央 AI",
      avatar: "char_zhibot_error",
      position: "center",
      sfx: "sfx_glitch",
      text: "【警告：代號 ERR-001】資料流衝突...校內各子系統數值異常浮動...請科技糾察隊儘速前往【科技大樓一樓大廳】與【智慧學生餐廳】檢修...",
      next: "prologue_end"
    },
    "prologue_end": {
      chapter: 0,
      bg: "bg_school_gate",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_think",
      position: "right",
      text: "看來不只是校門口，整個校園的 AI 都開始出現連鎖異常了。走吧，我們先去大廳看看阿哲那邊又發生了什麼事！",
      next: "ch1_start"
    },

    // -------------------------------------------------------------
    // 【第一關：自動門還是人工智慧？】
    // -------------------------------------------------------------
    "ch1_start": {
      chapter: 1,
      bg: "bg_tech_lobby",
      speaker: "阿哲",
      speakerRole: "驚慌失措的同學",
      avatar: "char_azhe_panic",
      position: "left",
      sfx: "sfx_alert",
      text: "救命啊啊啊！大代誌啦！剛剛我一走過來，那扇玻璃自動門居然自己打開了！連販賣機投幣後都會自己掉飲料出來！AI 已經產生自我意識要佔領學校啦！",
      next: "ch1_emma_sigh"
    },
    "ch1_emma_sigh": {
      chapter: 1,
      bg: "bg_tech_lobby",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_think",
      position: "right",
      text: "（無奈扶額）阿哲又開始神經兮兮了。學弟/學妹，請你用理性的分析，好好開導一下阿哲，別讓他把所有『自動化機器』都當成『人工智慧』！",
      next: "ch1_choice_rule_vs_ai"
    },
    "ch1_choice_rule_vs_ai": {
      chapter: 1,
      bg: "bg_tech_lobby",
      speaker: "主角",
      speakerRole: "科技糾察隊",
      avatar: null,
      text: "面對嚇破膽的阿哲，你決定怎麼向他解釋「自動門」與「AI」的差別？",
      choices: [
        {
          text: "阿哲冷靜點！自動門只是裝了紅外線感應器，執行傳統程式的 If-Else 條件（有人靠近就開門），沒有自主學習能力！",
          logic: 15,
          ethics: 5,
          feedback: "阿哲抓了抓頭：「咦？所以只要符合預設條件就動，就算自動門壞掉也只會依固定規則反應，不會自己學新東西囉？」",
          next: "ch1_quiz_device_sorting"
        },
        {
          text: "你說得對，其實自動門正在默默紀錄每個人的步態，準備寫進毀滅人類名冊...",
          logic: -10,
          ethics: -5,
          feedback: "艾瑪瞪了你一眼：「別跟著他一起胡鬧啦！阿哲快要嚇哭了！」",
          next: "ch1_quiz_device_sorting"
        },
        {
          text: "只要會插電或裝電池自己動的東西，理論上都算是一種 AI 吧？",
          logic: -5,
          ethics: 0,
          feedback: "艾瑪打斷道：「不對喔！這是很多人的常見迷思。傳統機器只遵循固定的死板規則，AI 則具備數據驅動的模式識別與適應能力。」",
          next: "ch1_quiz_device_sorting"
        }
      ]
    },
    "ch1_quiz_device_sorting": {
      chapter: 1,
      bg: "bg_tech_lobby",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_normal",
      position: "right",
      unlockConcept: "concept_rule_vs_ai",
      sfx: "sfx_correct",
      text: "為了徹底破除阿哲的迷思，我們來做個快速分類測驗！大廳裡有四種設備：【紅外線自動門】、【傳統計算機】、【智慧掃地機器人（具避障與建圖學習）】、【手機語音助理（Siri/小智）】。",
      next: "ch1_question_node"
    },
    "ch1_question_node": {
      chapter: 1,
      bg: "bg_tech_lobby",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_think",
      position: "right",
      text: "請指出以下哪一組設備屬於『人工智慧（數據與學習驅動）』，而非『純粹規則驅動的傳統程式』？",
      choices: [
        {
          text: "智慧掃地機器人、手機語音助理",
          logic: 20,
          ethics: 5,
          feedback: "太棒了！掃地機器人透過感測器資料持續學習並建構空間地圖；語音助理透過自然語言模型理解人類意圖，這些才是真正的 AI！",
          next: "ch1_azhe_relief"
        },
        {
          text: "紅外線自動門、傳統計算機",
          logic: -10,
          ethics: 0,
          feedback: "艾瑪提醒：「這兩者都是最典型的 If-Else 規則與固定算術晶片，並沒有學習能力喔！」",
          next: "ch1_azhe_relief"
        },
        {
          text: "只要有螢幕顯示的都是 AI",
          logic: -5,
          ethics: 0,
          feedback: "艾瑪苦笑：「有沒有螢幕跟它背後是不是 AI 演算法完全沒有關係啦！」",
          next: "ch1_azhe_relief"
        }
      ]
    },
    "ch1_azhe_relief": {
      chapter: 1,
      bg: "bg_tech_lobby",
      speaker: "阿哲",
      speakerRole: "迷糊同學",
      avatar: "char_azhe_normal",
      position: "left",
      text: "呼～原來是我自己嚇自己！那我就放心了...對了，既然沒危險，我們快去餐廳吧！今天我超期待午餐的炸豬排便當呢！",
      next: "ch2_start"
    },

    // -------------------------------------------------------------
    // 【第二關：香菜珍奶的秘密】
    // -------------------------------------------------------------
    "ch2_start": {
      chapter: 2,
      bg: "bg_cafeteria",
      speaker: "智慧餐廳點餐機",
      speakerRole: "AI 營養配膳系統",
      avatar: "char_zhibot_error",
      position: "center",
      sfx: "sfx_glitch",
      text: "【今日唯一指定特餐】高纖維綠能超營養組合：特濃香菜珍珠奶茶（加香菜、去冰、滿糖）！每位學生配發三杯，禁止更換菜色！",
      next: "ch2_azhe_crying"
    },
    "ch2_azhe_crying": {
      chapter: 2,
      bg: "bg_cafeteria",
      speaker: "阿哲",
      speakerRole: "崩潰的同學",
      avatar: "char_azhe_panic",
      position: "left",
      text: "嗚哇哇哇！我的香酥炸豬排呢？為什麼整間餐廳全是綠油油的香菜茶啊？！這種東西喝下去我會昇天啦！",
      next: "ch2_investigate"
    },
    "ch2_investigate": {
      chapter: 2,
      bg: "bg_cafeteria",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_think",
      position: "right",
      text: "等等，中央廚房的配餐 AI 是根據全校學生的「點餐評分回饋」來推薦最佳飲食的。我剛調出後台資料庫，你來看看這份資料哪裡不對勁！",
      next: "ch2_choice_gigo"
    },
    "ch2_choice_gigo": {
      chapter: 2,
      bg: "bg_cafeteria",
      speaker: "主角",
      speakerRole: "科技糾察隊",
      avatar: null,
      text: "後台日誌顯示：近三天內突然湧入 5000 筆來自同一組 IP 的「香菜珍奶 5 星滿分」評分，而日常便當的數據都被惡意灌上 1 星。",
      choices: [
        {
          text: "這就是經典的『垃圾進，垃圾出 (GIGO)』！資料庫被惡意灌水，導致模型產生極端偏見！",
          logic: 15,
          ethics: 10,
          feedback: "艾瑪大力點頭：「沒錯！AI 沒有味蕾也沒有常識，它只懂看統計數字。既然訓練集裡全都是香菜的滿分紀錄，它就天真地以為全校同學最愛香菜！」",
          next: "ch2_action_cleaning"
        },
        {
          text: "AI 真是太聰明了，它一定算出了香菜具有超強的抗氧化排毒功能！",
          logic: -5,
          ethics: 0,
          feedback: "阿哲在一旁吐舌頭：「就算排毒我也絕對不喝滿滿香菜的奶茶啦！」",
          next: "ch2_action_cleaning"
        },
        {
          text: "直接把伺服器插頭拔掉，換一台全新的 AI 主機就能解決問題。",
          logic: -5,
          ethics: 0,
          feedback: "艾瑪搖頭：「換了新模型，如果依然餵給它有毒的偏見資料，結果還是一模一樣的喔！」",
          next: "ch2_action_cleaning"
        }
      ]
    },
    "ch2_action_cleaning": {
      chapter: 2,
      bg: "bg_cafeteria",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_normal",
      position: "right",
      unlockConcept: "concept_gigo",
      unlockItem: "item_cilantro_tea",
      sfx: "sfx_evidence_get",
      text: "成功取得【香菜珍珠奶茶分析報告】證物！我們現在立即執行「資料清理（Data Cleaning）」，把惡意洗榜的極端異常值（Outliers）剔除，並重新權重平衡！",
      next: "ch2_success"
    },
    "ch2_success": {
      chapter: 2,
      bg: "bg_cafeteria",
      speaker: "智慧餐廳點餐機",
      speakerRole: "AI 營養配膳系統",
      avatar: "char_zhibot_normal",
      position: "center",
      sfx: "sfx_correct",
      text: "【資料庫重構完成】消除異常偏差數據...重新計算營養均衡模型...恢復供應日式炸豬排飯、烤鯖魚便當與新鮮果汁！",
      next: "ch2_to_ch3"
    },
    "ch2_to_ch3": {
      chapter: 2,
      bg: "bg_cafeteria",
      speaker: "阿哲",
      speakerRole: "開心的同學",
      avatar: "char_azhe_normal",
      position: "left",
      text: "太棒啦！我的炸豬排得救了！正義與健康必勝！...等等，天花板上的廣播喇叭怎麼突然開始滋滋作響了？",
      next: "ch3_start"
    },

    // -------------------------------------------------------------
    // 【第三關：真假難辨的校長廣播】
    // -------------------------------------------------------------
    "ch3_start": {
      chapter: 3,
      bg: "bg_server_room",
      speaker: "校長廣播（擬真語音）",
      speakerRole: "全校緊急廣播",
      avatar: null,
      sfx: "sfx_alert",
      text: "【緊急全校通告】各位老師與同學，我是校長。考量全校升學壓力，本校自即日起廢除所有體育課與戶外活動，全部改為在教室『發呆冥想』。公文即刻生效！",
      next: "ch3_fake_notice"
    },
    "ch3_fake_notice": {
      chapter: 3,
      bg: "bg_server_room",
      speaker: "艾瑪",
      speakerRole: "資訊社社長 / 學姊",
      avatar: "char_emma_think",
      position: "right",
      unlockItem: "item_fake_notice",
      sfx: "sfx_evidence_get",
      text: "這聲音聽起來跟校長簡直一模一樣！但內容太反常了！我剛剛截獲了廣播附帶的數位公文，上面寫著：『依據 1895 年太空總署國際發呆公約第 87 條辦理』...",
      next: "ch3_hacker_appear"
    },
    "ch3_hacker_appear": {
      chapter: 3,
      bg: "bg_server_room",
      speaker: "神秘駭客學長",
      speakerRole: "伺服器入侵者",
      avatar: "char_hacker_senior",
      position: "left",
      text: "哼哼哼...被你們發現啦？這可是我用最新的生成式 AI 與 Deepfake 語音複製模型做出來的傑作。全校師生現在都在歡呼不用跑大隊接力了呢！",
      next: "ch3_debate_1"
    },
    "ch3_debate_1": {
      chapter: 3,
      bg: "bg_server_room",
      speaker: "主角",
      speakerRole: "科技糾察隊",
      avatar: null,
      text: "面對洋洋得意的駭客學長，你必須指出這份廣播與公文的三大致命破綻！",
      choices: [
        {
          text: "破綻一：1895年根本沒有太空總署，這是生成式 AI 常見的『一本正經胡說八道（AI 幻覺）』！",
          logic: 15,
          ethics: 10,
          feedback: "駭客學長眉頭一皺：「嘖...沒想到你居然有做事實查核（Fact-checking）！」",
          next: "ch3_debate_2"
        },
        {
          text: "破綻是校長的聲音比平常更性感動聽！",
          logic: -5,
          ethics: 0,
          feedback: "艾瑪苦笑：「重點不是聲線好不好聽，而是音訊是透過訓練好的 Deepfake 模型合成的虛假語音啊！」",
          next: "ch3_debate_2"
        },
        {
          text: "只要是校長說的，不管是真是假我們都要遵守！",
          logic: -10,
          ethics: -10,
          feedback: "艾瑪認真糾正：「在數位時代，盲從權威最危險！面對可疑訊息必須主動求證來源。」",
          next: "ch3_debate_2"
        }
      ]
    },
    "ch3_debate_2": {
      chapter: 3,
      bg: "bg_server_room",
      speaker: "神秘駭客學長",
      speakerRole: "伺服器入侵者",
      avatar: "char_hacker_senior",
      position: "left",
      unlockConcept: "concept_hallucination",
      text: "好吧，就算公文年代有 bug，那又怎樣？現在 AI 什麼都能自動生成，好玩不就好了？這項技術遲早會取代所有創作者跟校長啦！",
      choices: [
        {
          text: "深偽技術（Deepfake）如果被濫用在偽造身分與詐騙，會摧毀社會的信任基礎！科技必須具備倫理底線！",
          logic: 10,
          ethics: 20,
          feedback: "駭客學長沉默了片刻：「...你說得對。我本來只是想測試學校系統的安全防護，沒考慮到引起全校恐慌的後果。」",
          next: "ch3_resolution"
        },
        {
          text: "只要能讓我不用上體育課，AI 騙人也沒差啦！",
          logic: -10,
          ethics: -20,
          feedback: "艾瑪嚴肅地說：「這種想法非常危險！今天騙的是體育課，明天可能就是轉移帳戶財產或名譽抹黑了！」",
          next: "ch3_resolution"
        }
      ]
    },
    "ch3_resolution": {
      chapter: 3,
      bg: "bg_server_room",
      speaker: "神秘駭客學長",
      speakerRole: "伺服器入侵者",
      avatar: "char_hacker_senior",
      position: "left",
      unlockConcept: "concept_deepfake",
      sfx: "sfx_correct",
      text: "受教了，科技糾察隊的學弟妹。我現在就撤銷偽造的廣播日誌，並把伺服器權限交還給你們。希望你們能打造一個真正健全的 AI 校園！",
      next: "ch4_start"
    },

    // -------------------------------------------------------------
    // 【終章：人機協作的未來】
    // -------------------------------------------------------------
    "ch4_start": {
      chapter: 4,
      bg: "bg_rooftop",
      speaker: "林老師",
      speakerRole: "資訊科技科教師",
      avatar: "char_teacher_lin",
      position: "center",
      text: "辛苦你們了！校門口、餐廳與伺服器機房的混亂都已經順利平息。夕陽下的天文台風景真美呢。",
      next: "ch4_zhibot_restart"
    },
    "ch4_zhibot_restart": {
      chapter: 4,
      bg: "bg_rooftop",
      speaker: "小智 (Zhi-Bot)",
      speakerRole: "校園中央 AI",
      avatar: "char_zhibot_normal",
      position: "left",
      sfx: "sfx_correct",
      text: "【中央核心重啟完成】所有認知偏差已校正。小智向全體調查員致謝！\n請問玩家：在歷經這場冒險後，您認為『人類與人工智慧』最適當的關係是什麼呢？",
      next: "ch4_final_choice"
    },
    "ch4_final_choice": {
      chapter: 4,
      bg: "bg_rooftop",
      speaker: "主角",
      speakerRole: "科技糾察隊",
      avatar: null,
      text: "請選擇你對人機協作未來的核心信念：",
      choices: [
        {
          text: "AI 是人類強大的協同與輔助工具；人類必須保有最終判斷權、倫理責任與溫暖同理心！",
          logic: 20,
          ethics: 20,
          feedback: "林老師微笑點頭：「說得太好了！這正是科技教育最核心的精神：科技源自於人性，亦受惠於人性！」",
          next: "ch4_badge_ceremony"
        },
        {
          text: "人類思考太容易出錯了，不如把所有決策權都交給 AI 統一管理！",
          logic: -10,
          ethics: -15,
          feedback: "林老師認真提醒：「AI 缺乏真正的同理心與價值判斷，將所有決策盲目交出，會引發更嚴重的體制風險喔！」",
          next: "ch4_badge_ceremony"
        },
        {
          text: "AI 太危險了，我們應該立刻把所有電腦砸掉，回歸純手工紙筆生活！",
          logic: -15,
          ethics: -5,
          feedback: "艾瑪笑著說：「因噎廢食可不是明智的做法，學會負責任地駕馭工具才是關鍵！」",
          next: "ch4_badge_ceremony"
        }
      ]
    },
    "ch4_badge_ceremony": {
      chapter: 4,
      bg: "bg_rooftop",
      speaker: "林老師",
      speakerRole: "資訊科技科教師",
      avatar: "char_teacher_lin",
      position: "center",
      unlockItem: "item_ai_badge",
      unlockConcept: "concept_ai_ethics",
      sfx: "sfx_badge",
      text: "在此我以資訊科技教師的身分，正式頒發【數位素養認證徽章】給你！恭喜你順利通過智械學園的所有考驗，成為一名優秀的 AI 數位公民！",
      next: "game_ending"
    },
    "game_ending": {
      chapter: 4,
      bg: "bg_rooftop",
      speaker: "系統",
      speakerRole: "冒險結算",
      avatar: null,
      text: "【調查任務達成】點擊下方按鈕，查看您的結算報告、成就稱號與結業證書！",
      isEnding: true
    }
  }
};
