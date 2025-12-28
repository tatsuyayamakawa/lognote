import Youtube from '@tiptap/extension-youtube';

// YouTube Live URL対応のカスタムYouTube拡張
export const CustomYoutube = Youtube.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      setYoutubeVideo:
        (options: { src: string }) =>
        ({ commands }) => {
          let videoId = '';
          const url = options.src;

          try {
            // YouTube Live URL: https://www.youtube.com/live/VIDEO_ID
            const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
            if (liveMatch) {
              videoId = liveMatch[1];
            }

            // 通常のYouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
            if (!videoId) {
              const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
              if (watchMatch) {
                videoId = watchMatch[1];
              }
            }

            // 短縮URL: https://youtu.be/VIDEO_ID
            if (!videoId) {
              const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
              if (shortMatch) {
                videoId = shortMatch[1];
              }
            }

            // 埋め込みURL: https://www.youtube.com/embed/VIDEO_ID
            if (!videoId) {
              const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
              if (embedMatch) {
                videoId = embedMatch[1];
              }
            }

            if (videoId) {
              // 埋め込み用URLに変換
              const embedUrl = `https://www.youtube.com/watch?v=${videoId}`;
              return commands.insertContent({
                type: this.name,
                attrs: {
                  src: embedUrl,
                },
              });
            }

            // 動画IDが取得できない場合はそのまま挿入を試みる
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          } catch (error) {
            console.error('YouTube URL parsing error:', error);
            return false;
          }
        },
    };
  },
});
