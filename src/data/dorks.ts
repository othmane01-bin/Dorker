export type LibraryId = 'logins' | 'admin' | 'directories' | 'sensitive' | 'subdomains';

export interface DorkTemplate {
  id: string;
  title: string;
  description: string;
  query: string;
  needsKeyword?: boolean;
}

export interface DorkCategory {
  id: LibraryId;
  index: string;
  title: string;
  accent: string;
  description: string;
  templates: DorkTemplate[];
}

export const DORK_CATEGORIES: Record<LibraryId, DorkCategory> = {
  logins: {
    id: 'logins',
    index: '03',
    title: 'Login',
    accent: 'Finder',
    description: 'Locate sign-in, registration, and password-reset pages exposed on a domain.',
    templates: [
      {
        id: 'login-portals',
        title: 'Login portals',
        description: 'Pages whose title or URL points to a sign-in form.',
        query: 'site:{target} (intitle:login OR intitle:"sign in" OR inurl:login OR inurl:signin)',
      },
      {
        id: 'admin-login',
        title: 'Admin login',
        description: 'Administrative sign-in pages on the target domain.',
        query:
          'site:{target} (inurl:admin OR inurl:administrator) (intitle:login OR intitle:"sign in")',
      },
      {
        id: 'password-reset',
        title: 'Password reset',
        description: 'Reset and account-recovery forms that reveal user accounts.',
        query:
          'site:{target} (inurl:password-reset OR inurl:forgot-password OR intitle:"reset password")',
      },
      {
        id: 'sso',
        title: 'Single sign-on',
        description: 'SSO, OAuth, and identity-provider entry points.',
        query: 'site:{target} (inurl:sso OR inurl:oauth OR intitle:"single sign-on")',
      },
      {
        id: 'registration',
        title: 'Registration pages',
        description: 'Sign-up pages leaked into search indexes.',
        query: 'site:{target} (inurl:register OR inurl:signup OR intitle:"create account")',
      },
      {
        id: 'webmail',
        title: 'Webmail portals',
        description: 'Webmail clients such as Roundcube hosted on the domain.',
        query: 'site:{target} (inurl:webmail OR intitle:webmail OR inurl:roundcube)',
      },
      {
        id: 'keyword-login',
        title: 'Keyword login',
        description: 'Combine a project or product keyword with login signals.',
        query: 'site:{target} "{keyword}" (inurl:login OR intitle:login)',
        needsKeyword: true,
      },
    ],
  },
  admin: {
    id: 'admin',
    index: '04',
    title: 'Admin',
    accent: 'Panels',
    description: 'Find management consoles, dashboards, and control panels on a target.',
    templates: [
      {
        id: 'admin-paths',
        title: 'Admin directories',
        description: 'Paths containing admin or administrator.',
        query: 'site:{target} (inurl:admin OR inurl:administrator)',
      },
      {
        id: 'admin-titles',
        title: 'Admin panels',
        description: 'Pages titled as an admin panel or administration area.',
        query: 'site:{target} (intitle:"admin panel" OR intitle:administration)',
      },
      {
        id: 'dashboards',
        title: 'Dashboards',
        description: 'Analytics and operations dashboards exposed to search.',
        query: 'site:{target} (intitle:dashboard OR inurl:dashboard)',
      },
      {
        id: 'wordpress',
        title: 'WordPress admin',
        description: 'Default WordPress administration paths.',
        query: 'site:{target} inurl:wp-admin',
      },
      {
        id: 'phpmyadmin',
        title: 'phpMyAdmin',
        description: 'Database management interfaces left reachable.',
        query: 'site:{target} (inurl:phpmyadmin OR intitle:phpmyadmin)',
      },
      {
        id: 'control-panels',
        title: 'Control panels',
        description: 'Hosting and infrastructure control panels.',
        query: 'site:{target} (intitle:"control panel" OR intitle:"control center")',
      },
      {
        id: 'cpanel',
        title: 'cPanel and Adminer',
        description: 'Common hosting and database management tools.',
        query: 'site:{target} (inurl:cpanel OR inurl:adminer OR inurl:webmail)',
      },
      {
        id: 'keyword-admin',
        title: 'Keyword admin',
        description: 'Pair a keyword with admin signals to narrow the surface.',
        query: 'site:{target} "{keyword}" (inurl:admin OR intitle:admin)',
        needsKeyword: true,
      },
    ],
  },
  directories: {
    id: 'directories',
    index: '05',
    title: 'Directory',
    accent: 'Listings',
    description: 'Surface open directory listings and the files they accidentally expose.',
    templates: [
      {
        id: 'open-dirs',
        title: 'Open directories',
        description: 'Directory listings indexed by the search engine.',
        query: 'site:{target} intitle:"index of"',
      },
      {
        id: 'parent-dir',
        title: 'Parent directory',
        description: 'Classic Apache-style directory listing signature.',
        query: 'site:{target} intitle:"index of" "parent directory"',
      },
      {
        id: 'backup-dirs',
        title: 'Backup folders',
        description: 'Directories named backup or backups.',
        query: 'site:{target} intitle:"index of" (backup OR backups)',
      },
      {
        id: 'upload-dirs',
        title: 'Upload folders',
        description: 'File upload directories exposed to the public.',
        query: 'site:{target} intitle:"index of" (uploads OR upload)',
      },
      {
        id: 'server-listings',
        title: 'Server listings',
        description: 'Server-generated listings with a "Server at" footer.',
        query: 'site:{target} intitle:"index of" "server at"',
      },
      {
        id: 'database-dirs',
        title: 'Database dumps',
        description: 'Directory listings containing SQL or dump files.',
        query: 'site:{target} intitle:"index of" (sql OR dump)',
      },
      {
        id: 'keyword-dir',
        title: 'Keyword folders',
        description: 'Open directories matching a keyword.',
        query: 'site:{target} intitle:"index of" "{keyword}"',
        needsKeyword: true,
      },
    ],
  },
  sensitive: {
    id: 'sensitive',
    index: '06',
    title: 'Sensitive',
    accent: 'Files',
    description: 'Hunt for configuration, backup, log, and credential files that should never be indexed.',
    templates: [
      {
        id: 'env-files',
        title: 'Environment files',
        description: 'Exposed .env files that may contain secrets.',
        query: 'site:{target} (filetype:env OR inurl:.env)',
      },
      {
        id: 'sql-dumps',
        title: 'SQL dumps',
        description: 'Database exports containing INSERT statements.',
        query: 'site:{target} filetype:sql "INSERT INTO"',
      },
      {
        id: 'log-files',
        title: 'Log files',
        description: 'Publicly indexed logs that can leak paths and tokens.',
        query: 'site:{target} filetype:log',
      },
      {
        id: 'backup-archives',
        title: 'Backup archives',
        description: 'Backup, old, and ZIP archives exposed on the domain.',
        query:
          'site:{target} (filetype:bak OR filetype:backup OR filetype:old OR filetype:zip)',
      },
      {
        id: 'config-files',
        title: 'Configuration files',
        description: 'YAML, INI, and config files mentioning secrets.',
        query:
          'site:{target} (filetype:yml OR filetype:yaml OR filetype:ini OR filetype:conf) (intext:password OR intext:secret)',
      },
      {
        id: 'private-keys',
        title: 'Private keys',
        description: 'PEM, KEY, P12, and PFX key material.',
        query: 'site:{target} (filetype:pem OR filetype:key OR filetype:p12 OR filetype:pfx)',
      },
      {
        id: 'credentials',
        title: 'Credentials in text',
        description: 'Plain-text and config files referencing usernames or passwords.',
        query:
          'site:{target} (filetype:txt OR filetype:cfg) (intext:"password" OR intext:"username")',
      },
      {
        id: 'db-files',
        title: 'Database files',
        description: 'SQLite and database files sitting on a web server.',
        query: 'site:{target} (filetype:sql OR filetype:db OR filetype:sqlite)',
      },
      {
        id: 'keyword-sensitive',
        title: 'Keyword secrets',
        description: 'Search sensitive extensions for a project keyword.',
        query: 'site:{target} "{keyword}" (filetype:env OR filetype:sql OR filetype:log)',
        needsKeyword: true,
      },
    ],
  },
  subdomains: {
    id: 'subdomains',
    index: '07',
    title: 'Subdomain',
    accent: 'Recon',
    description: 'Map indexed subdomains and find the services running on them.',
    templates: [
      {
        id: 'all-subdomains',
        title: 'All subdomains',
        description: 'Indexed subdomains, excluding the www host.',
        query: 'site:*.{target} -site:www.{target}',
      },
      {
        id: 'subdomain-login',
        title: 'Subdomain logins',
        description: 'Login pages hosted on subdomains.',
        query: 'site:*.{target} (inurl:login OR intitle:login)',
      },
      {
        id: 'subdomain-admin',
        title: 'Subdomain admin',
        description: 'Admin paths on subdomains.',
        query: 'site:*.{target} inurl:admin',
      },
      {
        id: 'dev-staging',
        title: 'Dev and staging',
        description: 'Non-production hosts indexed with dev, staging, or test.',
        query: 'site:*.{target} (inurl:dev OR inurl:staging OR inurl:test)',
      },
      {
        id: 'subdomain-docs',
        title: 'Subdomain documents',
        description: 'PDFs and documents hosted on subdomains.',
        query: 'site:*.{target} filetype:pdf',
      },
      {
        id: 'subdomain-dirs',
        title: 'Subdomain directories',
        description: 'Open directory listings across subdomains.',
        query: 'site:*.{target} intitle:"index of"',
      },
      {
        id: 'keyword-subdomain',
        title: 'Keyword subdomains',
        description: 'Find a keyword across every indexed subdomain.',
        query: 'site:*.{target} "{keyword}"',
        needsKeyword: true,
      },
    ],
  },
};

export function isLibraryId(value: string): value is LibraryId {
  return Object.prototype.hasOwnProperty.call(DORK_CATEGORIES, value);
}
