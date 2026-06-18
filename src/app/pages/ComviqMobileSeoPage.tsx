import { SeoLandingPageTemplate } from "@/app/components/SeoLandingPageTemplate";
import { MobilePlansTeaserWidget } from "@/app/components/MobilePlansTeaserWidget";

const disclosure =
  "تحتوي هذه الصفحة على روابط إعلانية. قد نحصل على عمولة إذا اخترت الاشتراك عبر روابطنا، دون أي تكلفة إضافية عليك.";

const otherOperatorLinks = [
  { label: "Vimla / فيملا", href: "/mobilabonnemang/vimla" },
  { label: "Fello / فيلّو", href: "/mobilabonnemang/fello" },
  { label: "Tre / تري", href: "/mobilabonnemang/tre" },
  { label: "Tele2 / تيلي 2", href: "/mobilabonnemang/tele2" },
  { label: "Telenor / تيلينور", href: "/mobilabonnemang/telenor" },
  { label: "Telia / تيليا", href: "/mobilabonnemang/telia" },
];

const internalLinks = [
  { label: "قارن جميع باقات الجوال", href: "/mobilabonnemang" },
  { label: "أرخص اشتراك جوال", href: "/mobilabonnemang/billigaste" },
  { label: "باقات بدون التزام", href: "/mobilabonnemang/utan-bindningstid" },
  { label: "كم إنترنت أحتاج؟", href: "/guider/hur-mycket-surf" },
];

export function ComviqMobileSeoPage() {
  return (
    <SeoLandingPageTemplate
      metaTitle="عروض كومفيك في السويد | قارن أفضل باقات Comviq"
      metaDescription="قارن أحدث عروض Comviq / كومفيك في السويد. شاهد الأسعار، كمية الإنترنت، مدة الالتزام والسعر بعد انتهاء العرض قبل اختيار اشتراك الجوال."
      canonicalUrl="https://ikhtar.se/mobilabonnemang/comviq"
      h1="عروض Comviq في السويد"
      intro="تعد Comviq / كومفيك من أشهر مشغلي الجوال في السويد، وتقدم باقات جوال مختلفة تناسب المستخدمين الذين يبحثون عن سعر مناسب وخيارات مرنة."
      ctaText="شاهد عروض Comviq"
      ctaHref="/mobilabonnemang"
      disclosure={disclosure}
      teaser={
        <MobilePlansTeaserWidget
          intent="operator"
          operatorSlug="comviq"
          title="باقات Comviq المتاحة حالياً"
          subtitle="عروض محدّثة من موقع المشغّل"
          showAllOperatorPlans
          showDetailedPricing
          fallbackMessage="لا توجد حالياً باقات Comviq إضافية متاحة في قاعدة البيانات."
        />
      }
      bodyIntro={[
        "إذا كنت تبحث عن عروض كومفيك في السويد، يمكنك هنا مقارنة باقات كومفيك الحالية ومعرفة السعر، كمية الإنترنت ومدة الالتزام قبل اختيار اشتراكك. تساعدك المقارنة على العثور على أرخص اشتراك كومفيك أو الباقة التي تمنحك أفضل قيمة مقابل السعر.",
        "على Ikhtar.se يمكنك مقارنة عروض كومفيك مع عروض الجوال من كومفيك في السويد ومع باقات أخرى قبل أن تختار. المقارنة تساعدك على رؤية السعر، حجم الإنترنت، مدة الالتزام والسعر بعد انتهاء العرض في مكان واحد.",
      ]}
      sections={[
        {
          title: "أفضل عروض كومفيك في السويد",
          paragraphs: [
            "تتغير عروض كومفيك حسب الحملات الحالية، لذلك من الأفضل مقارنة السعر الحالي مع السعر بعد انتهاء العرض قبل اختيار اشتراك كومفيك.",
          ],
        },
        {
          title: "باقات كومفيك الحالية",
          paragraphs: [
            "تعرض هذه الصفحة باقات كومفيك المتاحة في قاعدة بياناتنا حالياً. يمكنك مقارنة كمية الإنترنت، السعر الشهري ومدة الالتزام مباشرة من بطاقات العروض أعلاه.",
          ],
        },
        {
          title: "ما هي Comviq / كومفيك؟",
          paragraphs: [
            "Comviq / كومفيك هي علامة تجارية تابعة لـ Tele2 / تيلي 2 في السويد. تشتهر بعروض الجوال، الباقات بدون التزام، والخيارات التي تناسب المستخدمين الذين يريدون التحكم في تكلفة اشتراك الجوال.",
          ],
        },
        {
          title: "هل Comviq مناسبة لك؟",
          paragraphs: [
            "قد تكون Comviq خياراً مناسباً إذا كنت تبحث عن اشتراك جوال بسعر واضح وتريد مقارنة العروض قبل اتخاذ القرار.",
            "من المهم دائماً مقارنة السعر، حجم الإنترنت، مدة الالتزام والشبكة مع مشغلين آخرين قبل اختيار اشتراك جوال جديد.",
          ],
        },
      ]}
      operatorLinks={otherOperatorLinks}
      sectionsAfterOperators={[
        {
          title: "قارن عروض Comviq مع باقات أخرى",
          paragraphs: [
            "قبل اختيار Comviq، من الجيد مقارنة العرض مع باقات أخرى من Vimla / فيملا، Fello / فيلّو، Tre / تري، Tele2 / تيلي 2، Telenor / تيلينور وTelia / تيليا. قد تجد أن باقة من مشغل آخر تقدم إنترنت أكثر، سعراً أقل، أو شروطاً أفضل حسب احتياجك.",
          ],
        },
      ]}
      faq={[
        {
          question: "هل Comviq تقدم باقات جوال في السويد؟",
          answer:
            "نعم، Comviq / كومفيك تقدم باقات جوال في السويد بخيارات مختلفة من حيث كمية الإنترنت، السعر ومدة الالتزام.",
        },
        {
          question: "ما الشبكة التي تستخدمها Comviq؟",
          answer:
            "Comviq / كومفيك تابعة لـ Tele2 / تيلي 2 وتستخدم شبكة Tele2 في السويد.",
        },
        {
          question: "هل يجب مقارنة Comviq مع مشغلين آخرين؟",
          answer:
            "نعم، المقارنة تساعدك على معرفة ما إذا كانت عروض كومفيك هي الأنسب لك، أو إذا كانت باقة أخرى تمنحك سعراً أفضل أو إنترنت أكثر.",
        },
        {
          question: "ما أفضل عروض كومفيك حالياً؟",
          answer:
            "أفضل عروض كومفيك حالياً تعتمد على احتياجك من الإنترنت والسعر بعد انتهاء العرض. لذلك نعرض باقات كومفيك المتاحة ونوضح السعر، الإنترنت ومدة الالتزام حتى تختار بسهولة.",
        },
        {
          question: "هل توجد باقات Comviq بدون التزام؟",
          answer:
            "قد تختلف مدة الالتزام حسب العرض الحالي. تحقق دائماً من مدة الالتزام في بطاقة الباقة قبل الانتقال إلى موقع Comviq.",
        },
      ]}
      internalLinks={internalLinks}
    />
  );
}
