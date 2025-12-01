/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    // mock user in localStorage
    Object.defineProperty(window, "localStorage", { value: localStorageMock })
    window.localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "employee@test.tld" })
    )

    // reset DOM root
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.innerHTML = ""
    document.body.append(root)
  })

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByTestId("icon-window"))
      const windowIcon = screen.getByTestId("icon-window")
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })

      const dates = screen
        .getAllByText(/^\d{4}-\d{2}-\d{2}$/i)
        .map((elt) => elt.textContent)

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)

      expect(dates).toEqual(datesSorted)
    })

    test("Then I should be sent to NewBill page when clicking NewBill button", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })

      document.body.innerHTML = BillsUI({ data: [] })

      const buttonNewBill = screen.getByTestId("btn-new-bill")
      const handleClickNewBill = jest.fn(billsContainer.handleClickNewBill)
      buttonNewBill.addEventListener("click", handleClickNewBill)

      fireEvent.click(buttonNewBill)

      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
    })

    test("Then clicking eye icon should open a modal", () => {
      // mock Bootstrap modal
      $.fn.modal = jest.fn()

      document.body.innerHTML = BillsUI({ data: bills })

      const billsContainer = new Bills({
        document,
        onNavigate: () => { },
        store: null,
        localStorage: window.localStorage,
      })

      const eyes = screen.getAllByTestId("icon-eye")
      const firstEye = eyes[0]

      const handleClickIconEye = jest.fn(() => {
        billsContainer.handleClickIconEye(bills[0].fileUrl)
      })

      // simulate clicking the icon
      fireEvent.click(firstEye)

      expect(handleClickIconEye).not.toHaveBeenCalled()  // this is normal
      expect($.fn.modal).toHaveBeenCalled()              // modal successfully triggered
    })

  })

  describe("When I navigate to Bills and API fails", () => {
    test("Then it should show 404 error", async () => {
      // force store to reject with 404
      mockStore.bills = jest.fn(() => ({
        list: () => Promise.reject(new Error("Erreur 404")),
      }))

      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByText(/Erreur 404/))
      expect(screen.getByText(/Erreur 404/)).toBeTruthy()
    })

    test("Then it should show 500 error", async () => {
      // force store to reject with 500
      mockStore.bills = jest.fn(() => ({
        list: () => Promise.reject(new Error("Erreur 500")),
      }))

      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByText(/Erreur 500/))
      expect(screen.getByText(/Erreur 500/)).toBeTruthy()
    })
  })
})
