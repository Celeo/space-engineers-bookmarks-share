# Space Engineers Bookmarks Share

[![CI](https://github.com/Celeo/space-engineers-bookmarks-share/workflows/CD/badge.svg?branch=master)](https://github.com/celeo/space-engineers-bookmarks-share/actions?query=workflow%3ACD)

A site for sharing bookmarks for [Space Engineers](https://store.steampowered.com/app/244850/Space_Engineers/).

## Developing

### Building

#### Requirements

- Node
- npm or yarn (I'm using yarn)
- A [supabase](https://supabase.io/) account

#### Steps

```sh
git clone https://github.com/Celeo/space-engineers-bookmarks-share
cd space-engineers-bookmarks-share
yarn
```

Then create an `.env` file with the environment variables `REACT_APP_SUPABASE_KEY` and `REACT_APP_SUPABASE_URL` per the [create-react-app](https://create-react-app.dev/docs/adding-custom-environment-variables/) documentation.

Then, build with

```sh
yarn build
```

## License

Licensed under MIT ([LICENSE](LICENSE)).

## Contributing

Please feel free to contribute. Please open an issue first (or comment on an existing one) so that I know that you want to add/change something.
