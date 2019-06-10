# -- build targets {{{
build\:development:
	npm run build:development
.PHONY: build\:development

build\:production:
	npm run build:production
.PHONY: build\:production

build: build\:development
.PHONY: build
#  }}}

# -- linters {{{
lint\:ts:
	@npm run lint:ts
.PHONY: lint\:ts

lint\:styl:
	@npm run lint:styl
.PHONY: lint\:styl

lint: lint\:ts
.PHONY: lint
# }}}

# -- development utilities {{{
watch\:build:
	@npm run watch:build
.PHONY: watch\:build

watch\:lint\:ts:
	@npm run watch:lint:ts
.PHONY: watch\:lint\:ts

watch\:lint\:styl:
	@npm run watch:lint:styl
.PHONY: watch\:lint\:styl

watch\:serve:
	@npm run watch:serve
.PHONY: watch\:serve

watch: watch\:build
.PHONY: watch

serve: watch\:serve
.PHONY: serve
#  }}}
