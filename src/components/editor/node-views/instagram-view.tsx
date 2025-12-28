"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";

export function InstagramView({ node }: NodeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const url = node.attrs.url;

  useEffect(() => {
    // Instagram埋め込みスクリプトを読み込む
    const loadScript = () => {
      if (typeof window === "undefined") return;

      if (window.instgrm) {
        setScriptLoaded(true);
        return;
      }

      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          setScriptLoaded(true);
        };
        document.body.appendChild(script);
      } else {
        // スクリプトは既に存在するが、まだ読み込まれていない可能性がある
        const checkInterval = setInterval(() => {
          if (window.instgrm) {
            setScriptLoaded(true);
            clearInterval(checkInterval);
          }
        }, 100);

        setTimeout(() => clearInterval(checkInterval), 5000);
      }
    };

    loadScript();
  }, []);

  useEffect(() => {
    // スクリプトが読み込まれたら埋め込みを処理
    if (scriptLoaded && window.instgrm && containerRef.current) {
      // 少し遅延させて確実に処理する
      const timer = setTimeout(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [scriptLoaded, url]);

  return (
    <NodeViewWrapper>
      <div ref={containerRef} className="instagram-embed-wrapper my-4">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: 0,
            borderRadius: "3px",
            boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
            margin: "1px auto",
            maxWidth: "540px",
            minWidth: "326px",
            padding: 0,
            width: "calc(100% - 2px)",
          }}
        >
          <div style={{ padding: "16px" }}>
            <a
              href={url}
              style={{
                background: "#FFFFFF",
                lineHeight: 0,
                padding: "0 0",
                textAlign: "center",
                textDecoration: "none",
                width: "100%",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              View this post on Instagram
            </a>
          </div>
        </blockquote>
      </div>
    </NodeViewWrapper>
  );
}

// Instagram埋め込みスクリプトのグローバル型定義
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
