import React, { useState, useEffect } from 'react';
import {
  X,
  Sun,
  Moon,
  Laptop,
  Check,
  Globe,
  Radio,
  Calendar,
  Layers,
  Copy,
  ExternalLink,
  Activity,
  RefreshCw,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { TIMEZONES, formatTimeOnly } from '../utils/timeUtils';
import { checkServerHealth, API_BASE } from '../services/api';
import { PlatformIcon } from './PlatformIcons';

export function SettingsModal({
  visible,
  onClose,
  theme,
  onThemeChange,
  timezone,
  onTimezoneChange,
  platforms,
  selectedPlatforms,
  onTogglePlatform,
  onSelectAllPlatforms
}) {
  if (!visible) return null;

  const [healthStatus, setHealthStatus] = useState(null);
  const [testingHealth, setTestingHealth] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState(false);

  // Ping backend on open
  useEffect(() => {
    let mounted = true;
    const runPing = async () => {
      setTestingHealth(true);
      const res = await checkServerHealth();
      if (mounted) {
        setHealthStatus(res);
        setTestingHealth(false);
      }
    };
    runPing();
    return () => {
      mounted = false;
    };
  }, []);

  const handleTestPing = async () => {
    setTestingHealth(true);
    const res = await checkServerHealth();
    setHealthStatus(res);
    setTestingHealth(false);
  };

  const icsFeedUrl = `${API_BASE.replace(/\/+$/, '')}/contests/calendar.ics`;

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(icsFeedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-window settings-modal animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Bar */}
        <div className="modal-header">
          <div className="modal-header-platform">
            <div className="settings-header-icon">
              <Code2 size={18} />
            </div>
            <div>
              <h2 className="modal-platform-name" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                Preferences
              </h2>
              <span className="modal-sub-id">Contendar Design System</span>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="modal-body-content settings-body">
          {/* SECTION: Appearance */}
          <div className="settings-group">
            <span className="settings-group-title">APPEARANCE</span>
            <div className="settings-card">
              <div className="theme-picker-row">
                {[
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'system', label: 'System', icon: Laptop }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`theme-option-btn ${isSelected ? 'is-active' : ''}`}
                      onClick={() => onThemeChange(item.id)}
                    >
                      <div className="theme-option-preview">
                        <Icon size={18} />
                      </div>
                      <span className="theme-option-label">{item.label}</span>
                      {isSelected && (
                        <span className="theme-check-badge">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION: Time & Region */}
          <div className="settings-group">
            <span className="settings-group-title">TIME & REGION</span>
            <div className="settings-card">
              <div className="settings-row">
                <div className="settings-row-label">
                  <div className="settings-row-icon" style={{ color: 'var(--accent-blue)' }}>
                    <Globe size={16} />
                  </div>
                  <div>
                    <span className="settings-row-title">Display Timezone</span>
                    <span className="settings-row-desc">
                      Current time: {formatTimeOnly(Date.now(), timezone)}
                    </span>
                  </div>
                </div>

                <select
                  aria-label="Select display timezone"
                  className="settings-select"
                  value={timezone}
                  onChange={(e) => onTimezoneChange(e.target.value)}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.id} value={tz.id}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION: Platform Feeds */}
          <div className="settings-group">
            <div className="settings-group-header">
              <span className="settings-group-title">PLATFORM RADAR</span>
              <button
                className="settings-inline-action"
                onClick={onSelectAllPlatforms}
              >
                {selectedPlatforms.length === platforms.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="settings-card">
              {platforms.map((plat, idx) => {
                const isSelected = selectedPlatforms.includes(plat.id);
                return (
                  <React.Fragment key={plat.id}>
                    {idx > 0 && <div className="settings-separator" />}
                    <div
                      className="settings-row platform-toggle-row"
                      onClick={() => onTogglePlatform(plat.id)}
                    >
                      <div className="settings-row-label">
                        <div className="platform-avatar">
                          <PlatformIcon platform={plat.id} size={18} />
                        </div>
                        <div>
                          <span className="settings-row-title">{plat.name}</span>
                          <span className="settings-row-desc">
                            {plat.contestsCount !== undefined ? `${plat.contestsCount} rounds tracked` : 'Live radar stream'}
                          </span>
                        </div>
                      </div>

                      <div className={`apple-switch ${isSelected ? 'is-on' : ''}`}>
                        <div className="apple-switch-thumb" />
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* SECTION: Calendar Subscription */}
          <div className="settings-group">
            <span className="settings-group-title">CALENDAR SUBSCRIPTION</span>
            <div className="settings-card">
              <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
                <div className="settings-row-label">
                  <div className="settings-row-icon" style={{ color: 'var(--accent-live)' }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="settings-row-title">Live iCalendar Feed (.ics)</span>
                    <span className="settings-row-desc">
                      Subscribe from Apple Calendar, Google Calendar, or Microsoft Outlook.
                    </span>
                  </div>
                </div>

                <div className="feed-url-box">
                  <input
                    type="text"
                    readOnly
                    value={icsFeedUrl}
                    className="feed-url-input mono"
                  />
                  <button
                    className="feed-copy-btn"
                    onClick={handleCopyFeed}
                    title="Copy Calendar Feed URL"
                  >
                    {copiedFeed ? (
                      <>
                        <Check size={13} strokeWidth={2.5} style={{ color: 'var(--accent-live)' }} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: Backend & Connection Status */}
          <div className="settings-group">
            <span className="settings-group-title">NETWORK & RADAR BACKEND</span>
            <div className="settings-card">
              <div className="settings-row">
                <div className="settings-row-label">
                  <div className="settings-row-icon" style={{ color: healthStatus?.ok ? 'var(--accent-live)' : '#ef4444' }}>
                    <Activity size={16} />
                  </div>
                  <div>
                    <span className="settings-row-title">Render Cloud Server</span>
                    <span className="settings-row-desc mono">
                      {API_BASE}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {testingHealth ? (
                    <span className="status-ping-pill is-pending">
                      <RefreshCw size={11} className="animate-spin" />
                      <span>Pinging...</span>
                    </span>
                  ) : healthStatus?.ok ? (
                    <span className="status-ping-pill is-ok">
                      <span className="live-pulse-dot-sm" />
                      <span>{healthStatus.latencyMs}ms Operational</span>
                    </span>
                  ) : (
                    <span className="status-ping-pill is-error">
                      <span>Offline</span>
                    </span>
                  )}
                  <button
                    className="icon-btn"
                    onClick={handleTestPing}
                    disabled={testingHealth}
                    title="Retest ping"
                    style={{ padding: '6px' }}
                  >
                    <RefreshCw size={13} className={testingHealth ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: About */}
          <div className="settings-group">
            <span className="settings-group-title">ABOUT</span>
            <div className="settings-card">
              <div className="settings-row">
                <div className="settings-row-label">
                  <div className="settings-row-icon" style={{ color: 'var(--text-secondary)' }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <span className="settings-row-title">Contendar for Web</span>
                    <span className="settings-row-desc">
                      Version 1.0.0 • Designed with Apple-Level Craftsmanship
                    </span>
                  </div>
                </div>
                <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  Production
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="primary-apple-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

