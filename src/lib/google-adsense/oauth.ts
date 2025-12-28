import { google } from "googleapis";
import { createClient } from "@/lib/supabase/server";

const SCOPES = ["https://www.googleapis.com/auth/adsense.readonly"];

/**
 * OAuth 2.0クライアントを作成
 */
export function createOAuth2Client() {
  const clientId = process.env.GOOGLE_ADSENSE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADSENSE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_ADSENSE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("OAuth 2.0 credentials are not configured");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * 認証URLを生成
 */
export function generateAuthUrl() {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // 常に同意画面を表示してリフレッシュトークンを取得
  });
}

/**
 * Supabaseにトークンを保存
 */
export async function saveTokens(tokens: {
  access_token: string;
  refresh_token?: string | null;
  expiry_date?: number | null;
}) {
  const supabase = await createClient();

  // 現在のユーザーを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // トークンを保存（google_adsense_tokensテーブル）
  const { error } = await supabase.from("google_adsense_tokens").upsert(
    {
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("[AdSense OAuth] Error saving tokens:", error);
    throw error;
  }
}

/**
 * Supabaseからトークンを取得
 */
export async function getStoredTokens() {
  const supabase = await createClient();

  // 現在のユーザーを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("google_adsense_tokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // データが見つからない場合
      return null;
    }
    console.error("[AdSense OAuth] Error getting tokens:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: data.expiry_date ? new Date(data.expiry_date).getTime() : undefined,
  };
}

/**
 * トークンを削除（認証解除）
 */
export async function deleteTokens() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("google_adsense_tokens").delete().eq("user_id", user.id);
}

/**
 * 認証済みのOAuth2クライアントを取得
 */
export async function getAuthenticatedClient() {
  const tokens = await getStoredTokens();

  if (!tokens) {
    return null;
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);

  // トークンの有効期限をチェックし、必要に応じて更新
  if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      // 新しいトークンを保存
      await saveTokens({
        access_token: credentials.access_token!,
        refresh_token: credentials.refresh_token,
        expiry_date: credentials.expiry_date,
      });
    } catch (error) {
      console.error("[AdSense OAuth] Error refreshing token:", error);
      // トークンの更新に失敗した場合は削除
      await deleteTokens();
      return null;
    }
  }

  return oauth2Client;
}
