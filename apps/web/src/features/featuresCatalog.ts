export type FeatureDemo = {
  templateId: string;
  variables: Record<string, unknown>;
};

export type FeatureGuide = {
  intro: string;
  whatYouGet: string[];
  howDemoWorks: string[];
  promptTips: string[];
  assembleSteps: string[];
  troubleshooting: string[];
};

export type FeatureItem = {
  slug: string;
  title: string;
  description: string;
  icon: "scan-face" | "shirt" | "briefcase" | "users" | "video" | "shopping-bag";
  demo: FeatureDemo;
  guide: FeatureGuide;
};

export const featuresCatalog: FeatureItem[] = [
  {
    slug: "ai-personal-analysis",
    title: "AI Personal Analysis",
    description:
      "Deep breakdowns of your face, skin, style, and grooming to establish a confident baseline.",
    icon: "scan-face",
    guide: {
      intro:
        "Demo ini mensimulasikan “baseline scan → insight → roadmap” yang biasanya terjadi setelah user upload selfie. Outputnya berupa beberapa clip pendek supaya kamu bisa dapet pacing 30 detik yang rapih.",
      whatYouGet: [
        "Hook yang langsung menjelaskan value (scan + insight).",
        "Scene insight overlay (skin concern + struktur wajah).",
        "Roadmap reveal yang terasa premium untuk marketing.",
      ],
      howDemoWorks: [
        "1 job = beberapa clip (1 clip per scene).",
        "Durasi clip bisa dipilih 5–10 detik per scene.",
        "Setelah selesai, tiap clip punya URL video dan poster (PixVerse-hosted).",
      ],
      promptTips: [
        "Gunakan 5 scene × 6 detik untuk target ~30 detik.",
        "Sebutkan lighting dan framing yang konsisten (close-up, UI overlay rapi).",
        "Gunakan wording yang sama untuk “persona/face” agar tidak ganti karakter antar scene.",
      ],
      assembleSteps: [
        "Download/ambil semua URL clip dari hasil job.",
        "Susun clip urut 01→05, potong dead-air, dan sync ke beat ringan.",
        "Tambahkan subtitle singkat per scene (max 1 baris).",
      ],
      troubleshooting: [
        "Jika job gagal: cek PixVerse login/credits di mesin worker.",
        "Jika hasil berubah-ubah: pendekkan scene, dan ulangi dengan prompt yang lebih spesifik.",
        "Jika timeout: naikkan `PIXVERSE_WORKER_TIMEOUT_SEC`.",
      ],
    },
    demo: {
      templateId: "douyin-makeup-editorial-v1",
      variables: {
        lookName: "Professional glow-up baseline",
        skinFinish: "Natural",
        platform: "Douyin",
        tone: "Educational",
        sceneDurationSec: "6",
        steps: [
          "Hook: selfie upload → scan overlay",
          "Insight: skin concern + face structure callouts",
          "Routine: 3-step plan highlight",
          "Roadmap: timeline + habit tracker reveal",
          "CTA: save + follow",
        ],
      },
    },
  },
  {
    slug: "outfit-beauty-intelligence",
    title: "Outfit & Beauty Intelligence",
    description:
      "Smart wardrobe planners, outfit generators, and custom routines tailored to your life and budget.",
    icon: "shirt",
    guide: {
      intro:
        "Halaman ini fokus ke demo “outfit storytelling” yang enak untuk Douyin: 1 scene = 1 swap atau 1 detail fit. Format multi-clip bikin hasilnya mudah dirapihin jadi video 30 detik.",
      whatYouGet: [
        "Storyboard outfit yang terasa editorial (fit, tekstur, silhouette).",
        "Cut yang cocok untuk UGC + product highlight.",
        "Script visual yang repeatable (bisa dipakai untuk banyak occasion).",
      ],
      howDemoWorks: [
        "Isi `pieces` sebagai daftar scene (1 item per scene).",
        "Pilih `sceneDurationSec` 5–10 detik.",
        "Worker akan generate clip per item dan mengembalikan URL.",
      ],
      promptTips: [
        "Tulis item `pieces` dalam bentuk aksi (mis. “swap sneakers → loafers”).",
        "Pastikan palette/lighting konsisten agar continuity bagus.",
        "Untuk 30 detik, target 5 scene × 6 detik atau 6 scene × 5 detik.",
      ],
      assembleSteps: [
        "Gabungkan clip dan tambahkan overlay text: item utama + alasan singkat.",
        "Pakai 1 beat musik yang sama agar transisi terasa mulus.",
        "Tambahkan CTA di clip terakhir (save + follow).",
      ],
      troubleshooting: [
        "Jika scene terlihat random: sempitkan styleDirection dan mood.",
        "Jika outfit berubah terlalu ekstrem: tambahkan batasan warna/fit di stylingNotes.",
        "Jika blur/kurang detail: naikkan quality (1080p) bila credits cukup.",
      ],
    },
    demo: {
      templateId: "outfit-styling-editorial-v1",
      variables: {
        occasion: "Office days + client meetings",
        styleDirection: "Modern Tailored",
        platform: "Douyin",
        mood: "Confident",
        sceneDurationSec: "6",
        pieces: [
          "Neutral blazer + tank top",
          "Straight-leg trousers",
          "Minimal sneakers → switch to loafers",
          "Structured tote + subtle jewelry",
          "Before/after silhouette reveal",
        ],
        stylingNotes: "Keep palette monochrome, focus on fit, show 1 quick accessory swap.",
      },
    },
  },
  {
    slug: "personal-branding-os",
    title: "Personal Branding OS",
    description:
      "LinkedIn optimization, social audits, and professional persona development with measurable checkpoints.",
    icon: "briefcase",
    guide: {
      intro:
        "Branding demo ini menekankan “camera-ready presence”: tampilan yang clean, percaya diri, dan siap ketemu klien / tampil di kamera. Cocok untuk short-form marketing video.",
      whatYouGet: [
        "Hook yang jelas (professional look in 30s).",
        "Routine singkat yang mengarah ke confidence on-camera.",
        "CTA yang bisa dipakai untuk lead capture (comment / save).",
      ],
      howDemoWorks: [
        "Masukkan concern + skin type untuk narasi yang terasa personal.",
        "Step list akan jadi scene list, 1 item = 1 clip.",
        "Output berisi URL per clip, siap disusun jadi 30 detik.",
      ],
      promptTips: [
        "Gunakan tone “Editorial” untuk look premium, atau “Friendly” untuk UGC feel.",
        "Jaga scene tetap simple: 4–6 scene cukup.",
        "Pastikan CTA 1 scene terakhir, jangan di tengah.",
      ],
      assembleSteps: [
        "Susun clip dari hook → prep → base → finish → CTA.",
        "Tambahkan subtitle minimalis dan 1 highlight benefit (mis. “no greasy”).",
        "Tambahkan end card 1 detik (logo + CTA).",
      ],
      troubleshooting: [
        "Jika hasil terlalu glam: set skin finish Natural/Soft Matte dan perketat prompt.",
        "Jika terlalu flat: tambahkan “soft highlights, glassy UI overlay” di prompt.",
        "Jika beda karakter: tambahkan deskripsi persona yang sama di semua scene.",
      ],
    },
    demo: {
      templateId: "skincare-routine-editorial-v1",
      variables: {
        concern: "On-camera confidence (bright, fresh, non-greasy)",
        skinType: "Combination",
        platform: "Douyin",
        tone: "Editorial",
        heroProduct: "SPF + blur primer",
        sceneDurationSec: "6",
        steps: [
          "Hook: pro look in 30s",
          "Prep: hydration + SPF",
          "Base: blur + spot concealer",
          "Finish: setting + lip tint",
          "CTA: save + comment your skin type",
        ],
      },
    },
  },
  {
    slug: "creator-community",
    title: "Creator Community",
    description:
      "Follow and adopt real routines from top influencers and beauty experts—then remix for your own journey.",
    icon: "users",
    guide: {
      intro:
        "Creator demo meniru format Douyin yang cepat: ambil ‘routine snapshot’ dari creator, lalu remix jadi versi yang mudah diikuti. Fokusnya adalah retention (mudah di-save).",
      whatYouGet: [
        "Hook yang langsung terasa social-proof.",
        "Format step-by-step yang gampang diulang.",
        "CTA yang natural untuk follow + save.",
      ],
      howDemoWorks: [
        "Isi steps sebagai urutan rutinitas creator (ringkas).",
        "Worker akan generate clip per step dan mengembalikan URL per clip.",
        "Kamu bisa regenerate dengan sceneDurationSec berbeda untuk pacing.",
      ],
      promptTips: [
        "Tulis step dengan kata kerja (prep, base, eyes, lip).",
        "Jaga jumlah scene 5–6 untuk 30 detik.",
        "Tambahkan “minimal on-screen text” supaya terlihat premium.",
      ],
      assembleSteps: [
        "Gabungkan clip, tambahkan label step (Step 1/2/3) sebagai subtitle.",
        "Tambahkan 1 scene ‘result reveal’ kalau butuh lebih engaging.",
        "Tutup dengan CTA yang spesifik (mis. ‘save untuk besok pagi’).",
      ],
      troubleshooting: [
        "Jika hasil tidak konsisten: tetap gunakan lookName dan skinFinish yang sama.",
        "Jika scene terlalu panjang: turunkan ke 5 detik per scene.",
        "Jika output terlalu ramai: kurangi jumlah step dan fokus ke 3 inti + reveal.",
      ],
    },
    demo: {
      templateId: "douyin-makeup-editorial-v1",
      variables: {
        lookName: "Creator routine remix",
        skinFinish: "Glowy",
        platform: "Douyin",
        tone: "Friendly",
        sceneDurationSec: "6",
        steps: [
          "Hook: creator routine snapshot",
          "Step 1: prep",
          "Step 2: base + blush",
          "Step 3: eyes + lip",
          "CTA: follow + save",
        ],
      },
    },
  },
  {
    slug: "ai-video-studio",
    title: "AI Video Studio",
    description:
      "Auto-generated tutorials and UGC creation tools to help you build your audience and test hooks fast.",
    icon: "video",
    guide: {
      intro:
        "Ini adalah demo utama untuk produksi video: multi-scene clips yang bisa kamu stitch jadi 30 detik. Paling cocok untuk testing hook (scene 1) dan CTA (scene terakhir).",
      whatYouGet: [
        "Struktur video yang repeatable (hook → steps → finish → CTA).",
        "Clip per scene (lebih mudah edit & AB test).",
        "Output URL PixVerse-hosted untuk cepat share ke tim.",
      ],
      howDemoWorks: [
        "Isi steps (1 baris = 1 scene).",
        "Set `sceneDurationSec` 5–10 detik sesuai target total durasi.",
        "Generate, lalu ambil URL setiap clip untuk disusun di editor.",
      ],
      promptTips: [
        "Target 5 scene × 6 detik untuk 30 detik yang stabil.",
        "Buat hook super jelas (before/after / claim) untuk Douyin.",
        "Jaga continuity: lighting, camera distance, dan persona sama di semua scene.",
      ],
      assembleSteps: [
        "Susun clip berurutan, potong 0.2–0.4 detik di awal/akhir tiap clip bila perlu.",
        "Tambahkan subtitle + SFX ringan (tap, swoosh) untuk Douyin feel.",
        "Ekspor 9:16, pastikan safe area untuk teks.",
      ],
      troubleshooting: [
        "Jika job sering fail: cek credits dan coba kurangi duration per scene.",
        "Jika hasil ‘ganti wajah’: perketat deskripsi persona dan wardrobe.",
        "Jika pacing lambat: turunkan ke 5 detik per scene dan kurangi step.",
      ],
    },
    demo: {
      templateId: "douyin-makeup-editorial-v1",
      variables: {
        lookName: "Douyin commuting no-makeup look",
        skinFinish: "Soft Matte",
        platform: "Douyin",
        tone: "Educational",
        sceneDurationSec: "6",
        steps: [
          "Hook: before/after cepat",
          "Prep: skincare + sunscreen",
          "Base: concealer lokal + base tipis",
          "Eyes+Brow: natural lift",
          "Finish: blush + lip + CTA",
        ],
      },
    },
  },
  {
    slug: "affiliate-commerce",
    title: "Affiliate Commerce",
    description:
      "Shop directly via marketplaces and track conversion—tight loop from content → product → revenue.",
    icon: "shopping-bag",
    guide: {
      intro:
        "Demo commerce menggabungkan format try-on + product highlight. Tujuannya bikin video yang terasa natural tapi tetap konversi: tunjukin benefit, detail, lalu CTA checkout.",
      whatYouGet: [
        "Clip highlight per poin fit/benefit (mudah dipakai untuk iklan).",
        "Format yang cocok untuk katalog + landing page embed.",
        "CTA overlay yang bisa langsung diarahkan ke marketplace.",
      ],
      howDemoWorks: [
        "Isi `fitHighlights` sebagai scene list (1 item per scene).",
        "Pilih movement agar flow konsisten.",
        "Output `clips[]` berisi URL video/poster per highlight.",
      ],
      promptTips: [
        "Gunakan 4–6 highlights untuk target 24–36 detik.",
        "Tulis highlight yang spesifik (fit + alasan) bukan hanya nama item.",
        "Tambahkan ‘price tag overlay’ atau ‘promo’ di stylingNotes bila perlu.",
      ],
      assembleSteps: [
        "Susun highlight dari paling menarik (scene 1) → detail → CTA.",
        "Tambahkan overlay: price, marketplace logo, dan 1 benefit per scene.",
        "Pastikan CTA jelas di scene terakhir (scan/checkout).",
      ],
      troubleshooting: [
        "Jika motion tidak natural: ganti movement ke Walk-in reveal atau Mirror check.",
        "Jika kain terlihat ‘AI’: kurangi kompleksitas garment dan perjelas fabric.",
        "Jika terasa terlalu iklan: ubah tone jadi Friendly + lebih banyak POV shots.",
      ],
    },
    demo: {
      templateId: "virtual-try-on-motion-v1",
      variables: {
        garmentFocus: "Blazer fit + trousers drape",
        persona: "Young professional (Jakarta)",
        platform: "Douyin",
        movement: "Turnaround",
        sceneDurationSec: "6",
        fitHighlights: [
          "Shoulder structure",
          "Waist shaping",
          "Pant hem length",
          "Bag + shoes swap",
          "Checkout CTA overlay",
        ],
        stylingNotes: "Include subtle price tag overlay and quick product highlight cuts.",
      },
    },
  },
];
