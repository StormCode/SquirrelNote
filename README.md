# 松鼠筆記

> 以React開發的輕量級筆記應用


功能特點：
1. 所見即所得 (What You See Is What You Get/WYSIWYG)編輯器
2. 豐富的編輯功能: 文字縮排、字體大小、字型、引用、插入圖片、表格、線上影片、程式碼區塊...
3. 自動儲存: 每隔5分鐘自動儲存筆記
4. 安全: 所有內容(筆記本、目錄、筆記)加密儲存、傳輸


## Usage

Install dependencies

```bash
npm install
npm client-install
```

### Edit Config

### Server
在根目錄新增.env檔，設定以下資訊:

GMAIL_USERNAME=[你的Gmail信箱]

GMAIL_CLIENT_ID=[你的Gamil Client Id]

GMAIL_CLIENT_SECRET=[你的Gmail Client Secret]

GMAIL_REFRESH_TOKEN=[你的Gmail Refresh Token]

SECRET_KEY=[自行設定] (加密資料的Key)

JWTSECRET=[自行設定] (加密驗證資訊的Key)

IMAGE_DIRECTORY=[自行設定] e.g. "/uploads/images"

MONGOURI=[MongoDB URI]

LOGO_URL=https://stormcode.github.io/SquirrelNote/assets/logo.png

BRAND_URL=https://stormcode.github.io/SquirrelNote/assets/brand.png


> 以上資訊的GMAIL_CLIENT_ID、GMAIL_CLIENT_SECRET需在Google API申請(https://console.developers.google.com/apis/credentials);
GMAIL_REFRESH_TOKEN需使用Playground生成(https://developers.google.com/oauthplayground/);
MONGOURI請申請MongoDB Atlas並創建新Project > Clusters


### Client
在client目錄下新增.env檔，設定以下資訊:

REACT_APP_SECRET_KEY=[自行設定] (加密資料的Key)

REACT_APP_AUTOSAVE_INTERVAL=[自動儲存筆記的時間間隔，設你喜歡的值] (單位: 毫秒)


### Run Server

```bash
npm run dev
npm run server
npm run client
```

> 同時跑Server和Client直接執行"npm run dev"即可
