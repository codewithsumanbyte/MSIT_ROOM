<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Sitemap | MSIT Room</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
          h1 { color: #900C3F; border-bottom: 2px solid #eee; padding-bottom: 15px; }
          p { color: #666; font-size: 0.9em; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
          th { background: #f8f9fa; text-align: left; padding: 15px; font-weight: 600; color: #444; border-bottom: 1px solid #eee; }
          td { padding: 15px; border-bottom: 1px solid #eee; font-size: 0.95em; }
          tr:hover { background: #fffdfd; }
          a { color: #900C3F; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; }
          .count { background: #eee; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; color: #555; margin-left: 10px; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap <span class="count"><xsl:value-of select="count(//*[local-name()='url'])"/> URLs</span></h1>
        <p>This is the XML Sitemap for MSIT Room, generated for search engines like Google.</p>
        
        <table>
          <thead>
            <tr>
              <th width="70%">URL</th>
              <th width="15%">Priority</th>
              <th width="15%">Frequency</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="//*[local-name()='url']">
              <tr>
                <td><a href="{*[local-name()='loc']}"><xsl:value-of select="*[local-name()='loc']"/></a></td>
                <td><xsl:value-of select="*[local-name()='priority']"/></td>
                <td><xsl:value-of select="*[local-name()='changefreq']"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
