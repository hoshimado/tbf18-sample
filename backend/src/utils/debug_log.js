// デバッグ出力制御用ラッパー関数
// 将来的に環境変数等で切り替え可能にする想定
const DEBUG_LOG = false; // trueでデバッグ用のconsole.log()出力をOn、falseでOff

export function debugLog(...args) {
    if (DEBUG_LOG) {
        console.log(...args);
    }
}
