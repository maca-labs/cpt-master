import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  House,
  Menu,
  Moon,
  Play,
  RotateCcw,
  Search,
  Settings as SettingsIcon,
  Sun,
  Trophy,
  WifiOff,
  X,
} from 'lucide-react';
import { LearningProvider, useLearning } from './app/context';
import { db } from './storage/db';
import { units } from './content';
import Dashboard from './features/Dashboard';
import { Catalog, Lesson } from './features/Lessons';
import { Diagnostic, Practice, Quiz, Results, Review } from './features/Practice';
import Settings from './features/Settings';
import Videos from './features/Videos';
import { Empty } from './components/Shared';
import Analytics from './features/Analytics';
import MockExamHome, { MockExamSession, MockExamResults } from './features/MockExam';
import PwaStatus from './components/PwaStatus';
import DedicatedExamWorkspace from './features/DedicatedExam';
import { dedicatedExamSets, loadDedicatedExamSet } from './content/dedicated-exam';
import type { DedicatedExamPack } from './engines/dedicated-exam';
const navigation = [
  { to: '/', label: 'ダッシュボード', icon: House, end: true },
  { to: '/learn', label: '学習テキスト', icon: BookOpen },
  { to: '/diagnostic', label: '実力診断', icon: ClipboardCheck },
  { to: '/practice', label: '問題演習', icon: Search },
  { to: '/review', label: '復習ノート', icon: RotateCcw },
  { to: '/videos', label: '動画ライブラリ', icon: Play },
  { to: '/exam', label: '模擬試験', icon: Trophy },
  { to: '/analytics', label: '成績・弱点分析', icon: BarChart3 },
];
function DedicatedExamRoute() {
  const [params, setParams] = useSearchParams();
  const selected =
    dedicatedExamSets.find((set) => set.id === params.get('set')) ?? dedicatedExamSets[0];
  const [loaded, setLoaded] = useState<{ id: string; pack: DedicatedExamPack | null }>();
  useEffect(() => {
    let active = true;
    void loadDedicatedExamSet(selected).then(
      (pack) => {
        if (active) setLoaded({ id: selected.id, pack });
      },
      () => {
        if (active) setLoaded({ id: selected.id, pack: null });
      },
    );
    return () => {
      active = false;
    };
  }, [selected]);
  const current = loaded?.id === selected.id ? loaded : undefined;
  return (
    <>
      <section className="panel">
        <label className="field-label">
          専用模試セット
          <select
            aria-label="専用模試セット"
            value={selected.id}
            onChange={(event) => setParams({ set: event.target.value })}
          >
            {dedicatedExamSets.map((candidate, index) => (
              <option key={candidate.id} value={candidate.id}>
                セット {index + 1}
              </option>
            ))}
          </select>
        </label>
      </section>
      {!current ? (
        <p className="notice" role="status">
          模試を読み込んでいます。
        </p>
      ) : current.pack ? (
        <DedicatedExamWorkspace key={current.pack.id} pack={current.pack} access="released" />
      ) : (
        <Empty
          title="模試を読み込めませんでした。"
          body="通信を確認してページを再読み込みしてください。"
        />
      )}
    </>
  );
}
function Shell() {
  const { data, settings, error, clearError, run } = useLearning(),
    location = useLocation();
  const [compact, setCompact] = useState(window.matchMedia('(max-width:700px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width:700px)');
    const change = () => setCompact(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(''),
    [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    setMenu(false);
    setSearch('');
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  const due = data.reviews.filter((r) => r.dueAt <= new Date().toISOString()).length;
  const matches = search.trim()
    ? units.filter((u) =>
        [u.title, u.subtitle, ...u.terms.map((t) => t.term)]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : [];
  return (
    <div className="app-shell">
      {menu && (
        <button
          className="sidebar-shade"
          aria-label="メニューを閉じる"
          onClick={() => setMenu(false)}
        />
      )}
      <aside
        className={`sidebar ${menu ? 'open' : ''}`}
        inert={compact && !menu}
        aria-hidden={compact && !menu}
      >
        <Link to="/" className="brand">
          <span className="brand-symbol">
            C<span>✓</span>
          </span>
          <span>
            CPT<span className="brand-master">master.</span>
          </span>
        </Link>
        <div className="sidebar-label">LEARN AT YOUR PACE</div>
        <nav>
          {navigation.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <n.icon size={19} />
              <span>{n.label}</span>
              {n.to === '/review' && due > 0 && <b className="nav-badge">{due}</b>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span>ONE STEP AT A TIME</span>
            <p>
              知識をつなぐ。
              <br />
              自信につなげる。
            </p>
            <div className="mini-plant" aria-hidden="true">
              ✳
            </div>
          </div>
          <NavLink to="/settings" className="nav-item">
            <SettingsIcon size={19} />
            設定・バックアップ
          </NavLink>
          <small className="version">PERSONAL EDITION · v0.6.2</small>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            aria-label="メニューを開く"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            マイラーニング
            <ChevronRight size={13} />
            <b>
              {navigation.find((n) => n.to !== '/' && location.pathname.startsWith(n.to))?.label ??
                (location.pathname.startsWith('/settings')
                  ? '設定'
                  : location.pathname.startsWith('/session')
                    ? '学習中'
                    : location.pathname.startsWith('/results')
                      ? '学習結果'
                      : 'ダッシュボード')}
            </b>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input
                aria-label="単元・用語を検索"
                placeholder="単元・用語を検索"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <div className="search-results">
                  {matches.length ? (
                    matches.map((u) => (
                      <Link key={u.id} to={`/learn/${u.id}`}>
                        {u.title}
                        <ArrowUpRight size={14} />
                      </Link>
                    ))
                  ) : (
                    <p>一致する単元はありません</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="icon-button"
              aria-label="ライト・ダークを切り替える"
              onClick={() =>
                void run(() =>
                  db.settings.update('main', {
                    theme: document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark',
                  }),
                )
              }
            >
              {settings.theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Link to="/settings" className="avatar" aria-label="個人設定">
              MY
            </Link>
          </div>
        </header>
        <main className="main-content">
          {!online && (
            <div className="notice offline">
              <WifiOff size={17} />
              オフラインです。保存済み教材で学習できます。YouTubeの視聴には通信が必要です。
            </div>
          )}
          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button className="icon-button" aria-label="エラーを閉じる" onClick={clearError}>
                <X size={18} />
              </button>
            </div>
          )}
          <PwaStatus />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<Catalog />} />
            <Route path="/learn/:id" element={<Lesson />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/session/:id" element={<Quiz />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/review" element={<Review />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/exam" element={<MockExamHome />} />
            <Route path="/exam/full" element={<DedicatedExamRoute />} />
            <Route path="/exam/:id" element={<MockExamSession />} />
            <Route path="/exam-results/:id" element={<MockExamResults />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="*"
              element={
                <Empty title="ページが見つかりません" body="メニューから学習を選んでください。">
                  <Link to="/">ダッシュボードへ</Link>
                </Empty>
              }
            />
          </Routes>
          <footer className="app-footer">
            <span>CPT Master</span>
            <small>学びを、あなたの力に。</small>
            <Link to="/settings">出典・暫定設定を確認</Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
export default function App() {
  return (
    <LearningProvider>
      <Shell />
    </LearningProvider>
  );
}
