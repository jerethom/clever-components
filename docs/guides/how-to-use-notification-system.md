---
kind: '📌 Docs'
---
# How to use notification system?

We designed a notification system based on the toast pattern. This document explains how to integrate it in your application.

We provide two web components:

1. The `cc-toast` component that represents a single notification.
2. The `cc-toaster` component that helps you display them on your application.

First of all, you need to place the `cc-toaster` somewhere in your application.
A common practice is to have a single `cc-toaster` for your whole application and to place it at the end of the `body` tag.

```html
<html>
  <body>
    <!-- your application here ... -->
    <cc-toaster></cc-toaster>
  </body>
</html>
```

To display a notification, you need to call the `show` method on the `<cc-toaster>` element like this:

```javascript
const toast = {
  message: 'Message to be displayed!',
  intent: 'success',
}

document.querySelector('cc-toaster').show(toast);
```

For our needs, we decided to decouple the `cc-toaster` from the rest of our application, and we really encourage you to do so.
For that, we use DOM events to plug the `cc-toaster` to our application logic:

```javascript
document.addEventListener('notify', (event) => {
  document.querySelector('cc-toaster').show(event.detail);
});
```

And now, to display a notification, you need to dispatch a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) like this:

```javascript
function notify(node, message, intent) {
  node.dispatchEvent(new CustomEvent('notify', {detail: {message, intent}, bubbles: true, composed: true }));
};
```

## Note about placement

You can place the toaster where you want in your application but the toaster pattern encourages you to place it in the border of the screen.
Bellow an example showing how to place the `cc-toaster` in the top-right corner of the screen.

```css
cc-toaster {
  position: fixed;
  z-index: 1000;
  margin: 1em;
  top: 0;
  right: 0;
}
```

When doing that you need to tell the `cc-toaster` where you placed it so that he knows how to align toasts.
For that you will use the `position` attribute:

```html
<cc-toaster position="top-right"></cc-toaster>
```

## Toast options

When showing a toast, you have the ability to pass some options:

* `closeable`: whether the toast has a close button.
* `timeout`: the duration in milliseconds before the toast is automatically dismissed.
* `showProgress`: whether to show a progress bar. This progress bar materializes the timeout.

Bellow is an example on how to use options:

```javascript
const toast = {
  message: 'Message to be displayed!',
  intent: 'success',
  options: {
    closeable: true,
    showProgress: true,
    timeout: 3000,
  }
}

document.querySelector('cc-toaster').show(toast);
```

If you don't provide one of the option, the following default value will be used as fallback:

* `closeable`: `false`
* `timeout`: `5000`
* `showProgress`: `false`

If you don't want to provide options each time you want to display a toast, you can provide some default options to the `cc-toaster` which will always be applied when showing a toast.
Note that you'll still be able to override those defaults when you want to.

```html
<cc-toaster toast-default-options='{ "closeable": true, "timeout": 3000 }'></cc-toaster>
```
