import { createBrowserRouter } from "react-router";
import { Layout } from "@/app/components/Layout";
import { LandingPage } from "@/app/pages/LandingPage";
import { MobileComparison } from "@/app/pages/MobileComparison";
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
