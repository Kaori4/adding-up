// 2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング」

'use strict';
// 実装１ ファイルからデータを読み込む

//モジュールを呼んでいる
const fs = require('fs'); //ファイルを扱う
const readline = require('readline'); //ファイルを１行ずつ呼び込むためのモジュール

const rs = fs.createReadStream('./popu-pref.csv'); //引数のファイルの読み込みを行うStremを生成
const rl = readline.createInterface({ input: rs, output: {} }); //上のrsをreadlineオブジェクトのinputとして設定

// ここまでのコードを利用する rlオブジェクトでlineと言うイベントが発生したら、コンソールに引数lineStringの内容が出力される
// rl.on('line', lineString => {
// 	console.log(lineString)
// });

// 実装２ファイルから抜き出す（2010年と2015年のデータから「集計年」「都道府県」「15~19際の人口」）

// rl.on('line', lineString => {
// 	const columns = lineString.split(','); //lineStringで与えられた１行を,で分割して配列に
// 	const year = parseInt(columns[0]); //数値に変換
// 	const prefrecture = columns[1];
// 	const popu = parseInt(columns[3]); //数値に変換
// 	if (year === 2010 || year === 2015) {
// 		console.log(year);
// 		console.log(prefrecture);
// 		console.log(popu);
// 	}
// });

// 実装3 データ（都道府県ごとの変化率）の計算
// 2010年の人口の合計・2015年の人口の合計・計算された2015年の2010年に対する計算率）連想配列を使う

//集計されたデータを格納する連想配列
const prefectureDateMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
	const columns = lineString.split(','); //lineStringで与えられた１行を,で分割して配列に
	const year = parseInt(columns[0]); //数値に変換
	const prefrecture = columns[1];
	const popu = parseInt(columns[3]); //数値に変換
	if (year === 2010 || year === 2015) {
		let value = prefectureDateMap.get(prefrecture);
		// 初期値？
		if (!value) {
			value = {
				popu10: 0,
				popu15: 0,
				change: null
			};
		}
		if (year === 2010) {
			value.popu10 = popu;
		}
		if (year === 2015) {
			value.popu15 = popu;
		}
		prefectureDateMap.set(prefrecture, value);
	}
});
//全て行が読み終わった後に実行される
rl.on ('close', () => {
	// 都道府県ごとの変化率の計算
	for (let [key, value] of prefectureDateMap) {
		value.change = value.popu15 / value.popu10;
	}
//  変化率ごとに並び替える
// まず連想配列から普通の配列に変換してソート 比較関数
	const rankingArray = Array.from (prefectureDateMap).sort((pair1,pair2) => {
		return pair2[1].change - pair1[1].change;
	});
	// console.log(rankingArray);
	const rankingStrings = rankingArray.map(([key, value]) => {
		return (
			key + 
			': ' +
			value.popu10 +
			'=> ' +
			value.popu15 +
			' 変化率:' +
			value.change
		);
	});
	console.log(rankingStrings)
});


