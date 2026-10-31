# PlannerJapa

Preciso publicar essa aplicação para qu ela seja editável por alguns usuários que tenham o link

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://plannerjapa.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5b918181-e581-457e-aff3-1b5f4140572c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Google Calendar

Use the **Google Calendar** button to preview and subscribe to the current saved itinerary, or download a one-time `.ics` copy. The public feed is `/api/public/calendar`; `?format=json` previews the same events and `?download=1` downloads the calendar.

Events use `Asia/Tokyo`. Reservation starts explicitly confirmed in the saved itinerary are marked confirmed; all other times and estimated durations remain tentative; stops without a time are flexible all-day entries. Overlaps are disclosed. Subscriptions refresh on Google's schedule and do not write changes back to the planner. No day comments, reservation records or financial data are exported.

`npm run build` regenerates `src/lib/calendar-catalog.ts` from the HTML planner and Pokémon module before compiling. Run `node --test tests/trip-calendar.test.mjs tests/pokemon-route.test.cjs` for the export and preservation checks.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

The 31 October itinerary review preserves the saved Saihō-ji start at 11:30 on 12 November and teamLab at 09:00 on 20 November. Shared transport cards use `guide.dateRoutes` to keep date-specific departure margins. Only the missing 9 November Osaka transfer is added by an idempotent migration; user-added cards and saved data are retained. Regenerate the calendar catalogue after editing definitions.
