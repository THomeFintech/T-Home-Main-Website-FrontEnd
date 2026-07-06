import { Helmet } from "react-helmet-async";

const BASE_URL = "https://thomefintech.com";

export default function SEO({
  title,
  description,
  path = "",
  image = "/logo.png",
  robots = "index, follow",
}) {
  const canonicalUrl = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${BASE_URL}${image}`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}