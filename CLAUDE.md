@AGENTS.md

## 2026-04-30 (later)

### Chat Integration Complete
- Added `messages` state and `sendMessage` function to `AIChatInput` component.
- Webhook endpoint: `https://n8n.autom8n.site/webhook/c6fce477-c75a-4924-8d6d-45a8dbdcddc6`
- Sends POST with JSON payload `{chatInput, sessionId, action: 'sendMessage'}`.
- Handles both JSON and text responses, displays messages in chat bubbles.
- Added `renderContent` helper to render image URLs as `<img>` tags.
- Connected Send button to `sendMessage`, disabled while sending.
- Input supports Enter key to send.
- Added messages area above input with scrollable container.
- Build passes with no TypeScript errors.

### Next Steps
- Test the chat UI in browser with live n8n webhook.
- Possibly add streaming support if needed.
- Enhance message formatting (markdown, links, code blocks).

## 2026-04-30 (Gradient Background)

### GradientBackground Component Added
- Created `src/components/ui/gradient-background.tsx` component per the prompt spec.
- Added `.gradient-bg` CSS class and `@keyframes gradientShift` animation to `src/app/globals.css`.
- The gradient transitions through dark purple/blue tones (`#08080e`, `#1a0a2e`, `#0d0d3b`, `#120a2e`) with a 15s ease-in-out infinite animation.
- Updated `src/app/page.tsx` to wrap `AIChatInput` with `<GradientBackground>`.
- Removed `bg-[#08080e]` from `AIChatInput` outer div (changed to `bg-transparent`) so the gradient shows through.
- Build passes with no errors.

### Current Architecture
- **Page** (`src/app/page.tsx`): Renders `<GradientBackground>` which provides the animated gradient background, and inside it renders `<AIChatInput>`.
- **GradientBackground** (`src/components/ui/gradient-background.tsx`): Fixed gradient background with CSS animation, renders children on top with `relative z-10`.
- **AIChatInput** (`src/components/ui/ai-chat-input.tsx`): Chat interface with n8n webhook integration, message display with image support, animated placeholder text, Think/Deep Search toggles.

## 2026-04-30 (Chat UI Refinements)

### Chat Input UI Updates
- **Removed Think, Deep Search, and Attachment buttons** from the input area.
- **Frosted glass look**: Added `background: "rgba(255, 255, 255, 0.75)"`, `backdropFilter: "blur(20px)"`, and translucent border to the input container.
- **Centered initially**: Chat input box is centered on page load (via flex `justify-center`).
- **Messages push input down**: When messages appear, they render above the input, naturally pushing it downward. Used `motion.div` with fade-in animation for messages.
- **Simplified state**: Removed `thinkActive` and `deepSearchActive` state variables.
- **Updated message bubbles**: AI messages now also use `bg-white/90 backdrop-blur-sm` for consistency with frosted theme.

### Current Behavior
1. Page loads → gradient background with centered frosted glass input box
2. User types message and presses Enter → message sent to n8n webhook
3. Messages appear above input with fade-in animation
4. Input remains at bottom with frosted glass effect
5. AI response appears after webhook returns

### Build Status
- `npm run build` passes with no TypeScript errors
