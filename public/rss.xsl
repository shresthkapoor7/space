<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS Feed</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            background: #0a0908;
            color: #ccc;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            padding: 40px 20px 80px;
          }

          .container {
            max-width: 720px;
            margin: 0 auto;
          }

          .header {
            border-bottom: 1px solid #2a2a2a;
            padding-bottom: 28px;
            margin-bottom: 40px;
          }

          .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #FF6B35;
            text-decoration: none;
            letter-spacing: -0.03em;
          }

          .badge {
            display: inline-block;
            margin-top: 10px;
            padding: 3px 10px;
            border: 1px solid #333;
            border-radius: 3px;
            font-size: 0.7rem;
            color: #666;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .description {
            margin-top: 10px;
            color: #555;
            font-size: 0.82rem;
          }

          .hint {
            margin-top: 16px;
            padding: 12px 16px;
            background: rgba(255,107,53,0.05);
            border: 1px solid rgba(255,107,53,0.15);
            border-radius: 4px;
            color: #666;
            font-size: 0.78rem;
          }

          .hint code {
            color: #FF8C55;
            background: rgba(255,107,53,0.08);
            padding: 1px 6px;
            border-radius: 2px;
          }

          .items {
            display: flex;
            flex-direction: column;
            gap: 0;
          }

          .item {
            padding: 20px 0;
            border-bottom: 1px solid #1a1a1a;
          }

          .item:last-child {
            border-bottom: none;
          }

          .item-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
          }

          .item-category {
            font-size: 0.68rem;
            color: #FF6B35;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.7;
          }

          .item-date {
            font-size: 0.72rem;
            color: #444;
          }

          .item-title a {
            color: #e0e0e0;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: color 0.2s;
          }

          .item-title a:hover {
            color: #FF6B35;
          }

          .item-desc {
            margin-top: 6px;
            color: #555;
            font-size: 0.8rem;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a class="logo" href="{/rss/channel/link}">
              <xsl:value-of select="/rss/channel/title"/>
            </a>
            <div class="badge">RSS Feed</div>
            <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
            <p class="hint">
              Copy <code><xsl:value-of select="/rss/channel/atom:link/@href"/></code> into your feed reader to subscribe.
            </p>
          </div>

          <div class="items">
            <xsl:for-each select="/rss/channel/item">
              <div class="item">
                <div class="item-meta">
                  <span class="item-category"><xsl:value-of select="category"/></span>
                  <span class="item-date"><xsl:value-of select="pubDate"/></span>
                </div>
                <div class="item-title">
                  <a href="{link}" target="_blank">
                    <xsl:value-of select="title"/>
                  </a>
                </div>
                <xsl:if test="description != ''">
                  <p class="item-desc"><xsl:value-of select="description"/></p>
                </xsl:if>
              </div>
            </xsl:for-each>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
