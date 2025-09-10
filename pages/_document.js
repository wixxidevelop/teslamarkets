import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
        <Head>
            <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
            <link rel="icon" href="/icon.png" />
            {/* Smartsupp Live Chat script */}
            <script type="text/javascript" dangerouslySetInnerHTML={{
                __html: `
                    var _smartsupp = _smartsupp || {};
                    _smartsupp.key = 'c53ea0facf7a5a2577daf2952085d2849aac7536';
                    window.smartsupp||(function(d) {
                        var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                        s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                        c.type='text/javascript';c.charset='utf-8';c.async=true;
                        c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
                    })(document);
                `
            }} />
        </Head>
        <body>
            <noscript>Powered by <a href="https://www.smartsupp.com" target="_blank">Smartsupp</a></noscript>
            <Main />
            <NextScript />
        </body>
        </Html>
    )
}