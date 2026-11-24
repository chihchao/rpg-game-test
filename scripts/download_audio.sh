#!/usr/bin/env bash
# ==============================================================================
# 《智械學園：AI 覺醒調查錄》音訊素材自動下載與配置腳本
# 專案音訊授權：CC0 1.0 Universal / Creative Commons
# ==============================================================================

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BGM_DIR="${BASE_DIR}/assets/audio/bgm"
SFX_DIR="${BASE_DIR}/assets/audio/sfx"

echo "======================================================================"
echo " 🎧《智械學園：AI 覺醒調查錄》開源音訊素材配置精靈"
echo "======================================================================"

# 建立目標資料夾
mkdir -p "${BGM_DIR}" "${SFX_DIR}"

# 檢查下載工具 (curl 或 wget)
FETCH_CMD=""
if command -v curl >/dev/null 2>&1; then
    FETCH_CMD="curl --connect-timeout 4 --max-time 15 -L -s -f -o"
elif command -v wget >/dev/null 2>&1; then
    FETCH_CMD="wget --timeout=10 -q -O"
else
    echo "⚠️ 找不到 curl 或 wget 下載工具。"
fi

download_file() {
    local target_path="$1"
    local source_url="$2"
    local desc="$3"

    echo -n "  📥 [${desc}] -> $(basename "${target_path}")... "
    if [ -f "${target_path}" ] && [ -s "${target_path}" ]; then
        echo "✅ (已存在，跳過)"
        return 0
    fi

    if [ -n "${FETCH_CMD}" ] && $FETCH_CMD "${target_path}" "${source_url}"; then
        echo "✅ 完成"
        return 0
    else
        echo "⚠️ 下載未成功 (離線或無外網連線)"
        [ -f "${target_path}" ] && [ ! -s "${target_path}" ] && rm -f "${target_path}"
        return 1
    fi
}

echo ""
echo "🎶 [1/2] 正在嘗試獲取背景音樂 (BGM) - 來源：FreePD (CC0 1.0 Universal)..."
download_file "${BGM_DIR}/bgm_campus_daily.mp3" \
    "https://freepd.com/music/City%20Sunshine.mp3" \
    "校園日常 (City Sunshine)"

download_file "${BGM_DIR}/bgm_investigation.mp3" \
    "https://freepd.com/music/Thinking%20Music.mp3" \
    "調查解謎 (Thinking Music)"

download_file "${BGM_DIR}/bgm_system_glitch.mp3" \
    "https://freepd.com/music/Volatile%20Reaction.mp3" \
    "系統異常 (Volatile Reaction)"

download_file "${BGM_DIR}/bgm_rooftop_sunset.mp3" \
    "https://freepd.com/music/Heartwarming.mp3" \
    "夕陽感性 (Heartwarming)"

echo ""
echo "🔔 [2/2] 正在檢查與配置音效素材 (SFX)..."
# 執行本地程序化離線音效生成
if command -v node >/dev/null 2>&1; then
    node "${BASE_DIR}/scripts/generate_offline_sfx.js"
else
    echo "⚠️ 未檢測到 Node.js，請直接依賴瀏覽器 Web Audio API 程序化合成器 (js/audio-manager.js)。"
fi

echo ""
echo "======================================================================"
echo " 🎉 音訊素材配置流程完成！"
echo " 實體音訊資料夾狀態："
echo "   - BGM 目錄: $(find "${BGM_DIR}" -type f | wc -l | tr -d ' ') 個檔案"
echo "   - SFX 目錄: $(find "${SFX_DIR}" -type f | wc -l | tr -d ' ') 個檔案"
echo " 提示：可直接開啟 audio_preview.html 在瀏覽器中進行完整音效與音樂試聽。"
echo "======================================================================"
