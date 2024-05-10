import { flat } from "../Flat";

const { flatten, unflatten } = flat;

describe("flatten and unflatten functions", () => {
  test("flatten and unflatten a simple object", () => {
    const simpleObject = {
      name: "Test",
      age: 28,
      address: {
        city: "Cagliari",
        country: "IT",
      },
    };
    const flattenedObject = flatten(simpleObject);
    const unflattenedObject = unflatten(flattenedObject);

    expect(flattenedObject).toEqual({
      name: "Test",
      age: 28,
      "address.city": "Cagliari",
      "address.country": "IT",
    });
    expect(unflattenedObject).toEqual(simpleObject);
  });

  test("flatten and unflatten a deeply nested object", () => {
    const nestedObject = {
      name: "Test",
      age: 28,
      address: {
        city: "Cagliari",
        country: "IT",
        details: {
          street: "123 Main St",
          zip: "12345",
        },
      },
    };
    const flattenedObject = flatten(nestedObject);
    const unflattenedObject = unflatten(flattenedObject);

    expect(flattenedObject).toEqual({
      name: "Test",
      age: 28,
      "address.city": "Cagliari",
      "address.country": "IT",
      "address.details.street": "123 Main St",
      "address.details.zip": "12345",
    });
    expect(unflattenedObject).toEqual(nestedObject);
  });

  test("flatten and unflatten an empty object", () => {
    const emptyObject = {};
    const flattenedObject = flatten(emptyObject);
    const unflattenedObject = unflatten(flattenedObject);

    expect(flattenedObject).toEqual({});
    expect(unflattenedObject).toEqual({});
  });

  test("flatten and unflatten an object with null values", () => {
    const nullObject = {
      name: null,
      age: 28,
    };
    const flattenedObject = flatten(nullObject);
    const unflattenedObject = unflatten(flattenedObject);

    expect(flattenedObject).toEqual({
      name: null,
      age: 28,
    });
    expect(unflattenedObject).toEqual(nullObject);
  });

  test("flatten and unflatten an object with undefined values", () => {
    const undefinedObject = {
      name: undefined,
      age: 28,
    };
    const flattenedObject = flatten(undefinedObject);
    const unflattenedObject = unflatten(flattenedObject);

    expect(flattenedObject).toEqual({
      name: undefined,
      age: 28,
    });
    expect(unflattenedObject).toEqual(undefinedObject);
  });
});
