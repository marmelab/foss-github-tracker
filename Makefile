CURRENT_UID=$(shell id -u):$(shell id -g)
export CURRENT_UID
export NODE_ENV ?= development

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install node modules from Docker
	docker-compose run --rm --no-deps api yarn
	docker-compose run --rm --no-deps admin yarn

start: ## Start prot in development
	docker-compose up -d

stop: ## Stop prot in development from Docker
	docker-compose down

logs: ## Display prot logs in development from Docker
	docker-compose logs -f

connect-db:
	docker-compose exec postgres bash

init-db-if-you-are-really-sure: ## Delete existing db if exist and create a new one from last dump
	docker-compose exec postgres bash -ci '/db-scripts/init-db.sh'

dump-db: ## Create dump and replace the last one. Environment must be started
	docker-compose exec postgres bash -ci '/db-scripts/dump-db.sh'


