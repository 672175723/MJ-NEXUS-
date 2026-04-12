import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "MJ NEXUS : Votre Partenaire Business à Douala",
  description = "MJ NEXUS est l'écosystème unifié leader à Douala, Cameroun. High-Tech, Énergie Solaire, Écologie et Logistique. Qualité et Innovation.",
  image = "https://picsum.photos/seed/mjnexus/1200/630",
  url = "https://mjnexus.com",
  type = "website",
  keywords = "MJ NEXUS, business douala, high-tech cameroun, oraimo douala, hoco cameroun, énergie solaire douala, bio-charbon cameroun, pavés écologiques douala, logistique douala, livraison express cameroun, Joël Mikam, business cameroun, investissement douala"
}) => {
  const siteName = "MJ NEXUS";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      <meta name="geo.region" content="CM" />
      <meta name="geo.placename" content="Douala, Yaoundé" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Mobile & App */}
      <meta name="theme-color" content="#10b981" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />

      {/* Automatic Updates Meta (Search Engine Hints) */}
      <meta name="revisit-after" content="1 days" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": url,
          "logo": image,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+237-699-932-926",
            "contactType": "customer service",
            "areaServed": "CM",
            "availableLanguage": ["French", "English"]
          },
          "sameAs": [
            "https://facebook.com/mjnexus",
            "https://twitter.com/mjnexus",
            "https://instagram.com/mjnexus"
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": siteName,
          "url": url,
          "description": description,
          "applicationCategory": "FinanceApplication, SportsApplication, ShoppingApplication",
          "genre": "Betting, E-commerce, Home Services",
          "browserRequirements": "Requires JavaScript",
          "softwareVersion": "2.1.0",
          "operatingSystem": "All",
          "author": {
            "@type": "Person",
            "name": "Joël Mikam Djeute"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "XAF"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "25000"
          }
        })}
      </script>
    </Helmet>
  );
};
