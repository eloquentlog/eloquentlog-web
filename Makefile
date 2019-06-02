serve:
	@npm run serve
.PHONY: serve

build: build\:development
.PHONY: build

build\:development:
	npm run build:development
.PHONY: build\:development

build\:production:
	npm run build:production
.PHONY: build\:production

watch: watch\:build
.PHONY: watch

watch\:build:
	@npm run watch:build
.PHONY: watch\:build

watch\:lint:
	@npm run watch:lint
.PHONY: watch\:lint

lint:
	@npm run lint
.PHONY: lint
