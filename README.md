# Grand Trunk

History site for Grand Trunk, one of Toronto's longest-running open club ultimate teams (est. 2004).
Static Astro site, deployed to GitHub Pages: https://icbone.github.io/grand-trunk/

## Adding history
- **Season:** add `src/content/seasons/<year>.md` (see `2005.md` for every field). Rosters, captains and games are front matter; the body is the season story.
- **Players:** derived automatically from season rosters. Spell names identically across seasons.
- **Lore:** add `src/content/lore/<slug>.md`.
- Mark invented data `placeholder: true`; delete the flag once verified. Put where a fact came from in `sources`.

## Contributing
Anyone can suggest history. Nothing goes on the site until the repo owner reviews it.
- **No git needed:** open an issue with the [Submit history](https://github.com/icbone/grand-trunk/issues/new?template=submit-history.yml) form.
- **Editing files:** fork the repo, make your change, and open a pull request. `main` is protected, so every PR needs the owner's approval to merge.
- **Names only.** Don't add anyone's email, phone, address, age, job, health or family details.

## Commands
`npm run dev` · `npm run build`

Deploys on push to `main` (repo Settings → Pages → Source: GitHub Actions).
