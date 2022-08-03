import { LitElement } from 'lit-element';

/**
 * @typedef {import('./cc-test-component.types.d.ts').Foo} Foo
 * @typedef {import('./cc-test-component.types.d.ts').Bar} Bar
 * @typedef {import('./cc-test-component.types.d.ts').TheInterface} TheInterface
 * @typedef {import('./cc-test-component.types.d.ts').TheType} TheType
 * @typedef {import('./cc-test-component.types.d.ts').TupleFoo} TupleFoo
 * @typedef {import('./cc-test-component.types.d.ts').TupleBar} TupleBar
 */

/**
 * lorem ipsum...
 */
export class CcTestComponent extends LitElement {

  constructor () {
    super();

    /** @type {Foo|Bar} - lorem ipsum.  */
    this.union = null;

    /** @type {TheInterface} - lorem ipsum.  */
    this.interface = null;

    /** @type {TheType} - lorem ipsum.  */
    this.typeDeclaration = null;

    /** @type {Array<Foo>} - lorem ipsum.  */
    this.specialArray = null;

    /** @type {Array} - lorem ipsum.  */
    this.specialEmptyArray = null;

    /** @type {Array<string>} - lorem ipsum.  */
    this.specialArrayString = null;

    /** @type {Foo[]} - lorem ipsum.  */
    this.array = null;

    /** @type {[number, TupleFoo, string, TupleBar]} - lorem ipsum.  */
    this.tuple = null;

  }

}
