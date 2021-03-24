## Data files

This directory houses scripts to setup the server-side MongoDB database using various data sources.

To run the scripts, first you need to have the following source files in this directory:

- The "all candidates" CSV format data file from [Democracy Club](https://candidates.democracyclub.org.uk) (License: [CC BY 4.0](https://candidates.democracyclub.org.uk/api/docs)). The filename should be `candidates-all.csv`.
- The "election results by constituency" Excel file from the [House of Commons Library](https://commonslibrary.parliament.uk/research-briefings/cbp-8647) (License [Open Parliament License](https://www.parliament.uk/site-information/copyright-parliament/open-parliament-licence)). The filename should be set to `election-results.xlsx`.

Then use `npm run build:data` (assuming development dependencies were previously installed with `npm install`).

### Map Data

For the map to show constituencies you need to download the following GeoJSON and put it into the `public/assets` directory:

- The "Westminster Parliamentary Constituencies in the United Kingdom, as at December 2019" GeoJSON (from the APIs dropdown) file from the [Office for National Statistics](https://geoportal.statistics.gov.uk/datasets/westminster-parliamentary-constituencies-december-2019-boundaries-uk-bgc) (License: [OGLv3.0](https://www.ons.gov.uk/methodology/geography/licences)). The filename should be set to `constituencies.geojson`.