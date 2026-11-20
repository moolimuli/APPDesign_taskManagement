# Firebase / Google 登入設定

目前程式碼已整合 Firebase Authentication（Google provider）與 Cloud Firestore。沒有 `firebase-config.js` 時，程式會改用範例設定並以本機模式啟動；要使用 Google 登入及雲端同步，請使用自己的 Firebase 專案完成以下設定。

## 1. 建立 Firebase Web app

1. 在 Firebase Console 建立或選取專案。
2. 到 Project settings → General → Your apps，新增 Web app。
3. 複製 Firebase 提供的 Web app config。
4. 複製 `firebase-config.example.js` 為 `firebase-config.js`，填入真實值。本專案是靜態前端，執行及部署時都需要這份 Web app client config；它會隨網站提供給瀏覽器，不可在其中放入 service-account 金鑰或其他伺服器私密資料。

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

把靜態檔部署到 GitHub Pages 後，確認 Pages 網域已加入 Firebase Authentication Authorized domains。`firebase-config.js` 是供瀏覽器使用的 Web app 設定，Pages 部署必須包含此檔；Firestore Security Rules 與授權網域才是資料存取的主要限制。不要將 Firebase Admin SDK service-account 金鑰放入前端檔案。

## 資料同步規則

- 未登入時，任務只存於目前瀏覽器的 `localStorage`；訪客修改不會寫入 Firestore。
- 登入後若該 Google 帳號已有 Firestore 資料，雲端資料是此帳號的來源，會載入並取代目前瀏覽器的本機資料，不再顯示本機／雲端衝突視窗。
- 若該帳號尚無雲端資料，但本機已有任務，首次登入會詢問是否匯入。選擇匯入會上傳本機資料；選擇取消會以空白行程開始，並取代目前瀏覽器中的本機行程。
- 登出後的變更只留在本機。再次登入已有資料的帳號時，會重新載入該帳號的雲端資料。
