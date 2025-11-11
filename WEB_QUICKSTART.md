# 🚀 Web Hızlı Başlangıç

## 30 Saniyede Web'de Çalıştır

```bash
# 1. Klonla
git clone https://github.com/emreyunusbas/studyo_management.git
cd studyo_management

# 2. Yükle
npm install

# 3. Başlat
npm run web
```

Tarayıcınız otomatik olarak `http://localhost:8081` adresinde açılacak!

---

## 🎯 Temel Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run web` | Geliştirme sunucusunu başlat |
| `npm run web:build` | Production build oluştur |
| `npm run web:serve` | Build'i local'de test et |
| `npm run web:https` | HTTPS ile başlat |
| `npm run web:port 3000` | Özel port belirt |

---

## 📱 Desktop vs Mobile

### Desktop'ta Çalışırken

✅ **Otomatik Özellikler:**
- İçerik merkezi ve max-width uygulanır
- Grid layout devreye girer (3-4 kolon)
- Hover efektleri çalışır
- Klavye kısayolları aktif

### Mobile Browser'da Çalışırken

✅ **Otomatik Özellikler:**
- Tek kolon layout
- Touch-friendly boyutlar
- Pull-to-refresh devre dışı
- Responsive tasarım

---

## 🛠️ Geliştirici Araçları

### Responsive Test

```bash
# Chrome DevTools'u aç
F12

# Device Toolbar'ı aç
Ctrl + Shift + M  (Windows/Linux)
Cmd + Shift + M   (Mac)

# Farklı ekran boyutlarını test et
```

### Hot Reload

Kod değiştirdiğinizde sayfa otomatik yenilenir! 🔥

### Debug

- Console: `F12 > Console`
- Network: `F12 > Network`
- React DevTools: Chrome Extension yükleyin

---

## 🎨 Web-Specific Kod Kullanımı

### 1. Platform Kontrolü

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific kod
}
```

### 2. Responsive Layout

```typescript
import { WebWrapper } from '@/components/WebWrapper';

<WebWrapper maxWidth={1200}>
  {/* İçerik */}
</WebWrapper>
```

### 3. Web Styles

```typescript
import { webStyles } from '@/constants/webStyles';

<View style={webStyles.container}>
  <View style={webStyles.grid}>
    <View style={webStyles.gridItem}>
      {/* Grid item */}
    </View>
  </View>
</View>
```

### 4. Screen Size Detection

```typescript
import { getScreenSize, isDesktop } from '@/constants/webConfig';

const screenSize = getScreenSize(); // 'mobile' | 'tablet' | 'desktop' | 'wide'
const showSidebar = isDesktop();
```

---

## 🔑 Klavye Kısayolları

| Tuş | Fonksiyon |
|-----|-----------|
| `h` | Ana sayfa |
| `n` | Yeni üye |
| `s` | Yeni seans |
| `/` | Arama |
| `,` | Ayarlar |

---

## 📦 Production Build & Deploy

### Build Oluştur

```bash
npm run web:build
```

Build dosyaları `web-build/` klasöründe!

### Test Et

```bash
npm run web:serve
```

### Deploy

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
- `web-build/` klasörünü netlify.com'a sürükle-bırak

**GitHub Pages:**
```bash
npm i -g gh-pages
npx gh-pages -d web-build
```

---

## 🐛 Hızlı Sorun Giderme

### Port zaten kullanılıyor?
```bash
npm run web:port 3000
```

### Beyaz ekran?
```bash
# Cache temizle
Ctrl + Shift + Delete

# Hard reload
Ctrl + Shift + R
```

### Module bulunamadı?
```bash
rm -rf node_modules
npm install
```

---

## 📚 Daha Fazla Bilgi

Detaylı kılavuz için: [WEB_GUIDE.md](./WEB_GUIDE.md)

---

**Kolay gelsin! 🎉**
