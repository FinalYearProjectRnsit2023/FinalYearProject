// This part of code was borrowed from
// https://stackoverflow.com/a/63790625/13026811
// The code is modified to a small extent to fullfill the problem in hand

export class InvalidUuidError extends Error {
  constructor(m?: string) {
    super(m || "Error: invalid UUID !");

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidUuidError.prototype);
  }
}

export default class UUID {
  protected uuid: string;

  constructor(str: string) {
    this.uuid = str;

    let reg: RegExp = new RegExp(
      "[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}",
      "i"
    );
    if (!reg.test(this.uuid)) throw new InvalidUuidError();
  }

  toString() {
    return this.uuid;
  }
}
