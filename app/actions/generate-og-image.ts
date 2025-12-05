'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateOgImageBuffer } from '@/lib/generate-og-image'

/**
 * OG画像を生成してSupabase Storageに保存し、URLをデータベースに保存する
 */
export async function generateOgImage(postId: string, title: string) {
  try {
    const supabase = await createClient()

    // OG画像を直接生成
    console.log('Generating OG image for:', title)
    const imageBuffer = await generateOgImageBuffer(title)

    // Supabase Storageに保存
    const fileName = `og-${postId}-${Date.now()}.png`
    const filePath = `og-images/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '31536000', // 1年間キャッシュ
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`画像のアップロードに失敗しました: ${uploadError.message}`)
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from('blog-images').getPublicUrl(uploadData.path)

    // データベースのog_image_urlを更新
    const { error: updateError } = await supabase
      .from('posts')
      .update({ og_image_url: publicUrl })
      .eq('id', postId)

    if (updateError) {
      throw new Error(`データベースの更新に失敗しました: ${updateError.message}`)
    }

    // キャッシュを再検証
    revalidatePath('/posts')
    revalidatePath('/', 'layout')

    return {
      success: true,
      ogImageUrl: publicUrl,
    }
  } catch (error) {
    console.error('OG画像生成エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'OG画像の生成に失敗しました',
    }
  }
}

/**
 * 既存のOG画像を削除する
 */
export async function deleteOgImage(postId: string, ogImageUrl: string) {
  try {
    const supabase = await createClient()

    // URLからファイルパスを抽出
    const url = new URL(ogImageUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex((part) => part === 'blog-images')

    if (bucketIndex === -1) {
      throw new Error('無効なOG画像URLです')
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    // Supabase Storageから削除
    const { error: deleteError } = await supabase.storage
      .from('blog-images')
      .remove([filePath])

    if (deleteError) {
      console.error('画像の削除に失敗:', deleteError)
      // 削除エラーは無視（ファイルが存在しない場合など）
    }

    // データベースのog_image_urlをクリア
    const { error: updateError } = await supabase
      .from('posts')
      .update({ og_image_url: null })
      .eq('id', postId)

    if (updateError) {
      throw new Error(`データベースの更新に失敗しました: ${updateError.message}`)
    }

    // キャッシュを再検証
    revalidatePath('/posts')
    revalidatePath('/', 'layout')

    return {
      success: true,
    }
  } catch (error) {
    console.error('OG画像削除エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'OG画像の削除に失敗しました',
    }
  }
}
