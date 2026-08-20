# 漢字モンスター図鑑 - デプロイ手順

このプロジェクトは Vite + React で作られています。セーブデータは Firebase（無料）に保存され、
名前を選ぶだけで（パスワード不要）どの端末からでも続きから遊べます。

---

## ① Firebase プロジェクトを作る（無料・5分ほど）

1. https://console.firebase.google.com にアクセスし、Googleアカウントでログイン
2. 「プロジェクトを追加」→ 好きな名前を入力（例：kanji-monster）→ 作成
3. 左メニューの「構築」→「Firestore Database」→「データベースを作成」
   - ロケーションは `asia-northeast1`（東京）などお好みで
   - ルールは後述の `firestore.rules` の内容に差し替えます（最初は「テストモード」でもOK）
4. 左メニューの「プロジェクトの概要」の横にある歯車 →「プロジェクトの設定」
5. 下の方の「マイアプリ」→ `</>`（ウェブ）のアイコンをクリックしてアプリを登録
6. 表示された `firebaseConfig` の中身（apiKey, authDomain, projectId など）をコピー

## ② 設定を書き込む

`src/storage-shim.js` を開き、上のほうにある `firebaseConfig` を、①でコピーした内容に
書き換えてください。

## ③ Firestore のルールを設定する

Firebaseコンソールの「Firestore Database」→「ルール」タブを開き、このプロジェクトに含まれる
`firestore.rules` の内容をそのまま貼り付けて「公開」してください。

（このルールは誰でも読み書きできる、パスワードなしの設定です。URLとFirebaseの設定を知らない
人には見つかりませんが、絶対に他人に見られたくない内容は保存しないでください。）

## ④ ローカルで確認する

```bash
npm install
npm run dev
```

表示されたURL（例: http://localhost:5173）をブラウザで開いて動作確認してください。

## ⑤ 本番用にビルドする

```bash
npm run build
```

`dist` フォルダが作られます。これが公開用の完成ファイル一式です。

## ⑥ 無料で公開する（どちらか）

### Netlify（ドラッグ＆ドロップが一番簡単）
1. https://app.netlify.com にログイン（GitHubアカウントでOK）
2. 「Add new site」→「Deploy manually」
3. `dist` フォルダをそのままドラッグ＆ドロップ
4. 発行されたURLが公開リンクです（あとから独自ドメインも設定可）

### Vercel（GitHub連携が簡単）
1. このフォルダをGitHubリポジトリにpush
2. https://vercel.com でそのリポジトリをインポート
3. Build Command: `npm run build` / Output Directory: `dist` を指定してデプロイ

---

## 使い方（できあがったサイトで）

1. サイトを開くと「だれが あそぶ？」画面が出ます
2. 初回は名前を入力して「＋ つくる」
3. 次からはその名前をタップするだけで、前回の続きから遊べます（他の端末でも同じ）
4. 名前を知っていれば誰でもその続きにアクセスできます（パスワードなしのため）

## 注意点

- `window.storage` という、本来はClaudeのアーティファクト専用の仕組みを、
  `src/storage-shim.js` でFirebase版に置き換えています。`src/App.jsx` 自体は無改造です。
- Firebase無料枠（Sparkプラン）は 1日あたり読み書き数万回まで無料なので、家族利用なら十分足ります。
