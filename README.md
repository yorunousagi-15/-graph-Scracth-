# Math Grapher V4

数学関数グラファー V4。GitHub Pagesで公開できます。

## 主な機能
- 複数の実関数 `y=f(x)`
- 記号微分
- 数値定積分・絶対値積分
- 実数零点探索
- パラメトリック曲線
- 極座標
- 複素平面 `f(z)`
- 複素関数の絶対値・偏角・実部・虚部の可視化
- `ζ(z)` の数値近似
- 臨界線 `s=1/2+it` 上の `|ζ(s)|` の数値表示
- ダークモード
- Plotlyのズーム・パン

## GitHub Pages
`index.html`, `style.css`, `script.js`, `README.md` をリポジトリ直下にアップロードし、
Settings → Pages → Deploy from a branch → `main` → `/ (root)` にします。

## 注意
V4のζ関数表示は、交代級数を使った数値近似です。数学的な証明用の厳密計算器ではありません。
外部CDNの math.js と Plotly を使用するため、公開サイトの実行時にはインターネット接続が必要です。
