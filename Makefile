# -- setup {{{
setup:  ## Install node dev modules
	@npm i
.PHONY: setup
#  }}}

# -- build {{{
build\:development:  ## Build in development mode [alias: build]
	npm run build:development
.PHONY: build\:development

build\:production:  ## Build in production mode
	npm run build:production
.PHONY: build\:production

build: build\:development
.PHONY: build
#  }}}

# -- verify {{{
verify\:lint\:ts:  ## Verify coding style for TypScript [alias: verify:lint, lint]
	@npm run lint:ts
.PHONY: verify\:lint\:ts

verify\:lint\:styl:  ## Verify coding style for Stylus
	@npm run lint:styl
.PHONY: verify\:lint\:styl

verify\:lint: | verify\:lint\:ts
.PHONY: verify\:lint

lint: verify\:lint\:ts
.PHONY: lint

verify\:all: | verify\:lint\:ts verify\:lint\:styl  ## Check code using all verify:xxx targets [alias: verify]
.PHONY: verify\:all

verify: | verify\:all
.PHONY: verify
# }}}

# -- other utilities {{{
watch\:build:  ## Start a process for build [alias: watch]
	@npm run watch:build
.PHONY: watch\:build

watch\:lint\:ts:  ## Start a process for tslint
	@npm run watch:lint:ts
.PHONY: watch\:lint\:ts

watch\:lint\:styl:  ## Start a process for stylus lint
	@npm run watch:lint:styl
.PHONY: watch\:lint\:styl

watch\:serve:  ## Start a process for development server [alias: serve]
	@npm run watch:serve
.PHONY: watch\:serve

watch: | watch\:build
.PHONY: watch

serve: | watch\:serve
.PHONY: serve

clean:  ## Tidy up
	@rm dst/index*.js*
	@rm dst/index*.css*
.PHONY: clean

help:  ## Display this message
	@grep --extended-regexp '^[0-9a-z\:\\]+: ' $(MAKEFILE_LIST) | \
	  grep --extended-regexp '  ## ' | \
	  sed --expression='s/\(\s|\(\s[0-9a-z\:\\]*\)*\)  /  /' | \
	  tr --delete \\\\ | \
	  awk 'BEGIN {FS = ":  ## "}; \
	      {printf "\033[38;05;026m%-19s\033[0m %s\n", $$1, $$2}' | \
	  sort
.PHONY: help
# }}}
