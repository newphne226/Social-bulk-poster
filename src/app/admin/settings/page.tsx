"use client";

import * as React from "react";
import {
  Settings, Globe, DollarSign, Languages, Receipt, Truck,
  Save, RefreshCw, AlertCircle, CheckCircle, Info,
} from "lucide-react";

const tabs = [
  { key: "general", label: "General", icon: Settings },
  { key: "currency", label: "Currency", icon: DollarSign },
  { key: "language", label: "Language", icon: Languages },
  { key: "tax", label: "Tax / VAT", icon: Receipt },
  { key: "shipping", label: "Shipping", icon: Truck },
];

const currencies = [
  { code: "usd", name: "US Dollar", symbol: "$" },
  { code: "eur", name: "Euro", symbol: "\u20ac" },
  { code: "gbp", name: "British Pound", symbol: "\u00a3" },
  { code: "cad", name: "Canadian Dollar", symbol: "C$" },
  { code: "aud", name: "Australian Dollar", symbol: "A$" },
  { code: "pkr", name: "Pakistani Rupee", symbol: "Rs" },
  { code: "inr", name: "Indian Rupee", symbol: "\u20b9" },
];

const languages = [
  { code: "en", name: "English" }, { code: "es", name: "Spanish" },
  { code: "fr", name: "French" }, { code: "de", name: "German" },
  { code: "ar", name: "Arabic" }, { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" }, { code: "pt", name: "Portuguese" },
];

const timezones = ["UTC","US/Eastern","US/Central","US/Mountain","US/Pacific","Europe/London","Europe/Paris","Europe/Berlin","Asia/Dubai","Asia/Karachi","Asia/Kolkata","Asia/Tokyo","Australia/Sydney"];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-gray-900 dark:text-white font-medium block mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 disabled:opacity-50" />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-900"}`}
        onClick={() => onChange(!checked)}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "trangray-x-5" : ""}`} />
      </div>
      {label && <span className="text-sm text-gray-900 dark:text-white">{label}</span>}
    </label>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("general");
  const [settings, setSettings] = React.useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");

  const fetchSettings = React.useCallback(async () => {
    const token = localStorage.getItem("sp_admin_token");
    if (!token) { window.location.replace("/admin/login"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSettings(data.settings ?? {});
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const update = (group: string, key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
    setSaved(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("sp_admin_token");
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ group: activeTab, settings: settings[activeTab] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };

  const s = settings[activeTab] || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure your platform settings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchSettings}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Reload
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">
            {saving ? "Saving..." : saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`}>
            <tab.icon className="h-3.5 w-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Site Name" hint="Display name of your platform">
                  <Input value={s.siteName || ""} onChange={(v) => update("general", "siteName", v)} />
                </Field>
                <Field label="Support Email" hint="Contact email for support">
                  <Input type="email" value={s.supportEmail || ""} onChange={(v) => update("general", "supportEmail", v)} />
                </Field>
                <Field label="Site URL" hint="Main website URL">
                  <Input value={s.siteUrl || ""} onChange={(v) => update("general", "siteUrl", v)} />
                </Field>
                <Field label="Default Timezone" hint="Timezone for all users">
                  <Select value={s.defaultTimezone || "UTC"} onChange={(v) => update("general", "defaultTimezone", v)}
                    options={timezones.map((t) => ({ value: t, label: t }))} />
                </Field>
                <Field label="Date Format" hint="How dates are displayed">
                  <Select value={s.dateFormat || "MM/DD/YYYY"} onChange={(v) => update("general", "dateFormat", v)}
                    options={[{ value: "MM/DD/YYYY", label: "MM/DD/YYYY" },{ value: "DD/MM/YYYY", label: "DD/MM/YYYY" },{ value: "YYYY-MM-DD", label: "YYYY-MM-DD" }]} />
                </Field>
                <Field label="Time Format" hint="12-hour or 24-hour clock">
                  <Select value={s.timeFormat || "12h"} onChange={(v) => update("general", "timeFormat", v)}
                    options={[{ value: "12h", label: "12-hour (AM/PM)" },{ value: "24h", label: "24-hour" }]} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Field label="Site Description" hint="Brief description for SEO">
                  <Input value={s.siteDescription || ""} onChange={(v) => update("general", "siteDescription", v)} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Toggle checked={s.maintenanceMode === "true"} onChange={(v) => update("general", "maintenanceMode", v ? "true" : "false")} label="Maintenance Mode" />
                <Toggle checked={s.registrationEnabled !== "false"} onChange={(v) => update("general", "registrationEnabled", v ? "true" : "false")} label="Registration Enabled" />
              </div>
            </>
          )}

          {/* Currency Settings */}
          {activeTab === "currency" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="Default Currency" hint="Primary currency for payments">
                  <Select value={s.defaultCurrency || "usd"} onChange={(v) => {
                    const c = currencies.find((x) => x.code === v);
                    update("currency", "defaultCurrency", v);
                    if (c) update("currency", "currencySymbol", c.symbol);
                  }} options={currencies.map((c) => ({ value: c.code, label: `${c.symbol} ${c.name} (${c.code.toUpperCase()})` }))} />
                </Field>
                <Field label="Currency Symbol" hint="Symbol displayed with prices">
                  <Input value={s.currencySymbol || "$"} onChange={(v) => update("currency", "currencySymbol", v)} />
                </Field>
                <Field label="Symbol Position" hint="Before or after the amount">
                  <Select value={s.currencyPosition || "before"} onChange={(v) => update("currency", "currencyPosition", v)}
                    options={[{ value: "before", label: "Before ($100)" },{ value: "after", label: "After (100$)" }]} />
                </Field>
                <Field label="Decimal Places" hint="Number of decimal places">
                  <Select value={s.decimalPlaces || "2"} onChange={(v) => update("currency", "decimalPlaces", v)}
                    options={[{ value: "0", label: "0 ($100)" },{ value: "2", label: "2 ($100.00)" },{ value: "3", label: "3 ($100.000)" }]} />
                </Field>
                <Field label="Thousands Separator" hint="Separator for thousands">
                  <Select value={s.thousandsSeparator || ","} onChange={(v) => update("currency", "thousandsSeparator", v)}
                    options={[{ value: ",", label: "Comma (1,000)" },{ value: ".", label: "Period (1.000)" },{ value: " ", label: "Space (1 000)" }]} />
                </Field>
                <Field label="Decimal Separator" hint="Separator for decimals">
                  <Select value={s.decimalSeparator || "."} onChange={(v) => update("currency", "decimalSeparator", v)}
                    options={[{ value: ".", label: "Period (100.00)" },{ value: ",", label: "Comma (100,00)" }]} />
                </Field>
              </div>
            </>
          )}

          {/* Language Settings */}
          {activeTab === "language" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Default Language" hint="Default language for new users">
                  <Select value={s.defaultLanguage || "en"} onChange={(v) => update("language", "defaultLanguage", v)}
                    options={languages.map((l) => ({ value: l.code, label: l.name }))} />
                </Field>
                <Toggle checked={s.autoDetectLanguage === "true"} onChange={(v) => update("language", "autoDetectLanguage", v ? "true" : "false")} label="Auto-detect Language" />
                <Toggle checked={s.rtlSupport === "true"} onChange={(v) => update("language", "rtlSupport", v ? "true" : "false")} label="RTL Support (Arabic, Hebrew)" />
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <Field label="Supported Languages" hint="Comma-separated language codes">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {languages.map((l) => {
                      const supported = (s.supportedLanguages || '["en"]').includes(l.code);
                      return (
                        <button key={l.code} onClick={() => {
                          const list = JSON.parse(s.supportedLanguages || '["en"]');
                          const next = supported ? list.filter((x: string) => x !== l.code) : [...list, l.code];
                          update("language", "supportedLanguages", JSON.stringify(next));
                        }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            supported ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                          }`}>{l.name}</button>
                      );
                    })}
                  </div>
                </Field>
              </div>
            </>
          )}

          {/* Tax / VAT Settings */}
          {activeTab === "tax" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Toggle checked={s.taxEnabled === "true"} onChange={(v) => update("tax", "taxEnabled", v ? "true" : "false")} label="Enable Tax" />
                <Toggle checked={s.vatEnabled === "true"} onChange={(v) => update("tax", "vatEnabled", v ? "true" : "false")} label="Enable VAT" />
                <Toggle checked={s.showTaxOnCheckout === "true"} onChange={(v) => update("tax", "showTaxOnCheckout", v ? "true" : "false")} label="Show Tax on Checkout" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Field label="Tax Type" hint="Exclusive = added on top, Inclusive = included in price">
                  <Select value={s.taxType || "exclusive"} onChange={(v) => update("tax", "taxType", v)}
                    options={[{ value: "exclusive", label: "Tax Exclusive" },{ value: "inclusive", label: "Tax Inclusive" }]} />
                </Field>
                <Field label="Default Tax Rate (%)" hint="Applied to all taxable items">
                  <Input type="number" value={s.defaultTaxRate || "0"} onChange={(v) => update("tax", "defaultTaxRate", v)} />
                </Field>
                <Field label="Tax Name" hint="Label shown to customers (e.g. VAT, GST)">
                  <Input value={s.taxName || "Tax"} onChange={(v) => update("tax", "taxName", v)} />
                </Field>
                <Field label="VAT Rate (%)" hint="Value Added Tax rate">
                  <Input type="number" value={s.vatRate || "0"} onChange={(v) => update("tax", "vatRate", v)} />
                </Field>
                <Field label="VAT Number" hint="Your VAT registration number">
                  <Input value={s.vatNumber || ""} onChange={(v) => update("tax", "vatNumber", v)} placeholder="e.g. GB123456789" />
                </Field>
              </div>
            </>
          )}

          {/* Shipping Settings */}
          {activeTab === "shipping" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Toggle checked={s.shippingEnabled === "true"} onChange={(v) => update("shipping", "shippingEnabled", v ? "true" : "false")} label="Enable Shipping" />
                <Toggle checked={s.digitalDelivery === "true"} onChange={(v) => update("shipping", "digitalDelivery", v ? "true" : "false")} label="Digital Delivery (No Physical Shipping)" />
                <Toggle checked={s.shippingTaxable === "true"} onChange={(v) => update("shipping", "shippingTaxable", v ? "true" : "false")} label="Shipping is Taxable" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Field label="Free Shipping Threshold ($)" hint="Minimum order for free shipping (0 = disabled)">
                  <Input type="number" value={s.freeShippingThreshold || "0"} onChange={(v) => update("shipping", "freeShippingThreshold", v)} />
                </Field>
                <Field label="Default Shipping Rate ($)" hint="Flat rate for standard shipping">
                  <Input type="number" value={s.defaultShippingRate || "0"} onChange={(v) => update("shipping", "defaultShippingRate", v)} />
                </Field>
                <Field label="Calculation Method" hint="How shipping cost is calculated">
                  <Select value={s.shippingCalculation || "flat"} onChange={(v) => update("shipping", "shippingCalculation", v)}
                    options={[{ value: "flat", label: "Flat Rate" },{ value: "weight", label: "By Weight" },{ value: "price", label: "By Price" },{ value: "quantity", label: "By Quantity" }]} />
                </Field>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
