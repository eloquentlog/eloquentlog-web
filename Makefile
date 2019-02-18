serve:
	@npm run serve
.PHONY: serve

build:
	@npm run build
.PHONY: build

lint:
	@npm run lint
.PHONY: lint

test:
	@npm run test
.PHONY: test

test\:coverage:
	@npm run test:coverage
.PHONY: test\:coverage
