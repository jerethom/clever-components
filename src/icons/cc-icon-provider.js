export class CcIconProvider {
  constructor() {
    this.__icons = new Map();
  }

  addIcon(name, value) {
    if (this.__icons.has(name)) {
      console.warn('[cc-icon-provider] adding new icon named "${name}": already registered, overriding...');
    }
    this.__icons.set(name, value);
  }

  addIcons(icons) {
    icons.forEach(icon => {
      this.addIcon(icon.name, icon);
    });
  }

  getIcon(name) {
    if (name == null || !this.__icons.has(name)) {
      console.warn(`[cc-icon-provider] getting icon named "${name}": not existing, returning empty string...`);
      return '';
    }
    return this.__icons.get(name);
  }

  removeIcon(name) {
    if (!this.__icons.has(name)) {
      console.warn('[cc-icon-provider] deleting icon named "${name}": not existing, cancelling...');
    }
    this.__icons.delete(name);
  }
}
