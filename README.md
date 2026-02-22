<p align="center">
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/BizLenz/.github/refs/heads/main/assets/logo/logo_dark.svg">
  <img src="https://raw.githubusercontent.com/BizLenz/.github/refs/heads/main/assets/logo/logo_light.svg" width="130" alt="Logo for BizLenz">
</picture>
</p>

<h1 align="center">
  BizLenz
</h1>

<p align="center">
  AI-powered business proposal analysis tool for the web
</p>

> BizLenz는 과학기술정보통신부 대학디지털교육역량강화사업의 지원을 통해 수행한
> 한이음 드림업 프로젝트 결과물입니다.

## www

Frontend for BizLenz.

### Usage

`bun` is expected to run this app. See [here](https://bun.sh/docs/installation)
for installation.

```bash
bun dev # Run the app in development mode
bun start # Run the app in production mode
bun run build # Build the app
```

> `flake.nix` is provided for Nix users. Use `nix develop` to enter the
> development shell.

### System Architecture

<img src="https://raw.githubusercontent.com/BizLenz/.github/refs/heads/main/assets/architecture/www_architecture.svg" alt="www_architecture" width="600"/>

The frontend was developed using the Next.js framework as it enables server‑side
rendering, optimized performance, and efficient integration of dynamic AI‑driven
content.

It heavily utilizes the [shadcn/ui](https://ui.shadcn.com/) component library,
allowing rapid interface development and maintaining consistent design
efficiency even with a single developer on the FE side.

