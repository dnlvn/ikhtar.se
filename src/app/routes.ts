import { createBrowserRouter } from "react-router";
import { Layout } from "@/app/components/Layout";
import { LandingPage } from "@/app/pages/LandingPage";
import { MobileComparison } from "@/app/pages/MobileComparison";
import { ComviqMobileSeoPage } from "@/app/pages/ComviqMobileSeoPage";
import {
  CheapestMobileSubscriptionPage,
  FelloMobileSeoPage,
  NoBindingMobileSeoPage,
  SurfGuideMobileSeoPage,
  Tele2MobileSeoPage,
  TelenorMobileSeoPage,
  TeliaMobileSeoPage,
  TreMobileSeoPage,
  VimlaMobileSeoPage,
} from "@/app/pages/MobileSeoPage";
import { ElectricityComparison } from "@/app/pages/ElectricityComparison";
import { Integritetspolicy } from "@/app/pages/Integritetspolicy";
import { Cookies } from "@/app/pages/Cookies";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: "mobilabonnemang",
        Component: MobileComparison,
      },
      {
        path: "mobilabonnemang/billigaste",
        Component: CheapestMobileSubscriptionPage,
      },
      {
        path: "mobilabonnemang/comviq",
        Component: ComviqMobileSeoPage,
      },
      {
        path: "mobilabonnemang/vimla",
        Component: VimlaMobileSeoPage,
      },
      {
        path: "mobilabonnemang/fello",
        Component: FelloMobileSeoPage,
      },
      {
        path: "mobilabonnemang/tre",
        Component: TreMobileSeoPage,
      },
      {
        path: "mobilabonnemang/tele2",
        Component: Tele2MobileSeoPage,
      },
      {
        path: "mobilabonnemang/telenor",
        Component: TelenorMobileSeoPage,
      },
      {
        path: "mobilabonnemang/telia",
        Component: TeliaMobileSeoPage,
      },
      {
        path: "mobilabonnemang/utan-bindningstid",
        Component: NoBindingMobileSeoPage,
      },
      {
        path: "guider/hur-mycket-surf",
        Component: SurfGuideMobileSeoPage,
      },
      {
        path: "elavtal",
        Component: ElectricityComparison,
      },
      {
        path: "integritetspolicy",
        Component: Integritetspolicy,
      },
      {
        path: "cookies",
        Component: Cookies,
      },
    ],
  },
]);
