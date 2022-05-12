# Gsからゴルフ場への経路をプロットするアプリ

## 概要
- G'sから鎌倉パブリックというゴルフ場への経路をプロットする。
- ボタンをクリックするとRakutenGolfAPIより、住所が取得できるのでそれをHTML上に表示。
- Bing mapのAPIを利用して、G'sから鎌倉パブリックへの経路と所要時間(車)を取得し、それぞれ表示。
    - G'sの住所はProvided
    - 鎌倉パブリックもこちらではProvided

## 改善点
- APIの仕様を読んで理解するのに非常に時間がかかった。
- 本来はスタート地点はGPSで取得した位置、ゴール地点はRakutenGolfAPIで取得した住所でBing map APIを使用したかった。
- しかしながら、同期非同期処理(Promise)がよくわからず思った順番にデータを取得できなかったので、スタート/ゴール位置は固定として与えた。

## Bing map参考URL
- https://docs.microsoft.com/en-us/bingmaps/v8-web-control/map-control-api/map-class
- https://docs.microsoft.com/en-us/bingmaps/rest-services/routes/calculate-a-route