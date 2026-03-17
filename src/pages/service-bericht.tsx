import { SEO } from "@/components/SEO";
import Head from "next/head";

export default function ServiceBericht() {
  return (
    <>
      <SEO 
        title="Servicebericht - GERLIEVA Sprühtechnik GmbH"
        description="Digitaler Servicebericht für GERLIEVA Sprühtechnik GmbH"
      />
      <Head>
        <style dangerouslySetInnerHTML={{ __html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; max-width: 1000px; margin: 0 auto; background: #f5f5f5; }
          .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 50px; }
          .header { border-bottom: 2px solid #000; margin-bottom: 15px; padding-bottom: 8px; }
          .header h1 { font-size: 16px; font-weight: bold; }
          .header p { font-size: 9px; color: #666; }
          h2 { font-size: 14px; margin-bottom: 10px; background: #f0f0f0; padding: 8px; border-radius: 4px; }
          .section { margin-bottom: 15px; border: 1px solid #ccc; padding: 10px; border-radius: 4px; background: white; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #000; padding: 4px; text-align: left; font-size: 10px; }
          th { background-color: #e0e0e0; font-weight: bold; text-align: center; }
          th[colspan] { background-color: #d0d0d0; }
          td input { width: 100%; border: none; padding: 2px; background: transparent; font-size: 10px; }
          td input[type="number"] { width: 55px; }
          td input[type="time"] { width: 80px; }
          td input:focus { outline: 1px solid #4CAF50; background: #fffef0; }
          .checkbox-list { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 8px; }
          .checkbox-item { display: flex; align-items: center; gap: 5px; }
          .signature-container { display: flex; gap: 20px; margin-top: 15px; }
          .signature-box { flex: 1; border: 2px solid #ccc; padding: 10px; border-radius: 4px; background: #fafafa; }
          .signature-canvas { border: 2px dashed #999; background: white; cursor: crosshair; width: 100%; height: 150px; border-radius: 4px; }
          .signature-canvas:hover { border-color: #4CAF50; }
          .signature-name { margin-top: 8px; }
          .signature-name input { width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 11px; }
          .date-box { text-align: center; margin-top: 15px; font-weight: bold; font-size: 12px; }
          .date-box input { border: 1px solid #ccc; padding: 4px 8px; border-radius: 4px; font-size: 11px; }
          .grid-row { display: grid; grid-template-columns: 140px 1fr; gap: 8px; margin-bottom: 5px; align-items: center; }
          .label { font-weight: bold; }
          .grid-row input { border: 1px solid #ddd; padding: 4px; border-radius: 3px; font-size: 11px; }
          .grid-row input:focus { outline: 1px solid #4CAF50; }
          .inline-field { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
          .inline-field label { font-weight: bold; white-space: nowrap; }
          .inline-field input { flex: 1; border: 1px solid #ddd; padding: 4px; border-radius: 3px; font-size: 11px; }
          #toolbar {
            position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
            background: #1a2744; padding: 7px 18px;
            display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          }
          #toolbar span { color: #a8b8d8; font-size: 9pt; }
          .tbtn { border: none; padding: 6px 16px; font-size: 9pt; font-weight: bold; border-radius: 3px; cursor: pointer; font-family: Arial, sans-serif; }
          #btn-pdf   { background: #e8460a; color: #fff; }
          #btn-pdf:hover { background: #c53a08; }
          #btn-share { background: #1a7a3a; color: #fff; }
          #btn-share:hover { background: #155e2c; }
          #btn-save  { background: #1a5fa8; color: #fff; }
          #btn-save:hover { background: #154d8a; }
          #btn-load  { background: #8e24aa; color: #fff; }
          #btn-load:hover { background: #7b1fa2; }
          .tbtn:disabled { background: #888 !important; cursor: default; }
          #load-input { display: none; }
          @media print {
            #toolbar { display: none !important; }
            body { padding: 10px; font-size: 10.5px; background: white; }
            .section { page-break-inside: avoid; box-shadow: none; }
            .page-break-before { page-break-before: always; }
            .signature-canvas { border: 1px solid #000; }
            .container { box-shadow: none; padding: 0; }
          }
          
          .toast {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            max-width: 90%;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          .toast.show {
            opacity: 1;
          }
          .toast.success {
            background: #1a7a3a;
          }
          .toast.error {
            background: #c53a08;
          }
        ` }} />
      </Head>

      <div className="container">
        <div id="toolbar">
          <button id="btn-load" className="tbtn">📂 JSON laden</button>
          <button id="btn-pdf" className="tbtn">⬇ Als PDF speichern</button>
          <button id="btn-share" className="tbtn">📤 JSON teilen</button>
          <button id="btn-save" className="tbtn">💾 JSON speichern</button>
          <span>Servicebericht · GERLIEVA Sprühtechnik GmbH</span>
          <button className="tbtn" style={{ background: "#1a5fa8", marginLeft: "auto" }} onClick={() => window.location.href = '/'}>🏠 Home</button>
        </div>
        <input type="file" id="load-input" accept=".json" style={{ display: "none" }} />

        <div className="header">
          <h1>GERLIEVA Sprühtechnik GmbH</h1>
          <p>Tiergartenstraße 8 · 79423 Heitersheim · Tel. +49 7634 56912-0</p>
        </div>

        <h2 style={{ fontSize: "18px", marginBottom: "15px", background: "transparent", padding: 0 }}>Servicebericht</h2>

        <div className="section">
          <h2>Kunde</h2>
          <div className="grid-row"><span className="label">Name:</span> <input type="text" defaultValue="" /></div>
          <div className="grid-row"><span className="label">Straße:</span> <input type="text" defaultValue="" /></div>
          <div className="grid-row"><span className="label">Telefon:</span> <input type="text" defaultValue="" /></div>
          <div className="grid-row"><span className="label">Referenz:</span> <input type="text" defaultValue="" /></div>
        </div>

        <div className="inline-field">
          <label>Servicetechniker:</label>
          <input type="text" defaultValue="" />
        </div>

        <div className="section">
          <h2>Maschine</h2>
          <table>
            <thead>
              <tr>
                <th>Nr.</th>
                <th>Typ</th>
                <th>Maschinen-Nr.</th>
                <th>Kunden-Nr.</th>
                <th>Kom.-Nr.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
              </tr>
              <tr>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
              </tr>
              <tr>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
              </tr>
              <tr>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
              </tr>
              <tr>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
                <td><input type="text" defaultValue="" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2>Durchgeführte Arbeiten</h2>
          <div className="checkbox-list">
            <div className="checkbox-item"><input type="checkbox" /> Montage</div>
            <div className="checkbox-item"><input type="checkbox" /> Inbetriebnahme</div>
            <div className="checkbox-item"><input type="checkbox" /> Softwareupdate</div>
            <div className="checkbox-item"><input type="checkbox" /> Wartung</div>
            <div className="checkbox-item"><input type="checkbox" /> Reparatur</div>
          </div>
          <input type="text" defaultValue="" style={{ width: "100%", border: "1px solid #ddd", padding: "6px", borderRadius: "4px", marginTop: "8px" }} />
        </div>

        <div className="section">
          <h2>Arbeits- und Reisezeiten</h2>
          <div className="checkbox-list">
            <div className="checkbox-item"><input type="checkbox" /> PKW</div>
            <div className="checkbox-item"><input type="checkbox" /> Flugzeug</div>
            <div className="checkbox-item"><input type="checkbox" /> Zug</div>
            <div className="checkbox-item"><input type="checkbox" /> Hotel</div>
            <div className="checkbox-item"><input type="checkbox" /> Sonstiges</div>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ marginTop: "10px", borderCollapse: "collapse" }}>
              <colgroup>
                <col style={{ width: "30px" }} />
                <col style={{ width: "90px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "65px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th rowSpan={2}>Tag</th>
                  <th rowSpan={2}>Datum</th>
                  <th colSpan={2}>Anreise</th>
                  <th rowSpan={2}>km</th>
                  <th colSpan={2}>Arbeitszeit</th>
                  <th colSpan={2}>Rückreise</th>
                  <th rowSpan={2}>km</th>
                  <th rowSpan={2}>Pause (Min)</th>
                </tr>
                <tr>
                  <th>von</th>
                  <th>bis</th>
                  <th>von</th>
                  <th>bis</th>
                  <th>von</th>
                  <th>bis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center" }}>1</td>
                  <td><input type="date" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="number" defaultValue="" max={99999999} style={{ width: "80px" }} placeholder="Min" /></td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>2</td>
                  <td><input type="date" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="number" defaultValue="" max={99999999} style={{ width: "80px" }} placeholder="Min" /></td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>3</td>
                  <td><input type="date" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="number" defaultValue="" max={99999999} style={{ width: "80px" }} placeholder="Min" /></td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>4</td>
                  <td><input type="date" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="number" defaultValue="" max={99999999} style={{ width: "80px" }} placeholder="Min" /></td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>5</td>
                  <td><input type="date" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="number" defaultValue="" max={99999999} style={{ width: "80px" }} placeholder="Min" /></td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>6</td>
                  <td><input type="date" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="number" defaultValue="" max={99999999} style={{ width: "80px" }} placeholder="Min" /></td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>7</td>
                  <td><input type="date" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="time" defaultValue="" /></td>
                  <td><input type="number" defaultValue="" max={9999} style={{ width: "60px" }} /></td>
                  <td><input type="number" defaultValue="" max={99999999} style={{ width: "80px" }} placeholder="Min" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="page-break-before">
          <div className="section">
            <h2>Material- und Teileliste</h2>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Pos.</th>
                  <th>Beschreibung</th>
                  <th style={{ width: "120px" }}>Teilenummer</th>
                  <th style={{ width: "60px" }}>Stk.</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(20)].map((_, i) => (
                  <tr key={i}>
                    <td><input type="text" defaultValue="" /></td>
                    <td><input type="text" defaultValue="" /></td>
                    <td><input type="text" defaultValue="" /></td>
                    <td><input type="text" defaultValue="" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <h2>Bemerkungen / Fehlerbeschreibung</h2>
          <textarea style={{ width: "100%", height: "80px", border: "1px solid #ddd", padding: "6px", borderRadius: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", resize: "vertical" }}></textarea>
        </div>

        <div className="section" style={{ marginTop: "20px" }}>
          <h2 style={{ borderBottom: "3px solid #000", paddingBottom: "5px", marginBottom: "15px" }}>BESTÄTIGUNG / UNTERSCHRIFTEN</h2>
          <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
            <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: "4px", padding: "8px", background: "#fafafa" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Unterschrift GERLIEVA</div>
              <canvas 
                id="sig-gerlieva"
                style={{ border: "2px dashed #999", background: "white", cursor: "pointer", width: "100%", aspectRatio: "4/1", borderRadius: "3px", display: "block", touchAction: "none" }}
                width={400} 
                height={100}
              ></canvas>
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                <input type="text" id="name-gerlieva" placeholder="Name Techniker" style={{ flex: 1, border: "none", borderBottom: "1px solid #aaa", outline: "none", fontSize: "11px", background: "transparent" }} />
                <button onClick={() => (window as any).clearSig?.('sig-gerlieva')} style={{ fontSize: "9px", padding: "2px 6px", background: "#eee", border: "1px solid #bbb", borderRadius: "3px", cursor: "pointer" }}>✕ Löschen</button>
              </div>
            </div>
            <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: "4px", padding: "8px", background: "#fafafa" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Unterschrift Kunde</div>
              <canvas 
                id="sig-kunde"
                style={{ border: "2px dashed #999", background: "white", cursor: "pointer", width: "100%", aspectRatio: "4/1", borderRadius: "3px", display: "block", touchAction: "none" }}
                width={400} 
                height={100}
              ></canvas>
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                <input type="text" id="name-kunde" placeholder="Name Kunde" style={{ flex: 1, border: "none", borderBottom: "1px solid #aaa", outline: "none", fontSize: "11px", background: "transparent" }} />
                <button onClick={() => (window as any).clearSig?.('sig-kunde')} style={{ fontSize: "9px", padding: "2px 6px", background: "#eee", border: "1px solid #bbb", borderRadius: "3px", cursor: "pointer" }}>✕ Löschen</button>
              </div>
            </div>
          </div>
          <div className="date-box" style={{ marginTop: "15px" }}>
            Datum: <input type="date" id="signatureDate" defaultValue="" />
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        function showToast(msg, type) {
          const toast = document.createElement('div');
          toast.className = 'toast ' + (type || '');
          toast.textContent = msg;
          document.body.appendChild(toast);
          setTimeout(() => toast.classList.add('show'), 100);
          setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
        }

        function collectFormData() {
          const data = { version: 1, ts: new Date().toISOString(), inputs: {}, checkboxes: {}, textareas: {}, signatures: {} };
          document.querySelectorAll('input[type="text"],input[type="number"],input[type="time"],input[type="date"]').forEach((inp, i) => {
            data.inputs[i] = inp.value;
          });
          document.querySelectorAll('input[type="checkbox"]').forEach((inp, i) => {
            data.checkboxes[i] = inp.checked;
          });
          document.querySelectorAll('textarea').forEach((ta, i) => {
            data.textareas[i] = ta.value;
          });
          ['sig-gerlieva','sig-kunde'].forEach(id => {
            if (window.sigData && window.sigData[id]) data.signatures[id] = window.sigData[id];
          });
          ['name-gerlieva','name-kunde'].forEach(id => {
            const el = document.getElementById(id);
            if (el) data[id] = el.value;
          });
          return data;
        }

        function applyFormData(data) {
          if (!data || data.version !== 1) { showToast('Ungültige JSON-Datei', 'error'); return; }
          const inputs = document.querySelectorAll('input[type="text"],input[type="number"],input[type="time"],input[type="date"]');
          inputs.forEach((inp, i) => { if (data.inputs && data.inputs[i] !== undefined) inp.value = data.inputs[i]; });
          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach((cb, i) => { if (data.checkboxes && data.checkboxes[i] !== undefined) cb.checked = data.checkboxes[i]; });
          const textareas = document.querySelectorAll('textarea');
          textareas.forEach((ta, i) => { if (data.textareas && data.textareas[i] !== undefined) ta.value = data.textareas[i]; });
          ['sig-gerlieva','sig-kunde'].forEach(id => {
            if (data.signatures && data.signatures[id]) {
              if (!window.sigData) window.sigData = {};
              window.sigData[id] = data.signatures[id];
              setTimeout(() => window.redrawPreviewCanvas && window.redrawPreviewCanvas(id), 300);
            }
          });
          ['name-gerlieva','name-kunde'].forEach(id => {
            const el = document.getElementById(id);
            if (el && data[id] !== undefined) el.value = data[id];
          });
        }

        window.sigData = {};

        window.clearSig = function(id) {
          const c = document.getElementById(id);
          if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
          if (window.sigData) delete window.sigData[id];
        }

        function openSigModal(id, label) {
          const overlay = document.createElement('div');
          overlay.id = 'sig-overlay';
          overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#fff;display:flex;flex-direction:column;';
          overlay.innerHTML = \`
            <div style="background:#1a2744;color:#fff;padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;">
              <span style="font-size:13pt;font-weight:bold;flex:1;">✍️ \${label}</span>
              <button id="sig-clear-btn" style="background:#e8460a;color:#fff;border:none;padding:8px 16px;border-radius:4px;font-size:11pt;cursor:pointer;margin-right:8px;">🗑 Löschen</button>
              <button id="sig-cancel-btn" style="background:#888;color:#fff;border:none;padding:8px 16px;border-radius:4px;font-size:11pt;cursor:pointer;margin-right:8px;">Abbrechen</button>
              <button id="sig-ok-btn" style="background:#2a7a2a;color:#fff;border:none;padding:8px 20px;border-radius:4px;font-size:11pt;font-weight:bold;cursor:pointer;">✓ Bestätigen</button>
            </div>
            <div style="flex:1;padding:8px;display:flex;align-items:center;justify-content:center;background:#f0f0f0;">
              <canvas id="sig-modal-canvas" style="background:white;border:2px solid #aaa;border-radius:4px;touch-action:none;cursor:crosshair;max-width:100%;max-height:100%;"></canvas>
            </div>
            <div style="text-align:center;padding:6px;font-size:8pt;color:#666;flex-shrink:0;">Hier unterschreiben</div>\`;
          document.body.appendChild(overlay);

          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().then(() => {
              if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
            }).catch(() => {});
          }

          const modalCanvas = document.getElementById('sig-modal-canvas');
          const dpr = window.devicePixelRatio || 1;

          function resizeModalCanvas() {
            const container = modalCanvas.parentElement;
            const w = container.clientWidth - 16, h = container.clientHeight - 16;
            const tmp = document.createElement('canvas');
            tmp.width = modalCanvas.width; tmp.height = modalCanvas.height;
            tmp.getContext('2d').drawImage(modalCanvas, 0, 0);
            modalCanvas.width = Math.round(w * dpr); modalCanvas.height = Math.round(h * dpr);
            modalCanvas.style.width = w + 'px'; modalCanvas.style.height = h + 'px';
            const ctx = modalCanvas.getContext('2d');
            ctx.scale(dpr, dpr);
            ctx.drawImage(tmp, 0, 0, w, h);
          }
          setTimeout(resizeModalCanvas, 150);
          window.addEventListener('resize', resizeModalCanvas);

          if (window.sigData && window.sigData[id]) {
            setTimeout(() => {
              const img = new Image();
              img.onload = () => modalCanvas.getContext('2d').drawImage(img, 0, 0, modalCanvas.width, modalCanvas.height);
              img.src = window.sigData[id];
            }, 200);
          }

          const mCtx = modalCanvas.getContext('2d');
          let drawing = false;
          function mPos(e) {
            const r = modalCanvas.getBoundingClientRect();
            const src = e.touches ? e.touches[0] : e;
            return { x: src.clientX - r.left, y: src.clientY - r.top };
          }
          function mStart(e) { e.preventDefault(); drawing = true; const p = mPos(e); mCtx.beginPath(); mCtx.moveTo(p.x, p.y); }
          function mMove(e)  { e.preventDefault(); if (!drawing) return; const p = mPos(e); mCtx.lineTo(p.x, p.y); mCtx.strokeStyle='#000'; mCtx.lineWidth=2; mCtx.lineCap='round'; mCtx.lineJoin='round'; mCtx.stroke(); }
          function mStop()   { drawing = false; mCtx.closePath(); }
          modalCanvas.addEventListener('mousedown', mStart);
          modalCanvas.addEventListener('mousemove', mMove);
          modalCanvas.addEventListener('mouseup', mStop);
          modalCanvas.addEventListener('mouseleave', mStop);
          modalCanvas.addEventListener('touchstart', mStart, { passive: false });
          modalCanvas.addEventListener('touchmove', mMove, { passive: false });
          modalCanvas.addEventListener('touchend', mStop);

          document.getElementById('sig-clear-btn').onclick = () => mCtx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
          document.getElementById('sig-cancel-btn').onclick = () => closeModal(false, id, modalCanvas);
          document.getElementById('sig-ok-btn').onclick = () => closeModal(true, id, modalCanvas);
        }

        function closeModal(save, id, modalCanvas) {
          if (save) {
            if (!window.sigData) window.sigData = {};
            window.sigData[id] = modalCanvas.toDataURL('image/png');
          }
          window.removeEventListener('resize', () => {});
          const overlay = document.getElementById('sig-overlay');
          if (overlay) overlay.remove();
          const doRedraw = () => { if (save) setTimeout(() => window.redrawPreviewCanvas && window.redrawPreviewCanvas(id), 350); };
          if (document.fullscreenElement) {
            document.exitFullscreen().then(() => { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); doRedraw(); }).catch(() => doRedraw());
          } else {
            if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
            doRedraw();
          }
        }

        window.redrawPreviewCanvas = function(id) {
          const canvas = document.getElementById(id);
          if (!canvas) return;
          const dpr = window.devicePixelRatio || 1;
          const rect = canvas.getBoundingClientRect();
          const w = rect.width || canvas.offsetWidth || 300;
          const h = rect.height || canvas.offsetHeight || 90;
          canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
          canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
          const ctx = canvas.getContext('2d');
          ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
          if (window.sigData && window.sigData[id]) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, w, h);
            img.src = window.sigData[id];
          } else {
            ctx.fillStyle = '#bbb'; ctx.font = '11px Arial'; ctx.textAlign = 'center';
            ctx.fillText('Tippen zum Unterschreiben', w / 2, h / 2);
          }
        }

        function getFileName(ext) {
          const kunde = (document.querySelectorAll('.grid-row input')[0]?.value || '').trim().replace(/[^a-zA-Z0-9_\\-]/g, '_');
          const datum = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          return (kunde ? \`Servicebericht_\${kunde}_\${datum}\` : \`Servicebericht_\${datum}\`) + '.' + ext;
        }

        document.addEventListener('DOMContentLoaded', function() {
          ['sig-gerlieva', 'sig-kunde'].forEach(id => {
            const canvas = document.getElementById(id);
            if (!canvas) return;
            const label = id === 'sig-gerlieva' ? 'Unterschrift GERLIEVA' : 'Unterschrift Kunde';
            window.redrawPreviewCanvas(id);
            canvas.addEventListener('click', () => openSigModal(id, label));
            canvas.addEventListener('touchend', (e) => { e.preventDefault(); openSigModal(id, label); }, { passive: false });
          });
          function onResize() {
            setTimeout(() => { window.redrawPreviewCanvas('sig-gerlieva'); window.redrawPreviewCanvas('sig-kunde'); }, 200);
          }
          window.addEventListener('resize', onResize);
          if (screen.orientation) screen.orientation.addEventListener('change', onResize);

          document.getElementById('btn-pdf').addEventListener('click', () => {
            alert('Im Druckdialog:\\n1. Drucker → "Als PDF speichern"\\n2. Weitere Einstellungen → "Hintergrundgrafiken" ✓ aktivieren\\n→ Dann sind alle Farben im PDF enthalten.');
            window.print();
          });

          document.getElementById('btn-save').addEventListener('click', () => {
            const btn = document.getElementById('btn-save');
            btn.disabled = true; btn.textContent = '⏳ Wird gespeichert…';
            try {
              const json = JSON.stringify(collectFormData(), null, 2);
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = getFileName('json');
              document.body.appendChild(a); a.click(); document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(url), 2000);
              showToast('✅ JSON gespeichert!', 'success');
            } catch (err) { showToast('Fehler: ' + err.message, 'error'); }
            btn.disabled = false; btn.textContent = '💾 JSON speichern';
          });

          document.getElementById('btn-share').addEventListener('click', async () => {
            const btn = document.getElementById('btn-share');
            btn.disabled = true; btn.textContent = '⏳ Wird vorbereitet…';
            try {
              const json = JSON.stringify(collectFormData(), null, 2);
              const blob = new Blob([json], { type: 'application/json' });
              const file = new File([blob], getFileName('json'), { type: 'application/json' });
              if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ title: 'Servicebericht GERLIEVA', files: [file] });
              } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = getFileName('json');
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 2000);
                showToast('✅ JSON heruntergeladen!', 'success');
              }
            } catch (err) { if (err.name !== 'AbortError') showToast('Fehler: ' + err.message, 'error'); }
            btn.disabled = false; btn.textContent = '📤 JSON teilen';
          });

          document.getElementById('btn-load') && document.getElementById('btn-load').addEventListener('click', function(){
            document.getElementById('load-input').click();
          });
          document.getElementById('load-input') && document.getElementById('load-input').addEventListener('change', function(e){
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev){
              try {
                const data = JSON.parse(ev.target.result);
                applyFormData(data);
                showToast('✅ Datei erfolgreich geladen!', 'success');
              } catch(err) { showToast('Fehler beim Laden: ' + err.message, 'error'); }
            };
            reader.readAsText(file);
            e.target.value = '';
          });
        });
      ` }} />
    </>
  );
}