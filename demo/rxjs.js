import { filter, map, multicast, share, Observable, Subject, switchMap } from '../src/lib/observables.js';

function rand () {
  return Math.random().toString(36).slice(2);
}

const inputSubject$ = new Subject();
const valueSubject$ = new Subject();
const errorSubject$ = new Subject();

// const all$ = inputSubject$.pipe(
//   map((v) => {
//     console.log('before create promise');
//     return v;
//   }),
//   switchMap((createPromise) => {
//     console.log('create promise');
//     const ac = new AbortController();
//     const promise = createPromise(ac.signal);
//     return new Observable((subscriber) => {
//       promise
//         .then((value) => subscriber.next([null, value]))
//         .catch((error) => subscriber.next([error]))
//         .finally(() => subscriber.complete());
//       return () => ac.abort();
//     });
//   }),
//   share(),
// );
//
// all$
//   .pipe(
//     filter(([error]) => error == null),
//     map(([$, value]) => value),
//   )
//   .subscribe(valueSubject$);
//
// all$
//   .pipe(
//     filter(([error]) => error != null),
//     map(([error]) => error),
//   )
//   .subscribe(errorSubject$);
//
// valueSubject$.subscribe(
//   (value) => console.log('sub-one', value),
//   (error) => console.error('sub-one', error),
// );
//
// valueSubject$.subscribe(
//   (value) => console.log('sub-two', value),
//   (error) => console.error('sub-two', error),
// );
//
// valueSubject$.subscribe(
//   (value) => console.log('sub-three', value),
//   (error) => console.error('sub-three', error),
// );
//
// errorSubject$.subscribe(
//   (value) => console.log('sub-one', value),
//   (error) => console.error('sub-one', error),
// );
//
// errorSubject$.subscribe(
//   (value) => console.log('sub-two', value),
//   (error) => console.error('sub-two', error),
// );
//
// errorSubject$.subscribe(
//   (value) => console.log('sub-three', value),
//   (error) => console.error('sub-three', error),
// );
//
// inputSubject$.next((signal) => fetch('https://run.mocky.io/v3/7bf8e36f-b3f3-42e9-a59b-f7df9aec75c6\\?mocky-delay=1s', { signal }).then(() => 'one'));
// inputSubject$.next((signal) => fetch('https://run.mocky.io/v3/7bf8e36f-b3f3-42e9-a59b-f7df9aec75c6\\?mocky-delay=1.1s', { signal }).then(() => 'two'));
// inputSubject$.next((signal) => fetch('https://run.mocky.io/v3/7bf8e36f-b3f3-42e9-a59b-f7df9aec75c6\\?mocky-delay=1.2s', { signal }).then(() => {
//   throw new Error();
// }));
// setTimeout(() => {
//   inputSubject$.next((signal) => fetch('https://run.mocky.io/v3/7bf8e36f-b3f3-42e9-a59b-f7df9aec75c6\\?mocky-delay=1.3s', { signal }).then(() => 'three'));
// }, 2000);
//
// // const all$ = this._source$.pipe(switchMap((createPromise) => {
// //   console.log('create promise');
// //   const ac = new AbortController();
// //   const promise = createPromise(ac.signal);
// //   return new Observable((subscriber) => {
// //     promise
// //       .then((value) => subscriber.next([null, value]))
// //       .catch((error) => subscriber.next([error]))
// //       .finally(() => subscriber.complete());
// //     return () => ac.abort();
// //   });
// // }));
// //
// // all$
// //   .pipe(
// //     filter(([error]) => error == null),
// //     map(([$, value]) => value),
// //   )
// //   .subscribe(this.value$);
// //
// // all$
// //   .pipe(
// //     filter(([error]) => error != null),
// //     map(([error]) => error),
// //   )
// //   .subscribe(this.error$);
// // }
