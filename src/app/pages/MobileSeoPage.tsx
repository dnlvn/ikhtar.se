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
};

type OperatorPageInput = {
  slug: string;
  latin: string;
  arabic: string;
  titleArabic: string;
  network?: string;
  intro: string;
  whatIs: string;
  compare: string;
  fit: string;
};

const disclosure =
  "تحتوي هذه الصفحة على روابط إعلانية. قد نحصل على عمولة إذا اخترت الاشتراك عبر روابطنا، دون أي تكلفة إضافية عليك.";

const operatorLinks = [
  { label: "Vimla / فيملا", href: "/mobilabonnemang/vimla" },
  { label: "Fello / فيلّو", href: "/mobilabonnemang/fello" },
  { label: "Comviq / كومفيك", href: "/mobilabonnemang/comviq" },
  { label: "Tre / تري", href: "/mobilabonnemang/tre" },
  { label: "Tele2 / تيلي 2", href: "/mobilabonnemang/tele2" },
  { label: "Telenor / تيلينور", href: "/mobilabonnemang/telenor" },
  { label: "Telia / تيليا", href: "/mobilabonnemang/telia" },
];

const commonInternalLinks = [
  { label: "قارن جميع باقات الجوال", href: "/mobilabonnemang" },
  { label: "أرخص اشتراك جوال", href: "/mobilabonnemang/billigaste" },
  { label: "باقات بدون التزام", href: "/mobilabonnemang/utan-bindningstid" },
  { label: "كم إنترنت أحتاج؟", href: "/guider/hur-mycket-surf" },
];

function createOperatorPage(input: OperatorPageInput): SeoPageConfig {
  const brand = `${input.latin} / ${input.arabic}`;

  return {
    metaTitle: `عروض ${input.latin} في السويد – قارن باقات ${input.titleArabic}`,
    metaDescription: `قارن عروض ${brand} في السويد مع باقات جوال أخرى. شاهد الأسعار، حجم الإنترنت، الشبكة ومدة الالتزام قبل اختيار الاشتراك.`,
    canonicalUrl: `https://ikhtar.se/mobilabonnemang/${input.slug}`,
    h1: `عروض ${input.latin} في السويد`,
    intro: input.intro,
    ctaText: `شاهد عروض ${input.latin}`,
    ctaHref: "/mobilabonnemang",
    disclosure,
    bodyIntro: [
      `على Ikhtar.se يمكنك مقارنة عروض ${brand} مع عروض مشغلين آخرين قبل أن تختار. المقارنة تساعدك على رؤية السعر، حجم الإنترنت، مدة الالتزام والسعر بعد انتهاء العرض في مكان واحد.`,
    ],
    sections: [
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
        title: `قارن ${input.latin} مع باقات أخرى`,
        paragraphs: [input.compare],
      },
    ],
    operatorLinks,
    faq: [
      {
        question: `هل ${input.latin} تقدم باقات جوال في السويد؟`,
        answer: `نعم، ${brand} تقدم باقات جوال وخيارات مختلفة للمستخدمين في السويد.`,
      },
      {
        question: `ما الشبكة التي تستخدمها ${input.latin}؟`,
        answer: input.network
          ? `${brand} تستخدم شبكة ${input.network} في السويد.`
          : `تختلف تفاصيل الشبكة حسب العرض. قارن الشروط الحالية قبل اختيار الباقة.`,
      },
      {
        question: `هل يجب مقارنة ${input.latin} مع مشغلين آخرين؟`,
        answer: "نعم، المقارنة تساعدك على اختيار الباقة الأنسب من حيث السعر، الإنترنت والشروط.",
      },
    ],
    internalLinks: commonInternalLinks,
    teaserIntent: "operator",
    operatorSlug: input.slug,
  };
}

const pages = {
  cheapest: {
    metaTitle: "أرخص اشتراك جوال في السويد – قارن الأسعار والعروض",
    metaDescription:
      "قارن أرخص باقات الجوال في السويد واعثر على اشتراك يناسب ميزانيتك. نقارن الأسعار، حجم الإنترنت، مدة الالتزام والعروض الحالية من عدة مشغلين.",
    canonicalUrl: "https://ikhtar.se/mobilabonnemang/billigaste",
    h1: "أرخص اشتراك جوال في السويد",
    intro:
      "تبحث عن أرخص اشتراك جوال في السويد؟ على Ikhtar.se يمكنك مقارنة باقات الجوال من عدة مشغلين واختيار الاشتراك الذي يناسب ميزانيتك واحتياجك من الإنترنت.",
    ctaText: "قارن أرخص الباقات الآن",
    ctaHref: "/mobilabonnemang",
    disclosure,
    bodyIntro: [
      "قد يختلف أرخص اشتراك جوال من شخص إلى آخر. فالباقة الأرخص ليست دائماً الباقة التي تعرض أقل سعر في الشهر الأول، بل يجب أيضاً النظر إلى السعر بعد انتهاء العرض، حجم الإنترنت، مدة الالتزام، وجود مكالمات ورسائل مجانية، والشبكة التي يستخدمها المشغّل.",
      "على Ikhtar.se نقارن باقات الجوال في السويد بطريقة تساعدك على رؤية الفرق بين العروض بسرعة. يمكنك مقارنة الأسعار الحالية والعثور على اشتراك أرخص خلال دقائق.",
    ],
    sections: [
      {
        title: "كيف تجد أرخص اشتراك جوال؟",
        paragraphs: [
          "للعثور على أرخص اشتراك جوال، لا تنظر فقط إلى السعر الأولي. كثير من العروض تبدأ بسعر منخفض خلال الأشهر الأولى، ثم يرتفع السعر بعد انتهاء فترة العرض. لذلك من المهم مقارنة السعر الشهري الحالي والسعر العادي بعد الحملة.",
          "انتبه أيضاً إلى كمية الإنترنت. إذا كنت تستخدم WiFi في المنزل والعمل، فقد تكفيك باقة صغيرة. أما إذا كنت تشاهد الفيديو أو تستخدم الهاتف كثيراً خارج المنزل، فقد تحتاج إلى باقة أكبر حتى لا تضطر إلى شراء إنترنت إضافي.",
        ],
      },
    ],
    sectionsAfterOperators: [
      {
        title: "ما الذي يجعل الاشتراك رخيصاً فعلاً؟",
        paragraphs: [
          "الاشتراك الرخيص هو الاشتراك الذي يعطيك ما تحتاجه بسعر مناسب. إذا دفعت مقابل إنترنت أكثر مما تستخدم، فقد لا يكون الاشتراك اقتصادياً بالنسبة لك. وإذا اخترت باقة صغيرة جداً وتحتاج دائماً إلى شراء إنترنت إضافي، فقد تصبح التكلفة أعلى من المتوقع.",
          "لذلك من الأفضل اختيار باقة تناسب استخدامك الحقيقي.",
        ],
      },
    ],
    operatorLinks,
    faq: [
      {
        question: "ما هو أرخص اشتراك جوال في السويد؟",
        answer:
          "يتغير أرخص اشتراك جوال حسب العروض الحالية. لذلك من الأفضل مقارنة الأسعار بانتظام قبل اختيار الباقة.",
      },
      {
        question: "هل أرخص اشتراك هو الأفضل دائماً؟",
        answer:
          "ليس دائماً. يجب أيضاً مقارنة حجم الإنترنت، الشبكة، مدة الالتزام والسعر بعد انتهاء العرض.",
      },
      {
        question: "هل توجد باقات جوال بدون التزام؟",
        answer:
          "نعم، كثير من المشغلين يقدمون باقات بدون التزام، مما يجعل تغيير الاشتراك أسهل.",
      },
      {
        question: "هل يمكنني الاحتفاظ برقمي عند تغيير الاشتراك؟",
        answer:
          "في معظم الحالات يمكنك الاحتفاظ برقمك عند الانتقال إلى مشغل جديد.",
      },
    ],
    internalLinks: commonInternalLinks,
    teaserIntent: "cheapest",
  },
  comviq: createOperatorPage({
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
  }),
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
  }),
  noBinding: {
    metaTitle: "باقات جوال بدون التزام في السويد – قارن الأسعار",
    metaDescription:
      "قارن باقات جوال بدون التزام في السويد واعثر على اشتراك مرن يمكنك تغييره عند الحاجة. شاهد الأسعار والعروض الحالية.",
    canonicalUrl: "https://ikhtar.se/mobilabonnemang/utan-bindningstid",
    h1: "باقات جوال بدون التزام في السويد",
    intro:
      "إذا كنت تريد حرية تغيير اشتراك الجوال عندما تجد عرضاً أفضل، فقد تكون باقات الجوال بدون التزام خياراً مناسباً.",
    ctaText: "قارن الباقات بدون التزام",
    ctaHref: "/mobilabonnemang",
    disclosure,
    bodyIntro: [
      "على Ikhtar.se يمكنك مقارنة الباقات المرنة من عدة مشغلين في السويد. الباقة بدون التزام تمنحك حرية أكبر إذا تغيرت احتياجاتك أو ظهر عرض أفضل لاحقاً.",
    ],
    sections: [
      {
        title: "ما معنى بدون التزام؟",
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
        question: "هل الباقات بدون التزام أغلى؟",
        answer: "ليس بالضرورة. كثير من العروض الرخيصة في السويد تكون بدون التزام.",
      },
      {
        question: "هل يمكنني الاحتفاظ برقمي؟",
        answer: "غالباً نعم، يمكنك نقل رقمك إلى المشغل الجديد.",
      },
      {
        question: "لماذا أختار باقة بدون التزام؟",
        answer: "لأنها تمنحك حرية أكبر لتغيير الاشتراك إذا ظهر عرض أفضل.",
      },
    ],
    internalLinks: commonInternalLinks,
    teaserIntent: "no-binding",
  },
  surfGuide: {
    metaTitle: "كم إنترنت أحتاج في اشتراك الجوال؟ دليل لاختيار الباقة",
    metaDescription:
      "تعرف على كمية الإنترنت المناسبة لاستخدامك اليومي وقارن باقات الجوال في السويد حسب حجم الإنترنت والسعر.",
    canonicalUrl: "https://ikhtar.se/guider/hur-mycket-surf",
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
        title: "1 إلى 5 GB",
        paragraphs: [
          "تناسب هذه الباقات الاستخدام الخفيف، مثل الرسائل، قراءة الأخبار، البريد الإلكتروني وبعض التطبيقات. إذا كنت تستخدم WiFi معظم الوقت، فقد تكون هذه الكمية كافية.",
        ],
      },
      {
        title: "10 إلى 20 GB",
        paragraphs: [
          "تناسب الاستخدام اليومي العادي، مثل وسائل التواصل الاجتماعي، الخرائط، الموسيقى وبعض مشاهدة الفيديو. هذه الفئة مناسبة لكثير من المستخدمين.",
        ],
      },
      {
        title: "50 إلى 100 GB",
        paragraphs: [
          "تناسب من يستخدم الهاتف كثيراً خارج المنزل، يشاهد الفيديو، أو يستخدم الهاتف للعمل والتطبيقات بشكل يومي.",
        ],
      },
    ],
    sectionsAfterOperators: [
      {
        title: "إنترنت غير محدود",
        paragraphs: [
          "يناسب من لا يريد التفكير في كمية الإنترنت، أو يستخدم الهاتف كنقطة اتصال، أو يشاهد الفيديو كثيراً. لكنه ليس دائماً الخيار الأرخص.",
        ],
      },
      {
        title: "قارن حسب استخدامك",
        paragraphs: [
          "يمكنك مقارنة عروض من Vimla / فيملا، Fello / فيلّو، Comviq / كومفيك، Tre / تري، Tele2 / تيلي 2، Telenor / تيلينور وTelia / تيليا.",
        ],
      },
    ],
    operatorLinks,
    faq: [
      {
        question: "هل 5 GB تكفي؟",
        answer: "قد تكفي إذا كنت تستخدم WiFi معظم الوقت ولا تشاهد الفيديو كثيراً خارج المنزل.",
      },
      {
        question: "هل 10 GB كافية؟",
        answer: "نعم، قد تكون كافية لكثير من المستخدمين اليوميين.",
      },
      {
        question: "متى أحتاج إلى إنترنت غير محدود؟",
        answer: "إذا كنت تستخدم الفيديو بكثرة أو تشارك الإنترنت مع أجهزة أخرى.",
      },
    ],
    internalLinks: commonInternalLinks,
    teaserIntent: "data-guide",
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
        />
      }
    />
  );
}

export function CheapestMobileSubscriptionPage() {
  return <MobileSeoPage page={pages.cheapest} />;
}

export function ComviqMobileSeoPage() {
  return <MobileSeoPage page={pages.comviq} />;
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
