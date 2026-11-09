/**
 * Karibase Auto SEO Script
 * Automatic SEO optimization for any website
 * @version 2.0.0
 */

class AutoSEO {
  constructor(options = {}) {
    this.options = {
      autoGenerate: options.autoGenerate !== undefined ? options.autoGenerate : true,
      updateMeta: options.updateMeta !== undefined ? options.updateMeta : true,
      updateOpenGraph: options.updateOpenGraph !== undefined ? options.updateOpenGraph : true,
      updateTwitter: options.updateTwitter !== undefined ? options.updateTwitter : true,
      generateSitemap: options.generateSitemap !== undefined ? options.generateSitemap : false,
      generateRobots: options.generateRobots !== undefined ? options.generateRobots : false,
      addStructuredData: options.addStructuredData !== undefined ? options.addStructuredData : true,
      optimizeImages: options.optimizeImages !== undefined ? options.optimizeImages : true,
      addCanonical: options.addCanonical !== undefined ? options.addCanonical : true,
      trackPerformance: options.trackPerformance !== undefined ? options.trackPerformance : true,
      debug: options.debug || false,
      ...options
    }

    this.pageData = this.extractPageData()
    this.init()
  }

  init() {
    if (this.options.autoGenerate) {
      this.generateAll()
    }

    if (this.options.trackPerformance) {
      this.trackPagePerformance()
    }

    this.log('Auto SEO initialized')
  }

  extractPageData() {
    return {
      title: document.title || '',
      description: this.getMetaContent('description') || this.extractDescription(),
      keywords: this.getMetaContent('keywords') || this.extractKeywords(),
      url: window.location.href,
      domain: window.location.hostname,
      path: window.location.pathname,
      language: document.documentElement.lang || 'en',
      author: this.getMetaContent('author') || '',
      images: this.extractImages(),
      headings: this.extractHeadings(),
      links: this.extractLinks(),
      wordCount: this.countWords(),
      readingTime: this.calculateReadingTime()
    }
  }

  getMetaContent(name) {
    const meta = document.querySelector(`meta[name="${name}"]`)
    return meta ? meta.content : ''
  }

  extractDescription() {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && metaDescription.content) {
      return metaDescription.content
    }

    const firstParagraph = document.querySelector('p')
    return firstParagraph ? firstParagraph.textContent.substring(0, 160) : ''
  }

  extractKeywords() {
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords && metaKeywords.content) {
      return metaKeywords.content
    }

    const headings = document.querySelectorAll('h1, h2, h3')
    const keywords = new Set()
    
    headings.forEach(heading => {
      const words = heading.textContent.toLowerCase().split(/\s+/)
      words.forEach(word => {
        if (word.length > 3) {
          keywords.add(word)
        }
      })
    })

    return Array.from(keywords).slice(0, 10).join(', ')
  }

  extractImages() {
    const images = Array.from(document.querySelectorAll('img'))
    return images.map(img => ({
      src: img.src,
      alt: img.alt || '',
      width: img.width,
      height: img.height
    })).filter(img => img.src)
  }

  extractHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    return Array.from(headings).map(h => ({
      tag: h.tagName,
      text: h.textContent
    }))
  }

  extractLinks() {
    const links = document.querySelectorAll('a[href]')
    return Array.from(links).map(link => ({
      href: link.href,
      text: link.textContent,
      external: !link.href.includes(window.location.hostname)
    }))
  }

  countWords() {
    const text = document.body.textContent || ''
    return text.trim().split(/\s+/).length
  }

  calculateReadingTime() {
    const wordsPerMinute = 200
    const minutes = Math.ceil(this.pageData.wordCount / wordsPerMinute)
    return minutes
  }

  generateAll() {
    if (this.options.updateMeta) {
      this.updateMetaTags()
    }

    if (this.options.updateOpenGraph) {
      this.updateOpenGraphTags()
    }

    if (this.options.updateTwitter) {
      this.updateTwitterTags()
    }

    if (this.options.addCanonical) {
      this.addCanonicalLink()
    }

    if (this.options.addStructuredData) {
      this.addStructuredData()
    }

    if (this.options.optimizeImages) {
      this.optimizeImages()
    }
  }

  updateMetaTags() {
    this.setMetaTag('description', this.pageData.description)
    this.setMetaTag('keywords', this.pageData.keywords)
    this.setMetaTag('author', this.pageData.author)
    this.setMetaTag('robots', 'index, follow')

    // Generate better title if needed
    if (this.pageData.title.length < 30 || this.pageData.title.length > 60) {
      const h1 = document.querySelector('h1')
      if (h1) {
        const newTitle = h1.textContent + ' | ' + this.pageData.domain
        document.title = newTitle.substring(0, 60)
      }
    }

    this.log('Meta tags updated')
  }

  setMetaTag(name, content) {
    if (!content) return

    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  updateOpenGraphTags() {
    this.setOGTag('og:title', this.pageData.title)
    this.setOGTag('og:description', this.pageData.description)
    this.setOGTag('og:url', this.pageData.url)
    this.setOGTag('og:type', 'website')
    this.setOGTag('og:locale', this.pageData.language)
    this.setOGTag('og:site_name', this.pageData.domain)

    if (this.pageData.images.length > 0) {
      this.setOGTag('og:image', this.pageData.images[0].src)
      this.setOGTag('og:image:alt', this.pageData.images[0].alt || this.pageData.title)
      if (this.pageData.images[0].width) {
        this.setOGTag('og:image:width', this.pageData.images[0].width)
        this.setOGTag('og:image:height', this.pageData.images[0].height)
      }
    }

    this.log('Open Graph tags updated')
  }

  setOGTag(property, content) {
    if (!content) return

    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  updateTwitterTags() {
    this.setTwitterTag('twitter:card', 'summary_large_image')
    this.setTwitterTag('twitter:title', this.pageData.title)
    this.setTwitterTag('twitter:description', this.pageData.description)
    this.setTwitterTag('twitter:url', this.pageData.url)

    if (this.pageData.images.length > 0) {
      this.setTwitterTag('twitter:image', this.pageData.images[0].src)
    }

    this.log('Twitter tags updated')
  }

  setTwitterTag(name, content) {
    if (!content) return

    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  addCanonicalLink() {
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = this.pageData.url

    this.log('Canonical link added')
  }

  addStructuredData() {
    // Add WebPage schema
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: this.pageData.title,
      description: this.pageData.description,
      url: this.pageData.url,
      inLanguage: this.pageData.language,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString()
    }

    // Add BreadcrumbList if there are breadcrumbs
    const breadcrumbs = document.querySelector('[data-breadcrumb]')
    if (breadcrumbs) {
      const breadcrumbList = this.generateBreadcrumbSchema()
      this.addSchema(breadcrumbList)
    }

    // Add Organization schema
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.pageData.domain,
      url: this.pageData.url
    }

    this.addSchema(webPageSchema)
    this.addSchema(orgSchema)

    this.log('Structured data added')
  }

  generateBreadcrumbSchema() {
    const breadcrumbItems = document.querySelectorAll('[data-breadcrumb-item]')
    if (breadcrumbItems.length === 0) return null

    const itemList = Array.from(breadcrumbItems).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.textContent,
      item: item.href || window.location.href
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: itemList
    }
  }

  addSchema(schema) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  }

  optimizeImages() {
    const images = document.querySelectorAll('img')
    
    images.forEach(img => {
      // Add alt text if missing
      if (!img.alt) {
        img.alt = this.generateAltText(img)
      }

      // Add loading attribute
      if (!img.loading) {
        img.loading = 'lazy'
      }

      // Add width and height if missing
      if (!img.width || !img.height) {
        this.setImageDimensions(img)
      }
    })

    this.log('Images optimized')
  }

  generateAltText(img) {
    const src = img.src
    const filename = src.split('/').pop().split('.')[0]
    return filename.replace(/[-_]/g, ' ')
  }

  setImageDimensions(img) {
    if (img.complete && img.naturalWidth) {
      img.width = img.naturalWidth
      img.height = img.naturalHeight
    } else {
      img.onload = function() {
        img.width = img.naturalWidth
        img.height = img.naturalHeight
      }
    }
  }

  generateSitemap() {
    const links = this.extractLinks()
    const sitemap = {
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      itemListElement: links.map(link => ({
        '@type': 'SiteNavigationElement',
        name: link.text,
        url: link.href
      }))
    }

    this.addSchema(sitemap)
    this.log('Sitemap generated')
  }

  generateRobots() {
    const robotsContent = 'User-agent: *\nAllow: /\nSitemap: ' + this.pageData.url + '/sitemap.xml'
    console.log('Robots.txt content:', robotsContent)
    this.log('Robots.txt generated (see console)')
  }

  trackPagePerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0]
          const metrics = {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            firstPaint: this.getMetric('first-paint'),
            firstContentfulPaint: this.getMetric('first-contentful-paint'),
            largestContentfulPaint: this.getLCP()
          }

          this.log('Performance metrics:', metrics)
          this.sendPerformanceData(metrics)
        }, 0)
      })
    }
  }

  getMetric(name) {
    const entry = performance.getEntriesByName(name)[0]
    return entry ? entry.startTime : null
  }

  getLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        return lastEntry.startTime
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
    return null
  }

  sendPerformanceData(metrics) {
    // Send to analytics service (implement as needed)
    this.log('Performance data ready to send:', metrics)
  }

  analyzeSEO() {
    const analysis = {
      title: {
        length: this.pageData.title.length,
        valid: this.pageData.title.length >= 30 && this.pageData.title.length <= 60,
        value: this.pageData.title
      },
      description: {
        length: this.pageData.description.length,
        valid: this.pageData.description.length >= 120 && this.pageData.description.length <= 160,
        value: this.pageData.description
      },
      headings: {
        h1Count: this.pageData.headings.filter(h => h.tag === 'H1').length,
        valid: this.pageData.headings.filter(h => h.tag === 'H1').length === 1
      },
      images: {
        total: this.pageData.images.length,
        withAlt: this.pageData.images.filter(img => img.alt).length,
        valid: this.pageData.images.every(img => img.alt)
      },
      links: {
        total: this.pageData.links.length,
        external: this.pageData.links.filter(link => link.external).length
      },
      wordCount: this.pageData.wordCount,
      readingTime: this.pageData.readingTime
    }

    this.log('SEO Analysis:', analysis)
    return analysis
  }

  log(...args) {
    if (this.options.debug) {
      console.log('[AutoSEO]', ...args)
    }
  }
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
  const seoElement = document.querySelector('[data-auto-seo]')
  if (seoElement) {
    const options = {
      autoGenerate: seoElement.dataset.autoGenerate !== 'false',
      updateMeta: seoElement.dataset.updateMeta !== 'false',
      updateOpenGraph: seoElement.dataset.updateOpenGraph !== 'false',
      updateTwitter: seoElement.dataset.updateTwitter !== 'false',
      addStructuredData: seoElement.dataset.addStructuredData !== 'false',
      optimizeImages: seoElement.dataset.optimizeImages !== 'false',
      debug: seoElement.dataset.debug === 'true'
    }

    window.autoSEO = new AutoSEO(options)
  }
})

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutoSEO
}
