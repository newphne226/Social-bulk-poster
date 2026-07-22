import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

const defaults: Record<string, Record<string, any>> = {
  general: {
    siteName: "SMTools",
    siteDescription: "Multi-platform social media scheduling tool",
    siteUrl: "https://smtools.online",
    supportEmail: "support@smtools.online",
    maintenanceMode: "false",
    registrationEnabled: "true",
    defaultTimezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  },
  currency: {
    defaultCurrency: "usd",
    currencySymbol: "$",
    currencyPosition: "before",
    decimalPlaces: "2",
    thousandsSeparator: ",",
    decimalSeparator: ".",
    supportedCurrencies: `["usd","eur","gbp","cad","aud"]`,
  },
  language: {
    defaultLanguage: "en",
    rtlSupport: "false",
    supportedLanguages: `["en","es","fr","de","ar"]`,
    autoDetectLanguage: "true",
  },
  tax: {
    taxEnabled: "false",
    taxType: "exclusive",
    defaultTaxRate: "0",
    taxName: "Tax",
    vatEnabled: "false",
    vatRate: "0",
    vatNumber: "",
    taxExemptCountries: "[]",
    showTaxOnCheckout: "true",
  },
  shipping: {
    shippingEnabled: "false",
    freeShippingThreshold: "0",
    defaultShippingRate: "0",
    shippingCalculation: "flat",
    allowedRegions: `["*"]`,
    restrictedRegions: "[]",
    digitalDelivery: "true",
    shippingTaxable: "false",
  },
};

async function getGroup(group: string) {
  const rows = await db.systemSetting.findMany({ where: { group } });
  const settings: Record<string, any> = {};
  const d = defaults[group] || {};
  // Start with defaults
  for (const [k, v] of Object.entries(d)) settings[k] = v;
  // Override with DB values
  for (const row of rows) {
    try { settings[row.key] = JSON.parse(row.value); } catch { settings[row.key] = row.value; }
  }
  return settings;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group") || "";

  if (group && defaults[group]) {
    const settings = await getGroup(group);
    return NextResponse.json({ group, settings });
  }

  // Return all groups
  const all: Record<string, any> = {};
  for (const g of Object.keys(defaults)) {
    all[g] = await getGroup(g);
  }
  return NextResponse.json({ settings: all });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { group, settings } = body;

  if (!group || !settings || typeof settings !== "object") {
    return NextResponse.json({ error: "group and settings required" }, { status: 400 });
  }

  if (!defaults[group]) {
    return NextResponse.json({ error: "Invalid group" }, { status: 400 });
  }

  // Upsert each setting
  for (const [key, value] of Object.entries(settings)) {
    const strValue = typeof value === "string" ? value : JSON.stringify(value);
    await db.systemSetting.upsert({
      where: { group_key: { group, key } },
      create: { group, key, value: strValue },
      update: { value: strValue },
    });
  }

  return NextResponse.json({ ok: true });
}
