import { useState } from 'react'

// ── データ (20件) ──────────────────────────────────────────────────────────────
const PROVERBS = [
  { id: '1',  word: '猫に小判',               meaning: '価値のわからない者に、貴重なものを与えても意味がないこと。' },
  { id: '2',  word: '七転び八起き',            meaning: '何度失敗しても、そのたびに立ち上がること。諦めない精神。' },
  { id: '3',  word: '石の上にも三年',          meaning: '辛くても辛抱強く続ければ、いつか報われるということ。' },
  { id: '4',  word: '馬の耳に念仏',            meaning: 'いくら意見や忠告をしても、まったく効き目がないこと。' },
  { id: '5',  word: '井の中の蛙大海を知らず',  meaning: '狭い世界に閉じこもって、広い世界を知らないこと。視野が狭いことのたとえ。' },
  { id: '6',  word: '急がば回れ',              meaning: '急ぐときこそ、危険な近道より安全な遠回りをした方がよいということ。' },
  { id: '7',  word: '一石二鳥',               meaning: '一つの行動で、二つの利益を同時に得ること。' },
  { id: '8',  word: '五里霧中',               meaning: '物事の見通しが立たず、どうすればよいかわからない状態のこと。' },
  { id: '9',  word: '蛙の子は蛙',             meaning: '子は親に似るということ。凡人の子は凡人になるという意味でも使われる。' },
  { id: '10', word: '花より団子',             meaning: '風雅より実利を重んじること。見た目の美しさより実際の利益を好むこと。' },
  { id: '11', word: '三人寄れば文殊の知恵',   meaning: '平凡な人でも三人集まれば、よい知恵が出るということ。' },
  { id: '12', word: '灯台下暗し',             meaning: '身近なことは、かえって気がつきにくいということ。' },
  { id: '13', word: '覆水盆に返らず',         meaning: '一度してしまったことは、取り返しがつかないということ。' },
  { id: '14', word: '棚から牡丹餅',           meaning: '思いがけず幸運が舞い込んでくること。労せずして利益を得ること。' },
  { id: '15', word: '出る杭は打たれる',       meaning: '才能があって目立つ人は、周囲から妬まれたり攻撃されたりするということ。' },
  { id: '16', word: '喉元過ぎれば熱さを忘れる', meaning: '苦しいことも、過ぎ去ってしまえば忘れてしまうということ。' },
  { id: '17', word: '類は友を呼ぶ',           meaning: '似た者同士は自然と集まるということ。気の合う者は集まりやすい。' },
  { id: '18', word: '当たって砕けろ',         meaning: '失敗を恐れず、思い切って事に当たること。' },
  { id: '19', word: '二兎を追う者は一兎をも得ず', meaning: '二つのことを同時に手に入れようとすると、どちらも得られないということ。' },
  { id: '20', word: '七転八倒',              meaning: '激しい苦痛でもがき苦しむこと。または困難で手に負えない状態のこと。' },
]

// ── ユーティリティ ─────────────────────────────────────────────────────────────
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getRandomExcluding(excludeIds, count) {
  const available = PROVERBS.filter(p => !excludeIds.includes(p.id))
  return shuffle(available).slice(0, count)
}

function pickRandom(excludeIds = []) {
  const available = PROVERBS.filter(p => !excludeIds.includes(p.id))
  return available[Math.floor(Math.random() * available.length)]
}

// ── 定数 ──────────────────────────────────────────────────────────────────────
const MAX_TURNS = 5
const MAX_DUMMY_LENGTH = 20

// ── 縦書き選択肢コンポーネント ─────────────────────────────────────────────────
function ChoiceCard({ choice, index, selected, disabled, onSelect }) {
  const isSelected = selected?.word === choice.word

  return (
    <button
      onClick={() => !disabled && onSelect(choice)}
      disabled={disabled}
      className={`flex flex-col items-center justify-between py-5 px-3 rounded-2xl border-2 transition-all flex-1 min-h-[140px] ${
        disabled
          ? 'cursor-default'
          : 'cursor-pointer hover:border-violet-300 active:scale-95'
      } ${
        isSelected
          ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-100'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* ラベル */}
      <span className={`text-xs font-bold mb-2 ${isSelected ? 'text-violet-500' : 'text-gray-400'}`}>
        {String.fromCharCode(65 + index)}
      </span>

      {/* 縦書きことわざ */}
      <p
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        className={`text-sm font-bold leading-snug flex-1 ${
          isSelected ? 'text-violet-800' : 'text-gray-800'
        }`}
      >
        {choice.word}
      </p>

      {/* チェックボックス */}
      <div
        className={`w-5 h-5 rounded border-2 mt-3 flex items-center justify-center flex-shrink-0 transition-colors ${
          isSelected ? 'border-violet-500 bg-violet-500' : 'border-gray-300 bg-white'
        }`}
      >
        {isSelected && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  )
}

// ── ホーム画面 ────────────────────────────────────────────────────────────────
function HomeScreen({ onSolo, onVersus }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-14">
        <div className="text-6xl mb-5">📜</div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          ことわざ<span className="text-violet-600">クイズ</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">意味から、正しい言葉を当てよう</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <button
          onClick={onSolo}
          className="w-full py-5 rounded-2xl bg-gray-900 text-white font-black text-lg shadow-lg hover:bg-gray-700 active:scale-95 transition-all"
        >
          <span className="text-2xl mr-2">🧠</span>
          ソロモード
        </button>

        <button
          onClick={onVersus}
          className="w-full py-5 rounded-2xl bg-violet-600 text-white font-black text-lg shadow-lg shadow-violet-200 hover:bg-violet-500 active:scale-95 transition-all"
        >
          <span className="text-2xl mr-2">⚔️</span>
          対決モード
        </button>

        <p className="text-center text-gray-400 text-xs mt-2">
          対決モードは2人で1台のデバイスを使います
        </p>
      </div>
    </div>
  )
}

// ── 対決：出題画面 ─────────────────────────────────────────────────────────────
function VersusDeceiverScreen({ gameState, dummyInput, dummyError, onDummyChange, onSubmit, maxTurns }) {
  const { currentProverb, turnCount, scoreGuesser, scoreDeceiver } = gameState

  return (
    <div className="min-h-screen bg-violet-50 flex flex-col p-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4 pt-2">
        <span className="text-gray-400 text-sm">ターン {turnCount} / {maxTurns}</span>
        <div className="flex gap-2">
          <span className="text-blue-600 text-xs bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
            解答者 {scoreGuesser}pt
          </span>
          <span className="text-violet-600 text-xs bg-white border border-violet-200 px-2.5 py-1 rounded-full">
            出題者 {scoreDeceiver}pt
          </span>
        </div>
      </div>

      {/* 注意バナー */}
      <div className="bg-white border border-violet-200 rounded-2xl px-5 py-4 mb-5 flex items-center gap-3 shadow-sm">
        <span className="text-2xl">🎭</span>
        <div>
          <p className="text-violet-700 font-bold text-sm">出題者のターンです</p>
          <p className="text-violet-400 text-xs mt-0.5">解答者には画面を見せないでください</p>
        </div>
      </div>

      {/* お題カード */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">お題</p>
        <p className="text-gray-900 text-2xl font-black mb-4">{currentProverb?.word}</p>
        <div className="h-px bg-gray-100 mb-4" />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">意味</p>
        <p className="text-gray-700 text-base leading-relaxed">{currentProverb?.meaning}</p>
      </div>

      {/* ダミー入力 */}
      <div className="flex-1">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          もっともらしい「偽のことわざ」を入力してください
        </label>
        <input
          type="text"
          value={dummyInput}
          onChange={e => onDummyChange(e.target.value)}
          placeholder="例：鶴の一声より鳩の千声"
          maxLength={30}
          className={`w-full bg-white border-2 rounded-xl px-4 py-4 text-gray-900 text-base placeholder-gray-300 focus:outline-none focus:ring-2 transition-all ${
            dummyError
              ? 'border-red-400 focus:ring-red-200'
              : 'border-gray-200 focus:border-violet-400 focus:ring-violet-100'
          }`}
        />
        <div className="flex justify-between items-center mt-2">
          {dummyError ? (
            <p className="text-red-500 text-xs">{dummyError}</p>
          ) : (
            <p className="text-gray-400 text-xs">解答者が選んでしまうような罠を仕掛けよう</p>
          )}
          <p className={`text-xs ml-2 flex-shrink-0 ${dummyInput.length > MAX_DUMMY_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
            {dummyInput.length}/{MAX_DUMMY_LENGTH}
          </p>
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full py-4 mt-6 rounded-2xl bg-violet-600 text-white font-bold text-base hover:bg-violet-500 active:scale-95 transition-all shadow-lg shadow-violet-200"
      >
        ダミーを確定する →
      </button>
    </div>
  )
}

// ── 対決：待機画面 ────────────────────────────────────────────────────────────
function VersusWaitingScreen({ onReady }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="text-8xl mb-8 animate-bounce">📱</div>
      <h2 className="text-gray-900 text-2xl font-black mb-3">解答者にデバイスを渡してください</h2>
      <p className="text-gray-400 text-base leading-relaxed mb-12">
        準備ができたら解答者が<br />「準備完了」を押してください
      </p>
      <button
        onClick={onReady}
        className="w-full max-w-xs py-5 rounded-2xl bg-blue-500 text-white font-black text-xl hover:bg-blue-400 active:scale-95 transition-all shadow-xl shadow-blue-100"
      >
        準備完了！
      </button>
      <p className="text-gray-300 text-xs mt-6">※ 出題者は画面を見ないでください</p>
    </div>
  )
}

// ── 対決：解答画面 ────────────────────────────────────────────────────────────
function VersusGuesserScreen({ gameState, pendingChoice, onSelect, onConfirm }) {
  const { currentProverb, choices, scoreGuesser, scoreDeceiver } = gameState

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-5 pt-2">
        <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          解答者のターン
        </div>
        <div className="flex gap-2">
          <span className="text-blue-600 text-xs bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
            あなた {scoreGuesser}pt
          </span>
          <span className="text-violet-600 text-xs bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full">
            出題者 {scoreDeceiver}pt
          </span>
        </div>
      </div>

      {/* 意味カード（上部） */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
          この意味のことわざは？
        </p>
        <p className="text-gray-900 text-lg leading-relaxed font-medium">{currentProverb?.meaning}</p>
        <p className="text-gray-300 text-xs mt-3">※ 1つはダミー（出題者の罠）が紛れています</p>
      </div>

      {/* 縦書き選択肢（下部） */}
      <div className="flex gap-3 mb-6">
        {choices.map((choice, idx) => (
          <ChoiceCard
            key={idx}
            choice={choice}
            index={idx}
            selected={pendingChoice}
            disabled={false}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* 確定ボタン */}
      <div className="mt-auto">
        <button
          onClick={onConfirm}
          disabled={!pendingChoice}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
            pendingChoice
              ? 'bg-violet-600 text-white hover:bg-violet-500 active:scale-95 shadow-lg shadow-violet-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {pendingChoice ? `「${pendingChoice.word}」で回答する` : '選択肢を選んでください'}
        </button>
      </div>
    </div>
  )
}

// ── 対決：結果画面 ────────────────────────────────────────────────────────────
function VersusResultScreen({ gameState, maxTurns, onNext }) {
  const { currentProverb, dummyWord, lastResult, scoreGuesser, scoreDeceiver, turnCount } = gameState

  const configs = {
    correct: {
      emoji: '✅',
      title: '正解！',
      subtitle: '解答者が正解を当てた！',
      titleColor: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-700',
      points: '+10pt → 解答者',
    },
    dummy: {
      emoji: '🎭',
      title: 'だまされた！',
      subtitle: '出題者のダミーに引っかかった…',
      titleColor: 'text-violet-700',
      bg: 'bg-violet-50 border-violet-200',
      badgeBg: 'bg-violet-100 text-violet-700',
      points: '+15pt → 出題者（騙し成功ボーナス！）',
    },
    random: {
      emoji: '😅',
      title: 'はずれ…',
      subtitle: '関係ないことわざを選んでしまった',
      titleColor: 'text-gray-600',
      bg: 'bg-gray-50 border-gray-300',
      badgeBg: 'bg-gray-100 text-gray-600',
      points: '解答者 -5pt',
    },
  }

  const cfg = configs[lastResult?.type] ?? configs.random
  const isLastTurn = turnCount >= maxTurns

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      {/* 結果バナー */}
      <div className={`rounded-2xl border-2 p-6 mb-5 text-center ${cfg.bg}`}>
        <div className="text-5xl mb-2">{cfg.emoji}</div>
        <h2 className={`text-2xl font-black mb-1 ${cfg.titleColor}`}>{cfg.title}</h2>
        <p className="text-gray-500 text-sm mb-3">{cfg.subtitle}</p>
        <span className={`rounded-full px-4 py-1.5 text-sm font-bold inline-block ${cfg.badgeBg}`}>
          {cfg.points}
        </span>
      </div>

      {/* 正解発表 */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">正解発表</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
            ✓ 正解
          </span>
          <span className="text-gray-900 font-bold">{currentProverb?.word}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-violet-600 text-xs font-bold bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full flex-shrink-0">
            🎭 ダミー
          </span>
          <span className="text-gray-700 font-bold">{dummyWord}</span>
          <span className="text-gray-400 text-xs">（出題者が作成）</span>
        </div>
      </div>

      {/* スコア */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">現在のスコア</p>
        <div className="flex justify-around items-end">
          <div className="text-center">
            <p className="text-blue-600 text-4xl font-black">{scoreGuesser}</p>
            <p className="text-gray-400 text-xs mt-1">解答者</p>
          </div>
          <div className="text-gray-300 text-xl mb-1">vs</div>
          <div className="text-center">
            <p className="text-violet-600 text-4xl font-black">{scoreDeceiver}</p>
            <p className="text-gray-400 text-xs mt-1">出題者</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-gray-400 text-xs text-center mb-3">ターン {turnCount} / {maxTurns}</p>
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-base hover:bg-gray-700 active:scale-95 transition-all"
        >
          {isLastTurn ? '最終結果を見る →' : `次のターンへ (${turnCount + 1}/${maxTurns}) →`}
        </button>
      </div>
    </div>
  )
}

// ── 対決：最終結果画面 ─────────────────────────────────────────────────────────
function VersusFinalScreen({ gameState, onHome, onRestart }) {
  const { scoreGuesser, scoreDeceiver } = gameState
  const guesserWins = scoreGuesser > scoreDeceiver
  const isDraw = scoreGuesser === scoreDeceiver

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="text-6xl mb-4">
        {isDraw ? '🤝' : guesserWins ? '🏆' : '🎭'}
      </div>
      <h2 className="text-gray-900 text-3xl font-black mb-2 text-center">
        {isDraw ? '引き分け！' : guesserWins ? '解答者の勝利！' : '出題者の勝利！'}
      </h2>
      <p className="text-gray-400 text-sm mb-10 text-center">
        {isDraw ? '互角の知力戦でした' : guesserWins ? '正確な知識で全てを見破った！' : '巧みなダミーで解答者を翻弄した！'}
      </p>

      <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
        <p className="text-gray-400 text-xs text-center font-semibold uppercase tracking-widest mb-5">最終スコア</p>
        <div className="flex justify-around items-end">
          <div className="text-center">
            <div className={`text-5xl font-black mb-1 ${guesserWins ? 'text-yellow-500' : 'text-blue-500'}`}>
              {scoreGuesser}
            </div>
            <p className="text-gray-500 text-sm">解答者</p>
            {guesserWins && <p className="text-yellow-500 text-xs mt-1 font-bold">👑 WIN</p>}
            {isDraw && <p className="text-gray-400 text-xs mt-1">DRAW</p>}
          </div>
          <div className="text-gray-300 text-xl mb-3">vs</div>
          <div className="text-center">
            <div className={`text-5xl font-black mb-1 ${!guesserWins && !isDraw ? 'text-yellow-500' : 'text-violet-500'}`}>
              {scoreDeceiver}
            </div>
            <p className="text-gray-500 text-sm">出題者</p>
            {!guesserWins && !isDraw && <p className="text-yellow-500 text-xs mt-1 font-bold">👑 WIN</p>}
            {isDraw && <p className="text-gray-400 text-xs mt-1">DRAW</p>}
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-violet-600 text-white font-black text-lg active:scale-95 transition-all hover:bg-violet-500 shadow-lg shadow-violet-100"
        >
          もう一度対決する
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold text-lg active:scale-95 transition-all hover:bg-gray-200"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  )
}

// ── ソロ：クイズ画面 ──────────────────────────────────────────────────────────
function SoloQuizScreen({ gameState, selectedChoice, pendingChoice, onSelect, onConfirm, onNext, onHome }) {
  const { currentProverb, choices, soloScore, soloStreak, lastResult } = gameState
  const answered = selectedChoice !== null

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-5 pt-2">
        <button
          onClick={onHome}
          className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          ← ホーム
        </button>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-yellow-500 font-black text-xl leading-none">{soloScore}</p>
            <p className="text-gray-400 text-xs mt-0.5">スコア</p>
          </div>
          <div className="text-center">
            <p className="text-orange-500 font-black text-xl leading-none">
              {soloStreak > 0 ? `🔥${soloStreak}` : '0'}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">連続正解</p>
          </div>
        </div>
      </div>

      {/* 意味カード（上部） */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
          この意味のことわざは？
        </p>
        <p className="text-gray-900 text-lg leading-relaxed">{currentProverb?.meaning}</p>
      </div>

      {/* 縦書き選択肢（下部） */}
      {!answered ? (
        <>
          <div className="flex gap-3 mb-6">
            {choices.map((choice, idx) => (
              <ChoiceCard
                key={idx}
                choice={choice}
                index={idx}
                selected={pendingChoice}
                disabled={false}
                onSelect={onSelect}
              />
            ))}
          </div>

          {/* 確定ボタン */}
          <div className="mt-auto">
            <button
              onClick={onConfirm}
              disabled={!pendingChoice}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
                pendingChoice
                  ? 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95 shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {pendingChoice ? `「${pendingChoice.word}」で回答する` : '選択肢を選んでください'}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 回答後：正誤付き縦書き選択肢 */}
          <div className="flex gap-3 mb-5">
            {choices.map((choice, idx) => {
              let borderCls = 'border-gray-200'
              let bgCls = 'bg-white'
              let textCls = 'text-gray-400'
              let labelCls = 'text-gray-300'

              if (choice.type === 'correct') {
                borderCls = 'border-emerald-400'
                bgCls = 'bg-emerald-50'
                textCls = 'text-emerald-700'
                labelCls = 'text-emerald-400'
              } else if (selectedChoice?.word === choice.word) {
                borderCls = 'border-red-400'
                bgCls = 'bg-red-50'
                textCls = 'text-red-600'
                labelCls = 'text-red-400'
              }

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-between py-5 px-3 rounded-2xl border-2 flex-1 min-h-[140px] ${borderCls} ${bgCls}`}
                >
                  <span className={`text-xs font-bold mb-2 ${labelCls}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <p
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    className={`text-sm font-bold leading-snug flex-1 ${textCls}`}
                  >
                    {choice.word}
                  </p>
                  <div className="mt-3 text-xs">
                    {choice.type === 'correct' && <span className="text-emerald-500">✓</span>}
                    {choice.type !== 'correct' && selectedChoice?.word === choice.word && (
                      <span className="text-red-400">✗</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* フィードバック */}
          <div
            className={`rounded-2xl p-4 mb-5 ${
              lastResult?.type === 'correct'
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className={`font-bold text-sm ${lastResult?.type === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
              {lastResult?.type === 'correct' ? '✅ 正解！ +10pt' : '❌ 不正解… -5pt'}
            </p>
            {lastResult?.type !== 'correct' && (
              <p className="text-gray-500 text-xs mt-1">
                正解は「{currentProverb?.word}」でした
              </p>
            )}
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-base hover:bg-gray-700 active:scale-95 transition-all mt-auto"
          >
            次の問題 →
          </button>
        </>
      )}
    </div>
  )
}

// ── メインアプリ ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home')
  const [gameState, setGameState] = useState({
    currentMode: 'none',
    turnCount: 0,
    scoreGuesser: 0,
    scoreDeceiver: 0,
    currentProverb: null,
    dummyWord: '',
    choices: [],
    lastResult: null,
    soloScore: 0,
    soloStreak: 0,
  })
  const [dummyInput, setDummyInput] = useState('')
  const [dummyError, setDummyError] = useState('')
  const [selectedChoice, setSelectedChoice] = useState(null)  // 確定済み回答
  const [pendingChoice, setPendingChoice] = useState(null)    // チェック中（未確定）

  // ── 対決モード ────────────────────────────────────────────────────────────
  const startVersus = () => {
    const proverb = pickRandom()
    setGameState({
      currentMode: 'versus',
      turnCount: 1,
      scoreGuesser: 0,
      scoreDeceiver: 0,
      currentProverb: proverb,
      dummyWord: '',
      choices: [],
      lastResult: null,
      soloScore: 0,
      soloStreak: 0,
    })
    setDummyInput('')
    setDummyError('')
    setPendingChoice(null)
    setScreen('versus_deceiver')
  }

  const submitDummy = () => {
    const val = dummyInput.trim()
    if (!val) { setDummyError('ダミーのことわざを入力してください。'); return }
    if (val.length > MAX_DUMMY_LENGTH) { setDummyError(`${MAX_DUMMY_LENGTH}文字以内で入力してください。`); return }
    const randoms = getRandomExcluding([gameState.currentProverb.id], 2)
    const choices = shuffle([
      { word: gameState.currentProverb.word, type: 'correct' },
      { word: val, type: 'dummy' },
      ...randoms.map(p => ({ word: p.word, type: 'random' })),
    ])
    setGameState(prev => ({ ...prev, dummyWord: val, choices }))
    setDummyError('')
    setPendingChoice(null)
    setScreen('versus_waiting')
  }

  const confirmVersusAnswer = () => {
    if (!pendingChoice) return
    const choice = pendingChoice
    setPendingChoice(null)
    setGameState(prev => {
      let sg = prev.scoreGuesser
      let sd = prev.scoreDeceiver
      let type
      if (choice.type === 'correct') { sg += 10; type = 'correct' }
      else if (choice.type === 'dummy') { sd += 15; type = 'dummy' }
      else { sg = Math.max(0, sg - 5); type = 'random' }
      return { ...prev, scoreGuesser: sg, scoreDeceiver: sd, lastResult: { type, selected: choice.word } }
    })
    setScreen('versus_result')
  }

  const nextVersusTurn = () => {
    if (gameState.turnCount >= MAX_TURNS) { setScreen('versus_final'); return }
    const proverb = pickRandom([gameState.currentProverb.id])
    setGameState(prev => ({
      ...prev,
      turnCount: prev.turnCount + 1,
      currentProverb: proverb,
      dummyWord: '',
      choices: [],
      lastResult: null,
    }))
    setDummyInput('')
    setDummyError('')
    setPendingChoice(null)
    setScreen('versus_deceiver')
  }

  // ── ソロモード ────────────────────────────────────────────────────────────
  const startSolo = () => {
    const proverb = pickRandom()
    const randoms = getRandomExcluding([proverb.id], 3)
    const choices = shuffle([
      { word: proverb.word, type: 'correct' },
      ...randoms.map(p => ({ word: p.word, type: 'random' })),
    ])
    setGameState({
      currentMode: 'solo',
      turnCount: 0,
      scoreGuesser: 0,
      scoreDeceiver: 0,
      currentProverb: proverb,
      dummyWord: '',
      choices,
      lastResult: null,
      soloScore: 0,
      soloStreak: 0,
    })
    setSelectedChoice(null)
    setPendingChoice(null)
    setScreen('solo_quiz')
  }

  const confirmSoloAnswer = () => {
    if (!pendingChoice || selectedChoice !== null) return
    const choice = pendingChoice
    setPendingChoice(null)
    setSelectedChoice(choice)
    setGameState(prev => {
      const isCorrect = choice.type === 'correct'
      return {
        ...prev,
        soloScore: Math.max(0, prev.soloScore + (isCorrect ? 10 : -5)),
        soloStreak: isCorrect ? prev.soloStreak + 1 : 0,
        lastResult: { type: isCorrect ? 'correct' : 'wrong', selected: choice.word },
      }
    })
  }

  const nextSoloQuestion = () => {
    const proverb = pickRandom([gameState.currentProverb.id])
    const randoms = getRandomExcluding([proverb.id], 3)
    const choices = shuffle([
      { word: proverb.word, type: 'correct' },
      ...randoms.map(p => ({ word: p.word, type: 'random' })),
    ])
    setGameState(prev => ({ ...prev, currentProverb: proverb, choices, lastResult: null }))
    setSelectedChoice(null)
    setPendingChoice(null)
  }

  // ── レンダー ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {screen === 'home' && (
        <HomeScreen onSolo={startSolo} onVersus={startVersus} />
      )}
      {screen === 'versus_deceiver' && (
        <VersusDeceiverScreen
          gameState={gameState}
          dummyInput={dummyInput}
          dummyError={dummyError}
          onDummyChange={v => { setDummyInput(v); setDummyError('') }}
          onSubmit={submitDummy}
          maxTurns={MAX_TURNS}
        />
      )}
      {screen === 'versus_waiting' && (
        <VersusWaitingScreen onReady={() => setScreen('versus_guesser')} />
      )}
      {screen === 'versus_guesser' && (
        <VersusGuesserScreen
          gameState={gameState}
          pendingChoice={pendingChoice}
          onSelect={setPendingChoice}
          onConfirm={confirmVersusAnswer}
        />
      )}
      {screen === 'versus_result' && (
        <VersusResultScreen gameState={gameState} maxTurns={MAX_TURNS} onNext={nextVersusTurn} />
      )}
      {screen === 'versus_final' && (
        <VersusFinalScreen
          gameState={gameState}
          onHome={() => setScreen('home')}
          onRestart={startVersus}
        />
      )}
      {screen === 'solo_quiz' && (
        <SoloQuizScreen
          gameState={gameState}
          selectedChoice={selectedChoice}
          pendingChoice={pendingChoice}
          onSelect={setPendingChoice}
          onConfirm={confirmSoloAnswer}
          onNext={nextSoloQuestion}
          onHome={() => setScreen('home')}
        />
      )}
    </div>
  )
}
