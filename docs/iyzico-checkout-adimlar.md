# iyzico Checkout Form — Adım Adım Kurulum

Bu projede ürün: **Premium abonelik** (`monthly` / `yearly`).

Kaynak: [CF Sample Imp.](https://docs.iyzico.com/en/payment-methods/checkoutform/cf-implementation/cf-sample-imp.) · [CF Retrieve](https://docs.iyzico.com/en/payment-methods/checkoutform/cf-implementation/cf-retrieve)

**Nasıl ilerleyeceğiz:** Her adımı oku. Hazır olunca sohbette **`yap`** (veya `adım 1 yap`) de; sadece o adım kodlanır. Bitince durulur.

---

## Genel akış

```
Satın al (subscribe)
  → 1) CF-Initialize (sunucu → iyzico)
  → 2) token + paymentPageUrl al, DB’ye yaz
  → 3) Kullanıcıyı paymentPageUrl’e yönlendir
  → 4) Ödeme bitince callback + CF-Retrieve
  → 5) Başarılıysa User premium
  → 6) Webhook (yedek teyit)
```

Mock (`PAYMENT_PROVIDER=mock`) mevcut haliyle kalır; iyzico ayrı açılır.

---

## Adım 0 — Senin hazırlaman (kod yok)

1. [iyzico sandbox](https://sandbox-merchant.iyzipay.com) hesabı aç  
2. API Key + Secret Key al  
3. Not et (sonra `.env`’e girecek):
   - `IYZICO_API_KEY`
   - `IYZICO_SECRET_KEY`
   - URI: `https://sandbox-api.iyzipay.com`
   - Callback (senin API’n, iyzico’nun adresi değil):  
     `http://localhost:3000/api/payments/iyzico/callback`  
     **ngrok kullanmıyoruz**; local test için localhost yeterli.

Bu adımda AI kod yazmaz.

---

## Adım 1 — Paket + config + env

**Ne:**
- `npm install iyzipay`
- `src/config/iyzicoConfig.js` (apiKey, secretKey, uri)
- `.env` alanları:
  ```
  PAYMENT_PROVIDER=iyzico
  IYZICO_API_KEY=
  IYZICO_SECRET_KEY=
  IYZICO_URI=https://sandbox-api.iyzipay.com
  IYZICO_CALLBACK_URL=http://localhost:3000/api/payments/iyzico/callback
  IYZICO_TEST_IDENTITY=74300864791
  IYZICO_TEST_GSM=+905555434332
  ```
- `PAYMENT_PROVIDER=iyzico` (geliştirmede geçici test için `mock` da kullanılabilir)

**Komut:** `adım 1 yap` veya `yap` (sıradaki adım 1 ise)

---

## Adım 2 — Payment model alanları

**Ne:** [`src/models/Payment.js`](src/models/Payment.js) içine:
- `conversationId` (String, unique) — bizim sipariş/referans id
- `checkoutToken` (String) — initialize’dan gelen token

Mevcut `provider`, `status`, `providerPaymentId` aynen kalır.

**Komut:** `adım 2 yap`

---

## Adım 3 — iyzico servisi (Initialize + Retrieve)

**Ne:** `src/services/iyzicoService.js`
- `initializeCheckoutForm({ payment, user, ip })`  
  → `checkoutFormInitialize.create`  
  → `{ token, paymentPageUrl }`
- `retrieveCheckoutForm(token)`  
  → `checkoutForm.retrieve`  
  → sonuç (`paymentStatus`, `paymentId`, `paidPrice`…)

Buyer: User `firstName`, `lastName`, `email`, `address` + sandbox’ta test TC/GSM (`IYZICO_TEST_*`).

Basket: tek kalem Premium monthly/yearly, `VIRTUAL`.

**Komut:** `adım 3 yap`

---

## Adım 4 — Subscribe: mock vs iyzico

**Ne:** [`paymentController.paymentSubscribe`](src/controllers/paymentController.js)

| `PAYMENT_PROVIDER` | Davranış |
|--------------------|----------|
| `mock` | Şimdiki gibi: hemen `paid` + premium |
| `iyzico` | `pending` Payment → Initialize → `{ payment, paymentPageUrl, token }` — henüz premium yok |

Frontend: `paymentPageUrl`’e yönlendirir.

**Komut:** `adım 4 yap`

---

## Adım 5 — Callback + premium aktivasyon

**Ne:**
- Route: `POST /api/payments/iyzico/callback` (auth yok)
- Body’den `token` al
- CF-Retrieve çağır
- `paymentStatus === 'SUCCESS'` (+ tutar kontrolü) →
  - Payment: `paid`, `providerPaymentId`
  - User: `plan=premium`, `premiumValidDate` uzat (`extendPremiumDate`)
- Zaten `paid` ise tekrar süre ekleme (idempotent)
- Failure → Payment `failed`

**Komut:** `adım 5 yap`

---

## Adım 6 — Webhook (yedek)

**Ne:**
- Route: `POST /api/payments/iyzico/webhook`
- `paymentConversationId` / `paymentId` / `status` ile Payment bul
- SUCCESS ise aynı activate mantığı (callback kaçarsa bile premium açılsın)
- Mümkünse imza doğrulama

Panelde webhook URL’ini kaydetmen gerekir.

**Komut:** `adım 6 yap`

---

## Adım 7 — Swagger

**Ne:** Payments tag’inde iyzico subscribe cevabı (`paymentPageUrl`), callback/webhook notları.

**Komut:** `adım 7 yap`

---

## Test checklist (hepsi bitince)

1. `.env` → `PAYMENT_PROVIDER=iyzico` + sandbox key’ler  
2. Login  
3. `POST /api/payments/subscribe` `{ "plan": "monthly" }`  
4. Dönen `paymentPageUrl`’i tarayıcıda aç  
5. Sandbox test kartı ile öde  
6. Callback sonrası User `plan=premium`  
7. `GET /api/films/:id` → 200  

---

## Durum

| Adım | Durum |
|------|--------|
| 0 Hazırlık (sen) | tamam |
| 1 Config + paket | tamam |
| 2 Payment alanları | tamam |
| 3 iyzico servisi | tamam |
| 4 Subscribe ayrımı | tamam |
| 5 Callback | tamam |
| 6 Webhook | tamam |
| 7 Swagger | tamam |

Tüm kod adımları tamamlandı. Test checklist’i uygula.
