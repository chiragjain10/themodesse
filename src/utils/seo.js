// SEO Configuration and Utilities for The Modesse

export const SEO_CONFIG = {
  // Default meta tags
  default: {
    title: 'The Modesse | Premium Contemporary Womenswear - Designer Clothing Collection',
    description: 'Discover premium contemporary womenswear at The Modesse. Handcrafted designer clothing made from finest Indian fabrics - khadi, handloom, and pure cotton. Elegant dresses, modern ethnic wear, and sustainable fashion for the sophisticated woman.',
    keywords: 'premium contemporary clothing, designer womenswear, luxury fashion, modern ethnic wear, handcrafted garments, sustainable fashion, Indian designer clothes, boutique clothing, elegant dresses, contemporary fashion, khadi clothing, handloom dresses, premium women\'s clothing, designer dresses, luxury ethnic wear, modern Indian fashion',
    image: '/src/assets/images/themodesse.jpg',
    url: 'https://themodesse.com'
  },

  // Page-specific configurations
  pages: {
    home: {
      title: 'The Modesse | Premium Contemporary Womenswear - Designer Clothing Collection',
      description: 'Discover premium contemporary womenswear at The Modesse. Handcrafted designer clothing made from finest Indian fabrics - khadi, handloom, and pure cotton. Elegant dresses, modern ethnic wear, and sustainable fashion for the sophisticated woman.',
      keywords: 'premium contemporary clothing, designer womenswear, luxury fashion, modern ethnic wear, handcrafted garments, sustainable fashion, Indian designer clothes, boutique clothing, elegant dresses, contemporary fashion',
      schema: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "The Modesse",
        "url": "https://themodesse.com/",
        "description": "Premium contemporary womenswear brand offering handcrafted designer clothing",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://themodesse.com/shop?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    },

    shop: {
      title: 'Shop Premium Contemporary Womenswear | Designer Clothing Collection - The Modesse',
      description: 'Discover premium contemporary womenswear at The Modesse. Browse our exclusive collection of handcrafted designer clothing made from finest Indian fabrics - khadi, handloom, and pure cotton. Elegant dresses, modern ethnic wear, and sustainable fashion for the sophisticated woman.',
      keywords: 'shop premium contemporary clothing, designer womenswear, luxury fashion, modern ethnic wear, handcrafted garments, sustainable fashion, Indian designer clothes, boutique clothing, elegant dresses, contemporary fashion',
      schema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Shop Premium Contemporary Womenswear",
        "description": "Browse our exclusive collection of handcrafted designer clothing",
        "url": "https://themodesse.com/shop"
      }
    },

    about: {
      title: 'About The Modesse | Premium Contemporary Womenswear Brand Story',
      description: 'Discover the story behind The Modesse - a premium contemporary womenswear brand crafting handcrafted designer clothing from finest Indian fabrics. Learn about our sustainable fashion philosophy and commitment to quality.',
      keywords: 'about The Modesse, premium womenswear brand, sustainable fashion, handcrafted clothing, Indian designer brand, contemporary fashion brand, luxury clothing brand, ethical fashion, slow fashion, artisan-made clothing',
      schema: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "The Modesse",
        "url": "https://themodesse.com/about",
        "description": "Premium contemporary womenswear brand crafting handcrafted designer clothing from finest Indian fabrics",
        "foundingDate": "2020",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-93001-25126",
          "contactType": "customer service",
          "email": "hello@themodesse.com"
        }
      }
    },

    contact: {
      title: 'Contact The Modesse | Premium Womenswear Customer Support',
      description: 'Get in touch with The Modesse customer support team. We\'re here to help with orders, product inquiries, shipping, and any questions about our premium contemporary womenswear collection.',
      keywords: 'contact The Modesse, customer support, premium womenswear support, order help, product inquiries, shipping information, customer service, The Modesse contact',
      schema: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact The Modesse",
        "description": "Get in touch with The Modesse customer support team for orders, product inquiries, and assistance",
        "url": "https://themodesse.com/contact",
        "mainEntity": {
          "@type": "Organization",
          "name": "The Modesse",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-93001-25126",
            "contactType": "customer service",
            "email": "hello@themodesse.com",
            "availableLanguage": "English"
          }
        }
      }
    }
  },

  // Product schema generator
  generateProductSchema: (product) => {
    if (!product) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `${product.name} - Premium contemporary womenswear from The Modesse`,
      "url": `https://themodesse.com/product/${product.slug}`,
      "image": product.images || [],
      "brand": {
        "@type": "Brand",
        "name": "The Modesse"
      },
      "category": product.category?.name || "Contemporary Womenswear",
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "INR",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": `https://themodesse.com/product/${product.slug}`,
        "seller": {
          "@type": "Organization",
          "name": "The Modesse"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.review_count || 0
      } : undefined,
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Material",
          "value": "Khadi, Handloom, Pure Cotton"
        },
        {
          "@type": "PropertyValue",
          "name": "Made In",
          "value": "India"
        },
        {
          "@type": "PropertyValue",
          "name": "Style",
          "value": "Contemporary"
        }
      ]
    };
  },

  // Collection schema generator
  generateCollectionSchema: (category, products) => {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${category} Collection | Premium Contemporary Womenswear - The Modesse`,
      "description": `Explore our exclusive ${category} collection featuring premium contemporary womenswear. Handcrafted designer clothing made from finest Indian fabrics.`,
      "url": `https://themodesse.com/shop/${category}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": products?.length || 0,
        "itemListElement": products?.slice(0, 10).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "url": `https://themodesse.com/product/${product.slug}`,
            "image": product.images?.[0] || '/src/assets/images/themodesse.jpg',
            "brand": {
              "@type": "Brand",
              "name": "The Modesse"
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "INR",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "url": `https://themodesse.com/product/${product.slug}`
            }
          }
        })) || []
      }
    };
  }
};

// Utility function to generate meta tags
export const generateMetaTags = (pageType, customData = {}) => {
  const config = SEO_CONFIG.pages[pageType] || SEO_CONFIG.default;
  
  return {
    title: customData.title || config.title,
    description: customData.description || config.description,
    keywords: customData.keywords || config.keywords,
    image: customData.image || config.image,
    url: customData.url || config.url,
    schema: customData.schema || config.schema
  };
};

// Utility function to update page title
export const updatePageTitle = (title) => {
  document.title = title;
};

// Utility function to update meta description
export const updateMetaDescription = (description) => {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}; 