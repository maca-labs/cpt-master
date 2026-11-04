import { useEffect, useState } from 'react';
import type { Question } from '../domain/types';
import { mediaAssets, mediaRights } from '../content/media';
type Point = [number, number];
const viewBoxes: Record<string, string> = {
  'ex-tech-squat-knee': '170 45 270 280',
  'ex-tech-squat-range': '180 35 280 270',
  'ex-tech-lunge-base': '60 20 480 280',
  'ex-tech-deadlift-setup': '150 45 370 260',
  'ex-tech-deadlift-rise': '180 10 280 295',
  'ex-tech-bench-stack': '160 45 330 230',
  'ex-tech-birddog-range': '90 55 470 245',
  'ex-tech-pushup-body': '80 60 420 245',
  'ex-tech-active-passive': '50 20 540 260',
  'ex-tech-row-drive': '150 55 350 245',
  'ex-tech-landing-absorption': '180 5 280 300',
  'ex-tech-moment-arm': '175 25 320 295',
};
const frameLabels: Record<string, string[]> = {
  'ex-tech-squat-range': ['開始位置', '踵は接地・背部の形を維持', '踵が浮き、骨盤・背部の形が変化'],
  'ex-tech-deadlift-rise': ['床からの開始', 'バーが膝の下を通過', 'バーが膝を通過した後'],
  'ex-tech-birddog-range': [
    '四つ這い',
    '対側の腕・脚を低く伸ばす',
    'さらに高く挙げ、腰の反りが増える',
  ],
  'ex-tech-pushup-body': ['下降位置', '胸部が先に上がり、骨盤は低い位置'],
  'ex-tech-row-drive': [
    'キャッチ（腕は伸びている）',
    '脚で押す局面（腕は伸展）',
    '脚に続いて体幹・腕が連動',
  ],
  'ex-tech-landing-absorption': ['空中', '接地', '接地後の吸収局面'],
};
function Body({ head, chains }: { head: Point; chains: Point[][] }) {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={head[0]} cy={head[1]} r="17" />
      {chains.map((chain, i) => (
        <polyline key={i} points={chain.map((p) => p.join(',')).join(' ')} />
      ))}
      {chains.flat().map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--accent, #14856e)" strokeWidth="1" />
      ))}
    </g>
  );
}
function Floor() {
  return <path data-testid="media-floor" d="M70 280H570" stroke="currentColor" opacity=".35" />;
}
function Shape({ id, frame: f }: { id: string; frame: number }) {
  const side = (
    hip: Point,
    knee: Point,
    ankle: Point,
    shoulder: Point,
    hand: Point,
  ): React.ReactNode => (
    <Body
      head={[shoulder[0] + 8, shoulder[1] - 35]}
      chains={[
        [shoulder, hip, knee, ankle, [ankle[0] + 35, ankle[1]]],
        [shoulder, hand],
      ]}
    />
  );
  switch (id) {
    case 'ex-tech-squat-knee':
      return (
        <>
          <text x="85" y="35">
            正面・投影した足先の向き
          </text>
          <path
            d="M240 130V280M360 130V280"
            stroke="currentColor"
            strokeDasharray="7 6"
            opacity=".5"
          />
          <Body
            head={[300, 65]}
            chains={[
              [
                [260, 100],
                [340, 100],
              ],
              [
                [300, 100],
                [300, 170],
              ],
              [
                [260, 170],
                [280, 220],
                [240, 270],
              ],
              [
                [340, 170],
                [320, 220],
                [360, 270],
              ],
            ]}
          />
          <path
            d="M220 275l20-5 20 5M340 275l20-5 20 5"
            stroke="currentColor"
            fill="none"
            strokeWidth="5"
          />
          <path
            d="M240 200l35 17m-11 1 11-1-5-10M360 200l-35 17m5-10-5 10 11 1"
            stroke="#b5663b"
            strokeWidth="3"
            fill="none"
          />
          <text x="225" y="310">
            足先
          </text>
          <text x="345" y="310">
            足先
          </text>
        </>
      );
    case 'ex-tech-squat-range':
      return (
        <>
          <Floor />
          {f === 0 ? (
            side([310, 160], [310, 220], [310, 280], [310, 95], [380, 130])
          ) : f === 1 ? (
            side([260, 185], [345, 210], [310, 280], [290, 115], [370, 130])
          ) : (
            <>
              <Body
                head={[308, 130]}
                chains={[
                  [
                    [255, 220],
                    [360, 225],
                    [330, 265],
                    [365, 280],
                  ],
                  [
                    [300, 165],
                    [380, 180],
                  ],
                ]}
              />
              <path
                d="M300 165Q258 177 255 220"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}
          {f === 2 && (
            <>
              <path d="M265 215q-35-20-10-40" stroke="#c35a30" fill="none" strokeWidth="4" />
            </>
          )}
        </>
      );
    case 'ex-tech-lunge-base':
      return (
        <>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${i * 280},0)`}>
              <text x="85" y="45">
                {i === 0 ? 'A' : 'B'} / 上から見た足部
              </text>
              <path d="M155 70v205" stroke="currentColor" strokeDasharray="6 6" opacity=".4" />
              <ellipse
                cx={i === 0 ? 155 : 110}
                cy="110"
                rx="18"
                ry="38"
                fill="currentColor"
                opacity=".6"
              />
              <ellipse
                cx={i === 0 ? 155 : 200}
                cy="230"
                rx="18"
                ry="38"
                fill="currentColor"
                opacity=".6"
              />
            </g>
          ))}
        </>
      );
    case 'ex-tech-deadlift-setup':
      return (
        <>
          <Floor />
          {side([245, 175], [325, 220], [310, 280], [330, 110], [310, 250])}
          <path d="M310 75V280" stroke="#b5663b" strokeDasharray="7 5" />
          <circle cx="310" cy="250" r="30" fill="none" stroke="currentColor" strokeWidth="6" />
          <text x="340" y="100">
            肩
          </text>
          <text x="170" y="170">
            股関節
          </text>
          <text x="370" y="260">
            バーの鉛直線
          </text>
        </>
      );
    case 'ex-tech-deadlift-rise':
      return (
        <>
          <Floor />
          {f === 0
            ? side([245, 175], [325, 220], [310, 280], [330, 110], [310, 250])
            : f === 1
              ? side([260, 145], [325, 205], [310, 280], [345, 80], [325, 200])
              : side([310, 150], [310, 215], [310, 280], [310, 70], [340, 175])}
          <path
            d={`M${f === 0 ? 285 : f === 1 ? 300 : 315} ${f === 0 ? 250 : f === 1 ? 200 : 175}h60`}
            stroke="#b5663b"
            strokeWidth="10"
          />
        </>
      );
    case 'ex-tech-bench-stack':
      return (
        <>
          <text x="70" y="35">
            手首・前腕の拡大図（側面）
          </text>
          <path
            d="M270 240V120l70-20"
            stroke="currentColor"
            fill="none"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <circle cx="270" cy="120" r="7" fill="#b5663b" />
          <path
            d="M340 55V260M270 60V270"
            stroke="currentColor"
            strokeDasharray="6 6"
            opacity=".5"
          />
          <path d="M305 95h70" stroke="#b5663b" strokeWidth="14" />
          <text x="350" y="80">
            バー
          </text>
          <text x="170" y="125">
            手首
          </text>
          <text x="185" y="245">
            肘
          </text>
        </>
      );
    case 'ex-tech-birddog-range':
      return (
        <>
          <Floor />
          <Body
            head={[410, f === 2 ? 100 : 130]}
            chains={
              f === 0
                ? [
                    [
                      [390, 170],
                      [240, 170],
                      [220, 220],
                      [240, 280],
                    ],
                    [
                      [390, 170],
                      [390, 220],
                      [390, 280],
                    ],
                  ]
                : f === 1
                  ? [
                      [
                        [390, 170],
                        [240, 170],
                        [130, 170],
                      ],
                      [
                        [390, 170],
                        [510, 170],
                      ],
                      [
                        [240, 170],
                        [220, 220],
                        [240, 280],
                      ],
                      [
                        [390, 170],
                        [390, 220],
                        [390, 280],
                      ],
                    ]
                  : [
                      [
                        [390, 150],
                        [310, 190],
                        [240, 165],
                        [130, 90],
                      ],
                      [
                        [390, 150],
                        [500, 80],
                      ],
                      [
                        [240, 165],
                        [220, 220],
                        [240, 280],
                      ],
                      [
                        [390, 150],
                        [390, 220],
                        [390, 280],
                      ],
                    ]
            }
          />
        </>
      );
    case 'ex-tech-pushup-body':
      return (
        <>
          <Floor />
          <Body
            head={[420, f === 0 ? 170 : 105]}
            chains={[
              [
                [390, f === 0 ? 200 : 135],
                [270, 215],
                [130, 260],
              ],
              [
                [390, f === 0 ? 200 : 135],
                [350, 235],
                [400, 280],
              ],
            ]}
          />
        </>
      );
    case 'ex-tech-active-passive':
      return (
        <>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${i * 290},0)`}>
              <text x="65" y="40">
                {i === 0 ? '能動 90°' : '他動 120°'}（仮想値）
              </text>
              <path
                d={`M120 230h100M120 230L${i === 0 ? 120 : 70} ${i === 0 ? 130 : 143}`}
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
              />
              <circle cx="120" cy="230" r="8" fill="#b5663b" />
              <path
                d={`M170 230A50 50 0 0 0 ${i === 0 ? 120 : 95} ${i === 0 ? 180 : 187}`}
                fill="none"
                stroke="#b5663b"
                strokeWidth="3"
              />
            </g>
          ))}
        </>
      );
    case 'ex-tech-row-drive':
      return (
        <>
          <Floor />
          {f === 0 ? (
            <Body
              head={[360, 100]}
              chains={[
                [
                  [350, 135],
                  [280, 200],
                  [400, 210],
                  [400, 275],
                ],
                [
                  [350, 135],
                  [460, 160],
                ],
              ]}
            />
          ) : f === 1 ? (
            <Body
              head={[290, 100]}
              chains={[
                [
                  [280, 135],
                  [210, 200],
                  [300, 240],
                  [400, 275],
                ],
                [
                  [280, 135],
                  [400, 160],
                ],
              ]}
            />
          ) : (
            <Body
              head={[190, 100]}
              chains={[
                [
                  [200, 135],
                  [230, 200],
                  [310, 240],
                  [400, 275],
                ],
                [
                  [200, 135],
                  [180, 185],
                  [250, 170],
                ],
              ]}
            />
          )}
          <path d="M420 265l45-100" stroke="currentColor" strokeWidth="5" />
        </>
      );
    case 'ex-tech-landing-absorption':
      return (
        <>
          <Floor />
          {f === 0
            ? side([310, 125], [315, 170], [320, 215], [310, 65], [380, 90])
            : f === 1
              ? side([310, 160], [320, 215], [310, 280], [310, 90], [380, 130])
              : side([260, 200], [345, 225], [310, 280], [290, 130], [375, 155])}
        </>
      );
    case 'ex-tech-moment-arm':
      return (
        <>
          <circle cx="220" cy="280" r="8" fill="currentColor" />
          <text x="190" y="310">
            O
          </text>
          <path d="M220 280L400 40" stroke="currentColor" strokeWidth="4" />
          <path d="M400 25V295" stroke="currentColor" strokeDasharray="7 6" opacity=".5" />
          <path d="M220 280H400m-15 0v-15h15" stroke="#b5663b" strokeWidth="3" fill="none" />
          <path d="M400 40v110l-8-15m8 15 8-15" stroke="#b5663b" strokeWidth="5" fill="none" />
          <text x="415" y="100">
            100 N
          </text>
          <text x="280" y="265">
            0.30 m
          </text>
          <text x="230" y="135">
            0.50 m
          </text>
        </>
      );
    default:
      return null;
  }
}
export function QuestionMedia({ question: q }: { question: Question }) {
  const [frame, setFrame] = useState(0),
    [playing, setPlaying] = useState(false);
  const m = q.media,
    asset = m ? mediaAssets[m.assetId as keyof typeof mediaAssets] : undefined;
  useEffect(() => {
    setFrame(0);
    setPlaying(false);
  }, [q.id]);
  useEffect(() => {
    if (!playing || !asset || asset.frames < 2) return;
    const timer = window.setInterval(() => setFrame((f) => (f + 1) % asset.frames), 1100);
    return () => clearInterval(timer);
  }, [playing, asset]);
  if (!m || !asset) return null;
  return (
    <figure className="question-media" data-testid="question-media">
      {frameLabels[m.assetId] && (
        <p className="media-frame-label">
          図 {String.fromCharCode(65 + frame)}：{frameLabels[m.assetId][frame]}
        </p>
      )}
      <svg viewBox={viewBoxes[m.assetId] ?? '0 0 640 325'} role="img" aria-label={m.alt}>
        <title>{m.alt}</title>
        <Shape id={m.assetId} frame={frame} />
      </svg>
      <figcaption>
        {m.caption}
        <small>{mediaRights.note}</small>
      </figcaption>
      {asset.frames > 1 && (
        <div className="media-controls">
          <button
            type="button"
            className="button small secondary"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? '一時停止' : 'アニメーションを再生'}
          </button>
          {Array.from({ length: asset.frames }, (_, i) => (
            <button
              type="button"
              key={i}
              className={`chip ${frame === i ? 'active' : ''}`}
              aria-pressed={frame === i}
              onClick={() => {
                setPlaying(false);
                setFrame(i);
              }}
            >
              コマ {String.fromCharCode(65 + i)}
            </button>
          ))}
          <span aria-live={playing ? 'off' : 'polite'}>表示 {String.fromCharCode(65 + frame)}</span>
        </div>
      )}
    </figure>
  );
}
