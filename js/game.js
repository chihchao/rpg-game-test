/**
 * 《智械學園：AI 覺醒調查錄》核心遊戲引擎
 */
class GameEngine {
  constructor() {
    // 遊戲核心數值
    this.logicScore = 50;
    this.ethicsScore = 50;
    this.currentChapter = 0;
    this.currentNodeId = "start";

    // 收集進度
    this.unlockedConcepts = new Set();
    this.unlockedItems = new Set();

    // 打字機狀態
    this.isTyping = false;
    this.typewriterTimer = null;
    this.currentFullText = "";
    this.displayedText = "";

    // DOM 元素快取
    this.dom = {};
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.loadState();
    this.renderHUD();
    this.loadNode(this.currentNodeId);
    console.log("🎮 智械學園遊戲引擎已成功啟動！");
  }

  cacheDOM() {
    this.dom = {
      // HUD
      chapterBadge: document.getElementById("hud-chapter-badge"),
      locationText: document.getElementById("hud-location-text"),
      logicBar: document.getElementById("hud-logic-bar"),
      logicVal: document.getElementById("hud-logic-val"),
      ethicsBar: document.getElementById("hud-ethics-bar"),
      ethicsVal: document.getElementById("hud-ethics-val"),
      btnEncyclopedia: document.getElementById("btn-encyclopedia"),
      btnItems: document.getElementById("btn-items"),
      btnMute: document.getElementById("btn-mute"),
      btnRestart: document.getElementById("btn-restart"),

      // Stage
      sceneBg: document.getElementById("scene-bg"),
      alertOverlay: document.getElementById("alert-overlay"),
      slotLeft: document.getElementById("char-slot-left"),
      slotCenter: document.getElementById("char-slot-center"),
      slotRight: document.getElementById("char-slot-right"),

      // Dialogue
      dialogueWrapper: document.getElementById("dialogue-wrapper"),
      dialogueBox: document.getElementById("dialogue-box"),
      speakerBox: document.getElementById("speaker-box"),
      speakerName: document.getElementById("speaker-name"),
      speakerRole: document.getElementById("speaker-role"),
      dialogueText: document.getElementById("dialogue-text"),
      advanceIndicator: document.getElementById("advance-indicator"),

      // Choice Panel
      choicePanel: document.getElementById("choice-panel"),

      // Modals
      modalOverlay: document.getElementById("modal-overlay"),
      modalTitle: document.getElementById("modal-title"),
      modalBody: document.getElementById("modal-body"),
      modalCloseBtn: document.getElementById("modal-close-btn")
    };
  }

  bindEvents() {
    // 點擊對話框推進劇情或略過打字機
    this.dom.dialogueBox.addEventListener("click", () => {
      gameAudio.initAudioContext();
      if (this.isTyping) {
        this.skipTypewriter();
      } else {
        this.advanceDialogue();
      }
    });

    // 鍵盤空白鍵 / Enter 鍵推進
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        if (!this.dom.choicePanel.classList.contains("active") &&
            !this.dom.modalOverlay.classList.contains("active")) {
          if (this.isTyping) {
            this.skipTypewriter();
          } else {
            this.advanceDialogue();
          }
        }
      }
    });

    // HUD 按鈕事件
    this.dom.btnEncyclopedia.addEventListener("click", () => {
      gameAudio.playSFX("sfx_click");
      this.openEncyclopediaModal();
    });

    this.dom.btnItems.addEventListener("click", () => {
      gameAudio.playSFX("sfx_click");
      this.openItemsModal();
    });

    this.dom.btnMute.addEventListener("click", () => {
      const isMuted = gameAudio.toggleMute();
      this.dom.btnMute.innerHTML = isMuted ? "🔇 靜音" : "🔊 音效";
      gameAudio.playSFX("sfx_click");
    });

    this.dom.btnRestart.addEventListener("click", () => {
      if (confirm("確定要重啟調查紀錄嗎？所有數值與收集進度將會重置。")) {
        gameAudio.playSFX("sfx_click");
        this.resetGame();
      }
    });

    this.dom.modalCloseBtn.addEventListener("click", () => {
      gameAudio.playSFX("sfx_click");
      this.closeModal();
    });

    this.dom.modalOverlay.addEventListener("click", (e) => {
      if (e.target === this.dom.modalOverlay) {
        this.closeModal();
      }
    });
  }

  // 載入對話節點
  loadNode(nodeId) {
    const node = GAME_STORY.nodes[nodeId];
    if (!node) {
      console.error(`節點不存在: ${nodeId}`);
      return;
    }

    this.currentNodeId = nodeId;
    this.currentChapter = node.chapter;

    // 播放背景音樂
    const chapterBgmMap = {
      0: "bgm_campus_daily",
      1: "bgm_campus_daily",
      2: "bgm_investigation",
      3: "bgm_system_glitch",
      4: "bgm_rooftop_sunset"
    };
    gameAudio.playBGM(chapterBgmMap[node.chapter]);

    // 播放指定音效
    if (node.sfx) {
      gameAudio.playSFX(node.sfx);
    }

    // 更新背景
    this.updateBackground(node.bg);

    // 更新警報特效
    if (node.sfx === "sfx_alert" || node.sfx === "sfx_glitch") {
      this.dom.alertOverlay.classList.add("active");
    } else {
      this.dom.alertOverlay.classList.remove("active");
    }

    // 解鎖概念與證物
    if (node.unlockConcept) {
      this.unlockConcept(node.unlockConcept);
    }
    if (node.unlockItem) {
      this.unlockItem(node.unlockItem);
    }

    // 更新發話者資訊
    this.updateSpeaker(node.speaker, node.speakerRole);

    // 更新立繪位置與表情
    this.updateCharacters(node.avatar, node.position);

    // 更新 HUD
    this.renderHUD();

    // 檢查是否為結局節點
    if (node.isEnding) {
      this.showEndingScreen();
      return;
    }

    // 開始打字機輸出文字
    this.startTypewriter(node.text, () => {
      // 文字顯示完成後的處理
      if (node.choices && node.choices.length > 0) {
        this.showChoices(node.choices);
      } else {
        this.dom.advanceIndicator.style.display = "block";
      }
    });
  }

  // 更新背景
  updateBackground(bgKey) {
    if (!bgKey) return;
    this.dom.sceneBg.className = `scene-background ${bgKey}`;
    // 若本機已有放置美術背景圖片，優先套用圖片
    const customImgPath = `assets/images/backgrounds/${bgKey}.png`;
    const testImg = new Image();
    testImg.src = customImgPath;
    testImg.onload = () => {
      this.dom.sceneBg.style.backgroundImage = `url('${customImgPath}')`;
    };
  }

  // 更新立繪展現
  updateCharacters(avatarKey, position) {
    const slots = [this.dom.slotLeft, this.dom.slotCenter, this.dom.slotRight];
    slots.forEach(slot => {
      slot.classList.remove("visible", "speaking");
      slot.innerHTML = "";
    });

    if (!avatarKey) return;

    let targetSlot = this.dom.slotCenter;
    if (position === "left") targetSlot = this.dom.slotLeft;
    if (position === "right") targetSlot = this.dom.slotRight;

    targetSlot.classList.add("visible", "speaking");

    // 立繪圖示與稱號映射表
    const avatarMeta = {
      "char_emma_normal": { name: "艾瑪", title: "資訊社社長", icon: "👩‍💼" },
      "char_emma_think": { name: "艾瑪", title: "邏輯推理中", icon: "🧐" },
      "char_azhe_normal": { name: "阿哲", title: "迷糊同學", icon: "😋" },
      "char_azhe_panic": { name: "阿哲", title: "極度驚恐", icon: "😱" },
      "char_zhibot_normal": { name: "小智", title: "校園中央 AI", icon: "🤖" },
      "char_zhibot_error": { name: "小智", title: "系統異常中", icon: "💥" },
      "char_teacher_lin": { name: "林老師", title: "資訊科技教師", icon: "👨‍🏫" },
      "char_hacker_senior": { name: "神秘學長", title: "伺服器駭客", icon: "🥷" }
    };

    const meta = avatarMeta[avatarKey] || { name: "角色", title: "NPC", icon: "👤" };

    // 嘗試讀取本地產生的圖片，若無圖片則使用日系擬真科技風立繪卡片
    const spriteImg = new Image();
    spriteImg.src = `assets/images/characters/${avatarKey}.png`;
    spriteImg.onload = () => {
      targetSlot.innerHTML = `<img src="${spriteImg.src}" alt="${meta.name}" />`;
    };
    spriteImg.onerror = () => {
      targetSlot.innerHTML = `
        <div class="character-placeholder">
          <div class="avatar-icon-large">${meta.icon}</div>
          <div class="char-title-tag">${meta.title}</div>
          <div class="char-name-tag">${meta.name}</div>
        </div>
      `;
    };
  }

  // 更新發話者資訊
  updateSpeaker(name, role) {
    if (!name || name === "旁白") {
      this.dom.speakerBox.style.display = "none";
    } else {
      this.dom.speakerBox.style.display = "flex";
      this.dom.speakerName.textContent = name;
      this.dom.speakerRole.textContent = role || "";
    }
  }

  // 打字機文字效果
  startTypewriter(text, callback) {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.isTyping = true;
    this.currentFullText = text;
    this.displayedText = "";
    this.dom.dialogueText.innerHTML = "";
    this.dom.advanceIndicator.style.display = "none";
    this.dom.choicePanel.classList.remove("active");

    let charIndex = 0;
    this.typewriterTimer = setInterval(() => {
      if (charIndex < text.length) {
        this.displayedText += text[charIndex];
        this.dom.dialogueText.innerHTML = this.highlightKeywords(this.displayedText);
        if (charIndex % 3 === 0) {
          gameAudio.playSFX("sfx_typewriter");
        }
        charIndex++;
      } else {
        this.finishTypewriter(callback);
      }
    }, 24);
  }

  // 略過打字機直接顯示全文
  skipTypewriter() {
    if (!this.isTyping) return;
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.displayedText = this.currentFullText;
    this.dom.dialogueText.innerHTML = this.highlightKeywords(this.displayedText);
    this.finishTypewriter();
  }

  finishTypewriter(callback) {
    this.isTyping = false;
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    const node = GAME_STORY.nodes[this.currentNodeId];

    if (node.choices && node.choices.length > 0) {
      this.showChoices(node.choices);
    } else if (!node.isEnding) {
      this.dom.advanceIndicator.style.display = "block";
    }

    if (callback) callback();
  }

  // 關鍵字高亮處理
  highlightKeywords(rawText) {
    const keywords = [
      "電腦視覺", "特徵提取", "規則驅動", "數據驅動", "人工智慧", "機器學習",
      "垃圾進，垃圾出", "GIGO", "資料偏見", "生成式 AI", "AI 幻覺", "深偽技術",
      "Deepfake", "人機協作", "事實查核"
    ];
    let formatted = rawText;
    keywords.forEach(kw => {
      const reg = new RegExp(kw, "g");
      formatted = formatted.replace(reg, `<span class="highlight-keyword">${kw}</span>`);
    });
    return formatted;
  }

  // 推進對話至下一個節點
  advanceDialogue() {
    const node = GAME_STORY.nodes[this.currentNodeId];
    if (node.choices && node.choices.length > 0) {
      // 有選擇分支時不可直接點擊前進
      return;
    }
    if (node.next) {
      gameAudio.playSFX("sfx_click");
      const nextNode = GAME_STORY.nodes[node.next];
      // 檢查是否跨章節，跨章節時觸發林老師隨堂測驗
      if (nextNode && nextNode.chapter > node.chapter) {
        this.triggerChapterQuiz(node.chapter, () => {
          this.loadNode(node.next);
        });
      } else {
        this.loadNode(node.next);
      }
    }
  }

  // 林老師章節隨堂評量測驗
  triggerChapterQuiz(chapterIndex, onComplete) {
    if (typeof GAME_QUESTIONS === "undefined" || !GAME_QUESTIONS.length) {
      if (onComplete) onComplete();
      return;
    }

    const chapterMeta = GAME_STORY.chapters[chapterIndex];
    const chapterName = chapterMeta ? chapterMeta.name : "序章";
    const availableQuestions = GAME_QUESTIONS.filter(q => q.chapter === chapterName);

    if (!availableQuestions.length) {
      if (onComplete) onComplete();
      return;
    }

    // 隨機抽選 2 題
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const quizQuestions = shuffled.slice(0, 2);
    let currentQuizIndex = 0;

    gameAudio.playSFX("sfx_alert");
    this.dom.modalOverlay.classList.add("active");

    const renderQuizQuestion = () => {
      const q = quizQuestions[currentQuizIndex];
      this.dom.modalTitle.innerHTML = `👨‍🏫 林老師的隨堂測驗・${chapterName}（第 ${currentQuizIndex + 1} / ${quizQuestions.length} 題）`;
      
      let html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(30,41,59,0.7); padding:16px; border-radius:10px; border-left:4px solid var(--color-primary);">
            <div style="font-size:0.85rem; color:var(--color-primary); font-weight:700; margin-bottom:6px;">
              📌 評量概念：${q.concept}
            </div>
            <div style="font-size:1.05rem; line-height:1.6; color:#f8fafc; font-weight:600;">
              ${q.question}
            </div>
          </div>

          <div id="quiz-options-box" style="display:flex; flex-direction:column; gap:10px;">
      `;

      q.options.forEach((opt, oIdx) => {
        html += `
          <button class="choice-btn quiz-opt-btn" data-idx="${oIdx}" style="padding:12px 18px; font-size:0.95rem;">
            <span class="choice-badge">${String.fromCharCode(65 + oIdx)}</span>
            <span>${opt}</span>
          </button>
        `;
      });

      html += `
          </div>
          <div id="quiz-feedback-box" style="display:none; margin-top:8px;"></div>
        </div>
      `;

      this.dom.modalBody.innerHTML = html;

      // 綁定選項點擊
      const optBtns = this.dom.modalBody.querySelectorAll(".quiz-opt-btn");
      optBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const selectedIdx = parseInt(btn.dataset.idx, 10);
          const isCorrect = selectedIdx === q.answer;

          // 禁用所有按鈕
          optBtns.forEach(b => b.style.pointerEvents = "none");

          // 標記正誤顏色
          if (isCorrect) {
            btn.style.borderColor = "var(--color-accent-green)";
            btn.style.background = "rgba(16, 185, 129, 0.25)";
            gameAudio.playSFX("sfx_correct");
            if (q.rewards) {
              if (q.rewards.logic) this.logicScore = Math.min(100, this.logicScore + q.rewards.logic);
              if (q.rewards.ethics) this.ethicsScore = Math.min(100, this.ethicsScore + q.rewards.ethics);
              this.renderHUD();
            }
          } else {
            btn.style.borderColor = "var(--color-accent-rose)";
            btn.style.background = "rgba(244, 63, 94, 0.25)";
            optBtns[q.answer].style.borderColor = "var(--color-accent-green)";
            optBtns[q.answer].style.background = "rgba(16, 185, 129, 0.25)";
            gameAudio.playSFX("sfx_wrong");
          }

          // 顯示解析與艾瑪引導
          const fbBox = document.getElementById("quiz-feedback-box");
          fbBox.style.display = "block";
          fbBox.innerHTML = `
            <div style="background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:16px; display:flex; flex-direction:column; gap:10px;">
              <div style="font-weight:700; color:${isCorrect ? 'var(--color-accent-green)' : 'var(--color-accent-rose)'}; font-size:1.1rem;">
                ${isCorrect ? '🎉 答對了！邏輯思維非常敏銳！' : '💡 答錯了！別氣餒，來聽聽艾瑪學姊的觀念拆解：'}
              </div>
              <div style="font-size:0.92rem; color:#cbd5e1; line-height:1.6;">
                ${q.explanation}
              </div>
              <div style="font-size:0.85rem; color:#38bdf8; background:rgba(56,189,248,0.1); padding:8px 12px; border-radius:6px;">
                👩‍🏫 艾瑪的溫馨提示：${q.emmaHint}
              </div>
              <button id="btn-next-quiz" class="restart-game-btn" style="margin-top:8px; align-self:flex-end; padding:10px 24px; font-size:0.95rem;">
                ${currentQuizIndex + 1 < quizQuestions.length ? '下一題 ➔' : '完成評量，前往下一關 ➔'}
              </button>
            </div>
          `;

          document.getElementById("btn-next-quiz").addEventListener("click", () => {
            gameAudio.playSFX("sfx_click");
            currentQuizIndex++;
            if (currentQuizIndex < quizQuestions.length) {
              renderQuizQuestion();
            } else {
              this.closeModal();
              if (onComplete) onComplete();
            }
          });
        });
      });
    };

    renderQuizQuestion();
  }

  // 顯示分支選項
  showChoices(choices) {
    this.dom.choicePanel.innerHTML = "";
    this.dom.choicePanel.classList.add("active");
    this.dom.advanceIndicator.style.display = "none";

    choices.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `
        <span class="choice-badge">${idx + 1}</span>
        <span class="choice-text">${c.text}</span>
      `;

      btn.addEventListener("mouseenter", () => {
        gameAudio.playSFX("sfx_hover");
      });

      btn.addEventListener("click", () => {
        gameAudio.playSFX("sfx_click");
        this.selectChoice(c);
      });

      this.dom.choicePanel.appendChild(btn);
    });
  }

  // 玩家做出選擇
  selectChoice(choice) {
    this.dom.choicePanel.classList.remove("active");

    // 增減數值
    if (choice.logic) this.logicScore = Math.max(0, Math.min(100, this.logicScore + choice.logic));
    if (choice.ethics) this.ethicsScore = Math.max(0, Math.min(100, this.ethicsScore + choice.ethics));
    this.renderHUD();

    // 播放音效
    if ((choice.logic || 0) > 0 || (choice.ethics || 0) > 0) {
      gameAudio.playSFX("sfx_correct");
    } else {
      gameAudio.playSFX("sfx_wrong");
    }

    // 如果選項有引導反饋，先顯示反饋台詞
    if (choice.feedback) {
      this.dom.speakerBox.style.display = "flex";
      this.dom.speakerName.textContent = "艾瑪";
      this.dom.speakerRole.textContent = "提示反饋";
      this.startTypewriter(choice.feedback, () => {
        this.dom.advanceIndicator.style.display = "block";
        // 綁定單次點擊進入下一個節點
        const advanceOnce = () => {
          this.dom.dialogueBox.removeEventListener("click", advanceOnce);
          this.loadNode(choice.next);
        };
        setTimeout(() => {
          this.dom.dialogueBox.addEventListener("click", advanceOnce, { once: true });
        }, 300);
      });
    } else {
      this.loadNode(choice.next);
    }
  }

  // 解鎖百科概念
  unlockConcept(conceptId) {
    if (!this.unlockedConcepts.has(conceptId)) {
      this.unlockedConcepts.add(conceptId);
      this.saveState();
      console.log(`[百科解鎖] 獲得新概念：${conceptId}`);
    }
  }

  // 解鎖證物道具
  unlockItem(itemId) {
    if (!this.unlockedItems.has(itemId)) {
      this.unlockedItems.add(itemId);
      this.saveState();
      console.log(`[證物解鎖] 獲得新道具：${itemId}`);
    }
  }

  // 更新 HUD 數值與徽章
  renderHUD() {
    const chapter = GAME_STORY.chapters[this.currentChapter] || GAME_STORY.chapters[0];
    this.dom.chapterBadge.textContent = `${chapter.name}・${chapter.title}`;
    this.dom.locationText.textContent = `📍 ${chapter.location}`;

    this.dom.logicVal.textContent = this.logicScore;
    this.dom.logicBar.style.width = `${this.logicScore}%`;

    this.dom.ethicsVal.textContent = this.ethicsScore;
    this.dom.ethicsBar.style.width = `${this.ethicsScore}%`;
  }

  // 開啟百科圖鑑彈窗
  openEncyclopediaModal() {
    this.dom.modalTitle.innerHTML = "📖 AI 百科圖鑑庫";
    let html = `<div class="encyclopedia-grid">`;

    GAME_ENCYCLOPEDIA.concepts.forEach(c => {
      const isUnlocked = this.unlockedConcepts.has(c.id);
      html += `
        <div class="concept-card ${isUnlocked ? '' : 'locked'}">
          <div class="concept-header">
            <span class="concept-icon">${isUnlocked ? c.icon : '🔒'}</span>
            <div>
              <div class="concept-name">${isUnlocked ? c.title : '未解鎖概念'}</div>
              <div class="concept-category">${isUnlocked ? c.category : '探索解鎖'}</div>
            </div>
          </div>
          <div class="concept-desc">
            ${isUnlocked ? c.detail : '隨著調查深入並回答相關問題後自動收錄。'}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    this.dom.modalBody.innerHTML = html;
    this.dom.modalOverlay.classList.add("active");
  }

  // 開啟關鍵證物彈窗
  openItemsModal() {
    this.dom.modalTitle.innerHTML = "🔍 科技糾察隊證物欄";
    let html = `<div class="items-grid">`;

    GAME_ENCYCLOPEDIA.items.forEach(item => {
      const isUnlocked = this.unlockedItems.has(item.id);
      html += `
        <div class="item-card ${isUnlocked ? '' : 'locked'}">
          <div class="item-badge-icon">${isUnlocked ? item.icon : '❓'}</div>
          <div class="item-name">${isUnlocked ? item.name : '未發現的線索'}</div>
          <div class="item-desc">${isUnlocked ? item.description : '在各章節中指出系統異常時自動收錄。'}</div>
          ${isUnlocked ? `<div class="item-clue">💡 線索要點：${item.clue}</div>` : ''}
        </div>
      `;
    });

    html += `</div>`;
    this.dom.modalBody.innerHTML = html;
    this.dom.modalOverlay.classList.add("active");
  }

  // 關閉 Modal
  closeModal() {
    this.dom.modalOverlay.classList.remove("active");
  }

  // 顯示結局評分畫面
  showEndingScreen() {
    gameAudio.playSFX("sfx_badge");
    this.dom.modalTitle.innerHTML = "🎓 調查結算與數位素養認證";

    // 根據邏輯值與倫理值計算成就稱號
    let title = "初級 AI 調查實習生";
    let evalText = "你完成了基本的調查，對人工智慧有了初步認識。持續思考科技與倫理的平衡，你將變得更強大！";

    if (this.logicScore >= 75 && this.ethicsScore >= 75) {
      title = "🌟 首席 AI 架構與數位倫理守護者";
      evalText = "太驚人了！你具備敏銳的科技洞察力，既能一眼看穿演算法偏見與深偽幻覺，又能時刻秉持人機協作的同理心，是真正的未來科技領袖！";
    } else if (this.logicScore >= 75) {
      title = "⚡ 頂尖演算法邏輯專家";
      evalText = "你的邏輯推理極為出色，對特徵提取、機器學習流程與 GIGO 定律掌握透徹！若能再加強對隱私與深偽倫理的關懷，將會更加完美！";
    } else if (this.ethicsScore >= 75) {
      title = "🛡️ 數位公民人權守護者";
      evalText = "你擁有強烈的正義感與媒體識讀素養，堅守人類決策底線，絕不盲從 AI 幻覺！多加強化程式與模型底層運作邏輯，你將無懈可擊！";
    }

    const html = `
      <div class="ending-card-content">
        <div class="badge-grand-icon">🛡️</div>
        <div class="ending-title">${title}</div>
        <p class="ending-evaluation">${evalText}</p>
        
        <div class="ending-stats-summary">
          <div class="ending-stat-box">
            <h4>最終邏輯值 (Logic)</h4>
            <p>${this.logicScore} / 100</p>
          </div>
          <div class="ending-stat-box">
            <h4>最終倫理值 (Ethics)</h4>
            <p>${this.ethicsScore} / 100</p>
          </div>
          <div class="ending-stat-box">
            <h4>百科解鎖數</h4>
            <p>${this.unlockedConcepts.size} / ${GAME_ENCYCLOPEDIA.concepts.length}</p>
          </div>
          <div class="ending-stat-box">
            <h4>收集證物數</h4>
            <p>${this.unlockedItems.size} / ${GAME_ENCYCLOPEDIA.items.length}</p>
          </div>
        </div>

        <button class="restart-game-btn" id="btn-final-restart">🔄 重新挑戰新冒險</button>
      </div>
    `;

    this.dom.modalBody.innerHTML = html;
    this.dom.modalOverlay.classList.add("active");

    document.getElementById("btn-final-restart").addEventListener("click", () => {
      this.closeModal();
      this.resetGame();
    });
  }

  // 儲存狀態至 LocalStorage
  saveState() {
    const state = {
      logic: this.logicScore,
      ethics: this.ethicsScore,
      chapter: this.currentChapter,
      nodeId: this.currentNodeId,
      concepts: Array.from(this.unlockedConcepts),
      items: Array.from(this.unlockedItems)
    };
    try {
      localStorage.setItem("cyber_academy_save", JSON.stringify(state));
    } catch (e) {}
  }

  // 從 LocalStorage 載入狀態
  loadState() {
    try {
      const raw = localStorage.getItem("cyber_academy_save");
      if (raw) {
        const state = JSON.parse(raw);
        if (state.concepts) state.concepts.forEach(c => this.unlockedConcepts.add(c));
        if (state.items) state.items.forEach(i => this.unlockedItems.add(i));
      }
    } catch (e) {}
  }

  // 重置遊戲
  resetGame() {
    try {
      localStorage.removeItem("cyber_academy_save");
    } catch (e) {}
    this.logicScore = 50;
    this.ethicsScore = 50;
    this.currentChapter = 0;
    this.unlockedConcepts.clear();
    this.unlockedItems.clear();
    this.loadNode("start");
  }
}

// 實例化並等待 DOM 載入
let game = null;
window.addEventListener("DOMContentLoaded", () => {
  game = new GameEngine();
  game.init();
});
