make:
	npm run start

dev:
	cp .env.dev .env
	npm run start

prod: 
	cp .env.prod .env
	npm run start