# Babam İçin

Yusuf'un babası için hazırlanmış kişisel, statik ve mobil uyumlu Babalar Günü web sitesi. Site fotoğraf galerisi yerine metinsel anılar, karakter kartları, sembolik görseller, sade animasyonlar ve erişilebilir bir final mesajı üzerine kuruldu.

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
npm run dev
```

Vite geliştirme sunucusu yerel adresi terminalde gösterir. Genellikle `http://localhost:5173` üzerinden açılır.

## Build Alma

```bash
npm run build
```

Üretim çıktısı `dist/` klasörüne yazılır.

## Deploy Önerisi

Bu proje statik çıktı ürettiği için Netlify, Vercel, GitHub Pages veya herhangi bir statik hosting servisine dağıtılabilir. Deploy için build komutu `npm run build`, yayın klasörü `dist` olarak ayarlanmalıdır.

## İçerik Düzenleme

Ana içerik [index.html](/home/yusuf/babasite/index.html) içindedir. Kart metinleri, anılar, teşekkür bölümü ve final mesajı buradan değiştirilebilir.

Sembolik görseller `assets/images/` ve `assets/icons/` altında yer alır. Yeni fotoğraf veya ses eklenecekse `assets/` klasörü kullanılabilir; ses dosyaları otomatik başlatılmamalıdır.

## Animasyon ve Erişilebilirlik

Animasyonlar CSS transition/keyframes ve küçük bir Intersection Observer kullanımıyla sağlanır. `prefers-reduced-motion` desteği vardır; hareket azaltma tercihi açık olan kullanıcılarda animasyonlar sadeleşir.

Final mesajı JavaScript kapalıyken HTML içinde erişilebilir kalır. JavaScript çalıştığında mesaj butonla açılan bir sürpriz alana dönüşür.
