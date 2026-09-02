# Last Asylum「研究データベース」構築プロジェクト

本リポジトリは、モバイルストラテジーゲーム『Last Asylum: Plague（ラストアサイラム）』の研究（Research / Science / Technology）システムに関するデータを網羅的に収集・検証し、機械処理可能なJSON形式で提供するデータベースプロジェクトです。

---

## 1. プロジェクト概要

- **対象ゲーム**: Last Asylum: Plague
- **データ取得日**: 2026-09-02
- **ゲームバージョン**: null（未確認）
- **設計方針**:
  - **推測の完全禁止**: Web上で実測・確認できない数値、時間、前提条件、効果のレベル補完や推測は一切行わず、`null` または `status: "partial"` / `"unverified"` として厳密に記録。
  - **既存建築DBとのスキーマ統一**: 既存の `data/facility_costs.json` のキー構造（`wood`, `grain`, `herb`, `time_seconds`, `prerequisites`）を継承・拡張。

---

## 2. 収集データ統計（サマリー）

- **研究カテゴリ数**: 7カテゴリ（Development, Economy, Basic Military, City Defense, Advanced Military, Alliance Duel, Zone Commemoration）
- **研究総数**: 41件
- **総研究Lv数**: 222Lv
- **完全取得 (verified)**: 2件 (Tier 9 Troops, Tier 10 Troops)
- **部分取得 (partial)**: 39件 (Lv1データ実測確認済み、Lv2以降は実測未確認のため `null` および `missing_levels` に計上)
- **未確認 (unverified)**: 0件
- **データ矛盾 (conflicting)**: 0件
- **使用情報源**: 5サイト/ローカルDB
- **推定値使用**: **0件（厳守）**

---

## 3. 使用情報源 (Sources)

1. **Last Asylum: Plague Wiki (Fandom)** - `https://last-asylum-plague.fandom.com/wiki/Alliance_Duell_Guide`
2. **Last Asylum Database** - `https://lastasylumdatabase.com/research/`
3. **Packsify Research Priority Guide** - `https://packsify.com/guides/last-asylum-research-priority/`
4. **Last Asylum Strategy Guide** - `https://lastasylumguide.com/technology/`
5. **Local Facility Costs DB** - `file:///c:/Users/yokoz/OneDrive/Desktop/LastAsylum/data/facility_costs.json`

---

## 4. ディレクトリ・ファイル構成

```
c:\Users\yokoz\OneDrive\Desktop\LastAsylum/
├── data/
│   ├── researches.json      # 全41研究のレベル別詳細・効果・コストデータ
│   ├── research_tree.json   # カテゴリ別研究IDおよび研究間の依存関係
│   ├── categories.json      # 全7カテゴリの説明・多言語情報
│   └── sources.json         # 参照した全情報源のメタデータ
├── raw/                     # 取得した原データ・HTMLキャッシュ
├── reports/
│   ├── coverage_report.json     # 網羅率・欠損レベルの完全一覧
│   ├── verification_report.json # 検証結果・互換性チェックサマリー
│   └── conflicts.json           # 情報源間の矛盾データ記録（現時点で0件）
├── scripts/
│   └── generate_db.py       # データベース＆レポート生成スクリプト
└── README.md                # 本文書
```

---

## 5. データ仕様と互換性設計

### 既存DB（`facility_costs.json`）との統一項目
- リソースキー: `wood`, `grain`, `herb` (小文字・単数表記)
- 時間表記: `time_seconds` (整数秒単位)
- 前提施設表記: `prerequisites.buildings` (例: `"研究室": 10`)

### 研究DB拡張項目
- 追加リソースキー: `steel`, `stone`, `study_scroll`
- 多言語名称: `"name": { "en": "...", "ja": null }` （公式未確認の日本語訳は推測せず `null`）
- 構造化効果: `effect`: `{ type, target, value, unit, description_en, description_ja }`
- 戦力: `power` (整数または `null`)

---

## 6. 今後再調査すべき項目（欠損・未完了タスク）

1. **実ゲーム内スクリーショット/ログによる各研究のLv2〜Lv10コストおよび時間の採録**
   - 理由: 現在Web上で安定して公開されているデータがLv1中心のため、Lv2以降は原則 `null` および `missing_levels` として処理しています。
2. **研究名およびカテゴリ名の公式日本語訳（ja）の特定**
   - 理由: 英語名原文 `en` は確実ですが、日本語クライアントにおける公式表記の照合が必要です。
3. **ゲームアップデート（Ver.）による前提条件の変更トラッキング**
