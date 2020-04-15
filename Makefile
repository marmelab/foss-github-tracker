help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


install: ## Install node modules from Docker
	docker-compose run --rm --no-deps back npm install
	docker-compose run --rm --no-deps front npm install

run: ## Start webapp in development from Docker with logs
	docker-compose up

start: ## Start webapp in development without logs
	docker-compose up -d

stop: ## Stop webapp in development from Docker
	docker-compose down

connect-db:
	docker-compose exec postgres bash



