requirements django + react

python3 -m venv venv

pip install django django djangorestframework django-cors-headers python-dotenv djangorestframework-simplejwt PyJWT psycopg2-binary

django-admin startproject backend
cd backend
python manage.py startapp api

In the settings.py, add the following: 
1) rest_framework, and corsheaders, and api in installed apps
2) in the middleware settings add 
	... "corsheaders.middleware.CorsMiddleware", ...
3) add this two line in the end:
	CORS_ALLOW_ALL_ORIGINS = True
	CORS_ALLOWS_CREDENTIALS = True
4) Add the following part
	REST_FRAMEWORK = {
	    "DEFAULT_AUTHENTICATION_CLASSES": (
		"rest_framework_simplejwt.authentication.JWTAuthentication",
	    ),
	    "DEFAULT_PERMISSION_CLASSES": [
		"rest_framework.permissions.IsAuthenticated",
	    ],
	}
	SIMPLE_JWT = {
	    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
	    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
	}
	
frontend creation
You need npm installed

type in the root directory:
npm create vite@latest frontend -- --template react
then:
cd frontend
npm i axios react-router-dom jwt-decode
