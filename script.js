// --- UYGULAMA VERİLERİ ---
// Sitede gösterilecek tüm uygulamaların listesi.
// Yeni uygulama eklemek için bu yapıdan bir tane daha kopyalayıp virgülle ayırın.
const uygulamalar = [
    {
        ad: "Sms Bomber",
        kategori: "Güvenlik",
        aciklama: "Bir farklı kisiye sms saldırısı yapmak.",
        versiyon: "v2.10.0",
        ikon: "images/sms-bomber.png"
    },
    {
        ad: "Kod Düzenleyici",
        kategori: "Geliştirici Araçları",
        aciklama: "Geliştiriciler için tasarlanmış, eklentilerle zenginleştirilmiş kod editörü.",
        versiyon: "v2.1.5",
        ikon: "images/site.png"
    },
    {
        ad: "Sorgu Panel",
        kategori: "Sorgu",
        aciklama: "Bir farklı kisinin tüm bilgilerini öğrenmek.",
        versiyon: "v3.5.1",
        ikon: "images/sorgu.png"
    },
    {
        ad: "Token Grabber",
        kategori: "Araçlar",
        aciklama: "Bir farklı kisinin discord cookie bilgilerini çalmak.",
        versiyon: "v4.8.2",
        ikon: "images/token.png"
    },
    {
        ad: "Oyun Sunucusu",
        kategori: "Oyun",
        aciklama: "Hiç para ödemeden 7/24 oyun sunucusu açmak.",
        versiyon: "v1.5.0",
        ikon: "images/oyun-sunucu.png"
    }
];

// --- TEK KULLANIMLIK KOD SİSTEMİ ---
// BURAYA İSTEDİĞİN KADAR GEÇERLİ GİRİŞ KODU EKLE
// Bu kodlar SADECE BİR KEZ kullanılabilir.
const gecerliKodlar = [
    "PAROX-A4B7", "PAROX-C8D1", "PAROX-E2F5", "PAROX-G6H9",
    "KOD-1122", "KOD-3344", "KOD-5566", "KOD-7788",
    "GIZLI-9A8B", "GIZLI-7C6D", "GIZLI-5E4F", "GIZLI-3G2H"
];

const loginOverlay = document.getElementById('login-overlay');
const codeInput = document.getElementById('codeInput');
const loginButton = document.getElementById('loginButton');
const siteContent = document.getElementById('siteContent');
const loginMessage = document.getElementById('login-message');

loginButton.addEventListener('click', () => {
    const girilenKod = codeInput.value.trim();
    
    // Tarayıcının hafızasından kullanılmış kodları al
    let kullanilmisKodlar = JSON.parse(localStorage.getItem('kullanilmisKodlar')) || [];

    if (gecerliKodlar.includes(girilenKod)) {
        if (kullanilmisKodlar.includes(girilenKod)) {
            // Kod geçerli ama DAHA ÖNCE KULLANILMIŞ
            loginMessage.textContent = "Bu kod daha önce kullanılmış!";
            loginMessage.style.color = "var(--error-color)";
        } else {
            // Kod geçerli ve İLK KEZ KULLANILIYOR
            loginMessage.textContent = "Giriş başarılı!";
            loginMessage.style.color = "lightgreen";

            // Kodu "kullanılmış" olarak işaretle ve hafızaya kaydet
            kullanilmisKodlar.push(girilenKod);
            localStorage.setItem('kullanilmisKodlar', JSON.stringify(kullanilmisKodlar));
            
            // Giriş ekranını gizle, siteyi göster
            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.style.display = 'none';
                siteContent.style.display = 'block';
            }, 500); // Animasyonun bitmesini bekle
        }
    } else {
        // Kod GEÇERSİZ
        loginMessage.textContent = "Geçersiz kod girdiniz!";
        loginMessage.style.color = "var(--error-color)";
    }
});


// --- SİTE İÇİ FONKSİYONLAR ---
// Uygulama kartlarını oluştur ve ekrana bas
const appGrid = document.querySelector('#all-apps .app-grid');
uygulamalar.forEach(app => {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.innerHTML = `
        <div class="app-card-header">
            <img src="https://via.placeholder.com/64x64/0d6efd/ffffff?text=${app.ikon}" alt="${app.ad}">
            <div class="app-info">
                <h3>${app.ad}</h3>
                <span class="category">${app.kategori}</span>
            </div>
        </div>
        <div class="app-card-body"><p>${app.aciklama}</p></div>
        <div class="app-card-footer">
            <span class="version">${app.versiyon}</span>
            <a href="#" class="card-download-link">İndir</a>
        </div>
    `;
    appGrid.appendChild(card);
});

// Arama Fonksiyonu
document.getElementById('searchInput').addEventListener('keyup', function() {
    let filter = this.value.toUpperCase();
    let appCards = document.querySelectorAll('.app-card');

    appCards.forEach(card => {
        let appName = card.querySelector('h3').textContent.toUpperCase();
        if (appName.includes(filter)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});