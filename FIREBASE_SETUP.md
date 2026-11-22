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

## 6. Firebase AI Logic 與 App Check

1. 在 Firebase Console 啟用 Firebase AI Logic，並選用 Gemini Developer API。也可在已連結正確 Firebase 專案的目錄執行 `firebase init ailogic`，以啟用 AI Logic 服務。
2. 在 Google Cloud Console 的 Fraud Defense／reCAPTCHA Enterprise 建立網站金鑰。選擇網站金鑰，不要把 `localhost` 或 `127.0.0.1` 加入允許網域，也不要勾選核取方塊驗證。
3. 在 Firebase Console → App Check → Apps 選取此 Web app，使用 reCAPTCHA Enterprise 註冊，填入剛建立的網站金鑰。
4. 將網站金鑰填入 `firebase-config.js` 的 `recaptchaEnterpriseKey`。範例檔的佔位值 `YOUR_RECAPTCHA_ENTERPRISE_KEY` 不能用於正式驗證。
5. 本機以 `http://localhost` 或 `http://127.0.0.1` 測試時，程式會開啟 App Check debug token。第一次啟動後，從瀏覽器 console 複製產生的 token，到 Firebase Console → App Check → Apps → Manage debug tokens 註冊。切勿將實際 debug token 提交到版本控制。

AI 小幫手每次詢問都會將問題與目前任務資料傳送至 Google Gemini；關閉面板或登出時，畫面與記憶體中的對話會清空。

## 資料同步規則

- 未登入時，任務只存於目前瀏覽器的 `localStorage`；訪客修改不會寫入 Firestore。
- 登入後若該 Google 帳號已有 Firestore 資料，雲端資料是此帳號的來源，會載入並取代目前瀏覽器的本機資料，不再顯示本機／雲端衝突視窗。
- 若該帳號尚無雲端資料，但本機已有任務，首次登入會詢問是否匯入。選擇匯入會上傳本機資料；選擇取消會以空白行程開始，並取代目前瀏覽器中的本機行程。
- 登出後的變更只留在本機。再次登入已有資料的帳號時，會重新載入該帳號的雲端資料。
