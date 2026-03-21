/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js"

jest.mock("../app/Store.js", () => mockStore)

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock })
    window.localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "employee@test.tld" })
    )

    document.body.innerHTML = ""
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("When I am on NewBill Page", () => {
    test("Then the form should be visible", () => {
      window.onNavigate(ROUTES_PATH.NewBill)
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
    })

    test("Then uploading a wrong file extension should reset the input", () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate: window.onNavigate,
        store: null,
        localStorage: window.localStorage,
      })

      const fileInput = screen.getByTestId("file")
      const badFile = new File(["hello"], "file.pdf", {
        type: "application/pdf",
      })

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fileInput.addEventListener("change", handleChangeFile)

      fireEvent.change(fileInput, { target: { files: [badFile] } })

      expect(handleChangeFile).toHaveBeenCalled()
      expect(fileInput.value).toBe("") // invalid → cleared
    })

    test("Then uploading a correct file should keep the file", () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate: window.onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      })

      const fileInput = screen.getByTestId("file")
      const goodFile = new File(["hello"], "image.png", { type: "image/png" })

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fileInput.addEventListener("change", handleChangeFile)

      fireEvent.change(fileInput, { target: { files: [goodFile] } })

      expect(handleChangeFile).toHaveBeenCalled()
      expect(fileInput.files[0].name).toBe("image.png")
    })

    test("Then submitting a valid form should navigate to Bills page", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate: window.onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      })

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      form.addEventListener("submit", handleSubmit)

      fireEvent.change(screen.getByTestId("expense-type"), {
        target: { value: "Transports" },
      })
      fireEvent.change(screen.getByTestId("expense-name"), {
        target: { value: "Taxi" },
      })
      fireEvent.change(screen.getByTestId("amount"), {
        target: { value: "45" },
      })
      fireEvent.change(screen.getByTestId("datepicker"), {
        target: { value: "2022-01-01" },
      })
      fireEvent.change(screen.getByTestId("vat"), {
        target: { value: "20" },
      })
      fireEvent.change(screen.getByTestId("pct"), {
        target: { value: "20" },
      })

      // simulate file already uploaded
      newBill.fileUrl = "test.png"
      newBill.fileName = "test.png"

      fireEvent.submit(form)

      await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByText("Mes notes de frais")).toBeTruthy()
    })
  })

  describe("When an API error occurs on NewBill", () => {
    test("Then it should log a 404 error when file upload fails", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      const store = {
        bills: jest.fn(() => ({
          create: jest.fn(() => Promise.reject(new Error("Erreur 404"))),
        })),
      }

      const newBill = new NewBill({
        document,
        onNavigate: window.onNavigate,
        store,
        localStorage: window.localStorage,
      })

      const fileInput = screen.getByTestId("file")
      const goodFile = new File(["hello"], "image.png", { type: "image/png" })

      fireEvent.change(fileInput, { target: { files: [goodFile] } })

      await waitFor(() => expect(errorSpy).toHaveBeenCalled())
      expect(errorSpy).toHaveBeenCalledWith(new Error("Erreur 404"))
    })

    test("Then it should log a 500 error when file upload fails", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      const store = {
        bills: jest.fn(() => ({
          create: jest.fn(() => Promise.reject(new Error("Erreur 500"))),
        })),
      }

      const newBill = new NewBill({
        document,
        onNavigate: window.onNavigate,
        store,
        localStorage: window.localStorage,
      })

      const fileInput = screen.getByTestId("file")
      const goodFile = new File(["hello"], "image.png", { type: "image/png" })

      fireEvent.change(fileInput, { target: { files: [goodFile] } })

      await waitFor(() => expect(errorSpy).toHaveBeenCalled())
      expect(errorSpy).toHaveBeenCalledWith(new Error("Erreur 500"))
    })

    test("Then it should log a 404 error when bill update fails", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      const store = {
        bills: jest.fn(() => ({
          update: jest.fn(() => Promise.reject(new Error("Erreur 404"))),
        })),
      }

      const newBill = new NewBill({
        document,
        onNavigate: window.onNavigate,
        store,
        localStorage: window.localStorage,
      })

      newBill.billId = "1234"
      newBill.updateBill({
        email: "employee@test.tld",
        type: "Transports",
        name: "Taxi",
        amount: 45,
        date: "2022-01-01",
        vat: "20",
        pct: 20,
        commentary: "",
        fileUrl: "test.png",
        fileName: "test.png",
        status: "pending",
      })

      await waitFor(() => expect(errorSpy).toHaveBeenCalled())
      expect(errorSpy).toHaveBeenCalledWith(new Error("Erreur 404"))
    })

    test("Then it should log a 500 error when bill update fails", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      const store = {
        bills: jest.fn(() => ({
          update: jest.fn(() => Promise.reject(new Error("Erreur 500"))),
        })),
      }

      const newBill = new NewBill({
        document,
        onNavigate: window.onNavigate,
        store,
        localStorage: window.localStorage,
      })

      newBill.billId = "1234"
      newBill.updateBill({
        email: "employee@test.tld",
        type: "Transports",
        name: "Taxi",
        amount: 45,
        date: "2022-01-01",
        vat: "20",
        pct: 20,
        commentary: "",
        fileUrl: "test.png",
        fileName: "test.png",
        status: "pending",
      })

      await waitFor(() => expect(errorSpy).toHaveBeenCalled())
      expect(errorSpy).toHaveBeenCalledWith(new Error("Erreur 500"))
    })
  })
})
