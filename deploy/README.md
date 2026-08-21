# AILIS Web Deployment

The public Web experience is built from the same source as the desktop UI and
deployed as an atomic release under `/var/www/ailis/releases`. The `current`
symlink is switched only after all files are uploaded.

## Deploy the current IP site

```powershell
./scripts/deploy-ailis-web.ps1
```

The script builds `dist`, writes `robots.txt` and `sitemap.xml`, rewrites
canonical and Open Graph URLs for the selected site, uploads one archive, and
keeps the previous release available for rollback.

## Deploy an owned domain

1. Point an `A` record for the domain to `101.133.239.56`.
2. Replace `__AILIS_DOMAIN__` in `ailis-domain.nginx.conf.template`.
3. Obtain a Let's Encrypt certificate for that domain.
4. Install the rendered config as `/etc/nginx/conf.d/ailis.conf` and run
   `nginx -t` before reload.
5. Deploy with the canonical URL:

```powershell
./scripts/deploy-ailis-web.ps1 -SiteUrl https://ailis.example.com
```

Do not reuse another product's domain or certificate. Domain registration and
DNS ownership remain an explicit operator step.
