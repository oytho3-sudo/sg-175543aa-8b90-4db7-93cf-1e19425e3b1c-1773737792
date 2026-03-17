'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MaschineRow {
  nr: string; typ: string; maschinenNr: string; kundenNr: string; komNr: string;
}

interface ZeitRow {
  datum: string;
  anreiseVon: string; anreiseBis: string; anreiseKm: string;
  arbeitVon: string; arbeitBis: string;
  rueckreiseVon: string; rueckreiseBis: string; rueckreiseKm: string;
  pauseMin: string;
}

interface MaterialRow {
  pos: string; beschreibung: string; teilenummer: string; stk: string;
}

interface FormData {
  version: number;
  ts: string;
  // Kunde
  kundeName: string; kundeStrasse: string; kundeTelefon: string; kundeReferenz: string;
  servicetechniker: string;
  // Maschine
  maschinen: MaschineRow[];
  // Durchgeführte Arbeiten
  arbeitenChecks: Record<string, boolean>;
  arbeitenSonstiges: string;
  // Reise
  reiseChecks: Record<string, boolean>;
  zeiten: ZeitRow[];
  // Material
  material: MaterialRow[];
  // Bemerkungen
  bemerkungen: string;
  // Unterschriften
  nameGerlieva: string;
  nameKunde: string;
  signatureDate: string;
  signatures: { 'sig-gerlieva'?: string; 'sig-kunde'?: string };
}

// ─── Initial state ─────────────────────────────────────────────────────────────

const emptyMaschine = (): MaschineRow => ({ nr: '', typ: '', maschinenNr: '', kundenNr: '', komNr: '' });
const emptyZeit = (): ZeitRow => ({
  datum: '', anreiseVon: '', anreiseBis: '', anreiseKm: '',
  arbeitVon: '', arbeitBis: '', rueckreiseVon: '', rueckreiseBis: '', rueckreiseKm: '', pauseMin: '',
});
const emptyMaterial = (): MaterialRow => ({ pos: '', beschreibung: '', teilenummer: '', stk: '' });

const initialForm = (): FormData => ({
  version: 1, ts: '',
  kundeName: '', kundeStrasse: '', kundeTelefon: '', kundeReferenz: '',
  servicetechniker: '',
  maschinen: Array.from({ length: 4 }, emptyMaschine),
  arbeitenChecks: { Montage: false, Inbetriebnahme: false, Softwareupdate: false, Wartung: false, Reparatur: false },
  arbeitenSonstiges: '',
  reiseChecks: { PKW: false, Flugzeug: false, Zug: false, Hotel: false, Sonstiges: false },
  zeiten: Array.from({ length: 7 }, emptyZeit),
  material: Array.from({ length: 15 }, emptyMaterial),
  bemerkungen: '',
  nameGerlieva: '', nameKunde: '', signatureDate: '',
  signatures: {},
});

// ─── Signature Modal ───────────────────────────────────────────────────────────

interface SigModalProps {
  label: string;
  existing?: string;
  onClose: (dataUrl?: string) => void;
}

function SignatureModal({ label, existing, onClose }: SigModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const container = canvas.parentElement!;
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth - 16;
      const h = container.clientHeight - 16;
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width; tmp.height = canvas.height;
      tmp.getContext('2d')!.drawImage(canvas, 0, 0);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      ctx.drawImage(tmp, 0, 0, w, h);
    };
    setTimeout(resize, 150);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!existing || !canvasRef.current) return;
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const img = new Image();
      img.onload = () => canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = existing;
    }, 200);
  }, [existing]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const r = canvas.getBoundingClientRect();
    const src = 'touches' in e ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };

  const onStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    drawing.current = true;
    const p = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const p = getPos(e, canvas);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.stroke();
  };
  const onStop = () => { drawing.current = false; canvasRef.current?.getContext('2d')?.closePath(); };

  const handleClear = () => {
    const c = canvasRef.current!;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
  };

  const handleOk = () => {
    onClose(canvasRef.current?.toDataURL('image/png'));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, background: '#fff',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ background: '#1a2744', color: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 'bold', flex: 1 }}>✍️ {label}</span>
        <button onClick={handleClear} style={btnStyle('#e8460a')}>🗑 Löschen</button>
        <button onClick={() => onClose()} style={btnStyle('#888')}>Abbrechen</button>
        <button onClick={handleOk} style={btnStyle('#2a7a2a')}>✓ Bestätigen</button>
      </div>
      <div style={{ flex: 1, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
        <canvas
          ref={canvasRef}
          width={400} height={200}
          style={{ background: 'white', border: '2px solid #aaa', borderRadius: 4, touchAction: 'none', cursor: 'crosshair', maxWidth: '100%', maxHeight: '100%' }}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onStop} onMouseLeave={onStop}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onStop}
        />
      </div>
      <div style={{ textAlign: 'center', padding: 6, fontSize: 8, color: '#666' }}>Hier unterschreiben</div>
    </div>
  );
}

const btnStyle = (bg: string): React.CSSProperties => ({
  background: bg, color: '#fff', border: 'none', padding: '8px 16px',
  borderRadius: 4, fontSize: 11, cursor: 'pointer', marginRight: 4,
  fontFamily: 'Arial, sans-serif',
});

// ─── Signature Preview Canvas ──────────────────────────────────────────────────

function SigPreview({ dataUrl, onClick }: { dataUrl?: string; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 300;
    const h = rect.height || 90;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
    if (dataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      img.src = dataUrl;
    } else {
      ctx.fillStyle = '#bbb'; ctx.font = '11px Arial'; ctx.textAlign = 'center';
      ctx.fillText('Tippen zum Unterschreiben', w / 2, h / 2);
    }
  }, [dataUrl]);

  useEffect(() => {
    setTimeout(redraw, 50);
    window.addEventListener('resize', redraw);
    return () => window.removeEventListener('resize', redraw);
  }, [redraw]);

  return (
    <canvas
      ref={canvasRef}
      width={400} height={100}
      onClick={onClick}
      style={{ border: '2px dashed #999', background: 'white', cursor: 'pointer', width: '100%', aspectRatio: '4/1', borderRadius: 3, display: 'block', touchAction: 'none' }}
    />
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, visible }: { msg: string; type: 'success' | 'error' | ''; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      background: type === 'success' ? '#1a7a3a' : type === 'error' ? '#c53a08' : '#333',
      color: 'white', padding: '12px 24px', borderRadius: 8, fontSize: 14, zIndex: 10000,
      opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none',
      maxWidth: '90%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      {msg}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ServiceberichtPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [sigModal, setSigModal] = useState<{ id: 'sig-gerlieva' | 'sig-kunde'; label: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | ''; visible: boolean }>({ msg: '', type: '', visible: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  // ── Field helpers ────────────────────────────────────────────────────────────

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const setMaschine = (i: number, field: keyof MaschineRow, val: string) =>
    setForm(f => { const m = [...f.maschinen]; m[i] = { ...m[i], [field]: val }; return { ...f, maschinen: m }; });

  const setZeit = (i: number, field: keyof ZeitRow, val: string) =>
    setForm(f => { const z = [...f.zeiten]; z[i] = { ...z[i], [field]: val }; return { ...f, zeiten: z }; });

  const setMaterial = (i: number, field: keyof MaterialRow, val: string) =>
    setForm(f => { const m = [...f.material]; m[i] = { ...m[i], [field]: val }; return { ...f, material: m }; });

  const toggleCheck = (group: 'arbeitenChecks' | 'reiseChecks', key: string) =>
    setForm(f => ({ ...f, [group]: { ...f[group], [key]: !f[group][key] } }));

  // ── File name helper ─────────────────────────────────────────────────────────

  const getFileName = (ext: string) => {
    const kunde = (form.kundeName || '').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');
    const datum = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return (kunde ? `Servicebericht_${kunde}_${datum}` : `Servicebericht_${datum}`) + '.' + ext;
  };

  // ── Serialize / Deserialize ──────────────────────────────────────────────────

  const collectFormData = () => ({ ...form, ts: new Date().toISOString() });

  const applyFormData = (data: FormData) => {
    if (!data || data.version !== 1) { showToast('Ungültige JSON-Datei', 'error'); return; }
    setForm(data);
    showToast('✅ Datei erfolgreich geladen!', 'success');
  };

  // ── Toolbar actions ──────────────────────────────────────────────────────────

  const handleSave = () => {
    try {
      const json = JSON.stringify(collectFormData(), null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = getFileName('json');
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast('✅ JSON gespeichert!', 'success');
    } catch (err: unknown) { showToast('Fehler: ' + (err as Error).message, 'error'); }
  };

  const handleShare = async () => {
    try {
      const json = JSON.stringify(collectFormData(), null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const file = new File([blob], getFileName('json'), { type: 'application/json' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Servicebericht GERLIEVA', files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = getFileName('json');
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        showToast('✅ JSON heruntergeladen!', 'success');
      }
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') showToast('Fehler: ' + (err as Error).message, 'error');
    }
  };

  const handlePdf = () => {
    alert('Im Druckdialog:\n1. Drucker → "Als PDF speichern"\n2. Weitere Einstellungen → "Hintergrundgrafiken" ✓ aktivieren\n→ Dann sind alle Farben im PDF enthalten.');
    window.print();
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as FormData;
        applyFormData(data);
      } catch (err: unknown) { showToast('Fehler beim Laden: ' + (err as Error).message, 'error'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Signature ────────────────────────────────────────────────────────────────

  const handleSigClose = (id: 'sig-gerlieva' | 'sig-kunde', dataUrl?: string) => {
    if (dataUrl) setForm(f => ({ ...f, signatures: { ...f.signatures, [id]: dataUrl } }));
    setSigModal(null);
  };

  const clearSig = (id: 'sig-gerlieva' | 'sig-kunde') => {
    setForm(f => { const s = { ...f.signatures }; delete s[id]; return { ...f, signatures: s }; });
  };

  // ── Styles ───────────────────────────────────────────────────────────────────

  const s = styles;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{printStyles}</style>

      {/* Toolbar */}
      <div style={s.toolbar} className="no-print">
        <button onClick={() => fileInputRef.current?.click()} style={{ ...s.tbtn, background: '#8e24aa' }}>📂 JSON laden</button>
        <button onClick={handlePdf} style={{ ...s.tbtn, background: '#e8460a' }}>⬇ Als PDF speichern</button>
        <button onClick={handleShare} style={{ ...s.tbtn, background: '#1a7a3a' }}>📤 JSON teilen</button>
        <button onClick={handleSave} style={{ ...s.tbtn, background: '#1a5fa8' }}>💾 JSON speichern</button>
        <span style={{ color: '#a8b8d8', fontSize: 9 }}>Servicebericht · GERLIEVA Sprühtechnik GmbH</span>
        <Link href="/" style={{ ...s.tbtn, background: '#1a5fa8', marginLeft: 'auto', textDecoration: 'none' }}>🏠 Home</Link>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleLoad} />
      </div>

      {/* Main container */}
      <div style={s.body}>
        <div style={s.container}>

          {/* Header */}
          <div style={s.header}>
            <h1 style={{ fontSize: 16, fontWeight: 'bold' }}>GERLIEVA Sprühtechnik GmbH</h1>
            <p style={{ fontSize: 9, color: '#666' }}>Tiergartenstraße 8 · 79423 Heitersheim · Tel. +49 7634 56912-0</p>
          </div>

          <h2 style={{ fontSize: 18, marginBottom: 15, background: 'transparent', padding: 0 }}>Servicebericht</h2>

          {/* ── Kunde ── */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Kunde</h2>
            {(['Name', 'Straße', 'Telefon', 'Referenz'] as const).map((label) => {
              const key = ('kunde' + label) as keyof FormData;
              return (
                <div key={label} style={s.gridRow}>
                  <span style={s.label}>{label}:</span>
                  <input type="text" value={form[key] as string} onChange={e => setField(key, e.target.value)} style={s.gridInput} />
                </div>
              );
            })}
          </div>

          {/* ── Servicetechniker ── */}
          <div style={s.inlineField}>
            <label style={s.label}>Servicetechniker:</label>
            <input type="text" value={form.servicetechniker} onChange={e => setField('servicetechniker', e.target.value)} style={s.gridInput} />
          </div>

          {/* ── Maschine ── */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Maschine</h2>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Nr.', 'Typ', 'Maschinen-Nr.', 'Kunden-Nr.', 'Kom.-Nr.'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.maschinen.map((row, i) => (
                    <tr key={i}>
                      {(['nr', 'typ', 'maschinenNr', 'kundenNr', 'komNr'] as (keyof MaschineRow)[]).map(f => (
                        <td key={f} style={s.td}><input type="text" value={row[f]} onChange={e => setMaschine(i, f, e.target.value)} style={s.cellInput} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Durchgeführte Arbeiten ── */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Durchgeführte Arbeiten</h2>
            <div style={s.checkboxList}>
              {Object.keys(form.arbeitenChecks).map(k => (
                <label key={k} style={s.checkboxItem}>
                  <input type="checkbox" checked={form.arbeitenChecks[k]} onChange={() => toggleCheck('arbeitenChecks', k)} /> {k}
                </label>
              ))}
            </div>
            <input type="text" value={form.arbeitenSonstiges} onChange={e => setField('arbeitenSonstiges', e.target.value)}
              style={{ width: '100%', border: '1px solid #ddd', padding: 6, borderRadius: 4, marginTop: 8, fontSize: 11, fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }} />
          </div>

          {/* ── Arbeits- und Reisezeiten ── */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Arbeits- und Reisezeiten</h2>
            <div style={s.checkboxList}>
              {Object.keys(form.reiseChecks).map(k => (
                <label key={k} style={s.checkboxItem}>
                  <input type="checkbox" checked={form.reiseChecks[k]} onChange={() => toggleCheck('reiseChecks', k)} /> {k}
                </label>
              ))}
            </div>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ ...s.table, marginTop: 10 }}>
                <colgroup>
                  <col style={{ width: 30 }} /><col style={{ width: 90 }} /><col style={{ width: 70 }} /><col style={{ width: 70 }} />
                  <col style={{ width: 50 }} /><col style={{ width: 70 }} /><col style={{ width: 70 }} /><col style={{ width: 70 }} />
                  <col style={{ width: 70 }} /><col style={{ width: 50 }} /><col style={{ width: 65 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th rowSpan={2} style={s.th}>Tag</th>
                    <th rowSpan={2} style={s.th}>Datum</th>
                    <th colSpan={2} style={{ ...s.th, background: '#d0d0d0' }}>Anreise</th>
                    <th rowSpan={2} style={s.th}>km</th>
                    <th colSpan={2} style={{ ...s.th, background: '#d0d0d0' }}>Arbeitszeit</th>
                    <th colSpan={2} style={{ ...s.th, background: '#d0d0d0' }}>Rückreise</th>
                    <th rowSpan={2} style={s.th}>km</th>
                    <th rowSpan={2} style={s.th}>Pause (Min)</th>
                  </tr>
                  <tr>
                    {['von', 'bis', 'von', 'bis', 'von', 'bis'].map((h, i) => (
                      <th key={i} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.zeiten.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...s.td, textAlign: 'center' }}>{i + 1}</td>
                      <td style={s.td}><input type="date" value={row.datum} onChange={e => setZeit(i, 'datum', e.target.value)} style={s.cellInput} /></td>
                      <td style={s.td}><input type="time" value={row.anreiseVon} onChange={e => setZeit(i, 'anreiseVon', e.target.value)} style={{ ...s.cellInput, width: 80 }} /></td>
                      <td style={s.td}><input type="time" value={row.anreiseBis} onChange={e => setZeit(i, 'anreiseBis', e.target.value)} style={{ ...s.cellInput, width: 80 }} /></td>
                      <td style={s.td}><input type="number" value={row.anreiseKm} onChange={e => setZeit(i, 'anreiseKm', e.target.value)} max={9999} style={{ ...s.cellInput, width: 60 }} /></td>
                      <td style={s.td}><input type="time" value={row.arbeitVon} onChange={e => setZeit(i, 'arbeitVon', e.target.value)} style={{ ...s.cellInput, width: 80 }} /></td>
                      <td style={s.td}><input type="time" value={row.arbeitBis} onChange={e => setZeit(i, 'arbeitBis', e.target.value)} style={{ ...s.cellInput, width: 80 }} /></td>
                      <td style={s.td}><input type="time" value={row.rueckreiseVon} onChange={e => setZeit(i, 'rueckreiseVon', e.target.value)} style={{ ...s.cellInput, width: 80 }} /></td>
                      <td style={s.td}><input type="time" value={row.rueckreiseBis} onChange={e => setZeit(i, 'rueckreiseBis', e.target.value)} style={{ ...s.cellInput, width: 80 }} /></td>
                      <td style={s.td}><input type="number" value={row.rueckreiseKm} onChange={e => setZeit(i, 'rueckreiseKm', e.target.value)} max={9999} style={{ ...s.cellInput, width: 60 }} /></td>
                      <td style={s.td}><input type="number" value={row.pauseMin} onChange={e => setZeit(i, 'pauseMin', e.target.value)} max={99999999} placeholder="Min" style={{ ...s.cellInput, width: 80 }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Material- und Teileliste ── */}
          <div style={{ pageBreakBefore: 'always' }}>
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Material- und Teileliste</h2>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={{ ...s.th, width: 60 }}>Pos.</th>
                      <th style={s.th}>Beschreibung</th>
                      <th style={{ ...s.th, width: 120 }}>Teilenummer</th>
                      <th style={{ ...s.th, width: 60 }}>Stk.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.material.map((row, i) => (
                      <tr key={i}>
                        {(['pos', 'beschreibung', 'teilenummer', 'stk'] as (keyof MaterialRow)[]).map(f => (
                          <td key={f} style={s.td}><input type="text" value={row[f]} onChange={e => setMaterial(i, f, e.target.value)} style={s.cellInput} /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Bemerkungen ── */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Bemerkungen / Fehlerbeschreibung</h2>
            <textarea
              value={form.bemerkungen}
              onChange={e => setField('bemerkungen', e.target.value)}
              style={{ width: '100%', height: 80, border: '1px solid #ddd', padding: 6, borderRadius: 4, fontSize: 11, fontFamily: 'Arial, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {/* ── Unterschriften ── */}
          <div style={{ ...s.section, marginTop: 20 }}>
            <h2 style={{ borderBottom: '3px solid #000', paddingBottom: 5, marginBottom: 15, fontSize: 14, background: '#f0f0f0', padding: '8px', borderRadius: 4 }}>
              BESTÄTIGUNG / UNTERSCHRIFTEN
            </h2>
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              {(['sig-gerlieva', 'sig-kunde'] as const).map(id => {
                const isGerlieva = id === 'sig-gerlieva';
                const label = isGerlieva ? 'Unterschrift GERLIEVA' : 'Unterschrift Kunde';
                const nameKey = isGerlieva ? 'nameGerlieva' : 'nameKunde';
                const placeholder = isGerlieva ? 'Name Techniker' : 'Name Kunde';
                return (
                  <div key={id} style={{ flex: 1, border: '1px solid #ccc', borderRadius: 4, padding: 8, background: '#fafafa' }}>
                    <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>{label}</div>
                    <SigPreview dataUrl={form.signatures[id]} onClick={() => setSigModal({ id, label })} />
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={form[nameKey]}
                        onChange={e => setField(nameKey, e.target.value)}
                        style={{ flex: 1, border: 'none', borderBottom: '1px solid #aaa', outline: 'none', fontSize: 11, background: 'transparent' }}
                      />
                      <button onClick={() => clearSig(id)} style={{ fontSize: 9, padding: '2px 6px', background: '#eee', border: '1px solid #bbb', borderRadius: 3, cursor: 'pointer' }}>
                        ✕ Löschen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: 15, fontWeight: 'bold', fontSize: 12 }}>
              Datum:{' '}
              <input
                type="date"
                value={form.signatureDate}
                onChange={e => setField('signatureDate', e.target.value)}
                style={{ border: '1px solid #ccc', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Signature Modal */}
      {sigModal && (
        <SignatureModal
          label={sigModal.label}
          existing={form.signatures[sigModal.id]}
          onClose={(dataUrl) => handleSigClose(sigModal.id, dataUrl)}
        />
      )}

      {/* Toast */}
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible} />
    </>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
    background: '#1a2744', padding: '7px 18px',
    display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
  },
  tbtn: {
    border: 'none', padding: '6px 16px', fontSize: 9, fontWeight: 'bold',
    borderRadius: 3, cursor: 'pointer', fontFamily: 'Arial, sans-serif', color: '#fff',
  },
  body: {
    fontFamily: 'Arial, sans-serif', fontSize: 11, padding: 20,
    maxWidth: 1000, margin: '0 auto', background: '#f5f5f5',
  },
  container: {
    background: 'white', padding: 20, borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginTop: 50,
  },
  header: {
    borderBottom: '2px solid #000', marginBottom: 15, paddingBottom: 8,
  },
  section: {
    marginBottom: 15, border: '1px solid #ccc', padding: 10,
    borderRadius: 4, background: 'white',
  },
  sectionTitle: {
    fontSize: 14, marginBottom: 10, background: '#f0f0f0',
    padding: 8, borderRadius: 4,
  },
  table: {
    width: '100%', borderCollapse: 'collapse' as const, marginTop: 8,
  },
  th: {
    border: '1px solid #000', padding: 4, textAlign: 'center' as const,
    background: '#e0e0e0', fontWeight: 'bold', fontSize: 10,
  },
  td: {
    border: '1px solid #000', padding: 4, textAlign: 'left' as const, fontSize: 10,
  },
  cellInput: {
    width: '100%', border: 'none', padding: 2, background: 'transparent',
    fontSize: 10, fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' as const,
  },
  gridRow: {
    display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8,
    marginBottom: 5, alignItems: 'center',
  },
  label: { fontWeight: 'bold' },
  gridInput: {
    border: '1px solid #ddd', padding: 4, borderRadius: 3,
    fontSize: 11, fontFamily: 'Arial, sans-serif',
  },
  inlineField: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
  },
  checkboxList: {
    display: 'flex', flexWrap: 'wrap' as const, gap: 15, marginBottom: 8,
  },
  checkboxItem: {
    display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
  },
};

const printStyles = `
  @media print {
    .no-print { display: none !important; }
    body { padding: 10px; font-size: 10.5px; background: white; }
  }
`;