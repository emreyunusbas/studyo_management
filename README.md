# 💪 Pilates Salon Yönetimi

Modern ve kullanıcı dostu pilates stüdyo yönetim uygulaması. React Native ve Expo ile geliştirilmiş, **mobil ve web platformlarında** çalışan kapsamlı bir yönetim çözümü.

## 🌐 Web Desteği

✨ **Uygulamayı bilgisayarınızda web paneli olarak kullanabilirsiniz!**

```bash
# Hızlı başlangıç
npm install
npm run web
# Tarayıcınızda http://localhost:8081 otomatik açılır
```

**Özellikler:**
- 🖥️ Desktop-optimized responsive tasarım
- ⌨️ Klavye kısayolları desteği
- 📊 Geniş ekranlar için grid layout
- 🎨 Hover efektleri ve animasyonlar
- 📱 PWA desteği (Ana ekrana eklenebilir)
- 🚀 Hızlı performans ve SEO-friendly

**Detaylı Bilgi:**
- 📘 [Web Hızlı Başlangıç Kılavuzu](./WEB_QUICKSTART.md)
- 📗 [Kapsamlı Web Kullanım Kılavuzu](./WEB_GUIDE.md)

---

## 📱 Ekran Görüntüleri

Uygulama 6 ana modül ve 40+ ekrandan oluşmaktadır:
- Üye Yönetimi (14 ekran)
- Seans Yönetimi (4 ekran)
- Eğitmen Yönetimi (5 ekran)
- Finans Yönetimi (4 ekran)
- Raporlar ve Analizler (4 ekran)
- Ayarlar (4 ekran)

## ✨ Özellikler

### 👥 Üye Yönetimi
- Detaylı üye kayıt ve profil yönetimi
- Üyelik türleri: Birebir, Grup, Düet
- Kredi ve paket takibi
- Ödeme geçmişi ve taksit planları
- Üye ölçümleri ve ilerleme takibi
- Beslenme programları
- Üye-eğitmen mesajlaşma
- Seans zorluk seviyeleri
- Bildirim ve hatırlatmalar
- Grup yönetimi
- Pasif üye takibi

### 📅 Seans Yönetimi
- Haftalık seans takvimi
- Seans planı oluşturma ve düzenleme
- Katılımcı yönetimi
- Check-in sistemi
- Seans durumları (Planlandı, Tamamlandı, İptal)
- Kapasite takibi
- Günlük seans istatistikleri

### 👨‍🏫 Eğitmen Yönetimi
- Eğitmen kayıt ve profil yönetimi
- Uzmanlık alanları ve sertifikalar
- Performans metrikleri
- Tamamlanma oranları
- Aktif üye sayısı
- Puan sistemi
- Başarı rozetleri

### 💰 Finans Yönetimi
- Gelir özeti ve trendler
- Ödeme geçmişi (Nakit, Kart, Havale)
- Paket yönetimi (CRUD)
- Finansal raporlar
- Ödeme yöntemleri dağılımı
- En çok satan paketler
- Excel ve PDF export

### 📊 Raporlar ve Analizler
- Genel istatistik özeti
- Üye raporları ve analiz
- Seans raporları ve performans
- Katılım raporları
- Görsel grafikler ve chartlar
- Trend analizi
- Tarih aralığı filtreleme

### ⚙️ Ayarlar
- Profil düzenleme
- Şifre değiştirme
- Stüdyo bilgileri yönetimi
- Dil seçimi (TR/EN)
- Bildirim tercihleri
- Tema ayarları (Dark mode)
- Ses ve titreşim ayarları

## 🛠️ Teknolojiler

### Frontend
- **React Native** 0.81.5 - Cross-platform mobile framework
- **Expo** 54.0.0 - Development platform
- **Expo Router** 5.0.3 - File-based routing
- **TypeScript** 5.8.3 - Type safety
- **React** 19.0.0 - UI library

### UI & Styling
- **Expo Linear Gradient** - Gradient components
- **Lucide React Native** - Icon library
- **React Native Safe Area Context** - Safe area handling

### State Management
- **React Context API** - Global state
- **AsyncStorage** - Local persistence

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TS linting

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator (Mac için) veya Android Studio (Android için)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/emreyunusbas/studyo_management.git
cd studyo_management
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Uygulamayı başlatın**
```bash
# Mobil için
npm start
# veya
expo start

# Web için
npm run web
# veya
expo start --web
```

4. **Platform seçimi**
- iOS için: `i` tuşuna basın (Mac gerekli)
- Android için: `a` tuşuna basın
- Web için: `w` tuşuna basın veya tarayıcıda `http://localhost:8081` açın

## 🌐 Web Desteği

Uygulama Expo sayesinde web'de de çalışabilir. Web versiyonunu çalıştırmak için:

```bash
npm run web
```

Web versiyonu responsive tasarıma sahiptir ve tüm özellikler tam olarak çalışır.

### Web için Özel Optimizasyonlar
- Responsive layout
- Klavye navigasyonu
- Mouse hover efektleri
- Desktop-friendly UI

## 🎨 Tasarım Sistemi

### Renk Paleti
```typescript
Colors = {
  primary: '#B8FF3C',        // Neon yeşil
  primaryDark: '#9FE01A',
  primaryLight: '#C5FF60',

  background: '#0A0A0B',     // Koyu siyah
  backgroundLight: '#111113',

  surface: '#1A1A1D',        // Yüzey
  surfaceLight: '#2A2A2D',

  text: '#FFFFFF',           // Beyaz
  textSecondary: '#B3B3B3',
  textTertiary: '#666666',

  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  accent: '#EC4899',
}
```

### Tipografi
- **Başlıklar**: 800 weight, 24-32px
- **Alt başlıklar**: 700 weight, 16-20px
- **Gövde metni**: 600 weight, 13-15px
- **Etiketler**: 600 weight, 11-12px

### Bileşenler
- Gradient kartlar
- Modal picker'lar
- Custom switch toggle'lar
- Icon-based navigation
- Bottom sheet modals

## 📱 Ekranlar ve Navigasyon

### Tab Navigation (Ana Sekmeler)
1. **Home** - Dashboard ve hızlı erişim
2. **Members** - Üye listesi ve yönetimi
3. **Classes** - Seans takvimi
4. **Reports** - Raporlar ve istatistikler
5. **Settings** - Ayarlar

### Stack Navigation (Alt Ekranlar)
Tüm modüller file-based routing (Expo Router) ile yönetilir.

## 🔐 Authentication

Uygulama şu authentication flow'una sahiptir:
1. Welcome Screen - Karşılama ve dil seçimi
2. Onboarding - 9 özellik tanıtımı
3. Login - E-posta/telefon + şifre
4. Register - Yeni hesap oluşturma
5. OTP Verification - Kod doğrulama

Mock authentication kullanılmaktadır. Backend entegrasyonu için:
- `contexts/AppContext.tsx` dosyasındaki `login` ve `register` fonksiyonlarını güncelleyin
- API endpoint'lerinizi ekleyin

## 📊 Mock Data

Geliştirme ve test için kapsamlı mock data mevcuttur:
- `constants/mockData.ts` dosyasında bulunur
- 3 mock üye
- 6 mock seans
- 3 mock eğitmen
- 5 mock ödeme
- 5 mock paket

Production'da bu verileri backend API'den çekin.

## 🔌 Backend Entegrasyonu

### API Endpoints (Önerilen Yapı)

```typescript
// Auth
POST /api/auth/login
POST /api/auth/register
POST /api/auth/verify-otp
POST /api/auth/logout

// Members
GET    /api/members
GET    /api/members/:id
POST   /api/members
PUT    /api/members/:id
DELETE /api/members/:id

// Sessions
GET    /api/sessions
GET    /api/sessions/:id
POST   /api/sessions
PUT    /api/sessions/:id
DELETE /api/sessions/:id

// Trainers
GET    /api/trainers
GET    /api/trainers/:id
POST   /api/trainers
PUT    /api/trainers/:id
DELETE /api/trainers/:id

// Payments
GET    /api/payments
POST   /api/payments

// Packages
GET    /api/packages
POST   /api/packages
PUT    /api/packages/:id
DELETE /api/packages/:id

// Reports
GET /api/reports/members
GET /api/reports/sessions
GET /api/reports/attendance
GET /api/reports/financial
```

### API Entegrasyon Adımları

1. **API Service oluşturun**
```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'https://your-api.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

2. **Mock data'yı API call'ları ile değiştirin**
```typescript
// Örnek: Member listesi
const { data } = await api.get('/members');
setMembers(data);
```

3. **Error handling ekleyin**
```typescript
try {
  const response = await api.post('/members', memberData);
  Alert.alert('Başarılı', 'Üye eklendi');
} catch (error) {
  Alert.alert('Hata', error.message);
}
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests (Detox gerekli)
npm run test:e2e
```

## 📝 Proje Yapısı

```
studyo_management/
├── app/                          # Ekranlar (Expo Router)
│   ├── (auth)/                   # Auth flow
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── otp-verification.tsx
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Home
│   │   ├── members.tsx          # Members
│   │   ├── classes.tsx          # Sessions
│   │   ├── finance.tsx          # Finance
│   │   ├── reports.tsx          # Reports
│   │   └── settings.tsx         # Settings
│   ├── member-*.tsx             # Member screens
│   ├── session-*.tsx            # Session screens
│   ├── trainer-*.tsx            # Trainer screens
│   ├── payment-*.tsx            # Payment screens
│   ├── *-reports.tsx            # Report screens
│   ├── *-settings.tsx           # Settings screens
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
├── constants/                    # Constants & config
│   ├── colors.ts                # Color palette
│   └── mockData.ts              # Mock data
├── contexts/                     # React contexts
│   └── AppContext.tsx           # Global state
├── types/                        # TypeScript types
│   └── index.ts
├── assets/                       # Images & fonts
├── .gitignore
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Deployment

### Mobil (Expo EAS)

1. **EAS CLI yükleyin**
```bash
npm install -g eas-cli
```

2. **EAS hesabınıza giriş yapın**
```bash
eas login
```

3. **Build oluşturun**
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Her ikisi
eas build --platform all
```

4. **App Store ve Play Store'a yükleyin**
```bash
eas submit --platform ios
eas submit --platform android
```

### Web

```bash
# Web build oluşturun
expo export:web

# dist/ klasörünü hosting servisinize yükleyin
# Örnek: Vercel, Netlify, AWS S3, etc.
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Emre Yunus Baş**
- GitHub: [@emreyunusbas](https://github.com/emreyunusbas)

## 📞 İletişim

Sorularınız veya önerileriniz için:
- Email: info@neselipilates.com
- GitHub Issues: [Create an issue](https://github.com/emreyunusbas/studyo_management/issues)

## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak projeleri kullanmaktadır:
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Lucide Icons](https://lucide.dev/)
- [React Navigation](https://reactnavigation.org/)

## 📈 Gelecek Özellikler

- [x] Push notification entegrasyonu ✅
- [ ] SMS entegrasyonu
- [ ] E-posta gönderimi
- [ ] QR kod check-in
- [ ] Online ödeme entegrasyonu
- [ ] Takvim senkronizasyonu
- [ ] Sosyal medya entegrasyonu
- [ ] Video içerik yönetimi
- [ ] Çoklu stüdyo desteği
- [ ] Admin paneli (Web)
- [ ] İleri seviye analizler
- [ ] Export/Import özelliği
- [ ] Backup/Restore sistemi

## 🐛 Bilinen Sorunlar

Şu anda bilinen bir sorun bulunmamaktadır. Bir sorun bulursanız lütfen [issue açın](https://github.com/emreyunusbas/studyo_management/issues).

---

**Made with ❤️ for Pilates Studios**
