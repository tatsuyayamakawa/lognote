import { google } from "googleapis";
import { getAuthenticatedClient } from "./oauth";

/**
 * AdSense Management API クライアントを取得（OAuth 2.0対応）
 */
export async function getAdSenseClient() {
  try {
    // OAuth 2.0認証クライアントを取得
    const auth = await getAuthenticatedClient();

    if (!auth) {
      return null;
    }

    return google.adsense({
      version: "v2",
      auth,
    });
  } catch (error) {
    return null;
  }
}

/**
 * AdSenseアカウントIDを取得
 */
export async function getAdSenseAccountId(): Promise<string | null> {
  const client = await getAdSenseClient();
  if (!client) {
    return null;
  }

  try {
    const response = await client.accounts.list();
    const accounts = response.data.accounts;

    if (!accounts || accounts.length === 0) {
      return null;
    }

    // 最初のアカウントを使用
    return accounts[0].name || null;
  } catch (error) {
    return null;
  }
}

export interface AdSenseRevenueData {
  date: string;
  earnings: number;
  clicks: number;
  impressions: number;
  ctr: number; // Click-through rate
  rpm: number; // Revenue per thousand impressions
}

/**
 * AdSense収益データを取得
 * @param days 取得する日数（デフォルト: 30日）
 */
export async function getAdSenseRevenue(
  days: number = 30
): Promise<AdSenseRevenueData[]> {
  const client = await getAdSenseClient();
  if (!client) {
    return [];
  }

  const accountId = await getAdSenseAccountId();
  if (!accountId) {
    return [];
  }

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await client.accounts.reports.generate({
      account: accountId,
      dateRange: "CUSTOM",
      "startDate.year": startDate.getFullYear(),
      "startDate.month": startDate.getMonth() + 1,
      "startDate.day": startDate.getDate(),
      "endDate.year": endDate.getFullYear(),
      "endDate.month": endDate.getMonth() + 1,
      "endDate.day": endDate.getDate(),
      dimensions: ["DATE"],
      metrics: ["ESTIMATED_EARNINGS", "CLICKS", "IMPRESSIONS"],
    } as any); // Type workaround for googleapis typing issue

    const rows = response.data.rows || [];

    const result: AdSenseRevenueData[] = rows.map((row) => {
      const date = row.cells?.[0]?.value || "";
      const earnings = parseFloat(row.cells?.[1]?.value || "0");
      const clicks = parseInt(row.cells?.[2]?.value || "0");
      const impressions = parseInt(row.cells?.[3]?.value || "0");

      // CTR (Click-through rate) を計算
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

      // RPM (Revenue per thousand impressions) を計算
      const rpm = impressions > 0 ? (earnings / impressions) * 1000 : 0;

      return {
        date,
        earnings,
        clicks,
        impressions,
        ctr,
        rpm,
      };
    });

    // Sort by date in ascending order
    result.sort((a, b) => a.date.localeCompare(b.date));

    return result;
  } catch (error) {
    return [];
  }
}

export interface AdSenseSummary {
  totalEarnings: number;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averageRpm: number;
}

export interface AdUnitRevenueData {
  adUnitId: string;
  adUnitName: string;
  earnings: number;
  clicks: number;
  impressions: number;
  ctr: number;
  rpm: number;
}

/**
 * AdSense収益サマリーを取得
 * @param days 取得する日数（デフォルト: 30日）
 */
export async function getAdSenseSummary(
  days: number = 30
): Promise<AdSenseSummary | null> {
  const client = await getAdSenseClient();
  if (!client) {
    return null;
  }

  const accountId = await getAdSenseAccountId();
  if (!accountId) {
    return null;
  }

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await client.accounts.reports.generate({
      account: accountId,
      dateRange: "CUSTOM",
      "startDate.year": startDate.getFullYear(),
      "startDate.month": startDate.getMonth() + 1,
      "startDate.day": startDate.getDate(),
      "endDate.year": endDate.getFullYear(),
      "endDate.month": endDate.getMonth() + 1,
      "endDate.day": endDate.getDate(),
      metrics: ["ESTIMATED_EARNINGS", "CLICKS", "IMPRESSIONS"],
    } as any); // Type workaround for googleapis typing issue

    const row = response.data.rows?.[0];
    if (!row) {
      return {
        totalEarnings: 0,
        totalClicks: 0,
        totalImpressions: 0,
        averageCtr: 0,
        averageRpm: 0,
      };
    }

    const totalEarnings = parseFloat(row.cells?.[0]?.value || "0");
    const totalClicks = parseInt(row.cells?.[1]?.value || "0");
    const totalImpressions = parseInt(row.cells?.[2]?.value || "0");

    const averageCtr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageRpm =
      totalImpressions > 0 ? (totalEarnings / totalImpressions) * 1000 : 0;

    return {
      totalEarnings,
      totalClicks,
      totalImpressions,
      averageCtr,
      averageRpm,
    };
  } catch (error) {
    console.error("[AdSense] Error fetching summary:", error);
    if (error instanceof Error) {
      console.error("[AdSense] Error details:", error.message);
    }
    return null;
  }
}

/**
 * 広告ユニット別の収益データを取得
 * @param days 取得する日数（デフォルト: 30日）
 */
export async function getAdUnitRevenue(
  days: number = 30
): Promise<AdUnitRevenueData[]> {
  const client = await getAdSenseClient();
  if (!client) {
    return [];
  }

  const accountId = await getAdSenseAccountId();
  if (!accountId) {
    return [];
  }

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await client.accounts.reports.generate({
      account: accountId,
      dateRange: "CUSTOM",
      "startDate.year": startDate.getFullYear(),
      "startDate.month": startDate.getMonth() + 1,
      "startDate.day": startDate.getDate(),
      "endDate.year": endDate.getFullYear(),
      "endDate.month": endDate.getMonth() + 1,
      "endDate.day": endDate.getDate(),
      dimensions: ["AD_UNIT_ID", "AD_UNIT_NAME"],
      metrics: ["ESTIMATED_EARNINGS", "CLICKS", "IMPRESSIONS"],
    } as any); // Type workaround for googleapis typing issue

    const rows = response.data.rows || [];

    const result: AdUnitRevenueData[] = rows.map((row) => {
      const adUnitId = row.cells?.[0]?.value || "";
      const adUnitName = row.cells?.[1]?.value || "";
      const earnings = parseFloat(row.cells?.[2]?.value || "0");
      const clicks = parseInt(row.cells?.[3]?.value || "0");
      const impressions = parseInt(row.cells?.[4]?.value || "0");

      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const rpm = impressions > 0 ? (earnings / impressions) * 1000 : 0;

      return {
        adUnitId,
        adUnitName,
        earnings,
        clicks,
        impressions,
        ctr,
        rpm,
      };
    });

    // Sort by earnings in descending order
    result.sort((a, b) => b.earnings - a.earnings);

    return result;
  } catch (error) {
    console.error("[AdSense] Error fetching ad unit revenue:", error);
    if (error instanceof Error) {
      console.error("[AdSense] Error details:", error.message);
    }
    return [];
  }
}
