// api/tiktok.js - Vercel Serverless Function
// Fetches real TikTok public profile data using social crawler technique

export default async function handler(req, res) {
  // CORS headers so the browser can call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600'); // cache 5min

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { username } = req.query;

  if (!username || !/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  const clean = username.replace(/^@/, '');

  try {
    const url = `https://www.tiktok.com/@${encodeURIComponent(clean)}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      // User not found or blocked
      return res.status(404).json({ error: 'User not found', username: clean });
    }

    const html = await response.text();

    // Extract og: meta tags
    const get = (prop) => {
      const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
              || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, 'i'));
      return m ? m[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'") : null;
    };

    const title = get('og:title');   // e.g. "MrBeast on TikTok"
    const desc  = get('og:description'); // e.g. "@mrbeast 142.4m Followers, 355 Following..."
    const image = get('og:image');   // CDN avatar URL

    if (!title) {
      return res.status(404).json({ error: 'Profile not found', username: clean });
    }

    // Parse display name from title: "Name on TikTok" -> "Name"
    const displayName = title.replace(/ on TikTok$/i, '').trim();

    // Parse followers from description: "@user 142.4m Followers, 355 Following, 1503.8m Likes - Bio..."
    let followers = null;
    let bio = null;
    if (desc) {
      const followerMatch = desc.match(/[\d.,]+[kmbt]?\s*Followers/i);
      if (followerMatch) {
        followers = followerMatch[0].replace(/\s*Followers/i, '').trim();
      }
      // Bio is after the dash
      const dashIdx = desc.indexOf(' - ');
      if (dashIdx !== -1) {
        bio = desc.substring(dashIdx + 3).trim();
      }
    }

    return res.status(200).json({
      username: clean,
      displayName,
      followers: followers || '—',
      bio: bio || `@${clean} on TikTok`,
      avatar: image,
      tiktokUrl: `https://www.tiktok.com/@${clean}`,
      verified: false, // can't determine without full API
    });

  } catch (err) {
    console.error('TikTok fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}
