import { writeFile, readFile } from "fs/promises";
import Employee from "../dto/Employee.mjs";
import Manager from "../dto/Manager.mjs";

export default class Company {
  #employees;
  #departments;

  constructor() {
    this.#employees = [];
    this.#departments = [];
  }

  addEmployee(employee) {
    const id = employee.getId();
    const department = employee.getDepartment();

    if (this.#employees[id]) {
      throw new Error(`Employee with ID "${id}" already exists.`);
    }

    this.#employees[id] = employee;

    if (!this.#departments[department]) {
      this.#departments[department] = [];
    }
    this.#departments[department].push(employee);
  }

  getEmployees(id) {
    return this.#employees[id] || null;
  }

  removeEmployee(id) {
    const employee = this.#employees[id];
    if (!employee) {
      throw new Error(`Employee with ID "${id}" does not exist.`);
    }
    const department = employee.getDepartment();

    if (this.#departments[department]) {
      this.#departments[department] = this.#departments[department].filter(
        (e) => e.getId() !== id
      );
    }

    if (this.#departments[department].length === 0) {
      delete this.#departments[department];
    }
    delete this.#employees[id];
  }

  getDepartmentBudget(department) {
    if (!this.#departments[department]) {
      throw new Error(`Department ${department} does not exist`);
    }
    return (
      this.#departments[department].reduce(
        (total, employee) => total + employee.computeSalary()
      ),
      0
    );
  }

  getDepartmentBudget(department) {
    if (!this.#departments[department]) {
      throw new Error(`Department "${department}" does not exist.`);
    }
    return this.#departments[department].reduce(
      (total, employee) => total + employee.computeSalary(),
      0
    );
  }

  getDepartments() {
    return Object.keys(this.#departments);
  }

  getManagersWithMostFactor() {
    const managers = Object.values(this.#employees).filter(
      (employee) => employee instanceof Manager
    );
    const maxFactor = Math.max(...managers.map((managers)=>managers.getFactor()=maxFactor))
    return managers.filter((manager) => manager.getFactor() === maxFactor);
  }

  async saveToFile(filename) {
    const data = {
      employees: this.#employees,
      departments: this.#departments,
    };
    await writeFile(filename, JSON.stringify(data));
  }

  async restoreFromFile(filename) {
    const data = JSON.parse(await readFile(filename, "utf8"));
    this.#employees = data.employees || {};
    this.#departments = data.departments || {};
  }
}
