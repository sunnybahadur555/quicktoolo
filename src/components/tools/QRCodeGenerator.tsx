import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { Download, Copy, RefreshCw, QrCode as QrIcon, Wifi, User, Link as LinkIcon } from 'lucide-react';

export const QRCodeGeneratorTool: React.FC = () => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'url' | 'wifi' | 'vcard'>('url');

  // Input states
  const [textInput, setTextInput] = useState('https://quicktoolo.app');
  const [wifiSsid, setWifiSsid] = useState('HomeWiFi');
  const [wifiPass, setWifiPass] = useState('Secret123');
  const [wifiType, setWifiType] = useState('WPA');

  const [vFirstName, setVFirstName] = useState('John');
  const [vLastName, setVLastName] = useState('Doe');
  const [vPhone, setVPhone] = useState('+1234567890');
  const [vEmail, setVEmail] = useState('john@example.com');

  // Customization options
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(300);
  const [eccLevel, setEccLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState('');

  // Calculate target string
  const getFormattedData = () => {
    if (activeTab === 'url') return textInput;
    if (activeTab === 'wifi') {
      return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
    }
    if (activeTab === 'vcard') {
      return `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName}\nFN:${vFirstName} ${vLastName}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
    }
    return textInput;
  };

  useEffect(() => {
    const data = getFormattedData();
    if (!data.trim()) return;

    QRCode.toDataURL(data, {
      width: qrSize,
      margin: margin,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: eccLevel,
    })
      .then((url) => {
        setDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
  }, [textInput, wifiSsid, wifiPass, wifiType, vFirstName, vLastName, vPhone, vEmail, activeTab, fgColor, bgColor, qrSize, eccLevel, margin]);

  const handleDownloadPNG = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode-quicktoolo.png';
    a.click();
    addToast('QR Code downloaded as PNG!', 'success');
  };

  const handleCopyClipboard = async () => {
    if (!dataUrl) return;
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      addToast('QR Code image copied to clipboard!', 'success');
    } catch (e) {
      addToast('Could not copy image automatically. Right-click QR preview to copy.', 'info');
    }
  };

  const handleReset = () => {
    setTextInput('https://quicktoolo.app');
    setFgColor('#0f172a');
    setBgColor('#ffffff');
    setQrSize(300);
    setEccLevel('M');
    setMargin(2);
    addToast('Settings reset to defaults.', 'info');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'url'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>URL / Text</span>
            </button>
            <button
              onClick={() => setActiveTab('wifi')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'wifi'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>WiFi Network</span>
            </button>
            <button
              onClick={() => setActiveTab('vcard')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'vcard'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>vCard Contact</span>
            </button>
          </div>

          {/* Tab 1: URL/Text Input */}
          {activeTab === 'url' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Website URL or Custom Text
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="https://example.com or enter any message..."
                rows={3}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Tab 2: WiFi Input */}
          {activeTab === 'wifi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Encryption
                  </label>
                  <select
                    value={wifiType}
                    onChange={(e) => setWifiType(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Open (No Password)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: vCard Input */}
          {activeTab === 'vcard' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={vFirstName}
                  onChange={(e) => setVFirstName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={vLastName}
                  onChange={(e) => setVLastName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={vPhone}
                  onChange={(e) => setVPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={vEmail}
                  onChange={(e) => setVEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* Customization Options */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Design & Color Customization
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                  />
                  <span className="font-mono text-xs uppercase text-slate-700 dark:text-slate-300">
                    {fgColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                  />
                  <span className="font-mono text-xs uppercase text-slate-700 dark:text-slate-300">
                    {bgColor}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Size ({qrSize}px)
                </label>
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="25"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Error Correction Level
                </label>
                <select
                  value={eccLevel}
                  onChange={(e) => setEccLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                >
                  <option value="L">Low (7% recovery)</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Download Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl">
          <div className="text-center w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Preview
            </span>

            <div className="my-6 p-4 bg-white rounded-2xl shadow-md border border-slate-200/60 inline-block max-w-full overflow-hidden">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Generated QR Code"
                  className="mx-auto max-w-full h-auto object-contain"
                  style={{ width: `${Math.min(qrSize, 280)}px` }}
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                  <QrIcon className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={handleDownloadPNG}
              disabled={!dataUrl}
              className="w-full py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Image</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyClipboard}
                disabled={!dataUrl}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </button>

              <button
                onClick={handleReset}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
