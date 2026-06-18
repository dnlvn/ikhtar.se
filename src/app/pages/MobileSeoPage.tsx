import { SeoLandingPageTemplate } from "@/app/components/SeoLandingPageTemplate";
import { MobilePlansTeaserWidget } from "@/app/components/MobilePlansTeaserWidget";

type SeoPageConfig = {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  h1: string;
  intro: string;
  ctaText: string;
  ctaHref: string;
  disclosure: string;
  bodyIntro: string[];
  sections: Array<{ title: string; paragraphs: string[] }>;
  sectionsAfterOperators?: Array<{ title: string; paragraphs: string[] }>;
  operatorLinks?: Array<{ label: string; href: string }>;
  faq: Array<{ question: string; answer: string }>;
  internalLinks: Array<{ label: string; href: string }>;
  teaserIntent?: "cheapest" | "operator" | "no-binding" | "data-guide";
  operatorSlug?: string;
  teaserTitle?: string;
  teaserSubtitle?: string;
  showAllOperatorPlans?: boolean;
  showDetailedPricing?: boolean;
  teaserFallbackMessage?: string;
};

type OperatorPageInput = {
  slug: string;
  latin: string;
  arabic: string;
  titleArabic: string;
  network?: string;
  intro: string;
  whatIs: string;
  fit: string;
  compare: string;
  keywordVariants: string[];
};

const disclosure =
  "تحتوي هذه الصفحة على روابط إعلانية. قد نحصل على عمولة إذا اخترت الاشتراك عبر روابطنا، دون أي تكلفة إضافية عليك.";

const operatorLinks = [
  { label: "Vimla / فيملا", href: "/mobilabonnemang/vimla", slug: "vimla" },
  { label: "Fello / فيلّو", href: "/mobilabonnemang/fello", slug: "fello" },
  { label: "Comviq / كومفيك", href: "/mobilabonnemang/comviq", slug: "comviq" },
  { label: "Tre / تري", href: "/mobilabonnemang/tre", slug: "tre" },
  { label: "Tele2 / تيلي 2", href: "/mobilabonnemang/tele2", slug: "tele2" },
  { label: "Telenor / تيلينور", href: "/mobilabonnemang/telenor", slug: "telenor" },
  { label: "Telia / تيليا", href: "/mobilabonnemang/telia", slug: "telia" },
];

const commonInternalLinks = [
  { label: "قارن جميع باقات الجوال", href: "/mobilabonnemang" },
  { label: "أرخص اشتراك جوال", href: "/mobilabonnemang/billigaste" },
  { label: "باقات بدون التزام", href: "/mobilabonnemang/utan-bindningstid" },
  { label: "كم إنترنت أحتاج؟", href: "/mobilabonnemang/hur-mycket-surf" },
];

function operatorLinksExcept(slug: string) {
  return operatorLinks.filter((operator) => operator.slug !== slug);
}

function createOperatorPage(input: OperatorPageInput): SeoPageConfig {
  const brand = `${input.latin} / ${input.arabic}`;
  const variants = input.keywordVariants.join("، ");

  return {
    metaTitle: `عروض ${input.titleArabic} في السويد | قارن أفضل باقات ${input.latin}`,
    metaDescription: `قارن أحدث عروض ${brand} في السويد. شاهد الأسعار، كمية الإنترنت، مدة الالتزام والسعر بعد انتهاء العرض قبل اختيار اشتراك الجوال.`,
    canonicalUrl: `https://ikhtar.se/mobilabonnemang/${input.slug}`,
    h1: `عروض ${input.latin} في السويد`,
    intro: input.intro,
    ctaText: `شاهد عروض ${input.latin}`,
    ctaHref: "/mobilabonnemang",
    disclosure,
    bodyIntro: [
      `إذا كنت تبحث عن عروض ${input.latin} في السويد، يمكنك هنا مقارنة باقات ${input.latin} الحالية ومعرفة السعر، كمية الإنترنت ومدة الالتزام قبل اختيار اشتراكك. تساعدك المقارنة على العثور على أرخص اشتراك ${input.latin} أو الباقة التي تمنحك أفضل قيمة مقابل السعر.`,
      `نستخدم أيضاً صيغ البحث العربية الشائعة مثل ${variants} بطريقة طبيعية حتى تجد الصفحة بسهولة عند البحث عن عروض الجوال المناسبة لك في السويد.`,
    ],
    sections: [
      {
        title: `أفضل عروض ${input.titleArabic} في السويد`,
        paragraphs: [
          `تتغير عروض ${input.titleArabic} حسب الحملات والأسعار الحالية. لذلك من الأفضل مقارنة السعر الحالي، كمية الإنترنت، مدة الالتزام والسعر بعد انتهاء العرض قبل اختيار اشتراك ${input.titleArabic}.`,
        ],
      },
      {
        title: `باقات ${input.titleArabic} الحالية`,
        paragraphs: [
          `تعرض هذه الصفحة باقات ${input.titleArabic} المتاحة في قاعدة بياناتنا حالياً. بطاقات العروض أعلاه تستخدم البيانات الموجودة في المقارنة، وتعرض السعر، الإنترنت ومدة الالتزام عندما تكون متاحة.`,
        ],
      },
      {
        title: `ما هي ${brand}؟`,
        paragraphs: [input.whatIs],
      },
      {
        title: `هل ${input.latin} مناسبة لك؟`,
        paragraphs: [
          input.fit,
          "من المهم دائماً مقارنة السعر، حجم الإنترنت، مدة الالتزام والشبكة مع مشغلين آخرين قبل اختيار اشتراك جوال جديد.",
        ],
      },
    ],
    sectionsAfterOperators: [
      {
        title: `قارن عروض ${input.latin} مع باقات أخرى`,
        paragraphs: [input.compare],
      },
    ],
    operatorLinks: operatorLinksExcept(input.slug),
    faq: [
      {
        question: `هل ${input.latin} تقدم باقات جوال في السويد؟`,
        answer: `نعم، ${brand} تقدم باقات جوال وخيارات مختلفة للمستخدمين في السويد. يمكنك مقارنة عروض ${input.titleArabic} الحالية قبل اختيار الاشتراك.`,
      },
      {
        question: `ما الشبكة التي تستخدمها ${input.latin}؟`,
        answer: input.network
          ? `${brand} تستخدم شبكة ${input.network} في السويد.`
          : `تختلف تفاصيل الشبكة حسب العرض. قارن الشروط الحالية قبل اختيار الباقة.`,
      },
      {
        question: `هل يجب مقارنة ${input.latin} مع مشغلين آخرين؟`,
        answer: "نعم، المقارنة تساعدك على معرفة ما إذا كان العرض مناسباً فعلاً من حيث السعر، كمية الإنترنت، مدة الالتزام والسعر بعد انتهاء الحملة.",
      },
      {
        question: `ما أفضل عروض ${input.latin} حالياً؟`,
        answer: `أفضل عروض ${input.titleArabic} حالياً تعتمد على احتياجك من الإنترنت والسعر بعد انتهاء العرض. لذلك من الأفضل مراجعة الباقات المعروضة في أعلى الصفحة ومقارنتها مع خيارات أخرى.`,
      },
      {
        question: `هل توجد باقات ${input.latin} بدون التزام؟`,
        answer: "قد تختلف مدة الالتزام حسب العرض الحالي. تحقق دائماً من مدة الالتزام في بطاقة الباقة قبل الانتقال إلى موقع المشغل.",
      },
    ],
    internalLinks: commonInternalLinks,
    teaserIntent: "operator",
    operatorSlug: input.slug,
    teaserTitle: `باقات ${input.latin} المتاحة حالياً`,
    teaserSubtitle: "عروض محدّثة من موقع المشغّل",
    showAllOperatorPlans: true,
    showDetailedPricing: true,
    teaserFallbackMessage: "لا توجد حالياً باقات إضافية متاحة لهذا المشغّل في قاعدة البيانات.",
  };
}

const pages = {
  cheapest: {
    metaTitle: "أرخص اشتراك جوال في السويد | قارن أسعار الباقات",
    metaDescription:
      "قارن أرخص اشتراكات الجوال في السويد. شاهد السعر، كمية الإنترنت، مدة الالتزام والسعر بعد انتهاء العرض قبل اختيار الباقة المناسبة.",
    canonicalUrl: "https://ikhtar.se/mobilabonnemang/billigaste",
    h1: "أرخص اشتراك جوال في السويد",
    intro:
      "تبحث عن أرخص اشتراك جوال في السويد؟ على Ikhtar.se يمكنك مقارنة باقات الجوال من عدة مشغلين واختيار الاشتراك الذي يناسب ميزانيتك واحتياجك من الإنترنت.",
    ctaText: "قارن أرخص الباقات الآن",
    ctaHref: "/mobilabonnemang",
    disclosure,
    bodyIntro: [
      "إذا كنت تبحث عن أرخص اشتراك جوال أو أرخص باقة جوال في السويد، فمن المهم ألا تنظر فقط إلى السعر الأولي. يجب أيضاً مقارنة حجم الإنترنت، مدة الالتزام، السعر بعد انتهاء العرض ومتوسط التكلفة خلال أول 12 شهراً عندما تكون البيانات متاحة.",
      "على Ikhtar.se نقارن عروض جوال رخيصة من عدة مشغلين حتى تتمكن من العثور على اشتراك جوال رخيص يناسب استخدامك، سواء كنت تريد باقة صغيرة أو أرخص باقات الجوال في السويد مع إنترنت أكثر.",
    ],
    sections: [
      {
        title: "كيف تجد أرخص اشتراك جوال؟",
        paragraphs: [
          "للعثور على أرخص اشتراك جوال، قارن السعر الحالي مع السعر بعد انتهاء العرض. بعض الباقات تبدأ بسعر منخفض خلال الأشهر الأولى، ثم تصبح أغلى لاحقاً.",
          "انتبه أيضاً إلى كمية الإنترنت. أرخص باقة جوال ليست دائماً الأفضل إذا كانت كمية الإنترنت قليلة جداً وتحتاج إلى شراء بيانات إضافية.",
        ],
      },
      {
        title: "أرخص باقات الجوال في السويد",
        paragraphs: [
          "القائمة أعلاه تعرض عروضاً رخيصة من قاعدة بياناتنا الحالية. استخدمها كنقطة بداية، ثم قارن التفاصيل قبل الانتقال إلى موقع المشغل.",
        ],
      },
    ],
    sectionsAfterOperators: [
      {
        title: "ما الذي يجعل الاشتراك رخيصاً فعلاً؟",
        paragraphs: [
          "الاشتراك الرخيص هو الاشتراك الذي يعطيك ما تحتاجه بسعر مناسب. إذا دفعت مقابل إنترنت أكثر مما تستخدم، فقد لا يكون الاشتراك اقتصادياً بالنسبة لك.",
          "لذلك من الأفضل اختيار باقة تناسب استخدامك الحقيقي، وليس فقط أقل سعر ظاهر في القائمة.",
        ],
      },
    ],
    operatorLinks,
    faq: [
      {
        question: "ما أرخص اشتراك جوال حالياً؟",
        answer: "يتغير أرخص اشتراك جوال حسب العروض الحالية، لذلك من الأفضل مقارنة الأسعار بانتظام قبل اختيار الباقة.",
      },
      {
        question: "هل الأرخص دائماً هو الأفضل؟",
        answer: "ليس دائماً. يجب مقارنة حجم الإنترنت، مدة الالتزام، الشبكة والسعر بعد انتهاء العرض.",
      },
      {
        question: "كيف أقارن بين السعر وكمية الإنترنت؟",
        answer: "ابدأ بالسعر الشهري، ثم تحقق من كمية الإنترنت وهل تكفي استخدامك اليومي. الباقة الأرخص قد تصبح أغلى إذا احتجت إلى بيانات إضافية.",
      },
      {
        question: "هل توجد باقات رخيصة بدون التزام؟",
        answer: "نعم، توجد باقات رخيصة بدون التزام لدى بعض المشغلين، لكن العروض تتغير باستمرار.",
      },
      {
        question: "ما الفرق بين السعر الحالي ومتوسط 12 شهراً؟",
        answer: "السعر الحالي يوضح ما تدفعه الآن. متوسط 12 شهراً يساعدك على فهم التكلفة التقريبية خلال السنة الأولى عندما تكون مدة الحملة معروفة.",
      },
    ],
    internalLinks: commonInternalLinks,
    teaserIntent: "cheapest",
    teaserTitle: "أرخص الباقات حالياً",
    teaserSubtitle: "مرتّبة حسب أقل سعر شهري متاح",
    showDetailedPricing: true,
  },
  vimla: createOperatorPage({
    slug: "vimla",
    latin: "Vimla",
    arabic: "فيملا",
    titleArabic: "فيملا",
    network: "Telenor / تيلينور",
    intro:
      "Vimla / فيملا من مشغلي الجوال المعروفين في السويد، وتستهدف المستخدمين الذين يريدون باقات بسيطة ومرنة.",
    whatIs:
      "Vimla / فيملا هي مشغل جوال في السويد وتستخدم شبكة Telenor / تيلينور. تشتهر بعروضها الرقمية وباقات الجوال التي يمكن إدارتها بسهولة عبر الإنترنت.",
    fit:
      "قد تكون Vimla مناسبة لمن يريد اشتراكاً بسيطاً بسعر جيد، لكن أفضل باقة تعتمد على احتياجك من الإنترنت وسعر الباقة بعد انتهاء العرض.",
    compare:
      "قارن Vimla مع Fello / فيلّو، Comviq / كومفيك، Tre / تري وTelenor / تيلينور حتى ترى الفرق في السعر والإنترنت والشروط.",
    keywordVariants: ["عروض Vimla", "عروض فيملا", "باقات فيملا", "اشتراك فيملا"],
  }),
  fello: createOperatorPage({
    slug: "fello",
    latin: "Fello",
    arabic: "فيلّو",
    titleArabic: "فيلّو",
    network: "Telia / تيليا",
    intro:
      "Fello / فيلّو هو مشغل جوال في السويد يركز على الباقات البسيطة والأسعار الواضحة.",
    whatIs:
      "Fello / فيلّو هو مشغل جوال يستخدم شبكة Telia / تيليا في السويد. لذلك يمكن أن يكون خياراً مناسباً لمن يريد باقة منخفضة السعر مع شبكة واسعة الانتشار.",
    fit:
      "قد تكون Fello مناسبة إذا كنت تبحث عن اشتراك بسيط بدون تعقيد وتريد شبكة واسعة الانتشار.",
    compare:
      "قبل اختيار Fello، قارن الباقات حسب السعر، الإنترنت، مدة الالتزام والشبكة. قد تجد أن باقة أخرى تناسب استخدامك بشكل أفضل.",
    keywordVariants: ["عروض Fello", "عروض فيلّو", "باقات فيلّو", "اشتراك فيلّو"],
  }),
  tre: createOperatorPage({
    slug: "tre",
    latin: "Tre",
    arabic: "تري",
    titleArabic: "تري",
    intro:
      "Tre / تري من مشغلي الجوال المعروفين في السويد، وغالباً ما يكون خياراً مهماً لمن يبحث عن باقات مع كمية إنترنت كبيرة أو عروض حديثة.",
    whatIs:
      "Tre / تري يملك شبكة جوال خاصة به في السويد ويقدم باقات مختلفة للأفراد. قد تكون عروض Tre مناسبة لمن يستخدم الإنترنت كثيراً أو يريد مقارنة باقات أكبر.",
    fit:
      "قد تكون Tre مناسبة إذا كنت تريد باقة واضحة أو كمية إنترنت أكبر، لكن الخيار الأفضل يعتمد على تغطية الشبكة في منطقتك وميزانيتك الشهرية.",
    compare:
      "حتى إذا بدا عرض Tre جذاباً، من الأفضل مقارنة السعر الشهري، حجم الإنترنت، مدة الالتزام والسعر بعد الحملة مع مشغلين آخرين.",
    keywordVariants: ["عروض Tre", "عروض تري", "باقات تري", "اشتراك تري"],
  }),
  tele2: createOperatorPage({
    slug: "tele2",
    latin: "Tele2",
    arabic: "تيلي 2",
    titleArabic: "تيلي 2",
    intro:
      "Tele2 / تيلي 2 من أكبر مشغلي الشبكات في السويد ويقدم باقات جوال مختلفة للمستخدمين الذين يريدون شبكة معروفة وخيارات متعددة.",
    whatIs:
      "Tele2 / تيلي 2 هي شركة اتصالات سويدية كبيرة وتملك شبكة مستخدمة أيضاً من بعض العلامات الأخرى. لذلك تظهر Tele2 كثيراً عند مقارنة باقات الجوال في السويد.",
    fit:
      "قد تكون Tele2 مناسبة إذا كنت تريد مشغلاً كبيراً وشبكة معروفة، لكن من المهم مقارنة السعر مع بدائل أخرى.",
    compare:
      "قبل اختيار Tele2، قارن الباقات حسب السعر الشهري، كمية الإنترنت والسعر بعد انتهاء العرض. أحياناً قد تجد عرضاً أرخص لدى علامة أخرى مع شروط مناسبة لاستخدامك.",
    keywordVariants: ["عروض Tele2", "عروض تيلي 2", "باقات تيلي 2", "اشتراك تيلي 2"],
  }),
  telenor: createOperatorPage({
    slug: "telenor",
    latin: "Telenor",
    arabic: "تيلينور",
    titleArabic: "تيلينور",
    intro:
      "Telenor / تيلينور من مشغلي الشبكات المعروفين في السويد، وتقدم باقات جوال مختلفة للمستخدمين الذين يريدون شبكة واسعة وخيارات متعددة.",
    whatIs:
      "Telenor / تيلينور هي شركة اتصالات كبيرة في السويد وتملك شبكة يستخدمها أيضاً بعض المشغلين الرقميين مثل Vimla / فيملا.",
    fit:
      "قد تكون Telenor مناسبة إذا كنت تريد مشغلاً كبيراً وشبكة معروفة، لكن المقارنة تساعدك على فهم السعر والشروط بشكل أفضل.",
    compare:
      "قارن السعر الشهري، حجم الإنترنت، مدة الالتزام والسعر بعد انتهاء الحملة. إذا كنت تستخدم الكثير من الإنترنت فقد تكون الباقة الأكبر أفضل، أما الاستخدام الخفيف فقد يناسبه اشتراك أرخص.",
    keywordVariants: ["عروض Telenor", "عروض تيلينور", "باقات تيلينور", "اشتراك تيلينور"],
  }),
  telia: createOperatorPage({
    slug: "telia",
    latin: "Telia",
    arabic: "تيليا",
    titleArabic: "تيليا",
    intro:
      "Telia / تيليا من أكبر مشغلي الاتصالات في السويد، وتعد خياراً معروفاً لمن يريد شبكة واسعة وباقات جوال مختلفة.",
    whatIs:
      "Telia / تيليا هي شركة اتصالات كبيرة في السويد وتملك شبكة جوال واسعة. بعض المشغلين الآخرين يستخدمون شبكة Telia أيضاً، مثل Fello / فيلّو.",
    fit:
      "قد تكون Telia مناسبة إذا كنت تفضل مشغلاً كبيراً وشبكة معروفة، لكن من الذكاء مقارنة السعر مع مشغلين آخرين.",
    compare:
      "لا تنظر فقط إلى اسم المشغل. قارن السعر الشهري، حجم الإنترنت، مدة الالتزام والسعر بعد انتهاء العرض حتى تجد باقة تناسبك فعلاً.",
    keywordVariants: ["عروض Telia", "عروض تيليا", "باقات تيليا", "اشتراك تيليا"],
  }),
  noBinding: {
    metaTitle: "باقات جوال بدون التزام في السويد | قارن العروض",
    metaDescription:
      "قارن باقات الجوال بدون التزام في السويد. شاهد السعر، كمية الإنترنت والمشغل قبل اختيار اشتراك مرن يناسب احتياجك.",
    canonicalUrl: "https://ikhtar.se/mobilabonnemang/utan-bindningstid",
    h1: "باقات جوال بدون التزام في السويد",
    intro:
      "إذا كنت تريد حرية تغيير اشتراك الجوال عندما تجد عرضاً أفضل، فقد تكون باقات الجوال بدون التزام خياراً مناسباً.",
    ctaText: "قارن الباقات بدون التزام",
    ctaHref: "/mobilabonnemang",
    disclosure,
    bodyIntro: [
      "باقات بدون التزام تعطيك مرونة أكبر من الاشتراك الطويل. إذا كنت تبحث عن اشتراك جوال بدون التزام أو اشتراك بدون عقد، يمكنك هنا مقارنة باقات جوال مرنة ومعرفة السعر وكمية الإنترنت قبل الاختيار.",
      "مصطلحات مثل بدون مدة التزام وباقات جوال مرنة تعني غالباً أنك تستطيع تغيير الباقة أو المشغل بسهولة أكبر، لكن الشروط قد تختلف بين المشغلين.",
    ],
    sections: [
      {
        title: "ما معنى باقة بدون التزام؟",
        paragraphs: [
          "باقة جوال بدون التزام تعني أنك لا تكون مرتبطاً بعقد طويل لفترة محددة. هذا يمنحك مرونة أكبر إذا تغيرت احتياجاتك أو وجدت عرضاً أرخص لاحقاً.",
        ],
      },
      {
        title: "لمن تناسب الباقات بدون التزام؟",
        paragraphs: [
          "تناسب هذه الباقات الأشخاص الذين يريدون تجربة مشغل جديد، أو لا يعرفون بالضبط كمية الإنترنت التي يحتاجونها، أو يريدون الاستفادة من العروض المتغيرة في السوق.",
        ],
      },
    ],
    sectionsAfterOperators: [
      {
        title: "قارن المرونة مع السعر",
        paragraphs: [
          "الباقة بدون التزام ليست دائماً الأغلى أو الأرخص. لذلك من المهم مقارنة السعر الشهري، حجم الإنترنت والسعر بعد انتهاء العرض قبل أن تختار.",
        ],
      },
    ],
    operatorLinks,
    faq: [
      {
        question: "ما معنى باقة بدون التزام؟",
        answer: "تعني أن الاشتراك لا يربطك غالباً بعقد طويل، مما يجعل تغيير الباقة أو المشغل أسهل.",
      },
      {
        question: "هل يمكن إلغاء الاشتراك في أي وقت؟",
        answer: "في كثير من الحالات نعم، لكن تحقق دائماً من شروط المشغل وفترة الإشعار قبل الطلب.",
      },
      {
        question: "هل الباقات بدون التزام أغلى؟",
        answer: "ليست دائماً أغلى. بعض العروض الرخيصة تكون بدون التزام، لذلك من المهم مقارنة السعر والشروط.",
      },
      {
        question: "ما أفضل باقات الجوال بدون التزام؟",
        answer: "أفضل باقة تعتمد على السعر، كمية الإنترنت، الشبكة والسعر بعد انتهاء العرض.",
      },
      {
        question: "هل توجد عروض بدون التزام مع إنترنت كثير؟",
        answer: "نعم، قد توجد عروض بدون التزام مع إنترنت كثير، لكن التوفر والأسعار تتغير بين المشغلين.",
      },
    ],
    internalLinks: commonInternalLinks,
    teaserIntent: "no-binding",
    teaserTitle: "باقات بدون التزام حالياً",
    teaserSubtitle: "عروض مرنة من قاعدة المقارنة",
    showDetailedPricing: true,
  },
  surfGuide: {
    metaTitle: "كم إنترنت أحتاج في اشتراك الجوال؟ | دليل اختيار الباقة",
    metaDescription:
      "تعرف على كمية الإنترنت التي تحتاجها في اشتراك الجوال حسب استخدامك للفيديو، التطبيقات، التصفح والعمل. قارن الباقات واختر الأنسب لك.",
    canonicalUrl: "https://ikhtar.se/mobilabonnemang/hur-mycket-surf",
    h1: "كم إنترنت أحتاج في اشتراك الجوال؟",
    intro:
      "اختيار كمية الإنترنت المناسبة يساعدك على تجنب دفع أكثر مما تحتاج. الباقة الصحيحة تعتمد على استخدامك اليومي وليس على السعر فقط.",
    ctaText: "قارن الباقات حسب حجم الإنترنت",
    ctaHref: "/mobilabonnemang",
    disclosure,
    bodyIntro: [
      "إذا اخترت باقة كبيرة جداً قد تدفع بلا فائدة، وإذا اخترت باقة صغيرة جداً قد تحتاج إلى شراء إنترنت إضافي. لذلك من الأفضل مقارنة الباقات حسب السعر وحجم الإنترنت معاً.",
    ],
    sections: [
      {
        title: "استخدام خفيف",
        paragraphs: [
          "5–10 GB قد تكفي إذا كنت تستخدم WiFi معظم الوقت، وتحتاج الإنترنت للرسائل، التصفح، الخرائط وبعض التطبيقات اليومية.",
        ],
      },
      {
        title: "استخدام عادي",
        paragraphs: [
          "20–50 GB تناسب الاستخدام اليومي مثل السوشيال ميديا، الموسيقى، الخرائط، وبعض مشاهدة الفيديو خارج المنزل.",
        ],
      },
      {
        title: "استخدام مرتفع",
        paragraphs: [
          "100 GB أو أكثر تناسب من يشاهد الفيديو كثيراً، يستخدم الهاتف للعمل أو يعتمد على الهاتف خارج WiFi لفترات طويلة.",
        ],
      },
      {
        title: "متى تحتاج إلى إنترنت غير محدود؟",
        paragraphs: [
          "قد تحتاج إلى إنترنت غير محدود إذا كنت تستخدم الهاتف كنقطة اتصال، تشاهد الفيديو بكثرة، أو لا تريد التفكير في استهلاك البيانات شهرياً.",
        ],
      },
      {
        title: "كيف تختار الباقة المناسبة؟",
        paragraphs: [
          "ابدأ بتقدير استخدامك الحقيقي، ثم قارن السعر الحالي، متوسط التكلفة خلال 12 شهراً، ومدة الالتزام. لا تختار أكبر باقة إذا كنت لا تحتاجها.",
        ],
      },
    ],
    sectionsAfterOperators: [
      {
        title: "قارن باقات الجوال حسب كمية الإنترنت",
        paragraphs: [
          "يمكنك مقارنة عروض من Vimla / فيملا، Fello / فيلّو، Comviq / كومفيك، Tre / تري، Tele2 / تيلي 2، Telenor / تيلينور وTelia / تيليا حسب كمية الإنترنت والسعر.",
        ],
      },
    ],
    operatorLinks,
    faq: [
      {
        question: "هل 5–10 GB تكفي؟",
        answer: "قد تكفي إذا كنت تستخدم WiFi معظم الوقت ولا تشاهد الفيديو كثيراً خارج المنزل.",
      },
      {
        question: "هل 20–50 GB مناسبة للاستخدام اليومي؟",
        answer: "نعم، هذه الكمية تناسب كثيراً من المستخدمين الذين يستخدمون التطبيقات والسوشيال ميديا والموسيقى بشكل يومي.",
      },
      {
        question: "متى أحتاج إلى 100 GB أو أكثر؟",
        answer: "إذا كنت تشاهد الفيديو كثيراً أو تستخدم الهاتف للعمل أو كنقطة اتصال، فقد تحتاج إلى 100 GB أو أكثر.",
      },
      {
        question: "متى أحتاج إلى إنترنت غير محدود؟",
        answer: "إذا كنت لا تريد مراقبة الاستهلاك أو تستخدم الهاتف بكثافة كبيرة خارج WiFi.",
      },
      {
        question: "هل الباقة الأكبر هي الأفضل دائماً؟",
        answer: "ليست دائماً. الأفضل هو اختيار كمية إنترنت تناسب استخدامك بسعر مناسب.",
      },
    ],
    internalLinks: commonInternalLinks,
    teaserIntent: "data-guide",
    teaserTitle: "باقات تساعدك على اختيار كمية الإنترنت",
    teaserSubtitle: "أمثلة من عروض حالية حسب الاستخدام",
    showDetailedPricing: true,
  },
} satisfies Record<string, SeoPageConfig>;

function MobileSeoPage({ page }: { page: SeoPageConfig }) {
  return (
    <SeoLandingPageTemplate
      {...page}
      teaser={
        <MobilePlansTeaserWidget
          intent={page.teaserIntent}
          operatorSlug={page.operatorSlug}
          title={page.teaserTitle}
          subtitle={page.teaserSubtitle}
          showAllOperatorPlans={page.showAllOperatorPlans}
          showDetailedPricing={page.showDetailedPricing}
          fallbackMessage={page.teaserFallbackMessage}
        />
      }
    />
  );
}

export function CheapestMobileSubscriptionPage() {
  return <MobileSeoPage page={pages.cheapest} />;
}

export function ComviqMobileSeoPage() {
  return <MobileSeoPage page={createOperatorPage({
    slug: "comviq",
    latin: "Comviq",
    arabic: "كومفيك",
    titleArabic: "كومفيك",
    network: "Tele2 / تيلي 2",
    intro:
      "تعد Comviq / كومفيك من أشهر مشغلي الجوال في السويد، وتقدم باقات جوال مختلفة تناسب المستخدمين الذين يبحثون عن سعر مناسب وخيارات مرنة.",
    whatIs:
      "Comviq / كومفيك هي علامة تجارية تابعة لـ Tele2 / تيلي 2 في السويد. تشتهر بعروض الجوال، الباقات بدون التزام، والخيارات التي تناسب المستخدمين الذين يريدون التحكم في تكلفة اشتراك الجوال.",
    fit:
      "قد تكون Comviq خياراً مناسباً إذا كنت تبحث عن اشتراك جوال بسعر واضح وتريد مقارنة العروض قبل اتخاذ القرار.",
    compare:
      "قبل اختيار Comviq، من الجيد مقارنة العرض مع باقات أخرى. قد تجد أن باقة من مشغل آخر تقدم إنترنت أكثر، سعراً أقل، أو شروطاً أفضل حسب احتياجك.",
    keywordVariants: ["عروض Comviq", "عروض كومفيك", "باقات كومفيك", "اشتراك كومفيك"],
  })} />;
}

export function VimlaMobileSeoPage() {
  return <MobileSeoPage page={pages.vimla} />;
}

export function FelloMobileSeoPage() {
  return <MobileSeoPage page={pages.fello} />;
}

export function TreMobileSeoPage() {
  return <MobileSeoPage page={pages.tre} />;
}

export function Tele2MobileSeoPage() {
  return <MobileSeoPage page={pages.tele2} />;
}

export function TelenorMobileSeoPage() {
  return <MobileSeoPage page={pages.telenor} />;
}

export function TeliaMobileSeoPage() {
  return <MobileSeoPage page={pages.telia} />;
}

export function NoBindingMobileSeoPage() {
  return <MobileSeoPage page={pages.noBinding} />;
}

export function SurfGuideMobileSeoPage() {
  return <MobileSeoPage page={pages.surfGuide} />;
}
