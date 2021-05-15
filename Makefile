# setup
setup: ## Install node dev modules
	@npm install
.PHONY: setup

# build
build\:debug: ## Build in development mode
	npm run build:development
.PHONY: build\:debug

build\:release: ## Build in production mode
	npm run build:production
.PHONY: build\:release

build: build\:debug ## Synonym of build:debug
.PHONY: build

# verify
verify\:check: ## Check TypeScript codes [alias: check]
	@npm run check
.PHONY: verify\:check

check: verify\:check
.PHONY: check

verify\:lint\:ts: ## Verify coding style for TypeScript
	@npm run lint:ts
.PHONY: verify\:lint\:ts

verify\:lint\:styl: ## Verify coding style for Stylus
	@npm run lint:styl
.PHONY: verify\:lint\:styl

verify\:lint: verify\:lint\:ts ## Synonym of verify:lint:ts [alias: lint]
.PHONY: verify\:lint

lint: verify\:lint\:ts
.PHONY: lint

verify\:all: verify\:lint\:ts verify\:lint\:styl ## Check code using all verify targets
.PHONY: verify\:all

verify: verify\:check ## Synonym for verify:check
.PHONY: verify

# test
test: ## Run test
	@npm run test
.PHONY: test

coverage: ## Run test and generates a coverage report [alias: cov]
	@npm run coverage
.PHONY: coverage

cov: coverage
.PHONY: cov

# utility
watch\:build: ## Start a process for build
	@npm run watch:build
.PHONY: watch\:build

watch\:server: ## Start a process for development server [alias: server]
	@npm run watch:server
.PHONY: watch\:server

watch: watch\:build ## Synonym of watch:build
.PHONY: watch

server: watch\:server
.PHONY: server

clean: ## Tidy up
	@rm -fr .cache/*
	@rm -f dst/js/index*.js*
	@rm -f dst/css/index*.css*
.PHONY: clean

runner-%: ## Run a CI job on local (on Docker)
	@set -uo pipefail; \
	job=$(subst runner-,,$@); \
	opt=""; \
	while read line; do \
		opt+=" --env $$(echo $$line | sed -E 's/^export //')"; \
	done < .env.ci; \
	gitlab-runner exec docker \
		--executor docker \
		--cache-dir /cache \
		--docker-volumes $$(pwd)/.cache/gitlab-runner:/cache \
		--docker-volumes /var/run/docker.sock:/var/run/docker.sock \
		$${opt} $${job}
.PHONY: runner

help: ## Display this message
	@set -uo pipefail; \
	grep --extended-regexp '^[-_0-9a-z\%\:\\ ]+: ' \
	$(firstword $(MAKEFILE_LIST)) | \
	grep --extended-regexp ' ## ' | \
	sed --expression='s/\( [-_0-9a-z\%\:\\ ]*\) #/ #/' | \
	tr --delete \\\\ | \
	awk 'BEGIN {FS = ": ## "}; \
		{printf "\033[38;05;026m%-17s\033[0m %s\n", $$1, $$2}' | \
	sort
.PHONY: help
