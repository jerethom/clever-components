interface Foo {
  one: string;
  two: boolean;
}

type Bar = "One" | "Two" | false | null;

interface TheInterface {
  one: number;
  two: string;
  sub: SubInterface;
  subSpecialArray: Array<OtherInterface>;
  subArray: OtherInterfaceTwo[];
  subType: SubType;
}

type TheType = "One" | "Two" | SubInterface | Array<OtherInterface> | OtherInterfaceTwo[];

interface SubInterface {
}

interface Suberu {
}

interface OtherInterface {

}
interface OtherInterfaceTwo {

}

type SubType = "fooFromSub";

interface TupleFoo {

}

interface TupleBar {

}
