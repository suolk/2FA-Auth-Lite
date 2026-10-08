// 网站名称 → URL 映射表
// key 统一小写，匹配时不区分大小写
export const SITE_URL_MAP = {
    // ========== Core Dev ==========
    github: "https://github.com",
    gitlab: "https://gitlab.com",
    bitbucket: "https://bitbucket.org",
    npm: "https://npmjs.com",
    docker: "https://hub.docker.com",
    heroku: "https://heroku.com",
    vercel: "https://vercel.com",
    netlify: "https://netlify.com",
    cloudflare: "https://cloudflare.com",
    digitalocean: "https://digitalocean.com",
    stripe: "https://stripe.com",

    // ========== Big Tech ==========
    google: "https://google.com",
    microsoft: "https://microsoft.com",
    apple: "https://appleid.apple.com",
    amazon: "https://amazon.com",

    // ========== Cloud Platforms ==========
    aws: "https://aws.amazon.com",
    gcp: "https://cloud.google.com",
    azure: "https://azure.microsoft.com",
    oracle: "https://cloud.oracle.com",
    linode: "https://linode.com",
    fastly: "https://fastly.com",

    // ========== Social ==========
    twitter: "https://twitter.com",
    x: "https://x.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    reddit: "https://reddit.com",
    linkedin: "https://linkedin.com",
    discord: "https://discord.com",
    slack: "https://slack.com",
    twitch: "https://twitch.tv",

    // ========== AI / Dev AI ==========
    openai: "https://platform.openai.com",
    chatgpt: "https://chat.openai.com",
    anthropic: "https://console.anthropic.com",
    claude: "https://claude.ai",
    huggingface: "https://huggingface.co",
    replicate: "https://replicate.com",

    // ========== Dev Tools ==========
    figma: "https://figma.com",
    jira: "https://atlassian.com/software/jira",
    atlassian: "https://id.atlassian.com",
    sentry: "https://sentry.io",
    supabase: "https://supabase.com",
    firebase: "https://firebase.google.com",
    notion: "https://notion.so",

    // ========== Security / Identity ==========
    auth0: "https://auth0.com",
    okta: "https://okta.com",
    "1password": "https://1password.com",
    lastpass: "https://lastpass.com",

    // ========== Crypto / Finance ==========
    paypal: "https://paypal.com",
    coinbase: "https://coinbase.com",
    binance: "https://binance.com",
    kraken: "https://kraken.com",
    bybit: "https://bybit.com",
    kucoin: "https://kucoin.com",
    okx: "https://okx.com",

    // ========== Storage / Productivity ==========
    dropbox: "https://dropbox.com",
    box: "https://box.com",
    "google drive": "https://drive.google.com",

    // ========== Gaming / Entertainment ==========
    steam: "https://store.steampowered.com",
    epicgames: "https://epicgames.com",
    xbox: "https://xbox.com",
    playstation: "https://playstation.com",
    spotify: "https://spotify.com",
    netflix: "https://netflix.com",

    // ========== Commerce ==========
    ebay: "https://ebay.com",
    shopify: "https://shopify.com",
    alibaba: "https://alibaba.com",

    // ========== Misc Dev Infra ==========
    nginx: "https://nginx.com",
    mongodb: "https://mongodb.com",
    redis: "https://redis.io",
    elastic: "https://elastic.co"
};

export function lookupSiteUrl(siteName) {
    if (!siteName) return "";
    return SITE_URL_MAP[siteName.toLowerCase().trim()] ?? "";
}
