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
  title = "MJ NEXUS | The Unified World of Services",
  description = "MJ Nexus integrates Betting, Global Commerce, Secure Home Services, and Financial Trading into one powerful ecosystem. The ultimate platform for the modern world.",
  image = "https://picsum.photos/seed/mjnexus/1200/630",
  url = "https://mjnexus.com",
  type = "website",
  keywords = "betting, commerce, home services, trading, crypto, p2p, marketplace, global services, MJ Nexus"
}) => {
  const siteName = "MJ NEXUS";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

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
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};
