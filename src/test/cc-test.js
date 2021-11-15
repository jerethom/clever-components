import { i18n } from '../lib/i18n.js';

class Foo {
  render () {
    return `
    <h1>${i18n('cc-test.foo')}</h1>
  `;
  }
}

function run () {

  console.log(i18n('cc-test.bar', Math.random()));
  console.log(i18n('cc-test.baz', 42));

  const foo = new Foo();
  console.log(foo);
}

run();
