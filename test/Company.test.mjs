import { describe, it, expect, beforeEach } from "vitest";
import Employee from "../src/dto/Employee.mjs";
import Manager from "../src/dto/Manager.mjs";
import WageEmployee from "../src/dto/WageEmployee.mjs";
import SalesPerson from "../src/dto/SalesPerson.mjs";
import Company from "../src/service/Company.mjs";

const ID1 = 123;
const SALARY1 = 1000;
const DEPARTMENT1 = "QA";
const ID2 = 120;
const SALARY2 = 2000;
const ID3 = 125;
const SALARY3 = 3000;
const DEPARTMENT2 = "Development";
const ID4 = 200;
const DEPARTMENT4 = "Audit";
const WAGE1 = 100;
const HOURS1 = 10;
const FACTOR1 = 2;
const PERCENT1 = 1;
const SALES1 = 10000;
const FACTOR2 = 2.5;
const ID5 = 300;
const FACTOR3 = 3;
const ID6 = 400;
const ID7 = 500;

let empl1, empl2, empl3, company;

beforeEach(() => {
  empl1 = new WageEmployee(ID1, DEPARTMENT1, SALARY1, WAGE1, HOURS1);
  empl2 = new Manager(ID2, DEPARTMENT1, SALARY2, FACTOR1);
  empl3 = new SalesPerson(
    ID3,
    DEPARTMENT2,
    SALARY3,
    WAGE1,
    HOURS1,
    PERCENT1,
    SALES1
  );
  company = new Company();

  [empl1, empl2, empl3].forEach((emp) => company.addEmployee(emp));
});

describe("Company Tests", () => {
  it("should add an employee and retrieve it by ID", () => {
    const empl = new Employee(ID4, DEPARTMENT1, SALARY1);
    company.addEmployee(empl);
    const retrievedEmployee = company.getEmployees(ID4);
    expect(retrievedEmployee).toEqual(empl);
  });

  it("testing to get an employee", () => {
    expect(company.getEmployees(ID1)).toBe(empl1);
  });

  it("testing to get an employee who didn't exist", () => {
    expect(company.getEmployees(ID4)).toBeNull();
  });

  it("remove an employee by ID", () => {
    company.removeEmployee(ID1);
    expect(company.getEmployees(ID1)).toBeNull();
    expect(() => company.removeEmployee(ID1)).toThrowError(
      'Employee with ID "123" does not exist.'
    );
  });

  it("calculate budget of department", () => {
    expect(company.getDepartmentBudget(DEPARTMENT1)).toBe(
      SALARY1 + WAGE1 * HOURS1 + SALARY2 * FACTOR1
    );
    expect(company.getDepartmentBudget(DEPARTMENT2)).toBe(
      SALARY3 + WAGE1 * HOURS1 + (PERCENT1 * SALES1) / 100
    );
    expect(() => company.getDepartmentBudget(DEPARTMENT4)).toThrowError(
      'Department "Audit" does not exist.'
    );
  });

  it("get departmets", () => {
    const expected = [DEPARTMENT1, DEPARTMENT2].sort();
    expect(company.getDepartments().sort()).toEqual(expected);
    company.removeEmployee(ID3);
    expect(company.getDepartments().sort()).toEqual([DEPARTMENT1]);
  });


  it("testGetManagersWithMostFactor", () => {
    company.addEmployee(new Manager(ID4, DEPARTMENT1, SALARY1, FACTOR2));
    const managersExpected = [
      new Manager(ID5, DEPARTMENT1, SALARY1, FACTOR3),
      new Manager(ID6, DEPARTMENT1, SALARY1, FACTOR3),
      new Manager(ID7, DEPARTMENT2, SALARY1, FACTOR3),
    ];
    managersExpected.forEach((manager) => company.addEmployee(manager));
    expect(company.getManagersWithMostFactor()).toEqual(managersExpected);

    // [ID4, ID5, ID6, ID7].forEach((id) => company.removeEmployee(id));
    // expect(company.getManagersWithMostFactor()).toEqual([empl2]);

    // company.removeEmployee(ID2);
    // expect(company.getManagersWithMostFactor()).toEqual([]);
  });

  it("save to file test", () => {
    const jsonStr =
      '{"basicSalary":1000,"className":"Manager","id":123,"department":"QA","factor":2}';
    const empl = JSON.parse(jsonStr, (key, value) => {
      if (value.className === "Manager") {
        return new Manager(
          value.id,
          value.department,
          value.basicSalary,
          value.factor
        );
      }
      return value;
    });
    expect(empl).toEqual(new Manager(ID1, DEPARTMENT1, SALARY1, FACTOR1));
  });
});

