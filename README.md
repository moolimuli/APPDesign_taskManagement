# 日序｜個人行程與任務管理

「日序」是一款將待辦清單與行程規劃放在一起的個人管理工具。使用者可以快速記下任務，再依日期、時間、分類和優先度整理，透過日、週、月視圖安排工作與生活。

## 解決的問題

工作與生活中的待辦容易散落在筆記、行事曆和不同清單裡；有些任務已有明確時間，有些還沒有安排。只看清單不容易掌握時間分配，把每件事都排進行事曆又會增加規劃負擔。

日序讓使用者先低成本收集任務，再逐步安排時間。已排程的任務呈現在行事曆，未排時間的任務則保留在待辦清單，方便使用者看清當日安排、規劃整週並回顧進度。

## 使用者可以做到什麼

- 快速新增任務，或補充日期、起訖時間、分類、優先度和備註。
- 以日、週、月視圖查看時間安排，並快速切換日期或返回今天。
- 依自訂分類整理任務，並篩選行事曆中要顯示的分類。
- 標記任務完成、檢視已完成項目；刪除後可在短時間內復原。
- 以 Google 帳號登入，讓任務和分類同步至自己的 Firebase Firestore 資料。
- 詢問 AI 小幫手行程問題，或請它提出新增任務提案；只有使用者確認後才會新增。AI 不會修改或刪除任務。

## 專案特色

- **快速收集、彈性安排：**先記下任務即可，未排時間的待辦不會被塞進時間軸。
- **多尺度規劃：**日視圖查看時間軸，週視圖安排一週，月視圖掌握整體分布。
- **分類與色彩辨識：**自訂分類，並以分類顏色辨識行程和任務。
- **完整任務管理：**新增、編輯、完成、刪除及刪除復原。
- **帳號隔離與雲端同步：**登入後以 Firebase Authentication UID 區分使用者資料，儲存在 Cloud Firestore。
- **AI 行程問答：**使用 Firebase AI Logic 與 Gemini Developer API；遇到額度或暫時性服務錯誤時依序嘗試其他模型。對話保留在記憶體中，重新整理、登出或按下「清除對話」後清除。

## AI 與資料使用

使用 AI 小幫手時，使用者的問題與相關任務資料會傳送至 Google Gemini 產生回答。對話不會寫入 Firestore，也不會存進 `localStorage`。AI 只能回答問題或提出新增任務提案，新增前必須由使用者確認。

## 本機啟動

本專案使用原生 HTML、CSS、JavaScript ES modules 與 Firebase Web SDK，沒有套件安裝或建置步驟。請先依照 [FIREBASE_SETUP.md](FIREBASE_SETUP.md) 設定 Firebase、Google 登入、Firestore、Firebase AI Logic 與 App Check。

在專案目錄啟動靜態伺服器：

```bash
python3 -m http.server 8000
```

接著在瀏覽器開啟 <http://localhost:8000>。ES modules 需要透過 HTTP 伺服器載入，不能直接以 `file://` 開啟。

## 使用技術

- HTML、CSS、JavaScript（ES modules）
- Firebase Authentication（Google 登入）與 Cloud Firestore
- Firebase AI Logic（Gemini Developer API）
- Firebase App Check（reCAPTCHA Enterprise）
- Firebase Web SDK 13.4.0

