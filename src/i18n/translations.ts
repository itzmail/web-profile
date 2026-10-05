export type Language = "en" | "id";

export interface TranslationDict {
    // Navigation & Global UI
    nav: {
        projects: string;
        certificates: string;
        lab: string;
        blog: string;
        toggleTheme: string;
        toggleTerminal: string;
    };
    // Lab Directory / Index
    labIndex: {
        eyebrow: string;
        title: string;
        subtitle: string;
        readingTimeSuffix: string;
        inDev: string;
        launchBtn: string;
    };
    // Lab #01: JWT Inspector
    jwtLab: {
        eyebrow: string;
        title: string;
        subtitle: string;
        backLink: string;
        livePlaygroundTitle: string;
        resetBtn: string;
        tokenHeaderLabel: string;
        tokenPayloadLabel: string;
        tokenSignatureLabel: string;
        encodedTokenLabel: string;
        charsBytes: string;
        secretKeyLabel: string;
        secretPlaceholder: string;
        randomizeBtn: string;
        attackSimulatorTitle: string;
        attackSimulatorDesc: string;
        btnAlgNoneTitle: string;
        btnAlgNoneDesc: string;
        btnTamperTitle: string;
        btnTamperDesc: string;
        btnExpiredTitle: string;
        btnExpiredDesc: string;
        decodedHeaderLabel: string;
        decodedPayloadLabel: string;
        liveEditableBadge: string;
        signatureValidStatus: string;
        unsecuredNoneStatus: string;
        signatureMismatchStatus: string;
        tokenExpiredStatus: string;
        cryptoUnavailableStatus: string;
        alertNoneTitle: string;
        alertNoneBody: string;
        alertTamperTitle: string;
        alertTamperBody: string;
        alertExpiredTitle: string;
        alertExpiredBody: string;
        alertInsecureTitle: string;
        alertInsecureBody: string;
        // Deep Dive Article
        section1Title: string;
        section1P1: string;
        section1P2: string;
        partHeaderDesc: string;
        partPayloadDesc: string;
        partSignatureDesc: string;
        section2Title: string;
        section2P1: string;
        section2Step1: string;
        section2Step2: string;
        section2Step3: string;
        defenseTitle: string;
        defensePoint1: string;
        defensePoint2: string;
        defensePoint3: string;
        section3Title: string;
        takeaway1Title: string;
        takeaway1Desc: string;
        takeaway2Title: string;
        takeaway2Desc: string;
        footerBackBtn: string;
        footerNextHint: string;
    };
}

export const translations: Record<Language, TranslationDict> = {
    en: {
        nav: {
            projects: "Projects",
            certificates: "Certificates",
            lab: "Lab",
            blog: "Blog",
            toggleTheme: "Toggle theme",
            toggleTerminal: "Toggle Terminal (Ctrl + `)",
        },
        labIndex: {
            eyebrow: "// systems & architecture lab",
            title: "Proof of Concepts",
            subtitle: "Interactive engineering playgrounds, protocol dissections, and first-principles experiments built directly into the browser.",
            readingTimeSuffix: "min",
            inDev: "// in development",
            launchBtn: "Launch Interactive Lab",
        },
        jwtLab: {
            eyebrow: "// LAB #01 • SECURITY & PROTOCOLS",
            title: "JWT & Algorithm Confusion Attack Inspector",
            subtitle: "A deep dive into JSON Web Token (RFC 7519) anatomy, client-side Web Crypto signature generation, and how subtle parser flaws allow privilege escalation.",
            backLink: "← // return to lab directory",
            livePlaygroundTitle: "LIVE INTERACTIVE PLAYGROUND",
            resetBtn: "Reset",
            tokenHeaderLabel: "Header",
            tokenPayloadLabel: "Payload",
            tokenSignatureLabel: "Signature",
            encodedTokenLabel: "// ENCODED COMPACT TOKEN (Base64URL)",
            charsBytes: "chars (~{bytes} bytes)",
            secretKeyLabel: "1. Secret Key (HMAC-SHA256)",
            secretPlaceholder: "Enter HMAC Secret...",
            randomizeBtn: "Randomize",
            attackSimulatorTitle: "SECURITY ATTACK SIMULATOR",
            attackSimulatorDesc: "Inject known vulnerabilities to test parser defenses:",
            btnAlgNoneTitle: '💣 "alg": "none" Exploit',
            btnAlgNoneDesc: "Bypass signature verification by stripping alg",
            btnTamperTitle: "🎭 Privilege Escalation",
            btnTamperDesc: 'Tamper payload claim (role: "user" → "admin")',
            btnExpiredTitle: "⏰ Expired Token Test",
            btnExpiredDesc: "Set exp claim 1 hour in the past",
            decodedHeaderLabel: "HEADER (Algorithm & Type)",
            decodedPayloadLabel: "PAYLOAD (Claims / Identity)",
            liveEditableBadge: "Live Editable",
            signatureValidStatus: "SIGNATURE VALID (200 OK)",
            unsecuredNoneStatus: "UNSECURED (alg: none)",
            signatureMismatchStatus: "SIGNATURE MISMATCH (401)",
            tokenExpiredStatus: "TOKEN EXPIRED (401)",
            cryptoUnavailableStatus: "CRYPTO API UNAVAILABLE",
            alertNoneTitle: "🚨 Critical Vulnerability: 'alg: none' Accepted",
            alertNoneBody: "Token signature is completely missing. If the server does not enforce white-listed algorithms, attackers can forge any arbitrary payload (e.g. admin access) without needing the secret key.",
            alertTamperTitle: "🛡️ Signature Verification Failed",
            alertTamperBody: "Payload was altered without recalculating signature with the correct secret key. Verification failed: `HMAC_SHA256(Data, Secret) != Token_Signature`.",
            alertExpiredTitle: "⏰ Token Expired (exp claim passed)",
            alertExpiredBody: "The token signature is valid, but the timestamp claim 'exp' ({exp}) is in the past. Standard JWT verifiers will reject this token.",
            alertInsecureTitle: "Insecure Context Detected",
            alertInsecureBody: "Web Crypto API (window.crypto.subtle) is not available. Please access via HTTPS or localhost.",
            section1Title: "1. The First-Principles: What is a JWT?",
            section1P1: "A JSON Web Token (JWT) is not encrypted by default; it is simply signed and Base64URL-encoded. Anyone with the token can inspect its payload. The security guarantees come entirely from the cryptographic signature.",
            section1P2: "A standard compact token consists of three parts separated by dots (.):",
            partHeaderDesc: "Specifies signature algorithm & token type",
            partPayloadDesc: "Claims & identity metadata (openly readable)",
            partSignatureDesc: "Prevents tampering by cryptographically binding header + payload",
            section2Title: '2. The "alg": "none" Exploit Explained',
            section2P1: 'According to the original JWA specification (RFC 7518), an algorithm called "none" was permitted for unsecured tokens. If a backend library naively trusts the alg header passed by the client:',
            section2Step1: 'An attacker modifies the payload to elevate their role (e.g. "role": "admin").',
            section2Step2: 'The attacker updates the header to {"alg": "none"} and removes the signature part.',
            section2Step3: "If the server's verification logic checks if (header.alg === 'none') return true;, the forged token is accepted without any secret key!",
            defenseTitle: "🛡️ How to Defend (RFC 8725 Best Current Practice):",
            defensePoint1: "Enforce Algorithm Whitelisting: Never allow the token header to dictate which algorithm is used during verification. Hardcode the expected algorithm on the server (e.g., explicitly require HS256 or RS256).",
            defensePoint2: "Reject none by Default: Ensure your JWT verification library has unsecured tokens disabled.",
            defensePoint3: "Sufficient Key Entropy: For HS256, HMAC secrets must have at least 256 bits (32 bytes) of cryptographically secure randomness to resist brute-force attacks.",
            section3Title: "3. Key Takeaways from this Lab",
            takeaway1Title: "Encoding ≠ Encryption",
            takeaway1Desc: "Base64URL is merely an encoding mechanism to transport JSON safely across HTTP headers. Sensitive PII must never be stored in JWT payloads without JWE (JSON Web Encryption).",
            takeaway2Title: "Web Crypto in the Browser",
            takeaway2Desc: "Modern browsers can compute HMAC-SHA256 and RSA signatures directly using the native window.crypto.subtle API with zero external dependencies in <1ms.",
            footerBackBtn: "← Back to Lab Directory",
            footerNextHint: "Next Lab: Protobuf vs JSON Wire Inspector (Sprint 2) →",
        },
    },
    id: {
        nav: {
            projects: "Proyek",
            certificates: "Sertifikasi",
            lab: "Lab",
            blog: "Blog",
            toggleTheme: "Ganti tema",
            toggleTerminal: "Buka Terminal (Ctrl + `)",
        },
        labIndex: {
            eyebrow: "// lab sistem & arsitektur",
            title: "Proof of Concepts",
            subtitle: "Playground rekayasa perangkat lunak interaktif, pembedahan protokol, dan eksperimen first-principles langsung di browser.",
            readingTimeSuffix: "menit",
            inDev: "// dalam pengembangan",
            launchBtn: "Buka Lab Interaktif",
        },
        jwtLab: {
            eyebrow: "// LAB #01 • KEAMANAN & PROTOKOL",
            title: "Inspektor JWT & Serangan Algorithm Confusion",
            subtitle: "Membedah anatomi JSON Web Token (RFC 7519), kalkulasi signature Web Crypto HMAC-SHA256 di browser, dan bagaimana celah parser memicu eskalasi hak akses.",
            backLink: "← // kembali ke direktori lab",
            livePlaygroundTitle: "PLAYGROUND INTERAKTIF LIVE",
            resetBtn: "Reset",
            tokenHeaderLabel: "Header",
            tokenPayloadLabel: "Payload",
            tokenSignatureLabel: "Signature",
            encodedTokenLabel: "// TOKEN KOMPAK TER-ENCODE (Base64URL)",
            charsBytes: "karakter (~{bytes} byte)",
            secretKeyLabel: "1. Kunci Rahasia / Secret (HMAC-SHA256)",
            secretPlaceholder: "Masukkan HMAC Secret...",
            randomizeBtn: "Acak Kunci",
            attackSimulatorTitle: "SIMULATOR SERANGAN KEAMANAN",
            attackSimulatorDesc: "Uji ketahanan parser dengan menginjeksikan celah keamanan populer:",
            btnAlgNoneTitle: '💣 Eksploit "alg": "none"',
            btnAlgNoneDesc: "Bypass verifikasi tanda tangan dengan menghapus algoritma",
            btnTamperTitle: "🎭 Eskalasi Hak Akses",
            btnTamperDesc: 'Ubah klaim payload (role: "user" → "admin")',
            btnExpiredTitle: "⏰ Uji Token Kedaluwarsa",
            btnExpiredDesc: "Atur klaim exp mundur 1 jam ke masa lalu",
            decodedHeaderLabel: "HEADER (Algoritma & Tipe)",
            decodedPayloadLabel: "PAYLOAD (Klaim / Identitas)",
            liveEditableBadge: "Bisa Diedit Langsung",
            signatureValidStatus: "SIGNATURE VALID (200 OK)",
            unsecuredNoneStatus: "TIDAK AMAN (alg: none)",
            signatureMismatchStatus: "SIGNATURE TIDAK COCOK (401)",
            tokenExpiredStatus: "TOKEN KEDALUWARSA (401)",
            cryptoUnavailableStatus: "CRYPTO API TIDAK TERSEDIA",
            alertNoneTitle: "🚨 Kerentanan Kritis: 'alg: none' Diterima",
            alertNoneBody: "Signature token tidak ada sama sekali. Jika server tidak membatasi whitelist algoritma, penyerang dapat memalsukan payload apapun (misal akses admin) tanpa perlu secret key.",
            alertTamperTitle: "🛡️ Verifikasi Signature Gagal",
            alertTamperBody: "Payload telah dimodifikasi tanpa menghitung ulang signature dengan kunci rahasia yang sah. Verifikasi gagal: `HMAC_SHA256(Data, Secret) != Token_Signature`.",
            alertExpiredTitle: "⏰ Token Kedaluwarsa (Klaim exp terlewati)",
            alertExpiredBody: "Signature token sah secara kriptografi, tetapi stempel waktu klaim 'exp' ({exp}) telah terlewati. Verifier JWT standar akan menolak token ini.",
            alertInsecureTitle: "Konteks Tidak Aman Terdeteksi",
            alertInsecureBody: "Web Crypto API (window.crypto.subtle) tidak tersedia. Silakan akses lewat HTTPS atau localhost.",
            section1Title: "1. First-Principles: Apa itu JWT Sebenarnya?",
            section1P1: "JSON Web Token (JWT) pada dasarnya tidak dienkripsi secara default; token hanya ditandatangani secara kriptografis dan di-encode ke Base64URL. Siapa pun yang memegang token bisa membaca payload-nya. Jaminan keamanan sepenuhnya berasal dari tanda tangan digitalnya (signature).",
            section1P2: "Token kompak standar terdiri dari tiga bagian yang dipisahkan oleh tanda titik (.):",
            partHeaderDesc: "Menentukan algoritma signature & tipe token",
            partPayloadDesc: "Klaim & metadata identitas pengguna (terbuka & terbaca)",
            partSignatureDesc: "Mencegah manipulasi data dengan mengikat header + payload secara matematis",
            section2Title: '2. Cara Kerja Celah "alg": "none"',
            section2P1: 'Berdasarkan spesifikasi awal JWA (RFC 7518), algoritma bernama "none" diizinkan untuk token tanpa proteksi. Jika library backend secara naif mempercayai header alg dari kiriman klien:',
            section2Step1: 'Penyerang memodifikasi payload untuk menaikkan hak aksesnya (misal "role": "admin").',
            section2Step2: 'Penyerang mengubah header menjadi {"alg": "none"} lalu menghapus bagian signature token.',
            section2Step3: "Jika kode verifikasi server mengecek if (header.alg === 'none') return true;, token palsu diterima tanpa butuh kunci rahasia sama sekali!",
            defenseTitle: "🛡️ Cara Mitigasi Standar (RFC 8725 Best Practice):",
            defensePoint1: "Terapkan Whitelist Algoritma: Jangan biarkan header token menentukan algoritma saat verifikasi. Kunci mati algoritma yang diharapkan di sisi server (contoh: wajibkan HS256 atau RS256 secara eksplisit).",
            defensePoint2: "Tolak none Secara Default: Pastikan library JWT Anda menonaktifkan unsecured tokens secara permanen.",
            defensePoint3: "Entropi Kunci Memadai: Untuk HS256, rahasia HMAC minimal memiliki panjang 256-bit (32 byte) acak kriptografis agar tahan terhadap serangan brute-force.",
            section3Title: "3. Kesimpulan Penting dari Lab Ini",
            takeaway1Title: "Encoding ≠ Enkripsi",
            takeaway1Desc: "Base64URL hanyalah mekanisme encoding agar JSON aman ditransmisikan lewat HTTP header. Data sensitif rahasia tidak boleh disimpan di payload JWT tanpa JWE (JSON Web Encryption).",
            takeaway2Title: "Web Crypto di Browser Modern",
            takeaway2Desc: "Browser modern mampu menghitung signature HMAC-SHA256 & RSA secara native via window.crypto.subtle tanpa dependency eksternal dalam waktu <1 milidetik.",
            footerBackBtn: "← Kembali ke Direktori Lab",
            footerNextHint: "Lab Berikutnya: Protobuf vs JSON Wire Inspector (Sprint 2) →",
        },
    },
};

export function getTranslation(lang: Language): TranslationDict {
    return translations[lang] || translations.en;
}
