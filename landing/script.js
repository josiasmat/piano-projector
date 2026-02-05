// Auto language detection and redirect
(function() {

    // Don't redirect if user has already visited a non-root page
    const currentPath = window.location.pathname;
    if ( currentPath !== '/' && currentPath !== '/index.html' ) {
        sessionStorage.setItem('langVisited', 'true');
        return;
    }

    // Only redirect on first visit from root
    if ( sessionStorage.getItem('langVisited') ) return;

    // Get available languages from <link rel="alternate" hreflang=...> tags
    const availableLangs = Array.from(
        document.querySelectorAll('link[rel="alternate"][hreflang]')
    ).map((link) => {
        return { 
            code: link.getAttribute("hreflang"),
            url: link.getAttribute("href")
        }
    });

    // Get user preferred language
    const userLang = navigator.language || navigator.userLanguage;
    
    // Test every available language
    for ( const { code, url } of availableLangs ) {
        if (userLang.startsWith(code) ) {
            sessionStorage.setItem('langVisited', 'true');
            window.location.href = url;
            return;
        }
    }
})();
