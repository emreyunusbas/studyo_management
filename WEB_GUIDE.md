# 🌐 Web Desteği Kullanım Kılavuzu

Bu kılavuz, Pilates Salon Yönetimi uygulamasının web versiyonunu bilgisayarınızda çalıştırmanız ve kullanmanız için gerekli tüm bilgileri içermektedir.

## 📋 İçindekiler

1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Web Özellikleri](#web-özellikleri)
3. [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
4. [Web Paneli Kullanımı](#web-paneli-kullanımı)
5. [Klavye Kısayolları](#klavye-kısayolları)
6. [Responsive Tasarım](#responsive-tasarım)
7. [PWA Desteği](#pwa-desteği)
8. [Deployment](#deployment)
9. [Sorun Giderme](#sorun-giderme)

---

## 🚀 Hızlı Başlangıç

### 1. Projeyi İndirin

```bash
git clone https://github.com/emreyunusbas/studyo_management.git
cd studyo_management
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### 3. Web Versiyonunu Başlatın

```bash
npm run web
# veya
yarn web
```

### 4. Tarayıcıda Açın

Web sunucusu başladığında otomatik olarak tarayıcınızda açılacaktır:
- **Varsayılan URL**: `http://localhost:8081`
- **Network URL**: `http://[your-ip]:8081` (mobil cihazlardan erişim için)

---

## ✨ Web Özellikleri

### Desktop-Optimized UI
- **Responsive Layout**: Ekran boyutuna göre otomatik uyarlanan tasarım
- **Max-Width Container**: Geniş ekranlarda içerik merkezi konumlandırma
- **Grid Layouts**: Desktop'ta çoklu kolon düzeni
- **Hover Effects**: Mouse ile etkileşim için hover animasyonları

### Performans
- **Metro Bundler**: Hızlı geliştirme ve build
- **Static Export**: SEO-friendly statik HTML çıktısı
- **Code Splitting**: Otomatik sayfa bazlı kod bölümleme
- **Lazy Loading**: Gerektiğinde yükleme

### Erişilebilirlik
- **Keyboard Navigation**: Tam klavye desteği
- **Screen Reader Support**: ARIA etiketleri
- **Semantic HTML**: Anlamlı HTML yapısı
- **Color Contrast**: WCAG AA uyumlu kontrastlar

---

## 🛠️ Kurulum ve Çalıştırma

### Geliştirme Modu

```bash
# Web sunucusunu başlat
npm run web

# Port belirtme
npx expo start --web --port 3000

# HTTPS ile başlatma
npx expo start --web --https
```

### Production Build

```bash
# Web için build oluştur
npx expo export:web

# Build dosyaları dist/ klasöründe oluşturulacak
# Bu dosyaları herhangi bir statik hosting servisine yükleyebilirsiniz
```

### Build Çıktısı

Build sonrası `web-build/` klasöründe şunları bulacaksınız:
- `index.html` - Ana HTML dosyası
- `static/` - JS, CSS ve asset dosyaları
- `manifest.json` - PWA manifest dosyası
- `service-worker.js` - Service worker (PWA için)

---

## 💻 Web Paneli Kullanımı

### Ana Özellikler

1. **Dashboard** (Ana Sayfa)
   - Günlük istatistik özeti
   - Bugünün seansları
   - Hızlı erişim kartları
   - Bildirimler

2. **Üye Yönetimi**
   - Üye listesi (arama ve filtreleme)
   - Üye detayları
   - Yeni üye ekleme
   - Üyelik yenileme ve ödeme takibi

3. **Seans Yönetimi**
   - Haftalık takvim görünümü
   - Seans planlama
   - Katılımcı yönetimi
   - Check-in sistemi

4. **Eğitmen Yönetimi**
   - Eğitmen listesi
   - Performans metrikleri
   - Sertifika yönetimi

5. **Finans Yönetimi**
   - Gelir özeti
   - Ödeme geçmişi
   - Paket yönetimi
   - Raporlar ve export

6. **Raporlar ve Analizler**
   - İstatistikler
   - Grafikler
   - Trend analizi
   - PDF/Excel export

7. **Ayarlar**
   - Profil düzenleme
   - Stüdyo bilgileri
   - Uygulama ayarları
   - Dil ve tema

### Desktop-Specific Özellikler

#### Grid Layout
Desktop ekranlarda kartlar otomatik olarak grid düzeninde gösterilir:
- **Mobile**: 1 kolon
- **Tablet**: 2 kolon
- **Desktop**: 3 kolon
- **Wide Screen**: 4 kolon

#### Sidebar Navigation
Geniş ekranlarda yan navigasyon paneli:
- Tüm modüllere hızlı erişim
- Aktif sayfa göstergesi
- Collapse/expand özelliği

#### Hover Effects
Mouse ile etkileşim için özel efektler:
- Kartlarda hover animasyonu
- Butonlarda renk değişimi
- Tooltip'ler
- Cursor pointer

---

## ⌨️ Klavye Kısayolları

Web versiyonu klavye kısayollarını destekler:

| Kısayol | Fonksiyon |
|---------|-----------|
| `h` | Ana sayfaya git |
| `n` | Yeni üye ekle |
| `s` | Yeni seans ekle |
| `/` | Arama kutusunu aç |
| `,` | Ayarlara git |
| `Esc` | Modal/Dialog kapat |
| `Ctrl + S` | Formu kaydet |
| `Tab` | Sonraki alana geç |
| `Shift + Tab` | Önceki alana geç |

### Kısayolları Aktifleştirme

```typescript
import { keyboardShortcuts } from '@/constants/webConfig';

// Örnek kullanım
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === keyboardShortcuts.newMember) {
      router.push('/member-add');
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## 📱 Responsive Tasarım

### Breakpoints

```typescript
const breakpoints = {
  mobile: 0,       // 0-767px
  tablet: 768,     // 768-1023px
  desktop: 1024,   // 1024-1439px
  wide: 1440,      // 1440px+
};
```

### Responsive Utilities Kullanımı

```typescript
import { getScreenSize, isDesktop, getGridColumns } from '@/constants/webConfig';

// Ekran boyutu kontrolü
const screenSize = getScreenSize();
// 'mobile' | 'tablet' | 'desktop' | 'wide'

// Desktop kontrolü
const showSidebar = isDesktop();

// Grid kolon sayısı
const columns = getGridColumns();
```

### WebWrapper Kullanımı

```typescript
import { WebWrapper } from '@/components/WebWrapper';

function MyScreen() {
  return (
    <WebWrapper maxWidth={1200} centered>
      {/* İçerik otomatik olarak merkezlenir ve max-width uygulanır */}
      <View>
        {/* ... */}
      </View>
    </WebWrapper>
  );
}
```

### Responsive Styles

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

---

## 📲 PWA Desteği

### Progressive Web App Özellikleri

Uygulama PWA (Progressive Web App) olarak kurulabilir:

1. **Offline Çalışma**: Service worker ile offline erişim
2. **Ana Ekrana Ekle**: Mobil ve desktop'ta uygulama gibi kullanım
3. **Push Notifications**: (Gelecek özellik)
4. **Hızlı Başlatma**: Önceden cache'lenmiş kaynaklar

### PWA Kurulumu

#### Desktop (Chrome, Edge)
1. URL çubuğundaki "Kur" butonuna tıklayın
2. veya: Menü > "Yükle [App Name]"

#### Mobile (Chrome, Safari)
1. "Paylaş" butonuna tıklayın
2. "Ana Ekrana Ekle" seçeneğini seçin

### Manifest.json

PWA ayarları `web/manifest.json` dosyasında:

```json
{
  "name": "Pilates Salon Yönetimi",
  "short_name": "Pilates Yönetim",
  "display": "standalone",
  "theme_color": "#B8FF3C",
  "background_color": "#0A0A0B"
}
```

---

## 🚀 Deployment

### Statik Hosting Servisleri

#### Vercel

```bash
# Vercel CLI yükle
npm i -g vercel

# Build ve deploy
npm run web:build
vercel --prod
```

#### Netlify

```bash
# Build
npm run web:build

# Netlify'da yeni site oluştur
# web-build/ klasörünü sürükle-bırak
```

#### AWS S3 + CloudFront

```bash
# Build
npm run web:build

# S3'e yükle
aws s3 sync web-build/ s3://your-bucket-name

# CloudFront distribution oluştur
```

#### GitHub Pages

```bash
# package.json'a ekle
"homepage": "https://yourusername.github.io/studyo_management"

# Build ve deploy
npm run web:build
npx gh-pages -d web-build
```

### Environment Variables

`.env` dosyası oluşturun:

```env
EXPO_PUBLIC_API_URL=https://api.yourserver.com
EXPO_PUBLIC_ENV=production
```

---

## 🔧 Sorun Giderme

### Yaygın Sorunlar ve Çözümleri

#### 1. "Cannot find module" hatası

```bash
# node_modules'i temizle ve tekrar yükle
rm -rf node_modules
npm install
```

#### 2. Port zaten kullanılıyor

```bash
# Farklı port belirt
npx expo start --web --port 3000
```

#### 3. Beyaz ekran görünüyor

- Tarayıcı konsolunu kontrol edin (F12)
- Cache'i temizleyin (Ctrl + Shift + Delete)
- Hard reload yapın (Ctrl + Shift + R)

#### 4. Gradient'ler gösterilmiyor

Web'de LinearGradient yerine CSS gradient kullanılmalı:

```typescript
// Web için alternative
const webGradient = {
  background: 'linear-gradient(135deg, #B8FF3C, #9FE01A)',
};
```

#### 5. Icons yüklenmiyor

Lucide icons web'de SVG olarak render edilir. Eğer görünmüyorsa:

```bash
# react-native-svg yükleyin
npm install react-native-svg
```

### Debug Modu

```bash
# Detaylı log ile başlat
EXPO_DEBUG=true npm run web

# Network debug
npx expo start --web --dev-client
```

### Performance Optimization

1. **Bundle size kontrolü**
   ```bash
   npx expo export:web --dump-bundle-sizes
   ```

2. **Lazy loading ekle**
   ```typescript
   const LazyComponent = React.lazy(() => import('./Component'));
   ```

3. **Image optimization**
   - WebP format kullanın
   - Lazy load images
   - Responsive images

---

## 📊 Tarayıcı Desteği

| Tarayıcı | Minimum Versiyon |
|----------|------------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

---

## 🔗 Faydalı Linkler

- [Expo Web Docs](https://docs.expo.dev/workflow/web/)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web Accessibility](https://www.w3.org/WAI/)

---

## 📞 Destek

Sorun yaşarsanız:
- **GitHub Issues**: [Create an issue](https://github.com/emreyunusbas/studyo_management/issues)
- **Email**: info@neselipilates.com

---

**Web versiyonunun tadını çıkarın! 🎉**
