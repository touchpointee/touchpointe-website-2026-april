import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { Providers } from "@/app/providers";
import { defaultMetadata } from "@/lib/site";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

import "./globals.css";

const HATTIE_API_URL = "https://hattie.touchpointe.digital";
const HATTIE_TENANT_ID = "ebba062f-53df-4562-8438-9a04c26e3871";

const siteFont = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  preload: true,
});

export const metadata: Metadata = {
  ...defaultMetadata,
  other: {
    "theme-color": "#7C3AED",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Touchpointe Digital",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://touchpointe.com",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://touchpointe.com"}/brand/logo.jpeg`,
  description:
    "Touchpointe designs high-performance digital experiences, product ecosystems, and growth-ready websites for modern brands.",
  sameAs: [
    "https://www.linkedin.com",
    "https://www.instagram.com",
    "https://x.com",
  ],
};

function GTMScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`}
    </Script>
  );
}

function GA4Script() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#7C3AED" />
        <link rel="stylesheet" href={`${HATTIE_API_URL}/assets/index.css`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body
        className={`${siteFont.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        {/* GTM noscript fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Providers>{children}</Providers>
        <WhatsAppButton />
        <Script id="hattie-ai-config" strategy="beforeInteractive">
          {`window.HattieAI={tenantId:"${HATTIE_TENANT_ID}",apiUrl:"${HATTIE_API_URL}"};`}
        </Script>
        <Script
          src={`${HATTIE_API_URL}/assets/index.js`}
          type="module"
          strategy="afterInteractive"
        />
        <GTMScript />
        <GA4Script />
      </body>
    </html>
  );
}
