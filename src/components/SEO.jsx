import { Helmet } from "react-helmet-async";

const BASE_URL = "https://thomefintech.com";
const BRAND = "T-Home Fintech";

export default function SEO({
  title,
  description,
  path = "",
  image = "/home/logo.png",
  robots = "index, follow",
  keywords = "",
  type = "website",
  structuredData = [],
}) {
  const canonicalUrl = `${BASE_URL}${path}`;

  const imageUrl = image.startsWith("http")
    ? image
    : `${BASE_URL}${image}`;

  const fullTitle =
    title === "Home"
      ? "T-Home Fintech | Loans, Financial Services & Business Registration"
      : `${title} | ${BRAND}`;

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      {keywords && (
        <meta name="keywords" content={keywords} />
      )}

      <meta name="robots" content={robots} />

      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data */}
      {structuredData.map((schema, index) => (
        <script
            key={index}
            type="application/ld+json"
        >
            {JSON.stringify(schema)}
        </script>
        ))}
    </Helmet>
  );
}