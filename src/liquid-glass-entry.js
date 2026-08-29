import { LiquidGlassElement } from 'simple-liquid-glass/web-component'

const contextExplainerTag = 'context-explainer-liquid-glass'

if (!customElements.get(contextExplainerTag)) {
  customElements.define(
    contextExplainerTag,
    class ContextExplainerLiquidGlass extends LiquidGlassElement {},
  )
}
