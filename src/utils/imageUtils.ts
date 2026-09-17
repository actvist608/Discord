/**
 * Comprehensive utilities for image handling, compression, upload, and auto-detection.
 */

const IMAGE_EXTENSION_REGEX = /\.(png|jpe?g|gif|webp|svg|bmp|avif|heic|ico)(\?.*)?$/i;

const IMAGE_HOST_REGEX = /(images\.unsplash\.com|unsplash\.com|i\.imgur\.com|imgur\.com|media\.giphy\.com|i\.giphy\.com|giphy\.com|c\.tenor\.com|media\.tenor\.com|tenor\.com|cdn\.discordapp\.com|media\.discordapp\.net|pbs\.twimg\.com|twimg\.com|i\.redd\.it|preview\.redd\.it|external-preview\.redd\.it|i\.pinimg\.com|pinimg\.com|pin\.it|googleusercontent\.com|encrypted-tbn0\.gstatic\.com|gstatic\.com|photos\.app\.goo\.gl|i\.ibb\.co|ibb\.co|postimg\.cc|i\.postimg\.cc|gyazo\.com|i\.gyazo\.com|res\.cloudinary\.com|upload\.wikimedia\.org|pixabay\.com|images\.pexels\.com|pexels\.com|raw\.githubusercontent\.com)/i;

/**
 * Strips surrounding markdown formatting, brackets, or trailing punctuation from a URL string
 */
export function cleanUrlToken(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.trim();

  // Strip wrapping markdown <...> or (...) or [...] or quotes
  if (cleaned.startsWith('<') && cleaned.endsWith('>')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Strip trailing punctuation like .,!?;:
  cleaned = cleaned.replace(/[.,!?;:]+$/, '');
  return cleaned;
}

/**
 * Normalizes an image or GIF URL (e.g. converting web link to direct image asset if possible)
 */
export function normalizeImageUrl(url: string): string {
  const cleaned = cleanUrlToken(url);
  if (!cleaned) return '';

  try {
    const parsed = new URL(cleaned);

    // Giphy web page -> direct gif: giphy.com/gifs/*-(id) or giphy.com/gifs/(id)
    if (parsed.hostname.includes('giphy.com') && !parsed.hostname.includes('media.giphy.com')) {
      const match = parsed.pathname.match(/\/gifs\/(?:.*-)?([a-zA-Z0-9]+)$/);
      if (match && match[1]) {
        return `https://media.giphy.com/media/${match[1]}/giphy.gif`;
      }
    }

    // Imgur direct image resolution: imgur.com/xyz (single image, not gallery or album)
    if (parsed.hostname === 'imgur.com' && !parsed.pathname.startsWith('/a/') && !parsed.pathname.startsWith('/gallery/')) {
      const match = parsed.pathname.match(/^\/([a-zA-Z0-9]+)$/);
      if (match && match[1]) {
        return `https://i.imgur.com/${match[1]}.jpg`;
      }
    }

    return cleaned;
  } catch {
    return cleaned;
  }
}

/**
 * Checks if a string looks like an image URL, base64 data URL, or local file upload
 */
export function isImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const cleaned = cleanUrlToken(url);
  if (!cleaned) return false;

  // Base64 data URLs
  if (cleaned.startsWith('data:image/')) return true;

  // Local server uploaded files
  if (cleaned.startsWith('/api/files/') || cleaned.startsWith('/uploads/')) return true;

  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) return false;

  try {
    const parsed = new URL(cleaned);

    // 1. Direct file extensions in pathname
    if (IMAGE_EXTENSION_REGEX.test(parsed.pathname)) return true;

    // 2. Extension specified in search query (?format=jpg, ?format=png, ?type=image, etc.)
    if (/[?&](format|ext|type)=(png|jpe?g|gif|webp|svg|bmp|avif)/i.test(parsed.search)) return true;

    // 3. Known photo / GIF host domains
    if (IMAGE_HOST_REGEX.test(parsed.hostname)) return true;

    // 4. Path indicates an image / media asset
    if (/\/(images?|photos?|pictures?|media|avatars?|attachments?|thumbnails?)\//i.test(parsed.pathname)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Extracts image URLs from a message content and returns the remaining text + found image URLs
 */
export function extractImagesFromContent(content: string): { cleanText: string; imageUrls: string[] } {
  if (!content) return { cleanText: '', imageUrls: [] };

  // Split into tokens by whitespace
  const tokens = content.split(/(\s+)/);
  const imageUrls: string[] = [];
  const remainingTokens: string[] = [];

  for (const token of tokens) {
    const cleaned = cleanUrlToken(token);
    if (cleaned && isImageUrl(cleaned)) {
      const normalized = normalizeImageUrl(cleaned);
      if (!imageUrls.includes(normalized)) {
        imageUrls.push(normalized);
      }
    } else {
      remainingTokens.push(token);
    }
  }

  const cleanText = remainingTokens.join('').trim();
  return { cleanText, imageUrls };
}

/**
 * Compresses an image file and converts to Data URL (base64) so it can be shared with all clients
 */
export async function fileToDataUrl(file: File, maxDimension = 1440, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG or small animated GIF, preserve original binary without canvas re-compression
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to the server so all users receive a permanent, shareable URL
 * Falls back to base64 Data URL if server upload is unreachable
 */
export async function uploadImageFile(file: File): Promise<{ url: string; isImage: boolean; sizeFormatted: string }> {
  const isImg = file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(file.name);
  const sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

  let dataUrl = '';
  try {
    dataUrl = await fileToDataUrl(file);
  } catch {
    dataUrl = URL.createObjectURL(file);
  }

  // Attempt server upload so any user opening the app can load the image
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataUrl,
        name: file.name,
        size: file.size,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.url) {
        return {
          url: json.url,
          isImage: isImg,
          sizeFormatted,
        };
      }
    }
  } catch (err) {
    console.warn('Server upload unavailable, using compressed dataUrl fallback:', err);
  }

  return {
    url: dataUrl,
    isImage: isImg,
    sizeFormatted,
  };
}
