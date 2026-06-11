// ── COULEURS ───────────────────────────────────────────────────
export const COULEURS = {
  'Noir':           '#111111',
  'Cognac':         '#8B4513',
  'Gris ardoise':   '#5a5a6a',
  'Marron':         '#3b1d0e',
  'Bordeaux':       '#6b1e2a',
  'Camel':          '#c19a6b',
  'Kaki':           '#6b6b3a',
  'Tabac':          '#7a4f2e',
  'Marron tabac':   '#6b3a2a',
  'Bleu marine':    '#1a2f4a',
  'Blanc/bleu':     '#dce8f0',
  'Blanc/gris':     '#e8e8e8',
}

// ── CATALOGUE ──────────────────────────────────────────────────
export const PRODUCTS = [
  {
    id:     1,
    slug:   'rbati',
    cat:    { fr: 'CHELSEA BROGUE', ar: 'تشيلسي بروغ' },
    nom:    { fr: 'Rbati',         ar: 'الرباطي' },
    sub:    { fr: 'Cuir pleine fleur naturel · Semelle Vibram · Fait à Fès',
              ar: 'جلد طبيعي كامل الحبة · نعل فيبرام · صنع في فاس' },
    story:  {
      fr: "Inspiré des loafers des médinas de Rabat. Cousu à la main par nos artisans fassis. Un cuir qui vieillit magnifiquement.",
      ar: "مستوحى من تصميم الكدان التقليدي لمدينة الرباط. مخاط يدوياً من قبل حرفيينا في فاس."
    },
    prix:   890,
    old:    1190,
    imgs: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80',
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=900&q=80',
    ],
    lifestyle: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80',
    ],
    couleurs: ['Noir', 'Cognac', 'Gris ardoise'],
    tailles:  [39,40,41,42,43,44,45],
    featured: true,
    badge:    { fr: '4 restantes EU 42', ar: '4 أزواج فقط EU 42' }
  },
  {
    id:     2,
    slug:   'fassi',
    cat:    { fr: 'LACETS', ar: 'حذاء بأربطة' },
    nom:    { fr: 'Fassi', ar: 'الفاسي' },
    sub:    { fr: 'Cuir de veau tanné végétal', ar: 'جلد عجل مدبوغ نباتياً' },
    story:  {
      fr: "La chaussure à lacets par excellence. Fabriquée selon la tradition de Fès.",
      ar: "الحذاء بالأربطة بامتياز. مصنوع وفق تقاليد فاس العريقة."
    },
    prix:   1050,
    old:    null,
    imgs: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&q=80'],
    lifestyle: [],
    couleurs: ['Noir', 'Marron tabac', 'Bordeaux'],
    tailles:  [39,40,41,42,43,44],
    featured: true
  },
  {
    id:     3,
    slug:   'chaouen',
    cat:    { fr: 'SNEAKERS', ar: 'سنيكرز' },
    nom:    { fr: 'Chaouen', ar: 'شاوين' },
    sub:    { fr: 'Nubuck et cuir velours', ar: 'نوباك وجلد مخملي' },
    story:  {
      fr: "Inspirée des ruelles bleues de Chefchaouen. Légère, élégante, taillée pour la ville.",
      ar: "مستوحاة من أزقة شفشاون الزرقاء. خفيفة وأنيقة."
    },
    prix:   790,
    old:    990,
    imgs: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80'],
    lifestyle: [],
    couleurs: ['Blanc/bleu', 'Blanc/gris', 'Noir'],
    tailles:  [40,41,42,43,44,45],
    featured: true
  },
  {
    id:     4,
    slug:   'marrakchi',
    cat:    { fr: 'CHELSEA', ar: 'تشيلسي' },
    nom:    { fr: 'Marrakchi', ar: 'المراكشي' },
    sub:    { fr: 'Cuir grainé premium', ar: 'جلد حبيبي فاخر' },
    story:  {
      fr: "Le chelsea boot revisité avec l'élégance de Marrakech. Semelle Vibram.",
      ar: "حذاء تشيلسي بلمسة مراكشية راقية. نعل فيبرام."
    },
    prix:   1190,
    old:    null,
    imgs: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=80'],
    lifestyle: [],
    couleurs: ['Cognac', 'Noir', 'Kaki'],
    tailles:  [39,40,41,42,43,44],
    featured: false
  },
  {
    id:     5,
    slug:   'tanger',
    cat:    { fr: 'MOCASSINS', ar: 'موكاسين' },
    nom:    { fr: 'Tanger', ar: 'الطنجاوي' },
    sub:    { fr: 'Cuir velours souple', ar: 'جلد مخملي ناعم' },
    story:  {
      fr: "Douceur du velours, légèreté absolue. Le mocassin casual.",
      ar: "نعومة المخمل وخفة مطلقة. موكاسين كلاسيكي."
    },
    prix:   820,
    old:    1050,
    imgs: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900&q=80'],
    lifestyle: [],
    couleurs: ['Tabac', 'Camel', 'Bleu marine'],
    tailles:  [40,41,42,43,44,45],
    featured: false
  },
  {
    id:     6,
    slug:   'atlas',
    cat:    { fr: 'CEINTURE', ar: 'حزام' },
    nom:    { fr: 'Atlas', ar: 'الأطلس' },
    sub:    { fr: 'Cuir tressé naturel', ar: 'جلد مضفور طبيعي' },
    story:  {
      fr: "Tressée à la main par nos artisans. Cuir de première qualité.",
      ar: "مضفورة يدوياً من قبل حرفيينا. جلد من الدرجة الأولى."
    },
    prix:   390,
    old:    520,
    imgs: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80'],
    lifestyle: [],
    couleurs: ['Cognac', 'Marron', 'Noir'],
    tailles:  [],
    featured: false
  }
]

export const getProduct = (slug) => PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0]
