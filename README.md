# Movie-Sim-New

Milestone 1 foundation for a browser-based movie studio management sim built with Next.js + TypeScript + Tailwind.

## Milestone 1 scope
- Studio dashboard (week + funds)
- Talent database
- Film project creation (title, genre, motive)
- Cast and key crew assignment
- Weekly time progression
- Script simulation
- Production simulation
- Release and week-by-week box office reveal
- Ratings and finances tracking
- Browser persistence via localStorage

## Architecture
- `app/`: Next.js app routes and page shell
- `components/`: UI components only
- `lib/sim/`: core simulation data/types/engine logic
- `lib/storage/`: browser save/load helpers

The simulation engine is isolated from UI so future milestones can extend systems without rewriting the interface.
