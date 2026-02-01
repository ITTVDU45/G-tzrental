# Rental Configurator

This directory contains the implementation of the dynamic rental configurator.

## Usage

To embed the configurator on a page, use the `ConfiguratorShell` component:

```tsx
import ConfiguratorShell from "@/components/configurator/core/ConfiguratorShell";

export default function Page({ params }: { params: { slug: string } }) {
    return <ConfiguratorShell locationSlug={params.slug} />;
}
```

## Architecture

- **core/**: Shell, Stepper, Navigation components.
- **steps/**: Individual step logic components.
- **fields/**: Reusable form fields (RangeSlider, etc.).
- **state/**: `ConfiguratorContext` and `reducer` managing the global state.
- **api/**: API client wrapper (currently using mock data).

## Data Flow

1. `ConfiguratorShell` initializes and fetches `ConfiguratorData` based on `locationSlug`.
2. State is managed via `useConfigurator` hook (Context API).
3. Steps read/write to the central state.
4. Step 2 triggers `fetchRecommendations`.
5. Step 6 submits the lead via `submitLead`.

## API Expectations

The backend should provide:

- `GET /api/locations/{slug}/configurator`: Initial configuration.
- `POST /api/configurator/recommendations`: Dynamic filtering.
- `POST /api/leads`: Lead submission.

See `state/configurator.types.ts` for detailed interfaces.
