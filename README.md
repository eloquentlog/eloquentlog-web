# Eloquentlog Web Console

[![pipeline status][pipeline]][ci] [![coverage report][coverage]][ci]

```text
Eloquentlog

╦ ╦┌─┐┌┐   ╔═╗┌─┐┌┐┌┌─┐┌─┐┬  ┌─┐
║║║├┤ ├┴┐  ║  │ ││││└─┐│ ││  ├┤
╚╩╝└─┘└─┘  ╚═╝└─┘┘└┘└─┘└─┘┴─┘└─┘
```

The console web application of [Eloquentlog](https://eloquentlog.com).


## Overview

### Screenshots

![screenshot](
doc/img/screenshot-2021050513024622.png?raw=true "Screenshot - 2021-05-05T13:02:46:22+00:00")


## Repository

The main [repository][gitlab] is hosted on GitLab.com.  
\# A [mirror][github] is available also on GitHub.


## Requirements

* Node.js `>= 12.22.1`


## Setup

```zsh
% make setup
```

## Build

```zsh
% make build:debug
% make build:release
```


## Development

See `make help`.

### Verify

#### TypeScript

```zsh
: check by using `tsc`
% make verify:check
```

```zsh
: lint using `tslint`
% make verify:lint:ts
```

#### Stylus

```zsh
: lint using `stylint`
% make verify:lint:styl
```

### Test

```zsh
% make test
```

### Run server

```zsh
% make watch:server
```

### Release

In additon to `CHANGELOG`, update `version` in following files:

* package.json
* package-lock.json
* .gitlab-ci.yml

### Run CI job on local

#### Requirements

* Docker
* gitlab-runner

Build [GitLab.org/gitlab-runner](
https://gitlab.com/gitlab-org/gitlab-runner) (`gitlab-runner-bin`).

```zsh
# e.g. v13.12.0
% cd /path/to/gitlab-runner
% git checkout v13.12.0 -b v13.12.0
% make gitlab-runner-bin
% sudo cp out/binaries/gitlab-runner-linux-amd64 /usr/local/bin/
```

Run a job like below:

```zsh
% cd /path/to/eloquentlog-web-console
% cp .env.ci.sample .env.ci
% make runner-<job>
```


## License

```text
┏━╸╻  ┏━┓┏━┓╻ ╻┏━╸┏┓╻╺┳╸╻  ┏━┓┏━╸
┣╸ ┃  ┃ ┃┃┓┃┃ ┃┣╸ ┃┗┫ ┃ ┃  ┃ ┃┃╺┓
┗━╸┗━╸┗━┛┗┻┛┗━┛┗━╸╹ ╹ ╹ ┗━╸┗━┛┗━┛

Web Console
Copyright (c) 2019-2021 Lupine Software LLC
```

`AGPL-3.0-or-later`

```text
This is free software: You can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
```

[pipeline]: https://gitlab.com/eloquentlog/eloquentlog-web-console/badges/trunk/pipeline.svg
[coverage]: https://gitlab.com/eloquentlog/eloquentlog-web-console/badges/trunk/coverage.svg
[ci]: https://gitlab.com/eloquentlog/eloquentlog-web-console/pipelines
[gitlab]: https://gitlab.com/eloquentlog/eloquentlog-web-console
[github]: https://github.com/eloquentlog/eloquentlog-web-console
