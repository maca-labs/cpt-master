# 追加評価教材の独立AIレビュー

確認完了：2026-11-04T12:39:06Z。対象は `src/content/expansion/assessment.ts` の46問・7単元。著者担当とは別のAI（official_curriculum）が、設問、正答、誤答それぞれの理由、本文、具体例、用語を読んで照合した。人間の専門家によるレビューは0件。`source_checked` の範囲を維持し、`expert_reviewed` へ昇格していない。

構造検査と内容照合を分ける。ID・参照先・選択肢数・型が正しくても、正答や説明の根拠が確認されたことにはしない。本記録の判定は、以下の原典の該当本文と教材を読んだ結果である。原典全文・図表・公式問題はリポジトリへ転載しない。

## 対象と所見

範囲表は両端を含む。46問すべての正答と誤答理由を確認した。正答の差し替えを要する重大な事実誤認は見つからなかった。32問の誤答は、極端な断定や不自然な行為から、条件に合わない比較・手順・記録方法へ改稿し、対応する理由も原典と再照合した。

| 対象ID                           | 件数 | 内容照合と変更                                                                                                                                                                                                            |
| -------------------------------- | ---: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ex-assess-quality-01`〜`08`     |    8 | NSCA原著PDFの信頼性・妥当性・誤差・一般化、測定要項の実演と順序。反復平均で系統誤差を消す、表示桁を変化の根拠とする等の誤答へ改稿。全8問revision2。                                                                       |
| `ex-assess-adult-tests-01`〜`08` |    8 | スポーツ庁20〜64歳要項の印刷pp.2〜7,9と照合。握り幅、最良値の平均、有効反復、横とびの加点、胴の到達、連続未到達、直線距離を確認。01の指・関節の取り違えを改稿しrevision2、02〜08はrevision1を維持。                       |
| `ex-assess-bodycomp-01`〜`06`    |    6 | BMIのm換算、脂肪量/除脂肪量、BIAの水分、皮下脂肪と内臓脂肪、腹囲位置。02/04/05/06の誤答を、不適切な代替指標・異条件平均・比例換算・別方式混在へ改稿しrevision2。01/03はrevision1。                                        |
| `ex-assess-behavior-01`〜`06`    |    6 | NIDDKの準備、具体化、気持ちも含む記録、雨天の代案、中断、友人等の支援。本人の現在の求めと合わない支援の優先順位を扱う誤答へ全6問改稿しrevision2。                                                                         |
| `ex-assess-health-01`〜`06`      |    6 | 厚労省の生活活動/運動、健康情報の収集・更新と環境、JSHの座位安静・平均。01〜05を情報の先送り、転記、体制不足、安静順序の取り違えへ改稿しrevision2。06の平均計算はrevision1。                                              |
| `ex-assess-food-label-01`〜`07`  |    7 | 消費者庁の公開Webと2ページPDF、文科省の食塩換算、OpenStaxの代謝。基準量・単位・炭水化物内訳を確認。04〜07は添加/含有の混同、丸め/強調基準の混同、配合変更前の値の転用、欠落値の推定へ改稿しrevision2。01〜03はrevision1。 |
| `ex-assess-hydration-01`〜`05`   |    5 | CDCの食品/飲料からの水分、NCIの即時記録・曜日効果・反応性、NATA表2の発汗式。01〜04を供給源の除外、代表食の転記、平日のみの追加、推測での記録修正へ改稿しrevision2。05の計算はrevision1。                                  |

変更32問の `Question.revision` と `review.revision` は2、最終照合時刻は上記ISO日時にそろえた。未変更14問の著者照合記録はそのまま保持し、この文書で独立レビューを記録する。著者の初回照合は各バッチの12:04:00Z / 12:07:36Z / 12:13:35Z / 12:17:09Z / 12:19:52Zと区別する。

## 原典と確認範囲

出典ID・URL・該当節は各設問の `sourceRefs`、版と確認日は `assessmentExpansionSources` に保持する。新規21資料に加え、既存の成人要項 `f-sports-test-adult` と代謝 `f-metabolism` を参照した。

- [NSCA Testing and Profiling Athletes](https://www.nsca.com/contentassets/d34fb088b444495da825298cb03526a8/testing-and-profile--weakley-et-al.pdf)：公開PDFの2023年先行版。pp.3〜4の妥当性分類、pp.7〜9の再現性・検者差・技術/生物学的誤差と感度を実読。特定研究のSEMを一般成人の診断閾値にしていない。[NSCA測定モジュール2013](https://www.nsca.com/contentassets/4bc4e495944c470d81c429294a2b4c05/tsac-module-5.0--5.1.pdf)の5.1-3/4/7、[妥当性と信頼性の公式解説2017](https://www.nsca.com/education/articles/kinetic-select/tests-based-on-work-demands-and-training-status/)、[速度・敏捷性の公式解説2017](https://www.nsca.com/education/articles/kinetic-select/assessing-speed-and-agility-related-to-sport-performance/)のTest Selection / Methods of Measurementも照合した。
- [スポーツ庁20〜64歳要項](https://www.mext.go.jp/sports/content/250424-spt_kensport01-300000992_04.pdf)：版年月は本文で確認できず推測しない。印刷pp.2〜7,9の方法・記録・注意を確認。特に急歩/シャトルランには医師の治療を受けている者等への不実施条件があり、教材の導入にも追記した。運動一般への許可と、特定の調査テストへの参加条件は別である。
- 厚労省e-ヘルスネット：[BMI](https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-002.html)（2024-02-15）、[肥満と健康](https://kennet.mhlw.go.jp/information/information/food/e-02-001)（2019-12-17）、[体脂肪率](https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-041)（2024-05-28）、[体脂肪計](https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-091.html)（更新日表示なし）、[ウエスト周囲径](https://kennet.mhlw.go.jp/information/information/dictionary/metabolic/ym-089.html)（2024-05-28）の計算・限界・位置の該当本文を実読。古い体脂肪計ページの数値を診断基準にしていない。
- [NIDDK行動支援](https://www.niddk.nih.gov/health-information/diet-nutrition/changing-habits-better-health)：最終レビュー2020年11月。直接再取得は一部タイムアウトしたが、公式ページの検索取得全文でPreparation / Action / Maintenanceの該当段落を実読。原典の例文・表は転記せず、本人の求めに沿う支援を検討した。
- [厚労省成人ガイド](https://kennet.mhlw.go.jp/information/information/exercise/s-00-002.html)（2024-02-22）の分類、[安全情報シート](https://kennet.mhlw.go.jp/information/information/exercise/s-00-008)（2024-03-19）の開始前・毎回・環境、[日本高血圧学会パンフレット](https://www.jpnsh.jp/data/selfmonitoring.pdf)（版年月未確認）の1ページ「家庭血圧の正しいはかり方」を実読。薬、診断、個人の治療目標は教材へ転用しない。
- [消費者庁2ページ資料](https://www.caa.go.jp/policies/policy/food_labeling/nutrient_declearation/assets/food_labeling_cms206_250403_11.pdf)：URLの250403を本文の改訂日と断定しない。文字抽出が空のため一時領域へ取得し、Popplerで2ページをPNG描画、両ページ全体と式・図表・注を視覚確認。p.1の食品単位、2.54換算、糖質/糖類/食物繊維の階層、p.2の添加/含有/低減の条件を読んだ。[公開Web](https://www.caa.go.jp/policies/policy/food_labeling/nutrient_declearation)の義務/推奨/任意と省略例も確認。[文科省食塩換算](https://fooddb.mext.go.jp/nutman/nutman_09.html)、[OpenStax A&P2e 24.1](https://openstax.org/books/anatomy-and-physiology-2e/pages/24-1-overview-of-metabolic-reactions)の複数のエネルギー源も実読した。
- [CDC水分](https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html)（2026-03-05）のMeeting your water intake、NCIの[食事記録](https://epi.grants.cancer.gov/dietary-assessment-primer/profiles/record/)、[曜日効果](https://epi.grants.cancer.gov/dietary-assessment-primer/learn/day.html)、[反応性](https://epi.grants.cancer.gov/dietary-assessment-primer/learn/reactivity.html)（各2025-12-29）の該当本文を実読。NATA [Fluid Replacement声明2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5634236/)はPMC直接取得がreCAPTCHAだったため、原著の検索取得本文のFluid Replacement / Table2 / Sweat-Rate Variabilityを読んだ。取得制限を回避していない。

2資料の確認できた版情報（肥満と健康・CDC水分）をSourceへ補足した。表示がない版・日付は未確認のままにする。

## 計算・意味重複・限界

独立に再計算：左右握力の最良45/41kgの平均43kg、BMI72.25÷1.70²＝25.0、脂肪80×0.25＝20kgと残り60kg、240×150/100＝360kcal、500×2.54/1000＝1.27g、炭水化物30−繊維6＝糖質24g、血圧128/78と124/76の平均126/77mmHg、発汗70−69＋0.6−0.1＝1.5L・90分＝1.5hより1.0L/h。すべて出典の定義と設問条件内の独自例で、医学的診断や一律摂取指示に置き換えない。

既存100問の設問と正答を一巡し、意味も比較した。握力の幅/集計は既存の振り回し禁止と異なる。長座の膝条件は既存の距離零点と、シャトルの終了条件は既存のVO₂max推定値の扱いと異なる。表示量の換算は既存の基準量確認を具体計算へ進めたもの。行動支援は迷っている人の情報聴取と、実行を決めた人の準備・継続支援を分けた。新しい問診の空欄/情報更新は、医療職紹介という既存の一般原則の言換えにはしていない。単なる数値置換や同じ判断の言換えと判定した追加問はなかった。

AIによる限定的な一次資料照合であり、教育測定上の難易度・識別力、臨床的妥当性、実際の指導能力を実証したものではない。正答の長さから推測できる傾向など、実利用での項目分析は今後も必要。構造テストの成否は別途記録する。

## 検査結果

2026-11-04T12:41:31Zまでに実施：

- `npm run typecheck`：合格。
- `npx vitest run tests/content.test.ts`：21件合格。
- assessment単独の構造確認：7単元46問、新規出典21、revision2が32問・revision1が14問、全46問がAIのsource_checked、人間専門家0。選択肢・正答ID・出典参照・目標・改訂番号の整合を確認。
- `npm run validate:content`：36単元300問、分野69/96/93/42、診断12/16/15/7、エラー0。動画不足や保留等の確認事項40件を出力。検査による審査状態変更なし。

これらは構造・参照整合性の結果であり、原典読解の代わりではない。検査の成功だけで上記の内容照合を追加・更新する処理は設けない。
