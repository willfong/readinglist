# Heroku Express Auth0 PostgreSQL

### Initial Setup

```
git clone https://github.com/willfong/heroku-express-auth0-postgresql.git MyApp
cd MyApp
rm -rf .git
git init
npm install
heroku create
```

Set up the database:
```
heroku addons:create heroku-postgresql:hobby-dev
heroku config:get DATABASE_URL -s >> .env
npm run initdb
```

Create `.env` with the credentials from Auth0:
```
AUTH0_CLIENT_ID=ABC...123
AUTH0_DOMAIN=example-app.auth0.com
AUTH0_CLIENT_SECRET=ABC...123
AUTH0_CALLBACK_URL=http://localhost:5000/auth/callback
```

Copy the environment variables to Heroku:
```
heroku config:set AUTH0_CLIENT_ID=ABC...123
heroku config:set AUTH0_DOMAIN=example-app.auth0.com
heroku config:set AUTH0_CLIENT_SECRET=ABC...123
heroku config:set AUTH0_CALLBACK_URL=http://localhost:5000/auth/callback
```

Commit the code to the local repo and push to Heroku:
```
git add .
git commit -m "First commit"
git push heroku head
```


### Common Development Commands


- `heroku local web` - Start local development service


