const mockBills = [
  {
    id: "47qAXb6fIm2zOKkLzMro",
    vat: "80",
    fileUrl: "https://localhost:3456/images/test1.jpg",
    status: "pending",
    type: "Hôtel et logement",
    commentary: "séminaire billed",
    name: "encore",
    fileName: "preview-facture-free-201801-pdf-1.jpg",
    date: "2004-04-04",
    amount: 400,
    commentAdmin: "ok",
    email: "a@a",
    pct: 20,
  },
  {
    id: "BeKy5Mo4jkmdfPGYpTxZ",
    vat: "",
    amount: 100,
    name: "test1",
    fileName: "1592770761.jpeg",
    commentary: "plop",
    pct: 20,
    type: "Transports",
    email: "a@a",
    fileUrl: "https://localhost:3456/images/test2.jpg",
    date: "2001-01-01",
    status: "refused",
    commentAdmin: "en fait non",
  },
  {
    id: "UIUZtnPQvnbFnB0ozvJh",
    name: "test3",
    email: "a@a",
    type: "Services en ligne",
    vat: "60",
    pct: 20,
    commentAdmin: "bon bah d'accord",
    amount: 300,
    status: "accepted",
    date: "2003-03-03",
    commentary: "",
    fileName: "facture-client.png",
    fileUrl: "https://localhost:3456/images/test3.jpg",
  },
  {
    id: "qcCK3SzECmaZAGRrHjaC",
    status: "refused",
    pct: 20,
    amount: 200,
    email: "a@a",
    name: "test2",
    vat: "40",
    fileName: "preview-facture-free-201801-pdf-1.jpg",
    date: "2002-02-02",
    commentAdmin: "pas la bonne facture",
    commentary: "test2",
    type: "Restaurants et bars",
    fileUrl: "https://localhost:3456/images/test4.jpg",
  },
]

const mockStore = {
  bills: jest.fn(() => ({
    list: jest.fn(() => Promise.resolve(mockBills)),
    create: jest.fn(() =>
      Promise.resolve({
        fileUrl: "https://localhost:3456/images/uploaded.jpg",
        key: "1234",
      })
    ),
    update: jest.fn(() => Promise.resolve(mockBills[0])),
  })),
}

export default mockStore
