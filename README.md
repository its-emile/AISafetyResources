This list of resources is best to view using this [github.io link](https://its-emile.github.io/AISafetyResources/)

If you are joining or growing in the field of AI safety, the goal of this page is to give you resources learn about AI safety and alignment risks and mitigations, as well as understand "why" generative AI architectures pose challenges.

## Structure

The site is static and has no build step; GitHub Pages serves the repository as-is.

- `index.html`: page markup and all resource entries (add or edit resources here)
- `css/`: one stylesheet per area: `base`, `layout`, `buttons`, `paths`, `toolbar`, `catalog`, `entries`, `profile`
- `js/main.js`: entry point; wires up the modules below
  - `catalog.js`: reads the entries out of the page
  - `storage.js`, `userdata.js`: opened / starred / reflections, kept in this browser only
  - `entries.js`, `favicons.js`: per-entry controls and icon fallback
  - `suggestions.js`: "Suggested" ranking
  - `state.js`, `filters.js`: search, filter chips, view switch, deep links
  - `outlets.js`, `data/outlets.js`: the "By major outlet" view and its list of outlets
  - `progress.js`, `profile.js`, `transfer.js`: progress dialog, export / import / clear
  - `navigation.js`: random pick and in-page links

The scripts are ES modules, which browsers will not load from `file://`. To preview locally, run `python3 -m http.server` in this folder and open http://localhost:8000/.
