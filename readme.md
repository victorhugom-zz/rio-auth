# rio-auth api

## A simple jwt generator and validator for user auth purpose

### dependencies: mongodb

---

- use

```npm run start --MONGO_URI=yourdatabase-uri --AUDIENCE=Token-Audience --ISSUER=Token-Issuer --EXPIRE_TIME=Expire-Time --APP_SECRET=secret```

params:

MONGO_URI - you database url

AUDIENCE - The token Audience, default: `myapp` 

ISSUER - The token issuer, default: `myapp`

EXPIRE_TIME - The token expire time in seconds, default: `60 * 60 * 24 * 30 // 1 month in seconds`

APP_SECRET - Some string used to add and revoke roles from users: 

#### methods:

* login

Do login if user has account otherwise create a new user, the password is hashed using bcrypt

```
/**
 * POST /api/v1/login
 * {
 *	"email":"me@email.com",
 *	"password": "qwerty"
 * }
 */
```

* validate
Validate a JWT

```
/**
 * POST /api/v1/validate
 * {
 *	"token":"token"
 * }
 */
 ```

 * grantrole
 Grant a role to an user (every user has the role user)

 ```
 /**
 * POST /api/v1/grantrole
 * {
 *  "role": "master of universe",
 *  "email": "me@email.com",
 *  "secret": "secret_token"
 * }
 */
 ```

* revokerole
 Revoke a role from the user
```
 /**
 * POST /api/v1/rovekerole
 * {
 *  "role": "master of universe",
 *  "email": "me@email.com",
 *  "secret": "secret_token"
 * }
 */
 ```