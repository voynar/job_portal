## JobPortal WebApp

### Objective
A project done for my boss so I wouldn't have to hear about the costs of Indeed. Secondly, it was a chance to explore Django REST framework and React, as well as implement solid security practices on a production server.

### Project Setup
Unless specified otherwise, all CLI commands are executed on your Linux server. If you are on a Windows machine, or have a Windows server, please share your instructions with me!

_**Dev environment:**_
  - OS: macOS BigSur v11.7.10, 2.3GHz Quad-Core IntelCore i7
  - WebServer: Apache/2.4.56 (Unix) built Apr 12 2023 20:59:26
  - RAM: 16GB 1600MHz DDR3
  - PHP: 8.0.30 (cli) (built: Nov 17 2023 23:33:50)
  - Python: 3.12.1
  - MySQL: 11.2.2-MariaDB, client 15.2 for osx10.16 (x86_64) using  EditLine wrapper

_**Linux server:**_
  - OS: Debian 11 x64 (bullseye)
  - WebServer: nginx/1.18.0
  - RAM: 1024MB
  - Storage: 25GB SSD
  - PHP: 8.3.2-1+0~20240120.16+debian11~1.gbpb43448 (cli) (built: Jan 20 2024 14:17:59) (NTS)
  - Python: 3.9.2
  - MySQL: 11.1.4-MariaDB, client 15.2 for debian-linux-gnu (x86_64) using  EditLine wrapper


Let's start with _**Python and Django:**_
- Django will handle the registration and tokenization of each new user and login/logout of existing users.
- It will also handle the RestAPI endpoints.
- My username is admin and my home directory is `/home/admin/`. `mkdir` something like `project` and `cd` into that directory. Then:
```
  $ python3 -m venv venv
  $ source venv/bin/activate
  $ pip install django djangorestframework django-cors-headers uwsgi
  $ pip install psycopg2 // for optional PostgreSQL compatibility
  $ sudo apt-get install gcc python3.X-dev
  $ pip freeze > requirements.txt
  $ django-admin startproject job_listings
  $ cd job_listings
  $ python manage.py startapp positions
```
- When ready, you can verify that your Django website is ready for production:
```
  $ python manage.py check --deploy
```
- The entire `settings.py` file is included in the project, but here are some key moments!:
```
  # Generate secret_key and store it in project root directory with only read permissions
  #   set for 'admin' (or your user/group names):
  with open(os.path.join(BASE_DIR, 'secret_key.txt')) as f:
      SECRET_KEY = f.read().strip()
  DEBUG = False
  ALLOWED_HOSTS = ['site.org', 'www.site.org'] # ONLY Serve your domain!
  INSTALLED_APPS = [
      # ... default django apps
      'rest_framework',
      'rest_framework.authtoken',
      # 'rest_framework_simplejwt', # I havn't experimented on this project with JWT
      'corsheaders',
      'positions',
  ]
  MIDDLEWARE = [
      'corsheaders.middleware.CorsMiddleware',
      # ... rest of middleware pkgs
  ]
  CORS_ALLOWED_ORIGINS = [
      'https://site.org',
      'https://www.site.org',
  ]
  CORS_ALLOW_ALL_ORIGINS = False
  CORS_ALLOW_CREDENTIALS = True
  REST_FRAMEWORK = {
      'DEFAULT_AUTHENTICATION_CLASSES': [
          'rest_framework.authentication.TokenAuthentication',
          # put your JWT authentication class here!
      ],
  }
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.mysql',
          'NAME': 'dbName', # your db name!
          'USER': 'you',
          'PASSWORD': 'your_password',
          'HOST': 'localhost',
          'PORT': '',
      }
  }
  STATIC_URL = "/static/"
  STATIC_ROOT = os.path.join(BASE_DIR, "static")
  SESSION_COOKIE_SECURE = True
  CSRF_COOKIE_SECURE = True
  SECURE_SSL_REDIRECT = True
  SECURE_HSTS_SECONDS = 31536000 # 1 year
  SECURE_HSTS_PRELOAD = True
  SECURE_HSTS_INCLUDE_SUBDOMAINS = True
```

- Register models for each application (positions, user_app).
- Each app contains a directory `api/` that contains the permissions.py (for positions app), serializers.py, urls.py, and views.py.
- My `/job_postings/positions/models.py` file sets up the fields `title, description, requisites, salary, and availability` but any fields will work:
```
  title = models.CharField(max_length=50)
  description = models.TextField()
  requisites = models.TextField()
  availability = models.DateField()
  salary = models.IntegerField()
```
- Main resource for configuring Nginx with Django and uwsgi:
    - https://tonyteaches.tech/django-nginx-uwsgi-tutorial/
- Lessons the HARD WAY!:
    - the React, Django, and Django API Backend all need their root & static directories explicitly defined.
    - the React root `/` is the main point of entry for the application, and the static directories use aliases.
    - the Django API backend static directories all have `uwsgi_pass django;` as an argument.
- Create your `uwsgi_params` file as referenced under 'Proxy API Requests' in your nginx config file:
```
  # Do the same for the 'positions' and 'account' blocks
  location /admin/ {
      uwsgi_pass django;
      include /home/admin/django/job_postings/uwsgi_params;
  }
```
- Publish changes to config file:
```
  $ sudo ln -s /etc/nginx/sites-available/job_postings.conf /etc/nginx/sites-enabled/
```
- Edit `settings.py` to explicitly tell Nginx where our static files reside.
- Tell Django to put all static files in the static folder:
```
  $ python manage.py collectstatic
```
- Congigure uwsgi for production creating `job_postings_uwsgi.ini` at the root of your Django application.
    - This puts all the necessary command line arguments in a unified configuration file.
- Start up uwsgi and specify the `ini` file:
```
  $ uwsgi --ini job_postings_uwsgi.ini
```
- Monitor the uwsgi config file directory for changes by running it in emperor mode:
```
  $ mkdir /home/admin/django/venv/vassals/
  $ sudo ln -s /home/admin/django/job_postings/job_postings_uwsgi.ini /home/admin/django/venv/vassals/
  $ uwsgi --emperor /home/admin/django/venv/vassals --uid www-data --gid www-data
```
- Create a systemd service file `/etc/systemd/system/emperor.uwsgi.service` to start uwsgi when the system boots:
```
  [Unit]
  Description=uwsgi emperor for job_postings website
  After=network.target
  [Service]
  User=admin
  Restart=always
  ExecStart=/home/admin/django/venv/bin/uwsgi --emperor /home/admin/django/venv/vassals --uid www-data --gid www-data
  [Install]
  WantedBy=multi-user.target
```
- Enable and start the service:
```
  $ systemctl enable emperor.uwsgi.service
  $ systemctl start emperor.uwsgi.service
```
- Check the status:
```
  $ sudo systemctl status emperor.uwsgi.service
```
- Restart your server:
```
  $ sudo systemctl restart nginx.service
```

_**React:**_
- (Nginx) Requests to the root path `/` are served by the React frontend.
- Setup your project: :star:Done in Development Environment!:star:
```
  $ npx create-react-app app_name
  $ cd app_name && npm install react axios react-router-dom
  $ npm install -D tailwindcss
  $ npx tailwindcss init
```
- Update tailwind.config.js:
```
  /** @type {import('tailwindcss').Config} */
  module.exports = {
      content: ["./src/**/*.{html,js}"],
      theme: {
          extend: {},
      },
      plugins: [],
  }
```
- Write components, hooks, pages, and Routes.
- Uses asynchronous call to Django `http://localhost:8000/...`.
- The token that is generated when a user logs in is the one used to authenticate any changes that are made `POST|PUT|DELETE` and stored in the user's browser's local storage `access_token` variable.
- It was almost stupid challenging to figure out how to handle the appended `/` to the address so that it would NOT conflict with my `urls.py` paths. ALSO, in Django `settings.py` we need to set the `ALLOWED_HOSTS` to `your_website.com`. In contrast, on the React frontend we reference the specific port `8000` on the local machine `localhost`.
- Write and test React code in your :star:development environment:star:, build, then upload to your server.
- Build:
```
  $ npm run build
```
- Push to production server. The location will be the one set in your `/etc/nginx/sites-enabled/<your_config.conf` file:
```
  $ sudo rsync -vrP /your/react/build/dir/ you@your_server:/destination/directory/
```
```
  server {
        listen 80;
        server_name site.org www.site.org;
        root /var/www/site/build;            # <-- Right Here!
        charset utf-8;
        
        # ... rest of server block
    }
```

_**PHP:**_
- Resources:
  - 'https://phppot.com/php/sending-email-using-phpmailer-with-gmail-xoauth2/'
  - 'https://developers.google.com/gmail/imap/xoauth2-protocol'
- Check installed PHP-FPM packages:
```
  $ sudo dpkg -l | grep 'php-fpm'
```
  or
```
  $ php-fpm -v
```
- Check service status:
```
  $ sudo systemctl status php-fpm
```
- Create a directory for your secrets and set the ownership to the web server user:
```
  $ sudo mkdir /var/www/site/secrets/
  $ sudo chown www-data:www-data /var/www/site/secrets/
  $ sudo chmod 700 /var/www/site/secrets/
  $ sudo mv /path/to/client_secret.json /var/www/site/secrets/
```
- Serve your PHP files within the Nginx document root, for example:
    - In `ApplyToday.js`:
    ```
      'http://localhost:8888/send-mail.php'
    ```
- Enable Gmail API to utilize SMTP server for `send-mail.php`:
    - Generate API keys (Client ID & Client Secret) in cloud platform console.
    - Obtaining OAuth2 access tokens for Google's SMTP service:
        - Go to your `https://console.cloud.google.com/apis/...` and setup an OAuth consent screen and credentials.
        - Authorized redirect URI, `https://site.org/get_oauth_token.php` (for User authentication, you!).
- Ensure that the PHP scripts are executable by your web server user:
```
  $ chmod +x /var/www/site/php/get_oauth_token.php
```
- Navigate to the PHP root folder `/var/www/site/php/` and run:
```
  $ php composer-setup.php --install-dir=bin --filename-composer
  $ composer require phpmailer/phpmailer
  $ composer require league/oauth2-google
```

- Include CORS headers in `send-mail.php`:
```
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
```
- PHP will be responsible for secure communication between the frontend and backend validation in `validate.php`.
- Write your `/var/www/config.php` file and include it in `/var/www/site/php/class-db.php`:
```
  <?php
  
  return [
      'client_id' => 'your_client_id,
      'client_secret' => 'your_client_secret',
      'dbUsername' => 'admin',
      'dbPassword' => 'your_password',
      'dbName' => 'db_name',
  ];
```
- At some point, confirm php-fpm's master & worker processes are running:
```
  $ ps aux | grep 'php'
```
- Example output:
```
  root     2659666  0.0  0.4 199392  4672 ?        Ss   Jan21   2:44 php-fpm: master process (/etc/php/8.3/fpm/php-fpm.conf)
  www-data 2659667  0.0  0.0 199792   540 ?        S    Jan21   0:00 php-fpm: pool www
  www-data 2659668  0.0  0.0 199792   560 ?        S    Jan21   0:00 php-fpm: pool www
  admin    3277888  0.0  0.0   6340   644 pts/0    S+   14:33   0:00 grep
```

- PHP block in Nginx config file should look like:
```
  location ~ \.php$ {
      alias /var/www/site/php/;
      include snippets/fastcgi-php.conf;
      include fastcgi_params;
      fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;     # Does it match!?
      fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
  }
```
- Confirm the php-fpm version on your server matches the config file.
- Keep your PHP files within the web server's document root or a directory that's specifically configured to serve PHP files.
    - It keeps the server's file structure information secure, as well as provides portability & maintainability.

_**MySQL:**_
- Install MySQL (MariaDB) on your server and configure database name, user, password, and host.
- Verify the current status of the MariaDB service:
```
  $ sudo systemctl status mariadb
```
- Grant the necessary privileges to the `admin` user.
- Make sure to update the `DATABASES` object in `settings.py`:
```
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.mysql',
          'NAME': 'oauth',
          'USER': '<you>',
          'PASSWORD': '<your_pwd>',
          'HOST': 'localhost',
          'PORT': '',
      }
  }
```

_**Nginx/etc:**_
- The permissions for files and directories on your web server should generally be set to a user and group that the web server process has permission to access. In the case of Nginx running on many Linux distributions, the user and group is often `www-data`.
    - To allow the `www-data` user (which Nginx typically runs as) access to your Django static files located at `/home/admin/django/job_postings/static/`, you'll need to ensure that the directory and files have the appropriate permissions: (this is tentative, because you may already have these set appropriately)
        - Change the ownership of the static directory to the `www-data` user and group:
        ```
          $ sudo chown -R www-data:www-data /home/admin/django/job_postings/static
        ```
        - Ensure that the `www-data` user has read permissions on the static files:
        ```
          $ sudo chmod -R 755 /home/admin/django/job_postings/static
        ```
        - Restart Nginx after changing permissions, changing config files, etc:
        ```
          $ sudo systemctl restart nginx.service
        ```
        - If your server is using `SELinux`, you may also need to configure SELinux settings to allow Nginx to access the static files:
        ```
          $ sudo chcon -R -t httpd_sys_content_t /home/admin/django/job_postings/static
        ```

- React's static files are located in `/static` (`alias /var/www/site/build/static/;`)
- Django's static files are located in `/static/admin/` (`alias /home/admin/django/job_postings/static/admin/;`) and `/static/rest-framework` (`alias /home/admin/django/job_postings/static/rest-framework/;`)
- uwsgi communicates with Nginx through a Unix socket file rather than a network port (i.e. `uwsgi_pass unix:/path/to/your/uwsgi/socket;`)
- The location blocks forward requests to the uWSGI application using the uwsgi_pass directive.
    - The location blocks should match your project's `urls.py` paths.
- Acquire an `HTTPS` certificate. I used `certbot` & `letsencrypt`, which automatically appends the SSL/TLS info directly to your Nginx conf file(s).
- I used `rsync` to copy my React 'build' files to my server:
```
    $ rsync -vrP /path/to/build/ you@server.org:/home/admin/1wherever/
```
- Check these file permissions after uploading. After moving to `/var/www/`, I needed to:
```
    $ sudo chown www-data:www-data <files>
```

### Thank you for checking out my project! It was a lot of fun. Please give any feedback about the code as well as this README.md document.

_**Folder hierarchy:**_
```
  ├── job_postings/
  |   ├── job_postings/
  │       ├── __pycache__/
  │       ├── asgi.py
  │       ├── __init__.py
  │       ├── settings.py
  │       ├── urls.py
  │       └── wsgi.py
  |   ├── positions/
  │       ├── api/
  │           ├── __pycache__/
  │           ├── permissions.py
  │           ├── serializers.py
  │           ├── urls.py
  │           └── views.py
  |   ├── static/
  │       ├── admin/
  |           ├── css/
  |           ├── img/
  |           ├── js/
  │       ├── rest_framework/
  |           ├── css/
  |           ├── docs/
  |           ├── fonts/
  |           ├── img/
  |           ├── js/
  |   ├── user_app/
  │       ├── api/
  │           ├── __pycache__/
  │           ├── serializers.py
  │           ├── urls.py
  │           └── views.py
  │       ├── migrations/
  │       ├── __pycache__/
  │       ├── admin.py
  │       ├── apps.py
  │       ├── __init__.py
  │       ├── models.py
  │       ├── tests.py
  │       └── views.py
  │   ├── db.sqlite
  │   ├── job_postings.sock
  │   ├── job_listings_uwsgi.ini
  │   ├── manage.py
  │   ├── secret_key.txt
  │   └── uwsgi_params
  ├── venv/
  │   ├── bin/
  │   ├── include/
  │   ├── lib/
  │   ├── lib64
  │   ├── pyvenv.cfg
  │   ├── share/
  │   ├── vassals/
  │       └── job_listings_uwsgi.ini
```
- React folder structure before build:
```
  ├── solar-admin/
  |   ├── node_modules/
  |   ├── public/
  │       ├── favicon.ico
  │       ├── index.html
  │       ├── logo192.png
  │       ├── logo512.png
  │       ├── manifest.json
  │       └── robots.txt
  |   ├── src/
  │       ├── assets/
  │           ├── images/
  │           └── logo.png
  │       ├── components/
  │           ├── Button.js
  │           ├── Card.js
  │           ├── Footer.js
  │           ├── Header.js
  │           ├── index.js
  │           └── UserContext.js
  │       ├── hooks/
  │           ├── index.js
  │           ├── useFetch.js
  │           └── useTitle.js
  │       ├── pages/
  │           ├── AddJobForm.js
  │           ├── AdminLogin.js
  │           ├── ApplyToday.js
  │           ├── index.js
  │           ├── JobDetailApp.js
  │           ├── JobHome.js
  │           ├── PageNotFound.js
  │           ├── SuccessPage.js
  │           └── UpdateJob.js
  │       ├── Routes/
  │           └── AllRoutes.js
  │       ├── App.css
  │       ├── App.js
  │       ├── index.css
  │       └── index.js
  │   ├── .gitignore
  │   ├── package-lock.json
  │   ├── package.json
  │   ├── README.md
  │   └── tailwind.config.js
```
- After build on production server: `/var/www/site/`
```
  ├── build/
  │   ├── asset-manifest.json
  │   ├── favicon.ico
  │   ├── index.html
  │   ├── logo192.png
  |   ├── logo512.png
  │   ├── index.html
  │   ├── manifest.json
  |   ├── robots.txt
  |   ├── static/
  │       ├── css/
  │       ├── js/
  │       ├── media/
```
- Also in `/var/www/site/`:
```
  ├── php/
  │   ├── class-db.php
  │   ├── composer.json
  │   ├── composer.lock
  │   ├── get_oauth_token.php
  |   ├── send-mail.php
  │   ├── test.php
  │   ├── validate.php
  |   ├── vendor/
  │       ├── autoload.php
  │       ├── composer/
  │       ├── guzzlehttp/
  │       ├── league/
  │       ├── paragonie/
  │       ├── phpmailer/
  │       ├── psr/
  │       ├── ralouphie/
  │       ├── symfony/
  ├── secrets/
  │   └── client_secret.json
```
- One home cpu (for reference):
```
  ├── live_server_files/
  │   ├── emperor.uwsgi.service
  │   ├── full_config.conf.BAK
  │   ├── job_postings_uwsgi.ini
  │   ├── nginx_job_postings.conf
  │   ├── test.py
  |   ├── uwsgi_params
```



