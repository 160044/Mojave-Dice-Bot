# Changelog

## [1.1.0] - 2026-02-15

### Added
- Status effects system with 24 conditions (16 D&D 5e + 8 custom)
- Automatic duration tracking with `!init next`
- Full D&D 5e condition descriptions
- Categorized help system (`!help dice`, `!help init`, `!help status`)
- Chat separator utility (`!break`, `!br`)
- PM2 production configuration
- Comprehensive documentation suite

### Enhanced
- Help command now organized by category
- Status effects display inline in initiative tracker
- Duration auto-decrement at round start
- Condition lookup (`!status poisoned` shows description)

### Commands Added
- `!statusadd` / `!sa` - Apply status effect with duration
- `!statusremove` / `!sr` - Remove status effect
- `!statustick` / `!stk` - Manually advance durations
- `!statusclear` - Clear all effects
- `!status <condition>` - View condition description
- `!conditions` - List all available conditions
- `!break` / `!br` / `!sep` - Insert visual separator
- `!help <category>` - Categorized help

### Technical
- Integrated StatusTracker with InitiativeTracker
- Auto-tick on round advancement
- PM2 ecosystem configuration
- Production deployment scripts

## [1.0.0-beta] - 2026-02-15

### Initial Release
- Complete dice rolling system
- Initiative tracker with hidden HP
- Turn pinging with Root mentions
- Flexible command syntax
- Multi-word name support
- Character generation commands
- FATE and Shadowrun dice support

## Roadmap

### v1.2 (Future)
- Persistent storage option
- Combat log export
- Custom conditions
- Initiative reordering
- Concentration tracking
