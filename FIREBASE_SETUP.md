# Firebase / Google 登入設定

目前程式碼已整合 Firebase Authentication（Google provider）與 Cloud Firestore。沒有 `firebase-config.js` 時，程式會改用範例設定並以本機模式啟動；要使用 Google 登入及雲端同步，請使用自己的 Firebase 專案完成以下設定。

## 1. 建立 Firebase Web app

1. 在 Firebase Console 建立或選取專案。
2. 到 Project settings → General → Your apps，新增 Web app。
3. 複製 Firebase 提供的 Web app config。
4. 複製 `firebase-config.example.js` 為 `firebase-config.js`，填入真實值。此檔已加入 `.gitignore`，不會被 Git 提交。

## 2. 啟用 Google Authentication

1. Firebase Console → Authentication → Sign-in method。
2. 啟用 Google provider，選擇支援電子郵件並儲存。
3. Authentication → Settings → Authorized domains，加入本機測試網域及正式 GitHub Pages 網域（例如 `moolimuli.github.io`）。

## 3. 建立 Firestore

1. Firebase Console → Firestore Database → Create database。
2. 在 Rules 頁面套用此專案的 `firestore.rules` 內容並發布。
3. Rules 的核心限制是只允許登入者讀寫 `users/{自己的 UID}/...`。

## 4. 本機執行

ES module 不能直接以 `file://` 穩定載入。於專案目錄啟動任一靜態 HTTP server，例如：

```bash
python3 -m http.server 8000
```

再開啟 `http://localhost:8000`。

## 5. 部署

把靜態檔部署到 GitHub Pages 後，確認 Pages 網域已加入 Firebase Authentication Authorized domains。不要提交 `firebase-config.js`，需在部署環境以安全的建置／部署步驟產生此檔。Firebase Web config 本身不是伺服器私鑰，但仍應配合嚴格 Firestore Security Rules 與網域設定。

## 資料同步注意

登入後，應載入該 Google 使用者 UID 下的 Firestore 資料；登入前本機資料與雲端資料合併規則尚待產品決策。不要以不透明的覆蓋方式處理首次登入資料遷移。
