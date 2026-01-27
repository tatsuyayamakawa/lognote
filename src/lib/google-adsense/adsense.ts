import { google } from "googleapis";
import { getStoredTokens, createOAuth2Client, saveTokens, deleteTokens } from "./oauth";

type AdSenseTokens = {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
};

/**
 * トークンからAdSenseクライアントを作成
 */
function createAdSenseClientFromTokens(tokens: AdSenseTokens) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);
  return google.adsense({
    version: "v2",
    auth: oauth2Client,
  });
}

/**
 * トークンを取得（キャッシュの外で呼び出す）
 */
export async function getAdSenseTokens(): Promise<AdSenseTokens | null> {
  const tokens = await getStoredTokens();

  if (!tokens) {
    return null;
  }

  // トークンの有効期限をチェックし、必要に応じて更新
  if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
    try {
      const oauth2Client = createOAuth2Client();
      oauth2Client.setCredentials(tokens);
      const { credentials } = await oauth2Client.refreshAccessToken();

      // 新しいトークンを保存
      await saveTokens({
        access_token: credentials.access_token!,
        refresh_token: credentials.refresh_token,
        expiry_date: credentials.expiry_date,
      });

      return {
        access_token: credentials.access_token!,
        refresh_token: credentials.refresh_token || undefined,
        expiry_date: credentials.expiry_date || undefined,
      };
    } catch (error) {
      console.error("[AdSense] Error refreshing token:", error);
      await deleteTokens();
      return null;
    }
  }

  return tokens;
}

/**
 * AdSenseアカウントIDを取得（トークンを受け取る）
 */
async function getAdSenseAccountIdWithTokens(tokens: AdSenseTokens): Promise<string | null> {
  try {
    const client = createAdSenseClientFromTokens(tokens);
    const response = await client.accounts.list();
    const accounts = response.data.accounts;

    if (!accounts || accounts.length === 0) {
      return null;
    }

    return accounts[0].name || null;
  } catch (error) {
    console.error("[AdSense] Error fetching accounts:", error);
    return null;
  }
}

export interface AdSenseRevenueData {
  date: string;
  earnings: number;
  clicks: number;
  impressions: number;
  ctr: number;
  rpm: number;
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
 * AdSense収益データを取得
 * @param days 取得する日数（デフォルト: 30日）
 */
export async function getAdSenseRevenue(days: number = 30): Promise<AdSenseRevenueData[]> {
  const tokens = await getAdSenseTokens();
  if (!tokens) {
    return [];
  }

  const accountId = await getAdSenseAccountIdWithTokens(tokens);
  if (!accountId) {
    return [];
  }

  try {
    const client = createAdSenseClientFromTokens(tokens);
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
    } as any);

    const rows = response.data.rows || [];

    const result: AdSenseRevenueData[] = rows.map((row) => {
      const date = row.cells?.[0]?.value || "";
      const earnings = parseFloat(row.cells?.[1]?.value || "0");
      const clicks = parseInt(row.cells?.[2]?.value || "0");
      const impressions = parseInt(row.cells?.[3]?.value || "0");

      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const rpm = impressions > 0 ? (earnings / impressions) * 1000 : 0;

      return { date, earnings, clicks, impressions, ctr, rpm };
    });

    result.sort((a, b) => a.date.localeCompare(b.date));
    return result;
  } catch (error) {
    console.error("[AdSense] Error fetching revenue:", error);
    return [];
  }
}

/**
 * AdSense収益サマリーを取得
 * @param days 取得する日数（デフォルト: 30日）
 */
export async function getAdSenseSummary(days: number = 30): Promise<AdSenseSummary | null> {
  const tokens = await getAdSenseTokens();
  if (!tokens) {
    return null;
  }

  const accountId = await getAdSenseAccountIdWithTokens(tokens);
  if (!accountId) {
    return null;
  }

  try {
    const client = createAdSenseClientFromTokens(tokens);
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
    } as any);

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

    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageRpm = totalImpressions > 0 ? (totalEarnings / totalImpressions) * 1000 : 0;

    return { totalEarnings, totalClicks, totalImpressions, averageCtr, averageRpm };
  } catch (error) {
    console.error("[AdSense] Error fetching summary:", error);
    return null;
  }
}

/**
 * 広告ユニット別の収益データを取得
 * @param days 取得する日数（デフォルト: 30日）
 */
export async function getAdUnitRevenue(days: number = 30): Promise<AdUnitRevenueData[]> {
  const tokens = await getAdSenseTokens();
  if (!tokens) {
    return [];
  }

  const accountId = await getAdSenseAccountIdWithTokens(tokens);
  if (!accountId) {
    return [];
  }

  try {
    const client = createAdSenseClientFromTokens(tokens);
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
    } as any);

    const rows = response.data.rows || [];

    const result: AdUnitRevenueData[] = rows.map((row) => {
      const adUnitId = row.cells?.[0]?.value || "";
      const adUnitName = row.cells?.[1]?.value || "";
      const earnings = parseFloat(row.cells?.[2]?.value || "0");
      const clicks = parseInt(row.cells?.[3]?.value || "0");
      const impressions = parseInt(row.cells?.[4]?.value || "0");

      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const rpm = impressions > 0 ? (earnings / impressions) * 1000 : 0;

      return { adUnitId, adUnitName, earnings, clicks, impressions, ctr, rpm };
    });

    result.sort((a, b) => b.earnings - a.earnings);
    return result;
  } catch (error) {
    console.error("[AdSense] Error fetching ad unit revenue:", error);
    return [];
  }
}
