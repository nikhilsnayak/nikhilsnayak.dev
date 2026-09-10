<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <style>
          :root {
            color-scheme: light dark;
            --background: oklch(0.985104 0 0);
            --foreground: oklch(0.147 0 0);
            --muted-foreground: oklch(0.503229 0 0);
            --border: oklch(0.923 0 0);
            --primary: oklch(0.528945 0.200253 25.4499);
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background: oklch(0 0 0);
              --foreground: oklch(0.946105 0 0);
              --muted-foreground: oklch(0.68483 0.008698 286.167818);
              --border: oklch(0.261537 0.005542 286.010311);
              --primary: oklch(0.59795 0.218696 24.802113);
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0 24px 96px;
            background: var(--background);
            color: var(--foreground);
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 13px;
            line-height: 1.7;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { width: min(100%, 46rem); margin: 0 auto; }
          header { padding: 64px 0 0; }
          .kicker {
            color: var(--muted-foreground);
            font-size: 11px;
            margin: 0;
          }
          h1 {
            font-size: 15px;
            font-weight: 500;
            letter-spacing: 0;
            margin: 4px 0 0;
          }
          .note {
            color: var(--muted-foreground);
            max-width: 58ch;
            margin: 24px 0 0;
          }
          .url {
            display: inline-block;
            max-width: 100%;
            margin: 12px 0 0;
            padding: 14px 16px;
            border: 1px solid var(--border);
            color: var(--foreground);
            overflow-wrap: anywhere;
            user-select: all;
          }
          .meta {
            color: var(--muted-foreground);
            font-size: 11px;
            margin: 24px 0 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0 12px;
          }
          ol {
            list-style: none;
            margin: 56px 0 0;
            padding: 0;
            border-top: 1px solid var(--border);
          }
          li {
            display: grid;
            grid-template-columns: 12ch 1fr;
            gap: 0 24px;
            padding: 18px 0;
            border-bottom: 1px solid var(--border);
          }
          time {
            color: var(--muted-foreground);
            font-size: 11px;
            font-variant-numeric: tabular-nums;
            padding-top: 2px;
          }
          .title { font-weight: 500; }
          .summary {
            color: var(--muted-foreground);
            margin: 4px 0 0;
            max-width: 62ch;
          }
          a {
            color: inherit;
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-color: color-mix(in srgb, currentColor 30%, transparent);
          }
          a:hover { text-decoration-color: var(--primary); color: var(--primary); }
          @media (max-width: 599px) {
            li { grid-template-columns: 1fr; gap: 6px 0; }
            time { padding-top: 0; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <p class="kicker">rss 2.0 feed</p>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="note">Paste this into your reader:</p>
            <code class="url"><xsl:value-of select="/rss/channel/link"/>/rss.xml</code>
            <p class="meta">
              <span><xsl:value-of select="count(/rss/channel/item)"/> items</span>
              <a>
                <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
                nikhilsnayak.dev
              </a>
            </p>
          </header>
          <ol>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <time><xsl:value-of select="substring(pubDate, 6, 11)"/></time>
                <div>
                  <a class="title">
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                  <p class="summary"><xsl:value-of select="description"/></p>
                </div>
              </li>
            </xsl:for-each>
          </ol>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
