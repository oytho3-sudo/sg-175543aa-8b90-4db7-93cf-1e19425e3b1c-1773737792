'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// i18n
// ═══════════════════════════════════════════════════════════════════════════════

type Lang = 'de' | 'en' | 'fr';

const translations = {
  de: {
    loadJson:       '📂 JSON laden',
    savePdf:        '⬇ Als PDF speichern',
    shareJson:      '📤 JSON teilen',
    saveJson:       '💾 JSON speichern',
    toolbarTitle:   'Wartungsprotokoll GSZ 725 / GS 710 · GERLIEVA Sprühtechnik GmbH',
    pdfAlert:       'Im Druckdialog:\n1. Drucker → "Als PDF speichern"\n2. Weitere Einstellungen → "Hintergrundgrafiken" ✓ aktivieren\n3. Ränder auf "Minimal" setzen\n→ Dann sind alle Farben im PDF enthalten.',
    toastSaved:     '✅ JSON gespeichert!',
    toastDownloaded:'✅ JSON heruntergeladen!',
    toastLoaded:    '✅ Datei erfolgreich geladen!',
    toastInvalid:   'Ungültige JSON-Datei',
    toastError:     'Fehler: ',
    toastLoadError: 'Fehler beim Laden: ',
    docTitle:       'Wartungsprotokoll',
    labelKunde:     'Kunde',
    labelArbeitsplatz: 'Arbeitsplatz',
    labelDgm:       'DGM',
    labelPosition:  'Position',
    labelMaschinTyp:'Masch. Typ',
    labelMaschineNr:'Maschine Nr.',
    labelKom:       'Kom.',
    labelBaujahr:   'Baujahr',
    colPruefpunkt:  'Prüfpunkt / Kontrollieren auf',
    colOk:          'o.k.',
    colName:        'Name',
    colBemerkung:   'Bemerkung – Stückzahl und Bezeichnung getauschter Teile eintragen, möglichst mit Artikel Nr.',
    sectionGerlieva:'GERLIEVA',
    labelDatum:     'Datum:',
    sectionSign:    'BESTÄTIGUNG / UNTERSCHRIFTEN',
    sigGerlieva:    'Unterschrift GERLIEVA',
    sigKunde:       'Unterschrift Kunde',
    sigPlaceholderTech:  'Name Techniker',
    sigPlaceholderKunde: 'Name Kunde',
    sigDelete:      '✕ Löschen',
    sigLabel:       'Hier unterschreiben',
    sigClear:       '🗑 Löschen',
    sigCancel:      'Abbrechen',
    sigOk:          '✓ Bestätigen',
    sigTap:         'Tippen zum Unterschreiben',
    labelGesamtAZ:  'gesamte Arbeitszeit:',
    labelVon:       'von',
    labelBis:       'bis',
  },
  en: {
    loadJson:       '📂 Load JSON',
    savePdf:        '⬇ Save as PDF',
    shareJson:      '📤 Share JSON',
    saveJson:       '💾 Save JSON',
    toolbarTitle:   'Maintenance Log GSZ 725 / GS 710 · GERLIEVA Sprühtechnik GmbH',
    pdfAlert:       'In the print dialog:\n1. Printer → "Save as PDF"\n2. More settings → enable "Background graphics" ✓\n→ This ensures all colours appear in the PDF.',
    toastSaved:     '✅ JSON saved!',
    toastDownloaded:'✅ JSON downloaded!',
    toastLoaded:    '✅ File loaded successfully!',
    toastInvalid:   'Invalid JSON file',
    toastError:     'Error: ',
    toastLoadError: 'Error loading file: ',
    docTitle:       'Maintenance Log',
    labelKunde:     'Customer',
    labelArbeitsplatz: 'Workplace',
    labelDgm:       'DGM',
    labelPosition:  'Position',
    labelMaschinTyp:'Machine Type',
    labelMaschineNr:'Machine No.',
    labelKom:       'Com.',
    labelBaujahr:   'Year',
    colPruefpunkt:  'Inspection Point / Check for',
    colOk:          'o.k.',
    colName:        'Name',
    colBemerkung:   'Remarks – quantity and description of replaced parts, preferably with article no.',
    sectionGerlieva:'GERLIEVA',
    labelDatum:     'Date:',
    sectionSign:    'CONFIRMATION / SIGNATURES',
    sigGerlieva:    'Signature GERLIEVA',
    sigKunde:       'Customer Signature',
    sigPlaceholderTech:  'Technician Name',
    sigPlaceholderKunde: 'Customer Name',
    sigDelete:      '✕ Clear',
    sigLabel:       'Sign here',
    sigClear:       '🗑 Clear',
    sigCancel:      'Cancel',
    sigOk:          '✓ Confirm',
    sigTap:         'Tap to sign',
    labelGesamtAZ:  'total working time:',
    labelVon:       'from',
    labelBis:       'to',
  },
  fr: {
    loadJson:       '📂 Charger JSON',
    savePdf:        '⬇ Enregistrer en PDF',
    shareJson:      '📤 Partager JSON',
    saveJson:       '💾 Sauvegarder JSON',
    toolbarTitle:   'Protocole de maintenance GSZ 725 / GS 710 · GERLIEVA Sprühtechnik GmbH',
    pdfAlert:       "Dans la boîte de dialogue d'impression :\n1. Imprimante → \"Enregistrer en PDF\"\n2. Paramètres → activer \"Graphiques d'arrière-plan\" ✓\n→ Toutes les couleurs apparaîtront dans le PDF.",
    toastSaved:     '✅ JSON enregistré !',
    toastDownloaded:'✅ JSON téléchargé !',
    toastLoaded:    '✅ Fichier chargé avec succès !',
    toastInvalid:   'Fichier JSON invalide',
    toastError:     'Erreur : ',
    toastLoadError: 'Erreur de chargement : ',
    docTitle:       'Protocole de maintenance',
    labelKunde:     'Client',
    labelArbeitsplatz: 'Poste de travail',
    labelDgm:       'DGM',
    labelPosition:  'Position',
    labelMaschinTyp:'Type de machine',
    labelMaschineNr:'N° machine',
    labelKom:       'Com.',
    labelBaujahr:   'Année',
    colPruefpunkt:  'Point de contrôle / Vérifier',
    colOk:          'o.k.',
    colName:        'Nom',
    colBemerkung:   'Remarques – quantité et désignation des pièces remplacées, de préférence avec n° article.',
    sectionGerlieva:'GERLIEVA',
    labelDatum:     'Date :',
    sectionSign:    'CONFIRMATION / SIGNATURES',
    sigGerlieva:    'Signature GERLIEVA',
    sigKunde:       'Signature client',
    sigPlaceholderTech:  'Nom du technicien',
    sigPlaceholderKunde: 'Nom du client',
    sigDelete:      '✕ Effacer',
    sigLabel:       'Signer ici',
    sigClear:       '🗑 Effacer',
    sigCancel:      'Annuler',
    sigOk:          '✓ Confirmer',
    sigTap:         'Appuyer pour signer',
    labelGesamtAZ:  'temps de travail total :',
    labelVon:       'de',
    labelBis:       'à',
  },
} satisfies Record<Lang, Record<string, string>>;

type TKeys = keyof typeof translations['de'];
type T = Record<TKeys, string>;

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

type CheckState = 0 | 1 | 2;
type Ck2State   = 0 | 1;

interface Zeile {
  divider?: string;
  text?: string;
  bem?: string | null;
}

interface ZeilenState {
  ck:   CheckState;
  name: string;
  bem:  string;
}

interface TechnikerRow {
  name: string;
  azH:  string;
  azM:  string;
}

interface FormData {
  version:       number;
  ts:            string;
  kunde:         string;
  arbeitsplatz:  string;
  dgm:           string;
  position:      string;
  maschinTyp:    string;
  maschineNr:    string;
  kom:           string;
  baujahr:       string;
  wartungDatum:  string;
  techniker:     TechnikerRow[];
  vonZeit:       string;
  bisZeit:       string;
  nameGerlieva:  string;
  nameKunde:     string;
  signatureDate: string;
  signatures:    { 'sig-gerlieva'?: string; 'sig-kunde'?: string };
  bemerkungen:   string;
  massnahmen:    string;
  zeilenState:   ZeilenState[];
  nullPunkt:     { horVorh: Ck2State; horGet: Ck2State; vertVorh: Ck2State; vertGet: Ck2State };
  batt:          { b1: Ck2State; b2: Ck2State };
  druck:         { tmAktiv: Ck2State; luftAktiv: Ck2State; tmBar: string; luftBar: string };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Zeilen-Daten
// ═══════════════════════════════════════════════════════════════════════════════

const alleZeilen: Zeile[] = [
  { divider: '▶  ALLGEMEIN' },
  { text: 'Erster Eindruck Abdeckungen vorhanden / Sauberkeit, usw.', bem: '' },
  { text: 'Probelauf Laufgeräusche / optischer Eindruck / Fixierung', bem: '' },
  { text: 'Befestigung an DGM Wenn möglich Schrauben kontrollieren<br/>Ansonsten Anlage hinten versuchen zu bewegen; wenn fest, dann o.k.', bem: '' },
  { text: 'Zentralschmierung Druckminderer vorhanden: Funktion / Dichtigkeit<br/>Richtiges Öl eingefüllt / auf Wasser prüfen / Deckel / Messanschluss', bem: '' },
  { text: 'Versorgungsplatte/Schrank Filter / Filterelemente / Dichtigkeit<br/>Automatikfilter / Manometer / Drücke', bem: '' },
  { text: 'Sprühkopf Funktion / Belegung / Dichtigkeit / Düsensitze', bem: '' },
  { text: 'AVS-Verschlusseinheiten Dichtigkeit / Funktion', bem: '' },
  { text: 'Membrane Dichtigkeit / Funktion', bem: '' },
  { text: 'Abstreifer Zustand horizontal und vertikal', bem: '' },
  { divider: '▶  HORIZONTAL' },
  { text: 'Linearführung horizontal Spiel (hinten anheben) / Rost / Laufspuren<br/>Abstreifer / Rost / Lager nachschmieren', bem: '' },
  { text: 'Riemenantrieb horiz. Zahnriemen / Riemenspannung / Riemenscheibe', bem: '' },
  { text: 'Spannsatz horiz. Drehmoment 12 Nm', bem: '' },
  { text: 'Riemenhaltewinkel Sind Schrauben fest', bem: '' },
  { text: 'Schneckengetriebe Laufgeräusch / Sichtkontrolle / Ölaustritt<br/>Axiale Sicherung der Abtriebswelle', bem: '' },
  { divider: '▶  VERTIKAL' },
  { text: 'Linearführung vertikal Trägerrohr aus Fixierung fahren u. Spiel prüfen<br/>Schmierung / Rost / Laufspuren (bei Teleskop unteren Zahnriemen öffnen)', bem: '' },
  { text: 'Antrieb vertikal Zahnriemen / Riemenscheibe / Riemenspannung', bem: '' },
  { text: 'Zahnstange Befestigungsschrauben<br/>Einlaufspuren an Zahnstange und Zahnrad', bem: '' },
  { text: 'Motorhaltebremse vertikal Bei Notaus Haltekraft prüfen', bem: '' },
  { text: 'Halteplatte Zahnriemen Schrauben kontrollieren / mit Kleber sichern', bem: '' },
  { text: 'Endschalter mech. u. induktiv Verschleiß an der Rolle / Funktion', bem: '' },
  { text: 'Spannsatz vertikal Drehmoment 15 Nm', bem: '' },
  { text: 'Planetengetriebe Laufgeräusch / Sichtkontrolle / Ölaustritt', bem: '' },
  { text: 'Trägerrohr Schweißnähte / Ausrichtung / sind Schrauben fest<br/>Dichtigkeit der Anschlussplatten', bem: '' },
  { text: 'Trägerrohrfixierung Einstellung / Verschleißteile prüfen', bem: '' },
];

const seite2Zeilen: Zeile[] = [
  { divider: '▶  ALLGEMEIN' },
  { text: 'Ventile Funktion / Stecker / Dichtungen', bem: '' },
  { text: 'Schläuche Alterung / Beschädigung / Dichtigkeit<br/>Steuerluftschläuche im Verteiler', bem: '' },
  { text: 'Energieketten Halterungen fest / Beschädigung / alle Deckel vorhanden', bem: '' },
  { text: 'Kabel und Stecker Sichtkontrolle / Beschädigung / Zugentlastung', bem: '' },
  { text: 'Lampentest Bedienteil Schlösser Funktion', bem: '' },
  // nach idx 5 kommen 3 Spezialzeilen (0-Punkt, Batterie, Druck) bevor die bem=null Zeilen
  { text: '<strong>Bemerkungen</strong><br/><strong>Wartung Vorjahr</strong>', bem: null },
  { text: '<strong>Maßnahmen/<br/>Empfehlungen</strong>', bem: null },
];

// Gesamtanzahl Zeilen für zeilenState-Array:
// alleZeilen.length + seite2Zeilen.length (inkl. null-Zeilen) + 3 Spezialzeilen
const TOTAL_ZEILEN_COUNT = alleZeilen.length + seite2Zeilen.length + 3;

const emptyTechniker = (): TechnikerRow => ({ name: '', azH: '', azM: '' });

const initialForm = (): FormData => ({
  version:       1,
  ts:            '',
  kunde:         '',
  arbeitsplatz:  '',
  dgm:           '',
  position:      '',
  maschinTyp:    '',
  maschineNr:    '',
  kom:           '',
  baujahr:       '',
  wartungDatum:  '',
  techniker:     Array.from({ length: 4 }, emptyTechniker),
  vonZeit:       '',
  bisZeit:       '',
  nameGerlieva:  '',
  nameKunde:     '',
  signatureDate: '',
  signatures:    {},
  bemerkungen:   '',
  massnahmen:    '',
  zeilenState:   Array.from({ length: TOTAL_ZEILEN_COUNT }, () => ({ ck: 0 as CheckState, name: '', bem: '' })),
  nullPunkt:     { horVorh: 0, horGet: 0, vertVorh: 0, vertGet: 0 },
  batt:          { b1: 0, b2: 0 },
  druck:         { tmAktiv: 0, luftAktiv: 0, tmBar: '', luftBar: '' },
});

// ═══════════════════════════════════════════════════════════════════════════════
// Hilfsfunktionen
// ═══════════════════════════════════════════════════════════════════════════════

function calcGesamtMinutes(techniker: TechnikerRow[]): string {
  let total = 0;
  techniker.forEach(t => { total += (parseInt(t.azH) || 0) * 60 + (parseInt(t.azM) || 0); });
  const gh = Math.floor(total / 60), gm = total % 60;
  return `${String(gh).padStart(2, '0')} h ${String(gm).padStart(2, '0')} min`;
}

function buildFileName(ext: string, maschineNr: string): string {
  const nr = maschineNr.trim().replace(/[^a-zA-Z0-9_\-]/g, '_');
  const d  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return (nr ? `Wartungsprotokoll_${nr}_${d}` : `Wartungsprotokoll_${d}`) + '.' + ext;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Language Switcher
// ═══════════════════════════════════════════════════════════════════════════════

const FLAG: Record<Lang, string> = { de: '🇩🇪', en: '🇬🇧', fr: '🇫🇷' };

function LangSwitcher({ current, onChange }: { current: Lang; onChange: (l: Lang) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {(['de', 'en', 'fr'] as Lang[]).map(l => (
        <button key={l} onClick={() => onChange(l)} title={l.toUpperCase()} style={{
          border: current === l ? '2px solid #fff' : '2px solid transparent',
          background: current === l ? 'rgba(255,255,255,0.18)' : 'transparent',
          borderRadius: 4, cursor: 'pointer', padding: '2px 7px', fontSize: 17, lineHeight: 1,
          transition: 'all 0.15s',
        }}>
          {FLAG[l]}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Toast
// ═══════════════════════════════════════════════════════════════════════════════

function Toast({ msg, type, visible }: { msg: string; type: 'success' | 'error' | ''; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      background: type === 'success' ? '#1a7a3a' : type === 'error' ? '#c53a08' : '#333',
      color: 'white', padding: '12px 24px', borderRadius: 8, fontSize: 14, zIndex: 10000,
      opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none',
      maxWidth: '90%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>{msg}</div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Signature Modal
// ═══════════════════════════════════════════════════════════════════════════════

interface SigModalProps { label: string; existing?: string; onClose: (dataUrl?: string) => void; t: T; }

function SignatureModal({ label, existing, onClose, t }: SigModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing   = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const resize = () => {
      const container = canvas.parentElement!;
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth - 16, h = container.clientHeight - 16;
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width; tmp.height = canvas.height;
      tmp.getContext('2d')!.drawImage(canvas, 0, 0);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      const ctx = canvas.getContext('2d')!; ctx.scale(dpr, dpr); ctx.drawImage(tmp, 0, 0, w, h);
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

  const getPos = (e: React.MouseEvent | React.TouchEvent, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect(), src = 'touches' in e ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };
  const onStart = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); drawing.current = true; const c = canvasRef.current!; const ctx = c.getContext('2d')!; const p = getPos(e, c); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const onMove  = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); if (!drawing.current) return; const c = canvasRef.current!; const ctx = c.getContext('2d')!; const p = getPos(e, c); ctx.lineTo(p.x, p.y); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); };
  const onStop  = () => { drawing.current = false; canvasRef.current?.getContext('2d')?.closePath(); };

  const tbtn = (bg: string): React.CSSProperties => ({ background: bg, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontSize: 11, cursor: 'pointer', marginRight: 4, fontFamily: 'Arial, sans-serif' });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#1a2744', color: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 'bold', flex: 1 }}>✍️ {label}</span>
        <button onClick={() => { const c = canvasRef.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); }} style={tbtn('#e8460a')}>{t.sigClear}</button>
        <button onClick={() => onClose()} style={tbtn('#888')}>{t.sigCancel}</button>
        <button onClick={() => onClose(canvasRef.current?.toDataURL('image/png'))} style={tbtn('#2a7a2a')}>{t.sigOk}</button>
      </div>
      <div style={{ flex: 1, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
        <canvas ref={canvasRef} width={400} height={200}
          style={{ background: 'white', border: '2px solid #aaa', borderRadius: 4, touchAction: 'none', cursor: 'crosshair', maxWidth: '100%', maxHeight: '100%' }}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onStop} onMouseLeave={onStop}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onStop} />
      </div>
      <div style={{ textAlign: 'center', padding: 6, fontSize: 8, color: '#666' }}>{t.sigLabel}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Signature Preview
// ═══════════════════════════════════════════════════════════════════════════════

function SigPreview({ dataUrl, onClick, tapLabel }: { dataUrl?: string; onClick: () => void; tapLabel: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const redraw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 300, h = rect.height || 90;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
    if (dataUrl) {
      const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, w, h); img.src = dataUrl;
    } else {
      ctx.fillStyle = '#bbb'; ctx.font = '11px Arial'; ctx.textAlign = 'center';
      ctx.fillText(tapLabel, w / 2, h / 2);
    }
  }, [dataUrl, tapLabel]);

  useEffect(() => {
    setTimeout(redraw, 50);
    window.addEventListener('resize', redraw);
    return () => window.removeEventListener('resize', redraw);
  }, [redraw]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/1' }}>
      <canvas ref={canvasRef} width={400} height={100} onClick={onClick}
        className="sig-canvas"
        style={{ border: '2px dashed #999', background: 'white', cursor: 'pointer', width: '100%', height: '100%', borderRadius: 3, display: 'block', touchAction: 'none' }} />
      {dataUrl
        ? <img src={dataUrl} alt="Unterschrift" className="sig-print-img"
            style={{ display: 'none', width: '100%', height: '100%', objectFit: 'contain', border: '1px solid #000' }} />
        : <div className="sig-print-empty"
            style={{ display: 'none', width: '100%', height: '100%', border: '1px solid #000', background: 'white' }} />
      }
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Checkbox-Komponenten
// ═══════════════════════════════════════════════════════════════════════════════

const CK_LABELS: Record<number, string> = { 0: '', 1: '✓', 2: '✗' };
const CK_BG:     Record<number, string> = { 0: '',          1: '#d4edda', 2: '#f8d7da' };

function CheckCell({ state, onChange }: { state: CheckState; onChange: (s: CheckState) => void }) {
  return (
    <td onClick={() => onChange(((state + 1) % 3) as CheckState)}
      style={{ border: '1px solid #000', width: 20, textAlign: 'center', verticalAlign: 'middle',
        cursor: 'pointer', fontSize: 10, padding: 1, userSelect: 'none', background: CK_BG[state] }}>
      {CK_LABELS[state]}
    </td>
  );
}

function Ck2({ state, onChange }: { state: Ck2State; onChange: (s: Ck2State) => void }) {
  return (
    <span onClick={() => onChange(state === 1 ? 0 : 1)}
      style={{ display: 'inline-block', width: 18, height: 18, border: '1.5px solid #000',
        cursor: 'pointer', verticalAlign: 'middle', fontSize: 11, textAlign: 'center',
        lineHeight: '18px', userSelect: 'none', background: state === 1 ? '#d4edda' : '',
        WebkitTapHighlightColor: 'transparent' }}>
      {state === 1 ? '✓' : '\u00a0'}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PruefZeile
// ═══════════════════════════════════════════════════════════════════════════════

function PruefZeile({ zeile, state, onChange, rowIndex }: {
  zeile: Zeile; state: ZeilenState;
  onChange: (s: Partial<ZeilenState>) => void;
  rowIndex: number;
}) {
  const bg   = rowIndex % 2 === 0 ? '#fff' : '#f3f3f3';
  const cell: React.CSSProperties = { border: '1px solid #000', padding: '2px 3px', verticalAlign: 'top', wordBreak: 'break-word', lineHeight: 1.3, fontSize: 8.5, background: bg };
  const inp:  React.CSSProperties = { border: 'none', outline: 'none', width: '100%', fontFamily: 'Arial', fontSize: 8, background: 'transparent', padding: 0 };

  if (zeile.divider) {
    return (
      <tr>
        <td colSpan={4} style={{ background: '#cfdff5', fontWeight: 'bold', fontSize: 8, padding: '2px 4px', letterSpacing: '.03em', border: '1px solid #000' }}>
          {zeile.divider}
        </td>
      </tr>
    );
  }
  if (zeile.bem === null) {
    return (
      <tr>
        <td colSpan={4} style={{ ...cell, minHeight: 26 }}>
          <span dangerouslySetInnerHTML={{ __html: zeile.text || '' }} />
          &nbsp;&nbsp;
          <input type="text" value={state.bem} onChange={e => onChange({ bem: e.target.value })}
            style={{ ...inp, width: '60%', display: 'inline-block' }} />
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td style={cell}><span dangerouslySetInnerHTML={{ __html: zeile.text || '' }} /></td>
      <CheckCell state={state.ck} onChange={ck => onChange({ ck })} />
      <td style={cell}><input type="text" value={state.name} onChange={e => onChange({ name: e.target.value })} style={inp} /></td>
      <td style={cell}><input type="text" value={state.bem}  onChange={e => onChange({ bem: e.target.value })}  style={inp} /></td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Print Styles
// ═══════════════════════════════════════════════════════════════════════════════

const printStyles = `
  @page { size: A4 portrait; margin: 10mm 11mm; }
  @media print {
    .no-print { display: none !important; }
    #page-wrapper { margin: 0 !important; padding: 0 !important; gap: 0 !important; display: block !important; }
    .a4 { width: 100% !important; padding: 0 !important; box-shadow: none !important; page-break-after: always !important; }
    tr { page-break-inside: avoid; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    input[type="text"], input[type="number"], input[type="time"], input[type="date"], input[type="month"] {
      border-bottom: 1px solid #bbb !important;
    }
    .sig-canvas      { display: none !important; }
    .sig-print-img   { display: block !important; width: 100% !important; height: auto !important; max-height: 80px; object-fit: contain; border: 1px solid #000; }
    .sig-print-empty { display: block !important; width: 100% !important; height: 60px !important; border: 1px solid #000; background: white; }
  }
  @media screen and (max-width: 600px) {
    .toolbar-title { display: none; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// Logo
// ═══════════════════════════════════════════════════════════════════════════════

const LOGO_B64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/4SWIRXhpZgAATU0AKgAAAAgABgALAAIAAAAmAAAIYgESAAMAAAABAAEAAAExAAIAAAAmAAAIiAEyAAIAAAAUAAAIrodpAAQAAAABAAAIwuocAAcAAAgMAAAAVgAAEUYc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFdpbmRvd3MgUGhvdG8gRWRpdG9yIDEwLjAuMTAwMTEuMTYzODQAV2luZG93cyBQaG90byBFZGl0b3IgMTAuMC4xMDAxMS4xNjM4NAAyMDIxOjAzOjE5IDE2OjUzOjExAAAGkAMAAgAAABQAABEckAQAAgAAABQAABEwkpEAAgAAAAMxMwAAkpIAAgAAAAMxMwAAoAEAAwAAAAEAAQAA6hwABwAACAwAAAkQAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAxOToxMDoxNyAwODozNzo0OAAyMDE5OjEwOjE3IDA4OjM3OjQ4AAAAB';

// ═══════════════════════════════════════════════════════════════════════════════
// Haupt-Komponente
// ═══════════════════════════════════════════════════════════════════════════════

export default function WartungsprotokollPage() {
  const [lang, setLang]         = useState<Lang>('de');
  const t = translations[lang] as T;

  const [form, setForm]         = useState<FormData>(initialForm);
  const [sigModal, setSigModal] = useState<{ id: 'sig-gerlieva' | 'sig-kunde'; label: string } | null>(null);
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' | ''; visible: boolean }>({ msg: '', type: '', visible: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 2500);
  };

  // ── Field helpers ──────────────────────────────────────────────────────────
  const setField = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const setZeile = (idx: number, partial: Partial<ZeilenState>) =>
    setForm(f => { const z = [...f.zeilenState]; z[idx] = { ...z[idx], ...partial }; return { ...f, zeilenState: z }; });

  const setTechniker = (i: number, key: keyof TechnikerRow, val: string) =>
    setForm(f => { const tech = [...f.techniker]; tech[i] = { ...tech[i], [key]: val }; return { ...f, techniker: tech }; });

  // ── File name ──────────────────────────────────────────────────────────────
  const getFileNameFn = (ext: string) => buildFileName(ext, form.maschineNr);

  // ── JSON I/O ───────────────────────────────────────────────────────────────
  const collectFormData = () => ({ ...form, ts: new Date().toISOString() });

  const applyFormData = (data: FormData) => {
    if (!data || data.version !== 1) { showToast(t.toastInvalid, 'error'); return; }
    setForm(data);
    showToast(t.toastLoaded, 'success');
  };

  // ── Toolbar actions ────────────────────────────────────────────────────────
  const handleSave = () => {
    try {
      const blob = new Blob([JSON.stringify(collectFormData(), null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a'); a.href = url; a.download = getFileNameFn('json');
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast(t.toastSaved, 'success');
    } catch (err: unknown) { showToast(t.toastError + (err as Error).message, 'error'); }
  };

  const handleShare = async () => {
    try {
      const blob = new Blob([JSON.stringify(collectFormData(), null, 2)], { type: 'application/json' });
      const file = new File([blob], getFileNameFn('json'), { type: 'application/json' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Wartungsprotokoll GERLIEVA', files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a'); a.href = url; a.download = getFileNameFn('json');
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        showToast(t.toastDownloaded, 'success');
      }
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') showToast(t.toastError + (err as Error).message, 'error');
    }
  };

  const handlePdf = () => {
    alert(t.pdfAlert);
    const restoreList: Array<() => void> = [];
    document.querySelectorAll<HTMLInputElement>(
      'input[type="text"], input[type="number"], input[type="time"], input[type="date"], input[type="month"]'
    ).forEach(el => {
      const old = el.getAttribute('value');
      el.setAttribute('value', el.value);
      restoreList.push(() => { if (old === null) el.removeAttribute('value'); else el.setAttribute('value', old); });
    });
    window.print();
    setTimeout(() => restoreList.forEach(fn => fn()), 1000);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { applyFormData(JSON.parse(ev.target?.result as string)); }
      catch (err: unknown) { showToast(t.toastLoadError + (err as Error).message, 'error'); }
    };
    reader.readAsText(file); e.target.value = '';
  };

  // ── Signature ──────────────────────────────────────────────────────────────
  const handleSigClose = (id: 'sig-gerlieva' | 'sig-kunde', dataUrl?: string) => {
    if (dataUrl) setForm(f => ({ ...f, signatures: { ...f.signatures, [id]: dataUrl } }));
    setSigModal(null);
  };
  const clearSig = (id: 'sig-gerlieva' | 'sig-kunde') =>
    setForm(f => { const s = { ...f.signatures }; delete s[id]; return { ...f, signatures: s }; });

  // ── Computed ───────────────────────────────────────────────────────────────
  const gesamtAZ = calcGesamtMinutes(form.techniker);

  // ── Styles ─────────────────────────────────────────────────────────────────
  const cellStyle: React.CSSProperties = { border: '1px solid #000', padding: '1px 3px', verticalAlign: 'top', wordBreak: 'break-word', lineHeight: 1.3, fontSize: 8.5 };
  const thStyle:   React.CSSProperties = { ...cellStyle, fontWeight: 'bold', textAlign: 'left' };
  const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
    border: 'none', outline: 'none', width: '100%',
    fontFamily: 'Arial, sans-serif', fontSize: 8, background: 'transparent', padding: 0, ...extra,
  });
  const tbtn = (bg: string): React.CSSProperties => ({
    border: 'none', padding: '6px 16px', fontSize: 9, fontWeight: 'bold',
    borderRadius: 3, cursor: 'pointer', fontFamily: 'Arial, sans-serif', color: '#fff', background: bg,
  });

  // ── Seite-2-Spezialzeilen ──────────────────────────────────────────────────
  const S2_OFFSET  = alleZeilen.length;
  const S2_NORMAL  = seite2Zeilen.length; // inkl. der bem=null Zeilen
  const innerInp: React.CSSProperties = { border: 'none', outline: 'none', fontFamily: 'Arial', fontSize: 8, background: 'transparent', padding: 0 };

  const renderSpecial = (specialIdx: 0 | 1 | 2, rowIndex: number) => {
    const bg     = rowIndex % 2 === 0 ? '#fff' : '#f3f3f3';
    const absIdx = S2_OFFSET + S2_NORMAL + specialIdx;
    const td: React.CSSProperties = { ...cellStyle, background: bg };
    const zs = form.zeilenState[absIdx] ?? { ck: 0 as CheckState, name: '', bem: '' };

    const ckCol = <CheckCell state={zs.ck} onChange={ck => setZeile(absIdx, { ck })} />;
    const nameCol = <td style={td}><input type="text" value={zs.name} onChange={e => setZeile(absIdx, { name: e.target.value })} style={innerInp} /></td>;
    const bemCol  = <td style={td}><input type="text" value={zs.bem}  onChange={e => setZeile(absIdx, { bem:  e.target.value })} style={innerInp} /></td>;

    if (specialIdx === 0) return (
      <tr key="sp0">
        <td style={td}>
          <table style={{ border: 'none', width: '100%', fontSize: 8, borderCollapse: 'collapse' }}><tbody>
            <tr>
              <td colSpan={3} style={{ border: 'none', padding: '1px 4px 2px 0', fontWeight: 'bold' }}>0-Punkt Markierung:</td>
              <td style={{ border: 'none', textAlign: 'center', fontWeight: 'bold' }}>Hor.</td>
              <td style={{ border: 'none', textAlign: 'center', fontWeight: 'bold' }}>Vert.</td>
            </tr>
            <tr>
              <td colSpan={3} style={{ border: 'none', padding: '1px 0 1px 8px' }}>Vorhanden</td>
              <td style={{ border: 'none', textAlign: 'center' }}><Ck2 state={form.nullPunkt.horVorh}  onChange={v => setForm(f => ({ ...f, nullPunkt: { ...f.nullPunkt, horVorh: v } }))} /></td>
              <td style={{ border: 'none', textAlign: 'center' }}><Ck2 state={form.nullPunkt.vertVorh} onChange={v => setForm(f => ({ ...f, nullPunkt: { ...f.nullPunkt, vertVorh: v } }))} /></td>
            </tr>
            <tr>
              <td colSpan={3} style={{ border: 'none', padding: '1px 0 1px 8px' }}>Getauscht</td>
              <td style={{ border: 'none', textAlign: 'center' }}><Ck2 state={form.nullPunkt.horGet}  onChange={v => setForm(f => ({ ...f, nullPunkt: { ...f.nullPunkt, horGet: v } }))} /></td>
              <td style={{ border: 'none', textAlign: 'center' }}><Ck2 state={form.nullPunkt.vertGet} onChange={v => setForm(f => ({ ...f, nullPunkt: { ...f.nullPunkt, vertGet: v } }))} /></td>
            </tr>
          </tbody></table>
        </td>
        {ckCol}{nameCol}{bemCol}
      </tr>
    );

    if (specialIdx === 1) return (
      <tr key="sp1">
        <td style={td}>
          <table style={{ border: 'none', width: '100%', fontSize: 8, borderCollapse: 'collapse' }}><tbody>
            <tr>
              <td colSpan={2} style={{ border: 'none', padding: '1px 4px 2px 0', fontWeight: 'bold' }}>Batterieeinschub mit Lüfter:</td>
              <td style={{ border: 'none', textAlign: 'center', fontWeight: 'bold' }}>getauscht</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: 'none', padding: '1px 0 1px 8px' }}>604-31000403:</td>
              <td style={{ border: 'none', textAlign: 'center' }}><Ck2 state={form.batt.b1} onChange={v => setForm(f => ({ ...f, batt: { ...f.batt, b1: v } }))} /></td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: 'none', padding: '1px 0 1px 8px' }}>604-31300:</td>
              <td style={{ border: 'none', textAlign: 'center' }}><Ck2 state={form.batt.b2} onChange={v => setForm(f => ({ ...f, batt: { ...f.batt, b2: v } }))} /></td>
            </tr>
          </tbody></table>
        </td>
        {ckCol}{nameCol}{bemCol}
      </tr>
    );

    return (
      <tr key="sp2">
        <td style={td}>
          <table style={{ border: 'none', width: '100%', fontSize: 8, borderCollapse: 'collapse' }}><tbody>
            <tr>
              <td style={{ border: 'none', fontWeight: 'bold' }}>Drucküberwachung:</td>
              <td style={{ border: 'none', fontWeight: 'bold', textAlign: 'center' }}>aktiv</td>
              <td style={{ border: 'none', fontWeight: 'bold', textAlign: 'center' }}>Bar</td>
            </tr>
            <tr>
              <td style={{ border: 'none', padding: '1px 0 1px 8px' }}>Trennmittel:</td>
              <td style={{ border: 'none', textAlign: 'center' }}><Ck2 state={form.druck.tmAktiv}   onChange={v => setForm(f => ({ ...f, druck: { ...f.druck, tmAktiv: v } }))} /></td>
              <td style={{ border: 'none', textAlign: 'center' }}><input type="text" value={form.druck.tmBar}   onChange={e => setForm(f => ({ ...f, druck: { ...f.druck, tmBar: e.target.value } }))}   style={{ width: 60, border: '1px solid #000', fontSize: 8, textAlign: 'center', padding: 1 }} /></td>
            </tr>
            <tr>
              <td style={{ border: 'none', padding: '1px 0 1px 8px' }}>Luft:</td>
              <td style={{ border: 'none', textAlign: 'center' }}><Ck2 state={form.druck.luftAktiv} onChange={v => setForm(f => ({ ...f, druck: { ...f.druck, luftAktiv: v } }))} /></td>
              <td style={{ border: 'none', textAlign: 'center' }}><input type="text" value={form.druck.luftBar} onChange={e => setForm(f => ({ ...f, druck: { ...f.druck, luftBar: e.target.value } }))} style={{ width: 60, border: '1px solid #000', fontSize: 8, textAlign: 'center', padding: 1 }} /></td>
            </tr>
          </tbody></table>
        </td>
        {ckCol}{nameCol}{bemCol}
      </tr>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{printStyles}</style>

      {/* ── Toolbar ── */}
      <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: '#1a2744', padding: '7px 18px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => fileInputRef.current?.click()} style={tbtn('#8e24aa')}>{t.loadJson}</button>
        <button onClick={handlePdf}   style={tbtn('#e8460a')}>{t.savePdf}</button>
        <button onClick={handleShare} style={tbtn('#1a7a3a')}>{t.shareJson}</button>
        <button onClick={handleSave}  style={tbtn('#1a5fa8')}>{t.saveJson}</button>
        <span className="toolbar-title" style={{ color: '#a8b8d8', fontSize: 9 }}>{t.toolbarTitle}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <LangSwitcher current={lang} onChange={setLang} />
        </div>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleLoad} />
      </div>

      {/* ── Seiten ── */}
      <div id="page-wrapper" style={{ marginTop: 46, padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

        {/* ══════════════ SEITE 1 ══════════════ */}
        <div className="a4" style={{ width: 'min(210mm, 100%)', background: '#fff', padding: '10mm 11mm', boxShadow: '0 3px 16px rgba(0,0,0,.25)', boxSizing: 'border-box' }}>

          {/* Kopftabelle */}
          <table style={{ marginBottom: 0, width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '13%' }} /><col style={{ width: '5%' }} /><col style={{ width: '18%' }} />
              <col style={{ width: '10%' }} /><col style={{ width: '13%' }} /><col style={{ width: '4%' }} />
              <col style={{ width: '8%' }} /><col style={{ width: '7%' }} /><col style={{ width: '6%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td rowSpan={3} style={{ border: '1px solid #000', verticalAlign: 'middle', textAlign: 'center', padding: 0, overflow: 'hidden' }}>
                  <img src={`data:image/jpeg;base64,${LOGO_B64}`} alt="Logo" style={{ height: 36, display: 'block', margin: '0 auto' }} />
                </td>
                <td colSpan={6} style={{ border: '1px solid #000', padding: 1 }}></td>
                <th colSpan={2} style={{ border: '1px solid #000', textAlign: 'right', fontWeight: 'bold', fontSize: 11 }}>Wartung</th>
              </tr>
              <tr style={{ height: 18 }}>
                <th style={thStyle}>{t.labelKunde}</th>
                <td style={cellStyle}><input type="text" value={form.kunde}        onChange={e => setField('kunde', e.target.value)}        style={inp({ height: 16 })} /></td>
                <th style={thStyle}>{t.labelArbeitsplatz}</th>
                <td style={cellStyle}><input type="text" value={form.arbeitsplatz} onChange={e => setField('arbeitsplatz', e.target.value)} style={inp({ height: 16 })} maxLength={12} /></td>
                <th style={thStyle}>{t.labelDgm}</th>
                <td style={cellStyle}><input type="text" value={form.dgm}          onChange={e => setField('dgm', e.target.value)}          style={inp({ height: 16 })} /></td>
                <th style={thStyle}>{t.labelPosition}</th>
                <td style={{ ...cellStyle, width: 55 }}><input type="text" value={form.position} onChange={e => setField('position', e.target.value)} style={inp({ width: 52, height: 16 })} maxLength={8} /></td>
              </tr>
              <tr style={{ height: 18 }}>
                <th style={thStyle}>{t.labelMaschinTyp}</th>
                <td style={cellStyle}><input type="text" value={form.maschinTyp}  onChange={e => setField('maschinTyp', e.target.value)}  style={inp({ height: 16 })} /></td>
                <th style={thStyle}>{t.labelMaschineNr}</th>
                <td style={cellStyle}><input type="text" value={form.maschineNr}  onChange={e => setField('maschineNr', e.target.value)}  style={inp({ height: 16 })} maxLength={12} /></td>
                <th style={thStyle}>{t.labelKom}</th>
                <td style={cellStyle}><input type="text" value={form.kom}          onChange={e => setField('kom', e.target.value)}          style={inp({ height: 16 })} /></td>
                <th style={thStyle}>{t.labelBaujahr}</th>
                <td style={{ ...cellStyle, width: 72 }}>
                  <input type="month" value={form.baujahr} onChange={e => setField('baujahr', e.target.value)}
                    style={{ border: 'none', outline: 'none', fontFamily: 'Arial', fontSize: 7.5, background: 'transparent', padding: 0, width: 70, height: 16, cursor: 'pointer' }} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Prüftabelle Seite 1 */}
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '47%' }} /><col style={{ width: '4%' }} />
              <col style={{ width: '5%' }} /><col style={{ width: '44%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={thStyle}><strong>{t.colPruefpunkt}</strong></th>
                <th style={{ ...thStyle, textAlign: 'center', fontSize: 7.5 }}>{t.colOk}</th>
                <th style={{ ...thStyle, textAlign: 'center', fontSize: 7.5 }}>{t.colName}</th>
                <th style={{ ...thStyle, fontSize: 7 }}>{t.colBemerkung}</th>
              </tr>
            </thead>
            <tbody>
              {alleZeilen.map((z, i) => (
                <PruefZeile key={i} zeile={z}
                  state={form.zeilenState[i] ?? { ck: 0, name: '', bem: '' }}
                  onChange={p => setZeile(i, p)} rowIndex={i} />
              ))}
            </tbody>
          </table>
        </div>

        {/* ══════════════ SEITE 2 ══════════════ */}
        <div className="a4" style={{ width: 'min(210mm, 100%)', background: '#fff', padding: '10mm 11mm', boxShadow: '0 3px 16px rgba(0,0,0,.25)', boxSizing: 'border-box' }}>

          {/* Prüftabelle Seite 2 */}
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '47%' }} /><col style={{ width: '4%' }} />
              <col style={{ width: '5%' }} /><col style={{ width: '44%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={thStyle}><strong>{t.colPruefpunkt}</strong></th>
                <th style={{ ...thStyle, textAlign: 'center', fontSize: 7.5 }}>{t.colOk}</th>
                <th style={{ ...thStyle, textAlign: 'center', fontSize: 7.5 }}>{t.colName}</th>
                <th style={{ ...thStyle, fontSize: 7 }}>{t.colBemerkung}</th>
              </tr>
            </thead>
            <tbody>
              {seite2Zeilen.map((z, i) => {
                const absIdx   = S2_OFFSET + i;
                const rowIndex = absIdx;
                if (z.divider) {
                  return (
                    <tr key={i}>
                      <td colSpan={4} style={{ background: '#cfdff5', fontWeight: 'bold', fontSize: 8, padding: '2px 4px', letterSpacing: '.03em', border: '1px solid #000' }}>
                        {z.divider}
                      </td>
                    </tr>
                  );
                }
                return (
                  <PruefZeile key={i} zeile={z}
                    state={form.zeilenState[absIdx] ?? { ck: 0, name: '', bem: '' }}
                    onChange={p => setZeile(absIdx, p)} rowIndex={rowIndex} />
                );
              })}
              {/* 3 Spezialzeilen */}
              {renderSpecial(0, S2_OFFSET + S2_NORMAL)}
              {renderSpecial(1, S2_OFFSET + S2_NORMAL + 1)}
              {renderSpecial(2, S2_OFFSET + S2_NORMAL + 2)}
            </tbody>
          </table>

          {/* Fußtabelle – Arbeitszeiten */}
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup><col style={{ width: '11%' }} /><col style={{ width: '89%' }} /></colgroup>
            <tbody>
              <tr>
                <th style={{ ...thStyle, fontSize: 8 }}>{t.sectionGerlieva}</th>
                <td style={{ ...cellStyle, fontSize: 7.5, lineHeight: 1.7 }}>
                  {form.techniker.map((tech, n) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2, flexWrap: 'wrap' }}>
                      <input type="text" value={tech.name} onChange={e => setTechniker(n, 'name', e.target.value)}
                        placeholder="________________"
                        style={{ width: 160, border: '1px solid #aaa', borderRadius: 3, padding: '1px 3px', background: '#fff', fontFamily: 'Arial', fontSize: 8 }} />
                      /
                      <input type="number" min={0} max={23} value={tech.azH} onChange={e => setTechniker(n, 'azH', e.target.value)}
                        placeholder="0" style={{ width: 42, textAlign: 'center', border: '1px solid #aaa', borderRadius: 3, padding: '1px 3px', fontFamily: 'Arial', fontSize: 8 }} />
                      h
                      <input type="number" min={0} max={59} value={tech.azM} onChange={e => setTechniker(n, 'azM', e.target.value)}
                        placeholder="0" style={{ width: 42, textAlign: 'center', border: '1px solid #aaa', borderRadius: 3, padding: '1px 3px', fontFamily: 'Arial', fontSize: 8 }} />
                      min
                      {n === 0 && (
                        <><strong><em>{t.labelGesamtAZ}</em></strong>
                          <span style={{ fontWeight: 'bold', fontSize: 9, background: '#e8f4e8', padding: '1px 6px', borderRadius: 3, border: '1px solid #aaa' }}>{gesamtAZ}</span>
                        </>
                      )}
                      {n === 1 && (
                        <>{t.labelVon}
                          <input type="time" value={form.vonZeit} onChange={e => setField('vonZeit', e.target.value)}
                            style={{ width: 90, border: '1px solid #aaa', borderRadius: 3, padding: '1px 3px', outline: 'none', fontSize: 8, background: '#fff', cursor: 'pointer' }} />
                          {t.labelBis}
                          <input type="time" value={form.bisZeit} onChange={e => setField('bisZeit', e.target.value)}
                            style={{ width: 90, border: '1px solid #aaa', borderRadius: 3, padding: '1px 3px', outline: 'none', fontSize: 8, background: '#fff', cursor: 'pointer' }} />
                        </>
                      )}
                      {n === 3 && (
                        <>{t.labelDatum}
                          <input type="date" value={form.wartungDatum} onChange={e => setField('wartungDatum', e.target.value)}
                            style={{ width: 130, fontSize: 7.5, border: 'none', borderBottom: '1px solid #999', outline: 'none', fontFamily: 'Arial' }} />
                        </>
                      )}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Unterschriften */}
          <div style={{ marginTop: 12, border: '1px solid #000', padding: 10 }}>
            <strong style={{ fontSize: 9, letterSpacing: '.03em' }}>{t.sectionSign}</strong>
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              {(['sig-gerlieva', 'sig-kunde'] as const).map(id => {
                const isGerlieva  = id === 'sig-gerlieva';
                const label       = isGerlieva ? t.sigGerlieva : t.sigKunde;
                const nameKey     = isGerlieva ? 'nameGerlieva' : 'nameKunde';
                const placeholder = isGerlieva ? t.sigPlaceholderTech : t.sigPlaceholderKunde;
                return (
                  <div key={id} style={{ flex: 1, border: '1px solid #ccc', borderRadius: 4, padding: 8, background: '#fafafa' }}>
                    <div style={{ fontSize: 8, fontWeight: 'bold', marginBottom: 4 }}>{label}</div>
                    <SigPreview dataUrl={form.signatures[id]} onClick={() => setSigModal({ id, label })} tapLabel={t.sigTap} />
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="text" value={form[nameKey]} onChange={e => setField(nameKey, e.target.value)}
                        placeholder={placeholder}
                        style={{ flex: 1, border: 'none', borderBottom: '1px solid #aaa', outline: 'none', fontSize: 7.5, background: 'transparent', fontFamily: 'Arial' }} />
                      <button onClick={() => clearSig(id)}
                        style={{ fontSize: 7, padding: '2px 6px', background: '#eee', border: '1px solid #bbb', borderRadius: 3, cursor: 'pointer' }}>
                        {t.sigDelete}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: 12, fontWeight: 'bold', fontSize: 11 }}>
              {t.labelDatum}{' '}
              <input type="date" value={form.signatureDate} onChange={e => setField('signatureDate', e.target.value)}
                style={{ border: '1px solid #ccc', padding: '4px 8px', borderRadius: 4, fontSize: 11 }} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Modals & Notifications ── */}
      {sigModal && (
        <SignatureModal label={sigModal.label} existing={form.signatures[sigModal.id]}
          onClose={dataUrl => handleSigClose(sigModal.id, dataUrl)} t={t} />
      )}
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible} />
    </>
  );
}
