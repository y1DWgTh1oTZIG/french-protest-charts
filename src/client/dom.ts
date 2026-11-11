/* The only two DOM helpers the client needs. Both had been copy-pasted. */

export const byId = <T extends HTMLElement = HTMLElement>(
  id: string,
): T | null => document.getElementById(id) as T | null;

export function el<K extends keyof HTMLElementTagNameMap>(
  name: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(name);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}
