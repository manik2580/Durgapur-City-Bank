// Banking Management System - Enhanced JavaScript
class BankingSystem {
  constructor() {
    this.customers = JSON.parse(localStorage.getItem("customers")) || []
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || []
    this.loans = JSON.parse(localStorage.getItem("loans")) || []
    this.fdrs = JSON.parse(localStorage.getItem("fdrs")) || []
    this.dpsAccounts = JSON.parse(localStorage.getItem("dpsAccounts")) || []
    this.schedules = JSON.parse(localStorage.getItem("schedules")) || []
    this.activities = JSON.parse(localStorage.getItem("activities")) || []
    this.checkbooks = JSON.parse(localStorage.getItem("checkbooks")) || []
    this.currentLanguage = localStorage.getItem("language") || "en"
    this.currentTheme = localStorage.getItem("theme") || "light"
    this.currentColorTheme = localStorage.getItem("colorTheme") || "blue"
    this.currentPage = "dashboard"
    this.currentCustomer = null
    this.bankBalance = Number.parseFloat(localStorage.getItem("bankBalance")) || 1000000

    this.init()
    this.initializeClock()
  }

  init() {
    this.setupEventListeners()
    this.updateLanguage()
    this.updateTheme()
    this.updateColorTheme()
    this.updateDashboard()
    this.startRealTimeClock()
    this.showPage("dashboard")
    this.loadCustomersTable()
    this.loadLoansTable()
    this.loadFdrTable()
    this.loadDpsTable()
    this.loadChequeTable()
    this.loadScheduleTable()
    this.loadActivityLog()
    this.processScheduledPayments()
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const page = item.getAttribute("data-page")
        if (page) {
          this.showPage(page)
        }
      })
    })

    // Language toggle
    document.getElementById("languageToggle")?.addEventListener("click", () => {
      this.toggleLanguage()
    })

    // Theme toggle
    document.getElementById("themeToggle")?.addEventListener("click", () => {
      this.toggleTheme()
    })

    // Color theme selector
    document.querySelectorAll(".color-theme-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const theme = e.target.getAttribute("data-theme")
        this.setColorTheme(theme)
      })
    })

    // Tab functionality
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabId = e.target.getAttribute("data-tab")
        this.showTab(tabId)
      })
    })

    // Form submissions
    this.setupFormHandlers()

    // Search functionality
    this.setupSearchHandlers()

    // Modal handlers
    this.setupModalHandlers()

    // Admin tools
    this.setupAdminTools()
  }

  setupFormHandlers() {
    // Register form
    const registerForm = document.getElementById("registerForm")
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.registerCustomer()
      })
    }

    // Cash in form
    const cashInForm = document.getElementById("cashInForm")
    if (cashInForm) {
      cashInForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.processCashIn()
      })
    }

    // Cash out form
    const cashOutForm = document.getElementById("cashOutForm")
    if (cashOutForm) {
      cashOutForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.processCashOut()
      })
    }

    // Bank Transfer form
    const bankTransferForm = document.getElementById("bankTransferForm")
    if (bankTransferForm) {
      bankTransferForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.processBankTransfer()
      })
    }

    // FDR form
    const fdrForm = document.getElementById("fdrForm")
    if (fdrForm) {
      fdrForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.createFdr()
      })
    }

    // DPS form
    const dpsForm = document.getElementById("dpsForm")
    if (dpsForm) {
      dpsForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.createDps()
      })
    }

    // DPS Payment form
    const dpsPaymentForm = document.getElementById("dpsPaymentForm")
    if (dpsPaymentForm) {
      dpsPaymentForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.processDpsPayment()
      })
    }

    // Loan Issue form
    const loanIssueForm = document.getElementById("loanIssueForm")
    if (loanIssueForm) {
      loanIssueForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.issueLoan()
      })
    }

    // Loan Repay form
    const loanRepayForm = document.getElementById("loanRepayForm")
    if (loanRepayForm) {
      loanRepayForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.processLoanRepayment()
      })
    }

    // Issue Checkbook form
    const issueCheckbookForm = document.getElementById("issueCheckbookForm")
    if (issueCheckbookForm) {
      issueCheckbookForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.issueCheckbook()
      })
    }

    // Block Checkbook form
    const blockCheckbookForm = document.getElementById("blockCheckbookForm")
    if (blockCheckbookForm) {
      blockCheckbookForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.blockCheckbook()
      })
    }

    // Create Schedule form
    const createScheduleForm = document.getElementById("createScheduleForm")
    if (createScheduleForm) {
      createScheduleForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.createSchedule()
      })
    }

    // Personal Info form
    const personalInfoForm = document.getElementById("personalInfoForm")
    if (personalInfoForm) {
      personalInfoForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.updatePersonalInfo()
      })
    }

    // Custom Report form
    const customReportForm = document.getElementById("customReportForm")
    if (customReportForm) {
      customReportForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.generateCustomReport()
      })
    }
  }

  setupSearchHandlers() {
    // Cash In search
    const searchCashInBtn = document.getElementById("searchCashInBtn")
    if (searchCashInBtn) {
      searchCashInBtn.addEventListener("click", () => {
        const query = document.getElementById("searchCashIn").value
        this.searchCustomer(query, "cashIn")
      })
    }

    // Cash Out search
    const searchCashOutBtn = document.getElementById("searchCashOutBtn")
    if (searchCashOutBtn) {
      searchCashOutBtn.addEventListener("click", () => {
        const query = document.getElementById("searchCashOut").value
        this.searchCustomer(query, "cashOut")
      })
    }

    // Bank Transfer sender search
    const searchSenderBtn = document.getElementById("searchSenderBtn")
    if (searchSenderBtn) {
      searchSenderBtn.addEventListener("click", () => {
        const query = document.getElementById("searchSender").value
        this.searchCustomer(query, "sender")
      })
    }

    // Bank Transfer receiver search
    const searchReceiverBtn = document.getElementById("searchReceiverBtn")
    if (searchReceiverBtn) {
      searchReceiverBtn.addEventListener("click", () => {
        const query = document.getElementById("searchReceiver").value
        this.searchCustomer(query, "receiver")
      })
    }

    // Customer Profile search
    const searchCustomerProfileBtn = document.getElementById("searchCustomerProfileBtn")
    if (searchCustomerProfileBtn) {
      searchCustomerProfileBtn.addEventListener("click", () => {
        const query = document.getElementById("searchCustomerProfile").value
        this.searchCustomerProfile(query)
      })
    }

    // Passbook search
    const searchPassbookBtn = document.getElementById("searchPassbookBtn")
    if (searchPassbookBtn) {
      searchPassbookBtn.addEventListener("click", () => {
        const query = document.getElementById("searchPassbookCustomer").value
        this.searchPassbook(query)
      })
    }

    // FDR Customer search
    const searchFdrCustomerBtn = document.getElementById("searchFdrCustomerBtn")
    if (searchFdrCustomerBtn) {
      searchFdrCustomerBtn.addEventListener("click", () => {
        const query = document.getElementById("searchFdrCustomer").value
        this.searchCustomer(query, "fdr")
      })
    }

    // DPS Customer search
    const searchDpsCustomerBtn = document.getElementById("searchDpsCustomerBtn")
    if (searchDpsCustomerBtn) {
      searchDpsCustomerBtn.addEventListener("click", () => {
        const query = document.getElementById("searchDpsCustomer").value
        this.searchCustomer(query, "dps")
      })
    }

    // DPS Payment search
    const searchDpsPaymentBtn = document.getElementById("searchDpsPaymentBtn")
    if (searchDpsPaymentBtn) {
      searchDpsPaymentBtn.addEventListener("click", () => {
        const query = document.getElementById("searchDpsPayment").value
        this.searchDpsPayment(query)
      })
    }

    // Loan Customer search
    const searchLoanCustomerBtn = document.getElementById("searchLoanCustomerBtn")
    if (searchLoanCustomerBtn) {
      searchLoanCustomerBtn.addEventListener("click", () => {
        const query = document.getElementById("searchLoanCustomer").value
        this.searchCustomer(query, "loan")
      })
    }

    // Loan search for repayment
    const searchLoanBtn = document.getElementById("searchLoanBtn")
    if (searchLoanBtn) {
      searchLoanBtn.addEventListener("click", () => {
        const query = document.getElementById("searchLoan").value
        this.searchLoan(query)
      })
    }

    // Loan Statement search
    const searchLoanStatementBtn = document.getElementById("searchLoanStatementBtn")
    if (searchLoanStatementBtn) {
      searchLoanStatementBtn.addEventListener("click", () => {
        const query = document.getElementById("searchLoanStatement").value
        this.searchLoanStatement(query)
      })
    }

    // Checkbook Customer search
    const searchCheckbookCustomerBtn = document.getElementById("searchCheckbookCustomerBtn")
    if (searchCheckbookCustomerBtn) {
      searchCheckbookCustomerBtn.addEventListener("click", () => {
        const query = document.getElementById("searchCheckbookCustomer").value
        this.searchCustomer(query, "checkbook")
      })
    }

    // Block Customer search
    const searchBlockCustomerBtn = document.getElementById("searchBlockCustomerBtn")
    if (searchBlockCustomerBtn) {
      searchBlockCustomerBtn.addEventListener("click", () => {
        const query = document.getElementById("searchBlockCustomer").value
        this.searchCustomer(query, "block")
      })
    }

    // Schedule Customer search
    const searchScheduleCustomerBtn = document.getElementById("searchScheduleCustomerBtn")
    if (searchScheduleCustomerBtn) {
      searchScheduleCustomerBtn.addEventListener("click", () => {
        const query = document.getElementById("searchScheduleCustomer").value
        this.searchCustomer(query, "schedule")
      })
    }
  }

  setupModalHandlers() {
    // Close modals
    document.querySelectorAll(".close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        e.target.closest(".modal").style.display = "none"
      })
    })

    // Close modal on outside click
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none"
        }
      })
    })
  }

  setupAdminTools() {
    document.getElementById("wipeAllDataBtn")?.addEventListener("click", () => {
      this.showWipeDataModal()
    })
  }

  // Real-time clock functionality
  startRealTimeClock() {
    const updateClock = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      const dateString = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const timeElement = document.getElementById("current-time")
      const dateElement = document.getElementById("current-date")

      if (timeElement) timeElement.textContent = timeString
      if (dateElement) dateElement.textContent = dateString
    }

    updateClock()
    setInterval(updateClock, 1000)
  }

  showPage(pageId) {
    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
    })
    document.querySelector(`[data-page="${pageId}"]`)?.classList.add("active")

    // Update page content
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active")
    })
    document.getElementById(pageId)?.classList.add("active")

    // Update page title
    const pageTitle = document.getElementById("page-title")
    const pageTitles = {
      dashboard: "Dashboard",
      register: "Add Customer",
      "cash-in": "Cash In",
      "cash-out": "Cash Out",
      "customer-profile": "Customer Profile",
      passbook: "Passbook View",
      "bank-transfer": "Bank Transfer",
      "fixed-deposit": "Fixed Deposit (FDR)",
      dps: "DPS (Monthly Savings)",
      "loan-dashboard": "Loan Dashboard",
      "loan-issue": "Issue Loan",
      "loan-repay": "Loan Repayment",
      "loan-statement": "Loan Statement",
      customers: "Customer Management",
      reports: "Reports & Analytics",
      "cheque-management": "Cheque Management",
      "scheduled-payments": "Scheduled Payments",
      "activity-log": "Activity Log",
    }
    if (pageTitle) {
      pageTitle.textContent = pageTitles[pageId] || "Banking System"
    }

    this.currentPage = pageId

    // Page-specific initialization
    if (pageId === "dashboard") {
      this.updateDashboard()
    } else if (pageId === "loan-dashboard") {
      this.updateLoanDashboard()
    }
  }

  showTab(tabId) {
    const tabContainer = document.querySelector(`#${tabId}`).closest(".tab-content").parentElement

    // Update tab buttons
    tabContainer.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    tabContainer.querySelector(`[data-tab="${tabId}"]`).classList.add("active")

    // Update tab panes
    tabContainer.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.remove("active")
    })
    document.getElementById(tabId).classList.add("active")
  }

  // Language Management
  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === "en" ? "bn" : "en"
    localStorage.setItem("language", this.currentLanguage)
    this.updateLanguage()
  }

  updateLanguage() {
    const langBtn = document.getElementById("currentLang")
    if (langBtn) {
      langBtn.textContent = this.currentLanguage.toUpperCase()
    }

    document.querySelectorAll("[data-en][data-bn]").forEach((element) => {
      const text = this.currentLanguage === "en" ? element.getAttribute("data-en") : element.getAttribute("data-bn")
      element.textContent = text
    })
  }

  // Theme Management
  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light"
    localStorage.setItem("theme", this.currentTheme)
    this.updateTheme()
  }

  setColorTheme(theme) {
    this.currentColorTheme = theme
    localStorage.setItem("colorTheme", theme)
    this.updateColorTheme()
  }

  updateTheme() {
    document.body.setAttribute("data-theme", this.currentTheme)
    const themeIcon = document.querySelector("#themeToggle i")
    if (themeIcon) {
      themeIcon.className = this.currentTheme === "light" ? "fas fa-moon" : "fas fa-sun"
    }
  }

  updateColorTheme() {
    document.body.setAttribute("data-color-theme", this.currentColorTheme)

    // Update active color theme button
    document.querySelectorAll(".color-theme-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-theme="${this.currentColorTheme}"]`).classList.add("active")
  }

  // Checkbook Validation - NEW FEATURE
  isCheckbookNumberUnique(checkbookNumber, excludeCustomerId = null) {
    for (const customer of this.customers) {
      if (excludeCustomerId && customer.accountId === excludeCustomerId) {
        continue // Skip the customer we're updating
      }

      for (const checkbook of customer.checkbooks) {
        if (checkbook.number === checkbookNumber) {
          return {
            isUnique: false,
            existingCustomer: customer,
          }
        }
      }
    }
    return { isUnique: true }
  }

  validateCheckbookNumbers(checkbookNumbers, excludeCustomerId = null) {
    const duplicates = []

    for (const checkbookNumber of checkbookNumbers) {
      const validation = this.isCheckbookNumberUnique(checkbookNumber, excludeCustomerId)
      if (!validation.isUnique) {
        duplicates.push({
          number: checkbookNumber,
          existingCustomer: validation.existingCustomer,
        })
      }
    }

    return duplicates
  }

  // Customer Management
  generateAccountId() {
    const today = new Date()
    const dateStr =
      today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      today.getDate().toString().padStart(2, "0")

    const existingIds = this.customers
      .map((c) => c.accountId)
      .filter((id) => id.startsWith(dateStr))
      .map((id) => Number.parseInt(id.slice(-3)))
      .sort((a, b) => b - a)

    const nextSerial = existingIds.length > 0 ? existingIds[0] + 1 : 1
    return dateStr + nextSerial.toString().padStart(3, "0")
  }

  generateLoanId() {
    const today = new Date()
    const dateStr =
      "L" +
      today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      today.getDate().toString().padStart(2, "0")

    const existingIds = this.loans
      .map((l) => l.loanId)
      .filter((id) => id.startsWith(dateStr))
      .map((id) => Number.parseInt(id.slice(-3)))
      .sort((a, b) => b - a)

    const nextSerial = existingIds.length > 0 ? existingIds[0] + 1 : 1
    return dateStr + nextSerial.toString().padStart(3, "0")
  }

  generateFdrId() {
    const today = new Date()
    const dateStr =
      "F" +
      today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      today.getDate().toString().padStart(2, "0")

    const existingIds = this.fdrs
      .map((f) => f.fdrId)
      .filter((id) => id.startsWith(dateStr))
      .map((id) => Number.parseInt(id.slice(-3)))
      .sort((a, b) => b - a)

    const nextSerial = existingIds.length > 0 ? existingIds[0] + 1 : 1
    return dateStr + nextSerial.toString().padStart(3, "0")
  }

  generateDpsId() {
    const today = new Date()
    const dateStr =
      "D" +
      today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      today.getDate().toString().padStart(2, "0")

    const existingIds = this.dpsAccounts
      .map((d) => d.dpsId)
      .filter((id) => id.startsWith(dateStr))
      .map((id) => Number.parseInt(id.slice(-3)))
      .sort((a, b) => b - a)

    const nextSerial = existingIds.length > 0 ? existingIds[0] + 1 : 1
    return dateStr + nextSerial.toString().padStart(3, "0")
  }

  generateScheduleId() {
    const today = new Date()
    const dateStr =
      "S" +
      today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      today.getDate().toString().padStart(2, "0")

    const existingIds = this.schedules
      .map((s) => s.scheduleId)
      .filter((id) => id.startsWith(dateStr))
      .map((id) => Number.parseInt(id.slice(-3)))
      .sort((a, b) => b - a)

    const nextSerial = existingIds.length > 0 ? existingIds[0] + 1 : 1
    return dateStr + nextSerial.toString().padStart(3, "0")
  }

  formatCurrency(amount) {
    return (
      "৳" +
      Number.parseFloat(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  showMessage(elementId, message, type = "info") {
    const messageEl = document.getElementById(elementId)
    if (messageEl) {
      messageEl.textContent = message
      messageEl.className = `message ${type}`
      messageEl.style.display = "block"

      setTimeout(() => {
        messageEl.style.display = "none"
      }, 5000)
    }
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.className = `toast ${type}`
    toast.textContent = message

    const container = document.getElementById("toastContainer")
    container.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 5000)
  }

  showLoading() {
    document.getElementById("loadingOverlay").style.display = "block"
  }

  hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none"
  }

  // Validation functions
  validateCheckbooks(checkbooksStr) {
    const errors = []
    const checkbooks = this.parseCheckbooks(checkbooksStr)

    if (checkbooks.length === 0) {
      errors.push("Please enter valid checkbook numbers")
      return {
        valid: false,
        errors,
        checkbooks: [],
      }
    }

    // Check for duplicates within the input
    const duplicates = checkbooks.filter((item, index) => checkbooks.indexOf(item) !== index)
    if (duplicates.length > 0) {
      errors.push(`Duplicate checkbook numbers found: ${duplicates.join(", ")}`)
    }

    // Check against existing checkbooks globally
    const existingCheckbooks = this.getAllCheckbooks()
    const conflicts = checkbooks.filter((num) => existingCheckbooks.includes(num))
    if (conflicts.length > 0) {
      errors.push(`Checkbook numbers already exist: ${conflicts.join(", ")}`)
    }

    return {
      valid: errors.length === 0,
      errors,
      checkbooks: errors.length === 0 ? checkbooks : [],
    }
  }

  parseCheckbooks(checkbooksStr) {
    const checkbooks = []
    const parts = checkbooksStr.split(",").map((part) => part.trim())

    for (const part of parts) {
      if (part.includes("-")) {
        // Range format (e.g., "1001-1010")
        const [start, end] = part.split("-").map((num) => Number.parseInt(num.trim()))
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            checkbooks.push(i.toString())
          }
        }
      } else {
        // Single number
        const num = Number.parseInt(part)
        if (!isNaN(num)) {
          checkbooks.push(num.toString())
        }
      }
    }

    return [...new Set(checkbooks)] // Remove duplicates
  }

  getAllCheckbooks() {
    const allCheckbooks = []
    this.customers.forEach((customer) => {
      if (customer.checkbooks) {
        allCheckbooks.push(...customer.checkbooks)
      }
    })
    return allCheckbooks
  }

  // Customer management
  registerCustomer() {
    const name = document.getElementById("accountName").value.trim()
    const checkbooksStr = document.getElementById("checkbooks").value.trim()
    const initialBalance = Number.parseFloat(document.getElementById("initialBalance").value) || 0

    // Validation
    if (!name) {
      this.showMessage("registerMessage", "Please enter customer name", "error")
      return
    }

    if (!checkbooksStr) {
      this.showMessage("registerMessage", "Please enter checkbook numbers", "error")
      return
    }

    if (initialBalance < 0) {
      this.showMessage("registerMessage", "Initial balance cannot be negative", "error")
      return
    }

    // Validate checkbooks
    const checkbookValidation = this.validateCheckbooks(checkbooksStr)
    if (!checkbookValidation.valid) {
      this.showMessage("registerMessage", checkbookValidation.errors.join(". "), "error")
      return
    }

    const accountId = this.generateAccountId()
    const customer = {
      accountId,
      name,
      balance: initialBalance,
      checkbooks: checkbookValidation.checkbooks,
      createdDate: new Date().toISOString(),
      status: "active",
      profile: {
        phone: "",
        email: "",
        dob: "",
        address: "",
        photo: "/placeholder.svg?height=120&width=120",
        nid: "/placeholder.svg?height=200&width=300",
        passport: "/placeholder.svg?height=200&width=300",
        kycStatus: "pending",
      },
    }

    this.customers.push(customer)
    this.saveData()

    // Add checkbooks to global checkbook tracking
    checkbookValidation.checkbooks.forEach((checkbook) => {
      this.checkbooks.push({
        checkbookNumber: checkbook,
        customerId: accountId,
        customerName: name,
        issueDate: new Date().toISOString(),
        status: "active",
        lastUsed: null,
        blockedDate: null,
        blockReason: null,
      })
    })

    // Log activity
    this.logActivity(
      "customer",
      "Bank Manager",
      name,
      `New customer registered with Account ID: ${accountId}`,
      0,
      "success",
    )

    this.showMessage("registerMessage", `Customer registered successfully! Account ID: ${accountId}`, "success")
    this.updateDashboard()
    this.loadCustomersTable()

    // Reset form
    document.getElementById("registerForm").reset()
  }

  // Field Error Display Functions
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId)
    const errorElement = document.getElementById(fieldId + "Error")

    if (field) {
      field.classList.add("error-input")
    }

    if (errorElement) {
      errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`
      errorElement.classList.add("error-message")
      errorElement.style.display = "flex"
    }
  }

  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId)
    const errorElement = document.getElementById(fieldId + "Error")

    if (field) {
      field.classList.remove("error-input")
    }

    if (errorElement) {
      errorElement.innerHTML = ""
      errorElement.classList.remove("error-message")
      errorElement.style.display = "none"
    }
  }

  // Search Functions
  searchCustomer(query, context) {
    if (!query.trim()) {
      this.showToast("Please enter search query", "warning")
      return
    }

    const customer = this.customers.find(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.accountId === query ||
        (c.checkbooks && c.checkbooks.includes(query)),
    )

    if (!customer) {
      this.showToast("Customer not found", "error")
      return
    }

    this.populateCustomerFields(customer, context)
  }

  populateCustomerFields(customer, context) {
    switch (context) {
      case "cashIn":
        document.getElementById("cashInName").value = customer.name
        document.getElementById("cashInId").value = customer.accountId
        break
      case "cashOut":
        document.getElementById("cashOutName").value = customer.name
        document.getElementById("cashOutId").value = customer.accountId
        document.getElementById("currentBalance").textContent = this.formatCurrency(customer.balance)
        this.populateCheckbooks(customer.checkbooks, "cashOutCheckbook")
        break
      case "sender":
        document.getElementById("senderName").value = customer.name
        document.getElementById("senderBalance").value = this.formatCurrency(customer.balance)
        this.currentSender = customer
        break
      case "receiver":
        document.getElementById("receiverName").value = customer.name
        document.getElementById("receiverId").value = customer.accountId
        this.currentReceiver = customer
        break
      case "fdr":
        document.getElementById("fdrCustomerName").value = customer.name
        document.getElementById("fdrCustomerId").value = customer.accountId
        break
      case "dps":
        document.getElementById("dpsCustomerName").value = customer.name
        document.getElementById("dpsCustomerId").value = customer.accountId
        break
      case "loan":
        document.getElementById("loanCustomerName").value = customer.name
        document.getElementById("loanCustomerId").value = customer.accountId
        document.getElementById("customerCurrentBalance").value = this.formatCurrency(customer.balance)
        document.getElementById("bankBalance").value = this.formatCurrency(this.bankBalance)
        break
      case "checkbook":
        document.getElementById("checkbookCustomerName").value = customer.name
        document.getElementById("checkbookCustomerId").value = customer.accountId
        break
      case "block":
        document.getElementById("blockCustomerName").value = customer.name
        document.getElementById("blockCustomerId").value = customer.accountId
        this.populateBlockCheckbooks(customer.accountId)
        break
      case "schedule":
        document.getElementById("scheduleCustomerName").value = customer.name
        document.getElementById("scheduleCustomerId").value = customer.accountId
        break
    }
  }

  populateCheckbooks(checkbooks, selectId) {
    const select = document.getElementById(selectId)
    if (select) {
      select.innerHTML = '<option value="">Select Checkbook</option>'
      checkbooks.forEach((checkbook) => {
        const option = document.createElement("option")
        option.value = checkbook
        option.textContent = checkbook
        select.appendChild(option)
      })
    }
  }

  populateBlockCheckbooks(customerId) {
    const select = document.getElementById("blockCheckbookSelect")
    if (select) {
      select.innerHTML = '<option value="">Select Checkbook</option>'
      const customerCheckbooks = this.checkbooks.filter((cb) => cb.customerId === customerId && cb.status === "active")
      customerCheckbooks.forEach((checkbook) => {
        const option = document.createElement("option")
        option.value = checkbook.checkbookNumber
        option.textContent = checkbook.checkbookNumber
        select.appendChild(option)
      })
    }
  }

  searchCustomerForCashIn() {
    const query = document.getElementById("searchCashIn").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      document.getElementById("cashInName").value = customer.name
      document.getElementById("cashInId").value = customer.accountId
      this.showMessage("cashInMessage", "Customer found!", "success")
    } else {
      this.showMessage("cashInMessage", "Customer not found.", "error")
      document.getElementById("cashInName").value = ""
      document.getElementById("cashInId").value = ""
    }
  }

  searchCustomerForCashOut() {
    const query = document.getElementById("searchCashOut").value.trim()
    let customer = this.searchCustomer(query)

    // Also search by checkbook number
    if (!customer) {
      customer = this.customers.find((c) => c.checkbooks.some((cb) => cb.number === query))
    }

    if (customer) {
      document.getElementById("cashOutName").value = customer.name
      document.getElementById("cashOutId").value = customer.accountId
      document.getElementById("currentBalance").textContent = `৳${customer.balance.toFixed(2)}`

      // Populate available checkbooks
      const checkbookSelect = document.getElementById("cashOutCheckbook")
      checkbookSelect.innerHTML = '<option value="">Select Checkbook</option>'

      customer.checkbooks
        .filter((cb) => cb.status === "available")
        .forEach((cb) => {
          const option = document.createElement("option")
          option.value = cb.number
          option.textContent = cb.number
          checkbookSelect.appendChild(option)
        })

      this.showMessage("cashOutMessage", "Customer found!", "success")
    } else {
      this.showMessage("cashOutMessage", "Customer not found.", "error")
      this.clearCashOutForm()
    }
  }

  clearCashOutForm() {
    document.getElementById("cashOutName").value = ""
    document.getElementById("cashOutId").value = ""
    document.getElementById("currentBalance").textContent = "৳0.00"
    document.getElementById("cashOutCheckbook").innerHTML = '<option value="">Select Checkbook</option>'
  }

  // Transaction Processing
  processCashIn() {
    const name = document.getElementById("cashInName").value
    const accountId = document.getElementById("cashInId").value
    const amount = Number.parseFloat(document.getElementById("cashInAmount").value)
    const description = document.getElementById("cashInDescription").value || "Cash deposit"

    if (!accountId || !amount || amount <= 0) {
      this.showMessage("cashInMessage", "Please fill in all required fields with valid amounts.", "error")
      return
    }

    const customer = this.customers.find((c) => c.accountId === accountId)
    if (!customer) {
      this.showMessage("cashInMessage", "Customer not found.", "error")
      return
    }

    // Update balance
    customer.balance += amount

    // Add transaction
    this.addTransaction(accountId, "cash_in", amount, description, customer.balance)

    // Log activity
    this.logActivity("cash_in", `Cash in: ৳${amount.toFixed(2)} for ${customer.name}`, accountId, amount)

    this.saveData()
    this.showMessage("cashInMessage", `Cash in successful! New balance: ৳${customer.balance.toFixed(2)}`, "success")
    document.getElementById("cashInForm").reset()
    this.updateDashboard()
  }

  processCashOut() {
    const name = document.getElementById("cashOutName").value
    const accountId = document.getElementById("cashOutId").value
    const amount = Number.parseFloat(document.getElementById("cashOutAmount").value)
    const checkbookNumber = document.getElementById("cashOutCheckbook").value

    if (!accountId || !amount || amount <= 0 || !checkbookNumber) {
      this.showMessage("cashOutMessage", "Please fill in all required fields with valid amounts.", "error")
      return
    }

    const customer = this.customers.find((c) => c.accountId === accountId)
    if (!customer) {
      this.showMessage("cashOutMessage", "Customer not found.", "error")
      return
    }

    if (customer.balance < amount) {
      this.showMessage("cashOutMessage", "Insufficient balance.", "error")
      return
    }

    // Find and update checkbook
    const checkbook = customer.checkbooks.find((cb) => cb.number === checkbookNumber)
    if (!checkbook || checkbook.status !== "available") {
      this.showMessage("cashOutMessage", "Invalid or unavailable checkbook.", "error")
      return
    }

    // Update balance and checkbook
    customer.balance -= amount
    checkbook.status = "used"
    checkbook.usedDate = new Date().toISOString()
    checkbook.amount = amount

    // Add transaction
    this.addTransaction(accountId, "cash_out", amount, `Withdrawal via checkbook ${checkbookNumber}`, customer.balance)

    // Log activity
    this.logActivity(
      "cash_out",
      `Cash out: ৳${amount.toFixed(2)} for ${customer.name} via checkbook ${checkbookNumber}`,
      accountId,
      amount,
    )

    this.saveData()
    this.showMessage("cashOutMessage", `Cash out successful! New balance: ৳${customer.balance.toFixed(2)}`, "success")
    document.getElementById("cashOutForm").reset()
    this.clearCashOutForm()
    this.updateDashboard()
  }

  // Bank Transfer
  searchSender() {
    const query = document.getElementById("searchSender").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      document.getElementById("senderName").value = customer.name
      document.getElementById("senderBalance").value = `৳${customer.balance.toFixed(2)}`
      this.currentSender = customer
    } else {
      this.showMessage("bankTransferMessage", "Sender not found.", "error")
      document.getElementById("senderName").value = ""
      document.getElementById("senderBalance").value = ""
      this.currentSender = null
    }
  }

  searchReceiver() {
    const query = document.getElementById("searchReceiver").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      document.getElementById("receiverName").value = customer.name
      document.getElementById("receiverId").value = customer.accountId
      this.currentReceiver = customer
    } else {
      this.showMessage("bankTransferMessage", "Receiver not found.", "error")
      document.getElementById("receiverName").value = ""
      document.getElementById("receiverId").value = ""
      this.currentReceiver = null
    }
  }

  calculateTransferFee() {
    const amount = Number.parseFloat(document.getElementById("transferAmount").value) || 0
    const feeRate = 0.015 // 1.5%
    const fee = amount * feeRate
    const total = amount + fee

    document.getElementById("transferFee").value = `৳${fee.toFixed(2)}`
    document.getElementById("totalDeduction").value = `৳${total.toFixed(2)}`
  }

  processBankTransfer() {
    const amount = Number.parseFloat(document.getElementById("transferAmount").value)
    const description = document.getElementById("transferDescription").value || "Bank transfer"

    if (!this.currentSender || !this.currentReceiver) {
      this.showMessage("bankTransferMessage", "Please select both sender and receiver", "error")
      return
    }

    if (!amount || amount <= 0) {
      this.showMessage("bankTransferMessage", "Please enter a valid transfer amount", "error")
      return
    }

    const feeRate = 0.015 // 1.5%
    const fee = amount * feeRate
    const totalDeduction = amount + fee

    if (this.currentSender.balance < totalDeduction) {
      this.showMessage("bankTransferMessage", "Insufficient balance including transfer fee", "error")
      return
    }

    if (this.currentSender.accountId === this.currentReceiver.accountId) {
      this.showMessage("bankTransferMessage", "Cannot transfer to the same account", "error")
      return
    }

    // Process transfer
    this.currentSender.balance -= totalDeduction
    this.currentReceiver.balance += amount

    // Create transactions
    const senderTransaction = {
      id: Date.now().toString(),
      customerId: this.currentSender.accountId,
      customerName: this.currentSender.name,
      type: "transfer_out",
      amount: totalDeduction,
      transferAmount: amount,
      transferFee: fee,
      receiverId: this.currentReceiver.accountId,
      receiverName: this.currentReceiver.name,
      description: description,
      date: new Date().toISOString(),
      balance: this.currentSender.balance,
    }

    const receiverTransaction = {
      id: (Date.now() + 1).toString(),
      customerId: this.currentReceiver.accountId,
      customerName: this.currentReceiver.name,
      type: "transfer_in",
      amount: amount,
      senderId: this.currentSender.accountId,
      senderName: this.currentSender.name,
      description: description,
      date: new Date().toISOString(),
      balance: this.currentReceiver.balance,
    }

    this.transactions.push(senderTransaction, receiverTransaction)
    this.saveData()

    // Log activity
    this.logActivity(
      "transfer",
      "Bank Manager",
      `${this.currentSender.name} → ${this.currentReceiver.name}`,
      `Bank transfer: ${description}`,
      amount,
      "success",
    )

    this.showMessage(
      "bankTransferMessage",
      `Transfer successful! Amount: ${this.formatCurrency(amount)}, Fee: ${this.formatCurrency(fee)}`,
      "success",
    )
    this.updateDashboard()

    // Reset form
    document.getElementById("bankTransferForm").reset()
    this.currentSender = null
    this.currentReceiver = null
  }

  // FDR Management
  searchFdrCustomer() {
    const query = document.getElementById("searchFdrCustomer").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      document.getElementById("fdrCustomerName").value = customer.name
      document.getElementById("fdrCustomerId").value = customer.accountId
      this.currentFdrCustomer = customer
      this.showMessage("fdrMessage", "Customer found!", "success")
    } else {
      this.showMessage("fdrMessage", "Customer not found.", "error")
      document.getElementById("fdrCustomerName").value = ""
      document.getElementById("fdrCustomerId").value = ""
      this.currentFdrCustomer = null
    }
  }

  calculateFdr() {
    const amount = Number.parseFloat(document.getElementById("fdrAmount").value) || 0
    const duration = Number.parseInt(document.getElementById("fdrDuration").value) || 0

    if (amount > 0 && duration > 0) {
      const interestRates = {
        6: 8, // 6 months - 8% p.a.
        12: 9, // 12 months - 9% p.a.
        24: 10, // 24 months - 10% p.a.
        36: 11, // 36 months - 11% p.a.
        60: 12, // 60 months - 12% p.a.
      }

      const interestRate = interestRates[duration] || 0
      const totalInterest = (amount * interestRate * duration) / (12 * 100)
      const maturityAmount = amount + totalInterest

      const maturityDate = new Date()
      maturityDate.setMonth(maturityDate.getMonth() + duration)

      document.getElementById("fdrInterestRate").textContent = `${interestRate}% p.a.`
      document.getElementById("fdrTotalInterest").textContent = this.formatCurrency(totalInterest)
      document.getElementById("fdrMaturityAmount").textContent = this.formatCurrency(maturityAmount)
      document.getElementById("fdrMaturityDate").textContent = this.formatDate(maturityDate)
    }
  }

  clearFdrCalculation() {
    document.getElementById("fdrInterestRate").textContent = "0%"
    document.getElementById("fdrTotalInterest").textContent = "৳0.00"
    document.getElementById("fdrMaturityAmount").textContent = "৳0.00"
    document.getElementById("fdrMaturityDate").textContent = "-"
  }

  createFdr() {
    const customerName = document.getElementById("fdrCustomerName").value
    const customerId = document.getElementById("fdrCustomerId").value
    const amount = Number.parseFloat(document.getElementById("fdrAmount").value)
    const duration = Number.parseInt(document.getElementById("fdrDuration").value)

    if (!customerName || !customerId || !amount || !duration) {
      this.showMessage("fdrMessage", "Please fill all required fields", "error")
      return
    }

    if (amount < 10000) {
      this.showMessage("fdrMessage", "Minimum FDR amount is ৳10,000", "error")
      return
    }

    const customer = this.customers.find((c) => c.accountId === customerId)
    if (!customer) {
      this.showMessage("fdrMessage", "Customer not found", "error")
      return
    }

    if (customer.balance < amount) {
      this.showMessage("fdrMessage", "Insufficient account balance", "error")
      return
    }

    const interestRates = {
      6: 8,
      12: 9,
      24: 10,
      36: 11,
      60: 12,
    }

    const interestRate = interestRates[duration]
    const totalInterest = (amount * interestRate * duration) / (12 * 100)
    const maturityAmount = amount + totalInterest

    const maturityDate = new Date()
    maturityDate.setMonth(maturityDate.getMonth() + duration)

    const fdr = {
      fdrId: this.generateFdrId(),
      customerId: customerId,
      customerName: customerName,
      amount: amount,
      interestRate: interestRate,
      duration: duration,
      totalInterest: totalInterest,
      maturityAmount: maturityAmount,
      startDate: new Date().toISOString(),
      maturityDate: maturityDate.toISOString(),
      status: "active",
      createdDate: new Date().toISOString(),
    }

    // Deduct amount from customer account
    customer.balance -= amount

    this.fdrs.push(fdr)
    this.saveData()

    // Log activity
    this.logActivity(
      "fdr",
      "Bank Manager",
      customerName,
      `FDR created: ${fdr.fdrId} for ${duration} months`,
      amount,
      "success",
    )

    this.showMessage("fdrMessage", `FDR created successfully! FDR ID: ${fdr.fdrId}`, "success")
    this.loadFdrTable()

    // Reset form
    document.getElementById("fdrForm").reset()
  }

  loadFdrTable() {
    const tbody = document.getElementById("fdrTableBody")
    if (!tbody) return

    if (this.fdrs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No FDRs found</td></tr>'
      return
    }

    tbody.innerHTML = this.fdrs
      .map(
        (fdr) => `
            <tr>
                <td>${fdr.fdrId}</td>
                <td>${fdr.customerName}</td>
                <td>${this.formatCurrency(fdr.amount)}</td>
                <td>${fdr.interestRate}%</td>
                <td>${this.formatDate(fdr.maturityDate)}</td>
                <td><span class="status-badge ${fdr.status}">${fdr.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="bankSystem.viewFdr('${fdr.fdrId}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${
                      fdr.status === "active"
                        ? `
                        <button class="btn btn-sm btn-warning" onclick="bankSystem.closeFdr('${fdr.fdrId}')">
                            <i class="fas fa-times"></i> Close
                        </button>
                    `
                        : ""
                    }
                </td>
            </tr>
        `,
      )
      .join("")
  }

  refreshFdrTable() {
    this.loadFdrTable()
    this.showToast("FDR table refreshed", "success")
  }

  filterFdrs() {
    const statusFilter = document.getElementById("fdrStatusFilter").value
    let filteredFdrs = this.fdrs

    if (statusFilter !== "all") {
      filteredFdrs = this.fdrs.filter((fdr) => fdr.status === statusFilter)
    }

    const tbody = document.getElementById("fdrTableBody")
    if (filteredFdrs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No FDRs found</td></tr>'
      return
    }

    tbody.innerHTML = filteredFdrs
      .map(
        (fdr) => `
            <tr>
                <td>${fdr.fdrId}</td>
                <td>${fdr.customerName}</td>
                <td>${this.formatCurrency(fdr.amount)}</td>
                <td>${fdr.interestRate}%</td>
                <td>${this.formatDate(fdr.maturityDate)}</td>
                <td><span class="status-badge ${fdr.status}">${fdr.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="bankSystem.viewFdr('${fdr.fdrId}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${
                      fdr.status === "active"
                        ? `
                        <button class="btn btn-sm btn-warning" onclick="bankSystem.closeFdr('${fdr.fdrId}')">
                            <i class="fas fa-times"></i> Close
                        </button>
                    `
                        : ""
                    }
                </td>
            </tr>
        `,
      )
      .join("")
  }

  matureFdr(fdrId) {
    const fdr = this.fdrs.find((f) => f.id === fdrId)
    if (!fdr) return

    const customer = this.customers.find((c) => c.accountId === fdr.customerId)
    if (!customer) return

    // Add maturity amount to customer balance
    customer.balance += fdr.maturityAmount
    fdr.status = "matured"

    // Add transaction
    this.addTransaction(
      customer.accountId,
      "fdr_matured",
      fdr.maturityAmount,
      `FDR matured - ${fdr.id}`,
      customer.balance,
    )

    // Log activity
    this.logActivity(
      "fdr_matured",
      `FDR matured: ${fdr.id} for ${customer.name} - ৳${fdr.maturityAmount.toFixed(2)}`,
      customer.accountId,
      fdr.maturityAmount,
    )

    this.saveData()
    this.loadFdrTable()
    this.showMessage(
      "fdrMessage",
      `FDR ${fdrId} matured successfully! Amount credited: ৳${fdr.maturityAmount.toFixed(2)}`,
      "success",
    )
  }

  // DPS Management
  searchDpsCustomer() {
    const query = document.getElementById("searchDpsCustomer").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      document.getElementById("dpsCustomerName").value = customer.name
      document.getElementById("dpsCustomerId").value = customer.accountId
      this.currentDpsCustomer = customer
      this.showMessage("dpsMessage", "Customer found!", "success")
    } else {
      this.showMessage("dpsMessage", "Customer not found.", "error")
      document.getElementById("dpsCustomerName").value = ""
      document.getElementById("dpsCustomerId").value = ""
      this.currentDpsCustomer = null
    }
  }

  calculateDps() {
    const monthlyAmount = Number.parseFloat(document.getElementById("dpsMonthlyAmount").value) || 0
    const duration = Number.parseInt(document.getElementById("dpsDuration").value) || 0

    if (monthlyAmount > 0 && duration > 0) {
      const interestRates = {
        3: 10, // 3 years - 10% p.a.
        5: 11, // 5 years - 11% p.a.
        8: 12, // 8 years - 12% p.a.
        10: 13, // 10 years - 13% p.a.
      }

      const totalMonths = duration * 12
      const totalDeposit = monthlyAmount * totalMonths
      const interestRate = interestRates[duration] || 0

      // Calculate compound interest for DPS
      const monthlyInterestRate = interestRate / (12 * 100)
      const totalInterest =
        monthlyAmount * ((Math.pow(1 + monthlyInterestRate, totalMonths) - 1) / monthlyInterestRate - totalMonths)
      const maturityAmount = totalDeposit + totalInterest

      document.getElementById("dpsTotalMonths").textContent = totalMonths
      document.getElementById("dpsTotalDeposit").textContent = this.formatCurrency(totalDeposit)
      document.getElementById("dpsTotalInterest").textContent = this.formatCurrency(totalInterest)
      document.getElementById("dpsMaturityAmount").textContent = this.formatCurrency(maturityAmount)
    }
  }

  clearDpsCalculation() {
    document.getElementById("dpsTotalMonths").textContent = "0"
    document.getElementById("dpsTotalDeposit").textContent = "৳0.00"
    document.getElementById("dpsTotalInterest").textContent = "৳0.00"
    document.getElementById("dpsMaturityAmount").textContent = "৳0.00"
  }

  createDps() {
    const customerName = document.getElementById("dpsCustomerName").value
    const customerId = document.getElementById("dpsCustomerId").value
    const monthlyAmount = Number.parseFloat(document.getElementById("dpsMonthlyAmount").value)
    const duration = Number.parseInt(document.getElementById("dpsDuration").value)

    if (!customerName || !customerId || !monthlyAmount || !duration) {
      this.showMessage("dpsMessage", "Please fill all required fields", "error")
      return
    }

    if (monthlyAmount < 500) {
      this.showMessage("dpsMessage", "Minimum monthly DPS amount is ৳500", "error")
      return
    }

    const customer = this.customers.find((c) => c.accountId === customerId)
    if (!customer) {
      this.showMessage("dpsMessage", "Customer not found", "error")
      return
    }

    const interestRates = {
      3: 10,
      5: 11,
      8: 12,
      10: 13,
    }

    const totalMonths = duration * 12
    const totalDeposit = monthlyAmount * totalMonths
    const interestRate = interestRates[duration]
    const monthlyInterestRate = interestRate / (12 * 100)
    const totalInterest =
      monthlyAmount * ((Math.pow(1 + monthlyInterestRate, totalMonths) - 1) / monthlyInterestRate - totalMonths)
    const maturityAmount = totalDeposit + totalInterest

    const maturityDate = new Date()
    maturityDate.setFullYear(maturityDate.getFullYear() + duration)

    const dps = {
      dpsId: this.generateDpsId(),
      customerId: customerId,
      customerName: customerName,
      monthlyAmount: monthlyAmount,
      duration: duration,
      totalMonths: totalMonths,
      interestRate: interestRate,
      totalDeposit: totalDeposit,
      totalInterest: totalInterest,
      maturityAmount: maturityAmount,
      startDate: new Date().toISOString(),
      maturityDate: maturityDate.toISOString(),
      paidMonths: 0,
      status: "active",
      payments: [],
      createdDate: new Date().toISOString(),
    }

    this.dpsAccounts.push(dps)
    this.saveData()

    // Log activity
    this.logActivity(
      "dps",
      "Bank Manager",
      customerName,
      `DPS created: ${dps.dpsId} for ${duration} years`,
      monthlyAmount,
      "success",
    )

    this.showMessage("dpsMessage", `DPS created successfully! DPS ID: ${dps.dpsId}`, "success")
    this.loadDpsTable()

    // Reset form
    document.getElementById("dpsForm").reset()
  }

  loadDpsTable() {
    const tbody = document.getElementById("dpsTableBody")
    if (!tbody) return

    if (this.dpsAccounts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No DPS accounts found</td></tr>'
      return
    }

    tbody.innerHTML = this.dpsAccounts
      .map(
        (dps) => `
            <tr>
                <td>${dps.dpsId}</td>
                <td>${dps.customerName}</td>
                <td>${this.formatCurrency(dps.monthlyAmount)}</td>
                <td>${dps.duration} years</td>
                <td>${dps.paidMonths}/${dps.totalMonths}</td>
                <td><span class="status-badge ${dps.status}">${dps.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="bankSystem.viewDps('${dps.dpsId}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${
                      dps.status === "active"
                        ? `
                        <button class="btn btn-sm btn-success" onclick="bankSystem.showDpsPayment('${dps.dpsId}')">
                            <i class="fas fa-credit-card"></i> Payment
                        </button>
                    `
                        : ""
                    }
                </td>
            </tr>
        `,
      )
      .join("")
  }

  refreshDpsTable() {
    this.loadDpsTable()
    this.showToast("DPS table refreshed", "success")
  }

  filterDps() {
    const statusFilter = document.getElementById("dpsStatusFilter").value
    let filteredDps = this.dpsAccounts

    if (statusFilter !== "all") {
      filteredDps = this.dpsAccounts.filter((dps) => dps.status === statusFilter)
    }

    const tbody = document.getElementById("dpsTableBody")
    if (filteredDps.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No DPS accounts found</td></tr>'
      return
    }

    tbody.innerHTML = filteredDps
      .map(
        (dps) => `
            <tr>
                <td>${dps.dpsId}</td>
                <td>${dps.customerName}</td>
                <td>${this.formatCurrency(dps.monthlyAmount)}</td>
                <td>${dps.duration} years</td>
                <td>${dps.paidMonths}/${dps.totalMonths}</td>
                <td><span class="status-badge ${dps.status}">${dps.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="bankSystem.viewDps('${dps.dpsId}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${
                      dps.status === "active"
                        ? `
                        <button class="btn btn-sm btn-success" onclick="bankSystem.showDpsPayment('${dps.dpsId}')">
                            <i class="fas fa-credit-card"></i> Payment
                        </button>
                    `
                        : ""
                    }
                </td>
            </tr>
        `,
      )
      .join("")
  }

  searchDpsPayment() {
    const query = document.getElementById("searchDpsPayment").value.trim()
    let dps = this.dpsAccounts.find((d) => d.id === query)

    if (!dps) {
      // Search by customer name
      dps = this.dpsAccounts.find((d) => d.customerName.toLowerCase().includes(query.toLowerCase()))
    }

    if (dps) {
      document.getElementById("dpsPaymentId").value = dps.id
      document.getElementById("dpsPaymentCustomer").value = dps.customerName
      document.getElementById("dpsPaymentMonthly").value = `৳${dps.monthlyAmount.toFixed(2)}`
      document.getElementById("dpsPaymentStatus").value = `${dps.paidMonths}/${dps.totalMonths} months paid`
      document.getElementById("dpsPaymentAmount").value = dps.monthlyAmount
      this.currentDpsPayment = dps
      this.showMessage("dpsMessage", "DPS account found!", "success")
    } else {
      this.showMessage("dpsMessage", "DPS account not found.", "error")
      this.clearDpsPaymentForm()
    }
  }

  clearDpsPaymentForm() {
    document.getElementById("dpsPaymentId").value = ""
    document.getElementById("dpsPaymentCustomer").value = ""
    document.getElementById("dpsPaymentMonthly").value = ""
    document.getElementById("dpsPaymentStatus").value = ""
    document.getElementById("dpsPaymentAmount").value = ""
    this.currentDpsPayment = null
  }

  processDpsPayment() {
    if (!this.currentDpsPayment) {
      this.showMessage("dpsMessage", "Please select a DPS account.", "error")
      return
    }

    const amount = Number.parseFloat(document.getElementById("dpsPaymentAmount").value)
    const paymentMethod = document.getElementById("dpsPaymentMethod").value

    if (!amount || amount <= 0 || !paymentMethod) {
      this.showMessage("dpsMessage", "Please enter valid payment details.", "error")
      return
    }

    if (this.currentDpsPayment.paidMonths >= this.currentDpsPayment.totalMonths) {
      this.showMessage("dpsMessage", "DPS is already completed.", "error")
      return
    }

    // Process payment
    this.currentDpsPayment.paidMonths++
    this.currentDpsPayment.lastPaymentDate = new Date().toISOString()

    const payment = {
      date: new Date().toISOString(),
      amount,
      method: paymentMethod,
    }
    this.currentDpsPayment.payments.push(payment)

    // Check if DPS is completed
    if (this.currentDpsPayment.paidMonths >= this.currentDpsPayment.totalMonths) {
      this.currentDpsPayment.status = "matured"

      // Credit maturity amount to customer
      const customer = this.customers.find((c) => c.accountId === this.currentDpsPayment.customerId)
      if (customer) {
        customer.balance += this.currentDpsPayment.maturityAmount
        this.addTransaction(
          customer.accountId,
          "dps_matured",
          this.currentDpsPayment.maturityAmount,
          `DPS matured - ${this.currentDpsPayment.id}`,
          customer.balance,
        )
      }
    }

    // Log activity
    this.logActivity(
      "dps_payment",
      `DPS payment: ${this.currentDpsPayment.id} - ৳${amount.toFixed(2)}`,
      this.currentDpsPayment.customerId,
      amount,
    )

    this.saveData()
    this.showMessage(
      "dpsMessage",
      `Payment successful! ${this.currentDpsPayment.paidMonths}/${this.currentDpsPayment.totalMonths} months completed.`,
      "success",
    )

    document.getElementById("dpsPaymentForm").reset()
    this.clearDpsPaymentForm()
    this.loadDpsTable()
  }

  // Loan Management
  searchLoanCustomer() {
    const query = document.getElementById("searchLoanCustomer").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      document.getElementById("loanCustomerName").value = customer.name
      document.getElementById("loanCustomerId").value = customer.accountId
      document.getElementById("customerCurrentBalance").value = `৳${customer.balance.toFixed(2)}`
      document.getElementById("bankBalance").value = `৳${this.getBankBalance().toFixed(2)}`
      this.currentLoanCustomer = customer
      this.showMessage("loanIssueMessage", "Customer found!", "success")
    } else {
      this.showMessage("loanIssueMessage", "Customer not found.", "error")
      this.clearLoanForm()
    }
  }

  clearLoanForm() {
    document.getElementById("loanCustomerName").value = ""
    document.getElementById("loanCustomerId").value = ""
    document.getElementById("customerCurrentBalance").value = ""
    document.getElementById("bankBalance").value = ""
    this.currentLoanCustomer = null
  }

  updateLoanTypeDetails() {
    const loanType = document.getElementById("loanType").value
    const interestRates = {
      personal: 12,
      education: 8,
      business: 15,
    }

    const rate = interestRates[loanType] || 0
    document.getElementById("loanInterestRate").value = rate
    this.calculateLoan()
  }

  calculateLoan() {
    const principal = Number.parseFloat(document.getElementById("loanPrincipal").value) || 0
    const interestRate = Number.parseFloat(document.getElementById("loanInterestRate").value) || 0
    const duration = Number.parseInt(document.getElementById("loanDuration").value) || 0

    if (!principal || !interestRate || !duration) {
      this.clearLoanCalculation()
      return
    }

    // Calculate EMI using formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyRate = interestRate / (12 * 100)
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1)
    const totalPayable = emi * duration
    const totalInterest = totalPayable - principal

    document.getElementById("monthlyInstallment").textContent = `৳${emi.toFixed(2)}`
    document.getElementById("totalInterest").textContent = `৳${totalInterest.toFixed(2)}`
    document.getElementById("totalPayable").textContent = `৳${totalPayable.toFixed(2)}`
  }

  clearLoanCalculation() {
    document.getElementById("monthlyInstallment").textContent = "৳0.00"
    document.getElementById("totalInterest").textContent = "৳0.00"
    document.getElementById("totalPayable").textContent = "৳0.00"
  }

  getBankBalance() {
    // Calculate total bank balance (all customer balances)
    return this.customers.reduce((total, customer) => total + customer.balance, 0)
  }

  issueLoan() {
    if (!this.currentLoanCustomer) {
      this.showMessage("loanIssueMessage", "Please select a customer.", "error")
      return
    }

    const loanType = document.getElementById("loanType").value
    const principal = Number.parseFloat(document.getElementById("loanPrincipal").value)
    const interestRate = Number.parseFloat(document.getElementById("loanInterestRate").value)
    const duration = Number.parseInt(document.getElementById("loanDuration").value)
    const guarantor1Name = document.getElementById("guarantor1Name").value.trim()
    const guarantor1Phone = document.getElementById("guarantor1Phone").value.trim()
    const guarantor2Name = document.getElementById("guarantor2Name").value.trim()
    const guarantor2Phone = document.getElementById("guarantor2Phone").value.trim()

    if (
      !loanType ||
      !principal ||
      principal < 1000 ||
      !interestRate ||
      !duration ||
      !guarantor1Name ||
      !guarantor1Phone
    ) {
      this.showMessage("loanIssueMessage", "Please fill in all required fields. Minimum loan amount: ৳1,000", "error")
      return
    }

    const bankBalance = this.getBankBalance()
    if (bankBalance < principal) {
      this.showMessage("loanIssueMessage", "Insufficient bank balance to issue this loan.", "error")
      return
    }

    // Calculate loan details
    const monthlyRate = interestRate / (12 * 100)
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1)
    const totalPayable = emi * duration
    const totalInterest = totalPayable - principal

    const loan = {
      id: `LOAN${Date.now()}`,
      customerId: this.currentLoanCustomer.accountId,
      customerName: this.currentLoanCustomer.name,
      type: loanType,
      principal,
      interestRate,
      duration,
      emi,
      totalPayable,
      totalInterest,
      paidAmount: 0,
      remainingAmount: totalPayable,
      guarantors: [
        { name: guarantor1Name, phone: guarantor1Phone },
        ...(guarantor2Name ? [{ name: guarantor2Name, phone: guarantor2Phone }] : []),
      ],
      issuedDate: new Date().toISOString(),
      status: "active",
      payments: [],
    }

    // Add loan amount to customer balance
    this.currentLoanCustomer.balance += principal

    // Add loan
    this.loans.push(loan)

    // Add transaction
    this.addTransaction(
      this.currentLoanCustomer.accountId,
      "loan_issued",
      principal,
      `Loan issued - ${loan.id} (${loanType})`,
      this.currentLoanCustomer.balance,
    )

    // Log activity
    this.logActivity(
      "loan_issued",
      `Loan issued: ${loan.id} for ${this.currentLoanCustomer.name} - ৳${principal.toFixed(2)}`,
      this.currentLoanCustomer.accountId,
      principal,
    )

    this.saveData()
    this.showMessage("loanIssueMessage", `Loan issued successfully! Loan ID: ${loan.id}`, "success")
    document.getElementById("loanIssueForm").reset()
    this.clearLoanForm()
    this.clearLoanCalculation()
    this.currentLoanCustomer = null
    this.updateDashboard()
  }

  loadLoanDashboard() {
    // Update loan statistics
    const totalIssued = this.loans.reduce((sum, loan) => sum + loan.principal, 0)
    const totalPaid = this.loans.reduce((sum, loan) => sum + loan.paidAmount, 0)
    const totalRemaining = this.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
    const activeLoans = this.loans.filter((loan) => loan.status === "active").length

    document.getElementById("total-loans-issued").textContent = `৳${totalIssued.toFixed(2)}`
    document.getElementById("total-loans-paid").textContent = `৳${totalPaid.toFixed(2)}`
    document.getElementById("total-loans-remaining").textContent = `৳${totalRemaining.toFixed(2)}`
    document.getElementById("active-loans-count").textContent = activeLoans

    this.loadLoansTable()
  }

  loadLoansTable() {
    const tbody = document.getElementById("loansTableBody")
    if (!tbody) return

    tbody.innerHTML = ""

    if (this.loans.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No loans found</td></tr>'
      return
    }

    this.loans.forEach((loan) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${loan.id}</td>
                <td>${loan.customerName}</td>
                <td>${loan.type}</td>
                <td>৳${loan.principal.toFixed(2)}</td>
                <td>৳${loan.emi.toFixed(2)}</td>
                <td>৳${loan.paidAmount.toFixed(2)}</td>
                <td>৳${loan.remainingAmount.toFixed(2)}</td>
                <td><span class="status-indicator ${loan.status}">${loan.status}</span></td>
            `
      tbody.appendChild(row)
    })
  }

  searchLoanForRepayment() {
    const query = document.getElementById("searchLoan").value.trim()
    let loan = this.loans.find((l) => l.id === query)

    if (!loan) {
      // Search by customer name
      loan = this.loans.find((l) => l.customerName.toLowerCase().includes(query.toLowerCase()))
    }

    if (loan && loan.status === "active") {
      document.getElementById("repayLoanId").value = loan.id
      document.getElementById("repayCustomerName").value = loan.customerName
      document.getElementById("repayEmi").value = `৳${loan.emi.toFixed(2)}`
      document.getElementById("repayRemaining").value = `৳${loan.remainingAmount.toFixed(2)}`
      document.getElementById("repayAmount").value = loan.emi
      this.currentRepayLoan = loan
      this.showMessage("loanRepayMessage", "Loan found!", "success")
    } else {
      this.showMessage("loanRepayMessage", "Active loan not found.", "error")
      this.clearLoanRepayForm()
    }
  }

  clearLoanRepayForm() {
    document.getElementById("repayLoanId").value = ""
    document.getElementById("repayCustomerName").value = ""
    document.getElementById("repayEmi").value = ""
    document.getElementById("repayRemaining").value = ""
    document.getElementById("repayAmount").value = ""
    this.currentRepayLoan = null
  }

  repayLoan() {
    if (!this.currentRepayLoan) {
      this.showMessage("loanRepayMessage", "Please select a loan.", "error")
      return
    }

    const amount = Number.parseFloat(document.getElementById("repayAmount").value)
    const paymentMethod = document.getElementById("repayMethod").value

    if (!amount || amount <= 0 || !paymentMethod) {
      this.showMessage("loanRepayMessage", "Please enter valid payment details.", "error")
      return
    }

    if (amount > this.currentRepayLoan.remainingAmount) {
      this.showMessage("loanRepayMessage", "Payment amount exceeds remaining loan amount.", "error")
      return
    }

    // Process payment
    this.currentRepayLoan.paidAmount += amount
    this.currentRepayLoan.remainingAmount -= amount

    const payment = {
      date: new Date().toISOString(),
      amount,
      method: paymentMethod,
    }
    this.currentRepayLoan.payments.push(payment)

    // Check if loan is fully paid
    if (this.currentRepayLoan.remainingAmount <= 0) {
      this.currentRepayLoan.status = "paid"
    }

    // Log activity
    this.logActivity(
      "loan_payment",
      `Loan payment: ${this.currentRepayLoan.id} - ৳${amount.toFixed(2)}`,
      this.currentRepayLoan.customerId,
      amount,
    )

    this.saveData()
    this.showMessage(
      "loanRepayMessage",
      `Payment successful! Remaining amount: ৳${this.currentRepayLoan.remainingAmount.toFixed(2)}`,
      "success",
    )

    document.getElementById("loanRepayForm").reset()
    this.clearLoanRepayForm()
    this.loadLoanDashboard()
  }

  searchLoanForStatement() {
    const query = document.getElementById("searchStatementLoan").value.trim()
    let loan = this.loans.find((l) => l.id === query)

    if (!loan) {
      // Search by customer name
      loan = this.loans.find((l) => l.customerName.toLowerCase().includes(query.toLowerCase()))
    }

    if (loan) {
      this.displayLoanStatement(loan)
      this.showMessage("loanStatementMessage", "Loan statement loaded!", "success")
    } else {
      this.showMessage("loanStatementMessage", "Loan not found.", "error")
      this.clearLoanStatement()
    }
  }

  displayLoanStatement(loan) {
    // Update loan details
    document.getElementById("statementLoanId").textContent = loan.id
    document.getElementById("statementCustomerName").textContent = loan.customerName
    document.getElementById("statementLoanType").textContent = loan.type
    document.getElementById("statementPrincipal").textContent = `৳${loan.principal.toFixed(2)}`
    document.getElementById("statementInterestRate").textContent = `${loan.interestRate}%`
    document.getElementById("statementEmi").textContent = `৳${loan.emi.toFixed(2)}`
    document.getElementById("statementTotalPayable").textContent = `৳${loan.totalPayable.toFixed(2)}`
    document.getElementById("statementPaidAmount").textContent = `৳${loan.paidAmount.toFixed(2)}`
    document.getElementById("statementRemainingAmount").textContent = `৳${loan.remainingAmount.toFixed(2)}`
    document.getElementById("statementStatus").innerHTML =
      `<span class="status-indicator ${loan.status}">${loan.status}</span>`

    // Load payment history
    const tbody = document.getElementById("loanPaymentHistoryBody")
    tbody.innerHTML = ""

    if (loan.payments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No payments made yet</td></tr>'
      return
    }

    loan.payments.forEach((payment) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${new Date(payment.date).toLocaleDateString()}</td>
                <td>৳${payment.amount.toFixed(2)}</td>
                <td>${payment.method}</td>
            `
      tbody.appendChild(row)
    })
  }

  clearLoanStatement() {
    document.getElementById("statementLoanId").textContent = "-"
    document.getElementById("statementCustomerName").textContent = "-"
    document.getElementById("statementLoanType").textContent = "-"
    document.getElementById("statementPrincipal").textContent = "৳0.00"
    document.getElementById("statementInterestRate").textContent = "0%"
    document.getElementById("statementEmi").textContent = "৳0.00"
    document.getElementById("statementTotalPayable").textContent = "৳0.00"
    document.getElementById("statementPaidAmount").textContent = "৳0.00"
    document.getElementById("statementRemainingAmount").textContent = "৳0.00"
    document.getElementById("statementStatus").innerHTML = "-"

    const tbody = document.getElementById("loanPaymentHistoryBody")
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No loan selected</td></tr>'
  }

  // Customer Profile Management
  searchCustomerProfile() {
    const query = document.getElementById("searchCustomerProfile").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      this.displayCustomerProfile(customer)
      this.showMessage("customerProfileMessage", "Customer profile loaded!", "success")
    } else {
      this.showMessage("customerProfileMessage", "Customer not found.", "error")
      this.clearCustomerProfile()
    }
  }

  displayCustomerProfile(customer) {
    this.currentProfileCustomer = customer

    // Basic info
    document.getElementById("profileAccountId").textContent = customer.accountId
    document.getElementById("profileName").textContent = customer.name
    document.getElementById("profileBalance").textContent = `৳${customer.balance.toFixed(2)}`
    document.getElementById("profileCreatedDate").textContent = new Date(customer.createdDate).toLocaleDateString()

    // Profile form
    document.getElementById("profileCustomerName").value = customer.name
    document.getElementById("profilePhone").value = customer.profile.phone || ""
    document.getElementById("profileEmail").value = customer.profile.email || ""
    document.getElementById("profileDateOfBirth").value = customer.profile.dateOfBirth || ""
    document.getElementById("profileAddress").value = customer.profile.address || ""

    // KYC status
    const kycSelect = document.getElementById("kycStatus")
    kycSelect.value = customer.profile.kycStatus
    document.getElementById("profileKycStatus").innerHTML =
      `<span class="status-indicator ${customer.profile.kycStatus}">${customer.profile.kycStatus}</span>`

    // Account details
    this.updateAccountDetails(customer)

    // Load checkbook status
    this.loadCheckbookStatus(customer)

    // Load transaction history
    this.loadCustomerTransactions(customer.accountId)
  }

  updateAccountDetails(customer) {
    const totalCheckbooks = customer.checkbooks.length
    const usedCheckbooks = customer.checkbooks.filter((cb) => cb.status === "used").length
    const availableCheckbooks = totalCheckbooks - usedCheckbooks

    document.getElementById("totalCheckbooks").textContent = totalCheckbooks
    document.getElementById("usedCheckbooks").textContent = usedCheckbooks
    document.getElementById("availableCheckbooks").textContent = availableCheckbooks

    // Calculate total transactions
    const customerTransactions = this.transactions.filter((t) => t.accountId === customer.accountId)
    const totalTransactions = customerTransactions.length
    const totalCashIn = customerTransactions.filter((t) => t.type === "cash_in").reduce((sum, t) => sum + t.amount, 0)
    const totalCashOut = customerTransactions.filter((t) => t.type === "cash_out").reduce((sum, t) => sum + t.amount, 0)

    document.getElementById("totalTransactions").textContent = totalTransactions
    document.getElementById("totalCashIn").textContent = `৳${totalCashIn.toFixed(2)}`
    document.getElementById("totalCashOut").textContent = `৳${totalCashOut.toFixed(2)}`
  }

  loadCheckbookStatus(customer) {
    const tbody = document.getElementById("checkbookStatusBody")
    tbody.innerHTML = ""

    if (customer.checkbooks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No checkbooks assigned</td></tr>'
      return
    }

    customer.checkbooks.forEach((checkbook) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${checkbook.number}</td>
                <td><span class="status-indicator ${checkbook.status}">${checkbook.status}</span></td>
                <td>${checkbook.usedDate ? new Date(checkbook.usedDate).toLocaleDateString() : "-"}</td>
                <td>${checkbook.amount ? `৳${checkbook.amount.toFixed(2)}` : "-"}</td>
            `
      tbody.appendChild(row)
    })
  }

  loadCustomerTransactions(accountId) {
    const tbody = document.getElementById("customerTransactionsBody")
    tbody.innerHTML = ""

    const customerTransactions = this.transactions
      .filter((t) => t.accountId === accountId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20) // Show last 20 transactions

    if (customerTransactions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No transactions found</td></tr>'
      return
    }

    customerTransactions.forEach((transaction) => {
      const row = document.createElement("tr")
      const typeClass = transaction.type.includes("in") || transaction.type.includes("issued") ? "success" : "danger"

      row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td><span class="status-indicator ${typeClass}">${transaction.type.replace("_", " ")}</span></td>
                <td>৳${transaction.amount.toFixed(2)}</td>
                <td>${transaction.description}</td>
                <td>৳${transaction.balance.toFixed(2)}</td>
            `
      tbody.appendChild(row)
    })
  }

  updatePersonalInfo() {
    if (!this.currentProfileCustomer) {
      this.showMessage("customerProfileMessage", "No customer selected.", "error")
      return
    }

    const name = document.getElementById("profileCustomerName").value.trim()
    const phone = document.getElementById("profilePhone").value.trim()
    const email = document.getElementById("profileEmail").value.trim()
    const dateOfBirth = document.getElementById("profileDateOfBirth").value
    const address = document.getElementById("profileAddress").value.trim()
    const kycStatus = document.getElementById("kycStatus").value

    if (!name) {
      this.showMessage("customerProfileMessage", "Customer name is required.", "error")
      return
    }

    // Update customer data
    this.currentProfileCustomer.name = name
    this.currentProfileCustomer.profile.phone = phone
    this.currentProfileCustomer.profile.email = email
    this.currentProfileCustomer.profile.dateOfBirth = dateOfBirth
    this.currentProfileCustomer.profile.address = address
    this.currentProfileCustomer.profile.kycStatus = kycStatus

    // Log activity
    this.logActivity(
      "profile_updated",
      `Profile updated for ${name} (${this.currentProfileCustomer.accountId})`,
      this.currentProfileCustomer.accountId,
      0,
    )

    this.saveData()
    this.showMessage("customerProfileMessage", "Profile updated successfully!", "success")

    // Refresh display
    this.displayCustomerProfile(this.currentProfileCustomer)
  }

  clearCustomerProfile() {
    this.currentProfileCustomer = null
    document.getElementById("profileAccountId").textContent = "-"
    document.getElementById("profileName").textContent = "-"
    document.getElementById("profileBalance").textContent = "৳0.00"
    document.getElementById("profileCreatedDate").textContent = "-"
    document.getElementById("profileKycStatus").innerHTML = "-"

    // Clear form
    document.getElementById("personalInfoForm").reset()

    // Clear tables
    document.getElementById("checkbookStatusBody").innerHTML =
      '<tr><td colspan="4" class="text-center text-muted">No customer selected</td></tr>'
    document.getElementById("customerTransactionsBody").innerHTML =
      '<tr><td colspan="5" class="text-center text-muted">No customer selected</td></tr>'
  }

  // Passbook Management
  searchPassbookCustomer() {
    const query = document.getElementById("searchPassbook").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      this.displayPassbook(customer)
      this.showMessage("passbookMessage", "Passbook loaded!", "success")
    } else {
      this.showMessage("passbookMessage", "Customer not found.", "error")
      this.clearPassbook()
    }
  }

  displayPassbook(customer) {
    // Update passbook header
    document.getElementById("passbookCustomerName").textContent = customer.name
    document.getElementById("passbookAccountId").textContent = customer.accountId
    document.getElementById("passbookCurrentBalance").textContent = `৳${customer.balance.toFixed(2)}`

    // Calculate summary
    const customerTransactions = this.transactions.filter((t) => t.accountId === customer.accountId)
    const totalDeposits = customerTransactions
      .filter((t) => t.type.includes("in") || t.type.includes("issued"))
      .reduce((sum, t) => sum + t.amount, 0)
    const totalWithdrawals = customerTransactions
      .filter((t) => t.type.includes("out"))
      .reduce((sum, t) => sum + t.amount, 0)

    document.getElementById("passbookTotalDeposits").textContent = `৳${totalDeposits.toFixed(2)}`
    document.getElementById("passbookTotalWithdrawals").textContent = `৳${totalWithdrawals.toFixed(2)}`
    document.getElementById("passbookTotalTransactions").textContent = customerTransactions.length

    // Load transactions
    this.loadPassbookTransactions(customer.accountId)
  }

  loadPassbookTransactions(accountId) {
    const tbody = document.getElementById("passbookTransactionsBody")
    tbody.innerHTML = ""

    const customerTransactions = this.transactions
      .filter((t) => t.accountId === accountId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    if (customerTransactions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No transactions found</td></tr>'
      return
    }

    customerTransactions.forEach((transaction) => {
      const row = document.createElement("tr")
      const isCredit = transaction.type.includes("in") || transaction.type.includes("issued")

      row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${transaction.description}</td>
                <td>${isCredit ? `৳${transaction.amount.toFixed(2)}` : "-"}</td>
                <td>${!isCredit ? `৳${transaction.amount.toFixed(2)}` : "-"}</td>
                <td>৳${transaction.balance.toFixed(2)}</td>
                <td><span class="status-indicator ${isCredit ? "success" : "danger"}">${transaction.type.replace("_", " ")}</span></td>
            `
      tbody.appendChild(row)
    })
  }

  clearPassbook() {
    document.getElementById("passbookCustomerName").textContent = "-"
    document.getElementById("passbookAccountId").textContent = "-"
    document.getElementById("passbookCurrentBalance").textContent = "৳0.00"
    document.getElementById("passbookTotalDeposits").textContent = "৳0.00"
    document.getElementById("passbookTotalWithdrawals").textContent = "৳0.00"
    document.getElementById("passbookTotalTransactions").textContent = "0"

    const tbody = document.getElementById("passbookTransactionsBody")
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No customer selected</td></tr>'
  }

  // Cheque Management
  searchChequeCustomer() {
    const query = document.getElementById("searchChequeCustomer").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      this.displayChequeStatus(customer)
      this.showMessage("chequeMessage", "Customer checkbooks loaded!", "success")
    } else {
      this.showMessage("chequeMessage", "Customer not found.", "error")
      this.clearChequeStatus()
    }
  }

  displayChequeStatus(customer) {
    // Update customer info
    document.getElementById("chequeCustomerName").textContent = customer.name
    document.getElementById("chequeAccountId").textContent = customer.accountId

    // Load checkbook table
    const tbody = document.getElementById("chequeStatusBody")
    tbody.innerHTML = ""

    if (customer.checkbooks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No checkbooks assigned</td></tr>'
      return
    }

    customer.checkbooks.forEach((checkbook) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${checkbook.number}</td>
                <td><span class="status-indicator ${checkbook.status}">${checkbook.status}</span></td>
                <td>${checkbook.usedDate ? new Date(checkbook.usedDate).toLocaleDateString() : "-"}</td>
                <td>${checkbook.amount ? `৳${checkbook.amount.toFixed(2)}` : "-"}</td>
                <td>
                    ${
                      checkbook.status === "available"
                        ? `<button class="btn btn-danger btn-sm" onclick="bankSystem.blockCheckbook('${customer.accountId}', '${checkbook.number}')">Block</button>`
                        : "-"
                    }
                </td>
            `
      tbody.appendChild(row)
    })
  }

  blockCheckbook(customerId, checkbookNumber) {
    const customer = this.customers.find((c) => c.accountId === customerId)
    if (!customer) return

    const checkbook = customer.checkbooks.find((cb) => cb.number === checkbookNumber)
    if (!checkbook) return

    checkbook.status = "blocked"

    // Log activity
    this.logActivity("checkbook_blocked", `Checkbook ${checkbookNumber} blocked for ${customer.name}`, customerId, 0)

    this.saveData()
    this.displayChequeStatus(customer)
    this.showMessage("chequeMessage", `Checkbook ${checkbookNumber} has been blocked.`, "success")
  }

  clearChequeStatus() {
    document.getElementById("chequeCustomerName").textContent = "-"
    document.getElementById("chequeAccountId").textContent = "-"

    const tbody = document.getElementById("chequeStatusBody")
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No customer selected</td></tr>'
  }

  searchBlockChequeCustomer() {
    const query = document.getElementById("searchBlockChequeCustomer").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      document.getElementById("blockChequeCustomerName").value = customer.name
      document.getElementById("blockChequeCustomerId").value = customer.accountId

      // Populate available checkbooks
      const checkbookSelect = document.getElementById("blockChequeNumber")
      checkbookSelect.innerHTML = '<option value="">Select Checkbook</option>'

      customer.checkbooks
        .filter((cb) => cb.status === "available")
        .forEach((cb) => {
          const option = document.createElement("option")
          option.value = cb.number
          option.textContent = cb.number
          checkbookSelect.appendChild(option)
        })

      this.currentBlockChequeCustomer = customer
      this.showMessage("chequeMessage", "Customer found!", "success")
    } else {
      this.showMessage("chequeMessage", "Customer not found.", "error")
      this.clearBlockChequeForm()
    }
  }

  clearBlockChequeForm() {
    document.getElementById("blockChequeCustomerName").value = ""
    document.getElementById("blockChequeCustomerId").value = ""
    document.getElementById("blockChequeNumber").innerHTML = '<option value="">Select Checkbook</option>'
    this.currentBlockChequeCustomer = null
  }

  blockCheque() {
    if (!this.currentBlockChequeCustomer) {
      this.showMessage("chequeMessage", "Please select a customer.", "error")
      return
    }

    const checkbookNumber = document.getElementById("blockChequeNumber").value
    const reason = document.getElementById("blockReason").value.trim()

    if (!checkbookNumber || !reason) {
      this.showMessage("chequeMessage", "Please select a checkbook and provide a reason.", "error")
      return
    }

    const checkbook = this.currentBlockChequeCustomer.checkbooks.find((cb) => cb.number === checkbookNumber)
    if (!checkbook) {
      this.showMessage("chequeMessage", "Checkbook not found.", "error")
      return
    }

    checkbook.status = "blocked"
    checkbook.blockReason = reason
    checkbook.blockDate = new Date().toISOString()

    // Log activity
    this.logActivity(
      "checkbook_blocked",
      `Checkbook ${checkbookNumber} blocked for ${this.currentBlockChequeCustomer.name} - Reason: ${reason}`,
      this.currentBlockChequeCustomer.accountId,
      0,
    )

    this.saveData()
    this.showMessage("chequeMessage", `Checkbook ${checkbookNumber} has been blocked successfully.`, "success")
    document.getElementById("blockChequeForm").reset()
    this.clearBlockChequeForm()
  }

  // Scheduled Payments
  searchScheduleCustomer() {
    const query = document.getElementById("searchScheduleCustomer").value.trim()
    const customer = this.searchCustomer(query)

    if (customer) {
      document.getElementById("scheduleCustomerName").value = customer.name
      document.getElementById("scheduleCustomerId").value = customer.accountId
      this.currentScheduleCustomer = customer
      this.showMessage("scheduleMessage", "Customer found!", "success")
    } else {
      this.showMessage("scheduleMessage", "Customer not found.", "error")
      this.clearScheduleForm()
    }
  }

  clearScheduleForm() {
    document.getElementById("scheduleCustomerName").value = ""
    document.getElementById("scheduleCustomerId").value = ""
    this.currentScheduleCustomer = null
  }

  schedulePayment() {
    if (!this.currentScheduleCustomer) {
      this.showMessage("scheduleMessage", "Please select a customer.", "error")
      return
    }

    const amount = Number.parseFloat(document.getElementById("scheduleAmount").value)
    const description = document.getElementById("scheduleDescription").value.trim()
    const scheduledDate = document.getElementById("scheduledDate").value
    const frequency = document.getElementById("scheduleFrequency").value

    if (!amount || amount <= 0 || !description || !scheduledDate || !frequency) {
      this.showMessage("scheduleMessage", "Please fill in all required fields.", "error")
      return
    }

    const scheduledPayment = {
      id: `SCHEDULE${Date.now()}`,
      customerId: this.currentScheduleCustomer.accountId,
      customerName: this.currentScheduleCustomer.name,
      amount,
      description,
      scheduledDate,
      frequency,
      status: "active",
      createdDate: new Date().toISOString(),
      lastExecuted: null,
      nextExecution: scheduledDate,
    }

    this.scheduledPayments.push(scheduledPayment)

    // Log activity
    this.logActivity(
      "payment_scheduled",
      `Payment scheduled: ${scheduledPayment.id} for ${this.currentScheduleCustomer.name} - ৳${amount.toFixed(2)}`,
      this.currentScheduleCustomer.accountId,
      amount,
    )

    this.saveData()
    this.showMessage(
      "scheduleMessage",
      `Payment scheduled successfully! Schedule ID: ${scheduledPayment.id}`,
      "success",
    )
    document.getElementById("schedulePaymentForm").reset()
    this.clearScheduleForm()
    this.loadScheduledPaymentsTable()
  }

  loadScheduledPaymentsTable() {
    const tbody = document.getElementById("scheduledPaymentsBody")
    if (!tbody) return

    tbody.innerHTML = ""

    if (this.scheduledPayments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No scheduled payments found</td></tr>'
      return
    }

    this.scheduledPayments.forEach((payment) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${payment.id}</td>
                <td>${payment.customerName}</td>
                <td>৳${payment.amount.toFixed(2)}</td>
                <td>${payment.description}</td>
                <td>${new Date(payment.nextExecution).toLocaleDateString()}</td>
                <td>${payment.frequency}</td>
                <td><span class="status-indicator ${payment.status}">${payment.status}</span></td>
            `
      tbody.appendChild(row)
    })
  }

  processScheduledPayments() {
    const today = new Date().toISOString().split("T")[0]

    this.scheduledPayments
      .filter((payment) => payment.status === "active" && payment.nextExecution <= today)
      .forEach((payment) => {
        const customer = this.customers.find((c) => c.accountId === payment.customerId)
        if (customer && customer.balance >= payment.amount) {
          // Process payment
          customer.balance -= payment.amount

          // Add transaction
          this.addTransaction(
            customer.accountId,
            "scheduled_payment",
            payment.amount,
            `Scheduled payment: ${payment.description}`,
            customer.balance,
          )

          // Update next execution date
          const nextDate = new Date(payment.nextExecution)
          switch (payment.frequency) {
            case "daily":
              nextDate.setDate(nextDate.getDate() + 1)
              break
            case "weekly":
              nextDate.setDate(nextDate.getDate() + 7)
              break
            case "monthly":
              nextDate.setMonth(nextDate.getMonth() + 1)
              break
            case "yearly":
              nextDate.setFullYear(nextDate.getFullYear() + 1)
              break
          }

          payment.lastExecuted = today
          payment.nextExecution = nextDate.toISOString().split("T")[0]

          // Log activity
          this.logActivity(
            "scheduled_payment_executed",
            `Scheduled payment executed: ${payment.id} - ৳${payment.amount.toFixed(2)}`,
            customer.accountId,
            payment.amount,
          )
        }
      })

    this.saveData()
  }

  // Activity Log
  logActivity(type, description, accountId = null, amount = 0) {
    const activity = {
      id: `ACT${Date.now()}`,
      type,
      description,
      accountId,
      amount,
      timestamp: new Date().toISOString(),
      user: "System Admin", // In a real system, this would be the logged-in user
    }

    this.activityLog.push(activity)

    // Keep only last 1000 activities to prevent storage overflow
    if (this.activityLog.length > 1000) {
      this.activityLog = this.activityLog.slice(-1000)
    }

    this.saveData()
  }

  loadActivityLog() {
    const tbody = document.getElementById("activityLogBody")
    if (!tbody) return

    tbody.innerHTML = ""

    if (this.activityLog.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No activities found</td></tr>'
      return
    }

    // Show latest activities first
    const recentActivities = this.activityLog
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 100) // Show last 100 activities

    recentActivities.forEach((activity) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${new Date(activity.timestamp).toLocaleString()}</td>
                <td><span class="status-indicator ${activity.type.includes("error") ? "danger" : "success"}">${activity.type.replace("_", " ")}</span></td>
                <td>${activity.description}</td>
                <td>${activity.accountId || "-"}</td>
                <td>${activity.amount > 0 ? `৳${activity.amount.toFixed(2)}` : "-"}</td>
                <td>${activity.user}</td>
            `
      tbody.appendChild(row)
    })
  }

  // Transaction Management
  addTransaction(accountId, type, amount, description, balance) {
    const transaction = {
      id: `TXN${Date.now()}`,
      accountId,
      type,
      amount,
      description,
      balance,
      date: new Date().toISOString(),
    }

    this.transactions.push(transaction)
    this.saveData()
  }

  // Customer Management
  loadCustomerTable() {
    const tbody = document.getElementById("customersTableBody")
    if (!tbody) return

    tbody.innerHTML = ""

    if (this.customers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No customers found</td></tr>'
      return
    }

    this.customers.forEach((customer) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${customer.accountId}</td>
                <td>${customer.name}</td>
                <td>৳${customer.balance.toFixed(2)}</td>
                <td>${customer.checkbooks.length}</td>
                <td><span class="status-indicator ${customer.profile.kycStatus}">${customer.profile.kycStatus}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="bankSystem.viewCustomerDetails('${customer.accountId}')">View</button>
                    <button class="btn btn-danger btn-sm" onclick="bankSystem.deleteCustomer('${customer.accountId}')">Delete</button>
                </td>
            `
      tbody.appendChild(row)
    })
  }

  viewCustomerDetails(accountId) {
    const customer = this.customers.find((c) => c.accountId === accountId)
    if (customer) {
      this.showPage("customer-profile")
      document.getElementById("searchCustomerProfile").value = customer.accountId
      this.searchCustomerProfile()
    }
  }

  deleteCustomer(accountId) {
    if (confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      this.customers = this.customers.filter((c) => c.accountId !== accountId)
      this.transactions = this.transactions.filter((t) => t.accountId !== accountId)

      // Log activity
      this.logActivity("customer_deleted", `Customer deleted: ${accountId}`, accountId, 0)

      this.saveData()
      this.loadCustomerTable()
      this.updateDashboard()
      this.showMessage("customersMessage", "Customer deleted successfully.", "success")
    }
  }

  // Reports
  loadReports() {
    this.generateDailyReport()
    this.generateMonthlyReport()
    this.generateCustomerReport()
  }

  generateDailyReport() {
    const today = new Date().toISOString().split("T")[0]
    const todayTransactions = this.transactions.filter((t) => t.date.startsWith(today))

    const cashIn = todayTransactions.filter((t) => t.type === "cash_in").reduce((sum, t) => sum + t.amount, 0)
    const cashOut = todayTransactions.filter((t) => t.type === "cash_out").reduce((sum, t) => sum + t.amount, 0)
    const transfers = todayTransactions.filter((t) => t.type.includes("transfer")).length / 2 // Divide by 2 as each transfer creates 2 transactions

    document.getElementById("dailyCashIn").textContent = `৳${cashIn.toFixed(2)}`
    document.getElementById("dailyCashOut").textContent = `৳${cashOut.toFixed(2)}`
    document.getElementById("dailyTransfers").textContent = transfers
    document.getElementById("dailyTransactions").textContent = todayTransactions.length
  }

  generateMonthlyReport() {
    const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
    const monthlyTransactions = this.transactions.filter((t) => t.date.startsWith(currentMonth))

    const totalCashIn = monthlyTransactions.filter((t) => t.type === "cash_in").reduce((sum, t) => sum + t.amount, 0)
    const totalCashOut = monthlyTransactions.filter((t) => t.type === "cash_out").reduce((sum, t) => sum + t.amount, 0)
    const newCustomers = this.customers.filter((c) => c.createdDate.startsWith(currentMonth)).length

    document.getElementById("monthlyCashIn").textContent = `৳${totalCashIn.toFixed(2)}`
    document.getElementById("monthlyCashOut").textContent = `৳${totalCashOut.toFixed(2)}`
    document.getElementById("monthlyNewCustomers").textContent = newCustomers
    document.getElementById("monthlyTransactions").textContent = monthlyTransactions.length
  }

  generateCustomerReport() {
    const totalCustomers = this.customers.length
    const activeCustomers = this.customers.filter((c) => {
      const lastTransaction = this.transactions
        .filter((t) => t.accountId === c.accountId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      return lastTransaction && new Date(lastTransaction.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
    }).length

    const verifiedCustomers = this.customers.filter((c) => c.profile.kycStatus === "verified").length

    document.getElementById("totalCustomersReport").textContent = totalCustomers
    document.getElementById("activeCustomersReport").textContent = activeCustomers
    document.getElementById("verifiedCustomersReport").textContent = verifiedCustomers
    document.getElementById("pendingKycReport").textContent = totalCustomers - verifiedCustomers
  }

  // Dashboard Updates
  updateDashboard() {
    this.updateStatistics()
    this.updateRecentTransactions()
    this.updateTodaySummary()
  }

  updateStatistics() {
    // Calculate totals
    const totalCashIn = this.transactions.filter((t) => t.type === "cash_in").reduce((sum, t) => sum + t.amount, 0)
    const totalCashOut = this.transactions.filter((t) => t.type === "cash_out").reduce((sum, t) => sum + t.amount, 0)
    const totalBalance = this.customers.reduce((sum, c) => sum + c.balance, 0)
    const totalCustomers = this.customers.length

    // Loan statistics
    const totalLoansIssued = this.loans.reduce((sum, loan) => sum + loan.principal, 0)
    const totalLoansPaid = this.loans.reduce((sum, loan) => sum + loan.paidAmount, 0)
    const totalLoansRemaining = this.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
    const totalLoansCount = this.loans.length

    // Update dashboard cards
    document.getElementById("total-cash-in").textContent = `৳${totalCashIn.toFixed(2)}`
    document.getElementById("total-cash-out").textContent = `৳${totalCashOut.toFixed(2)}`
    document.getElementById("total-balance").textContent = `৳${totalBalance.toFixed(2)}`
    document.getElementById("total-customers").textContent = totalCustomers

    // Update loan dashboard if elements exist
    if (document.getElementById("total-loans-issued")) {
      document.getElementById("total-loans-issued").textContent = `৳${totalLoansIssued.toFixed(2)}`
      document.getElementById("total-loans-paid").textContent = `৳${totalLoansPaid.toFixed(2)}`
      document.getElementById("total-loans-remaining").textContent = `৳${totalLoansRemaining.toFixed(2)}`
      document.getElementById("active-loans-count").textContent = totalLoansCount
    }
  }

  updateRecentTransactions() {
    const tbody = document.getElementById("recentTransactionsBody")
    if (!tbody) return

    tbody.innerHTML = ""

    const recentTransactions = this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)

    if (recentTransactions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No transactions found</td></tr>'
      return
    }

    recentTransactions.forEach((transaction) => {
      const customer = this.customers.find((c) => c.accountId === transaction.accountId)
      const row = document.createElement("tr")

      row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${customer ? customer.name : "Unknown"}</td>
                <td><span class="status-indicator ${transaction.type.includes("in") || transaction.type.includes("issued") ? "success" : "danger"}">${transaction.type.replace("_", " ")}</span></td>
                <td>৳${transaction.amount.toFixed(2)}</td>
                <td>${transaction.description}</td>
            `
      tbody.appendChild(row)
    })
  }

  updateTodaySummary() {
    const today = new Date().toISOString().split("T")[0]
    const todayTransactions = this.transactions.filter((t) => t.date.startsWith(today))

    const todayCashIn = todayTransactions.filter((t) => t.type === "cash_in").reduce((sum, t) => sum + t.amount, 0)
    const todayCashOut = todayTransactions.filter((t) => t.type === "cash_out").reduce((sum, t) => sum + t.amount, 0)
    const todayTransactionCount = todayTransactions.length

    document.getElementById("today-cash-in").textContent = `৳${todayCashIn.toFixed(2)}`
    document.getElementById("today-cash-out").textContent = `৳${todayCashOut.toFixed(2)}`
    document.getElementById("today-transactions").textContent = todayTransactionCount
  }

  // Admin Tools
  showWipeDataModal() {
    document.getElementById("wipeDataModal").style.display = "flex"
  }

  confirmWipeData() {
    if (confirm("Are you absolutely sure? This will delete ALL data and cannot be undone!")) {
      this.customers = []
      this.transactions = []
      this.loans = []
      this.fdrs = []
      this.dpsAccounts = []
      this.scheduledPayments = []
      this.activityLog = []

      this.saveData()
      this.updateDashboard()

      document.getElementById("wipeDataModal").style.display = "none"
      alert("All data has been wiped successfully.")
    }
  }

  // Utility Functions
  showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId)
    if (messageElement) {
      messageElement.textContent = message
      messageElement.className = `message ${type}`
      messageElement.style.display = "block"

      // Auto-hide after 5 seconds
      setTimeout(() => {
        messageElement.style.display = "none"
      }, 5000)
    }
  }

  saveData() {
    localStorage.setItem("bankCustomers", JSON.stringify(this.customers))
    localStorage.setItem("bankTransactions", JSON.stringify(this.transactions))
    localStorage.setItem("bankLoans", JSON.stringify(this.loans))
    localStorage.setItem("bankFdrs", JSON.stringify(this.fdrs))
    localStorage.setItem("bankDps", JSON.stringify(this.dpsAccounts))
    localStorage.setItem("bankScheduledPayments", JSON.stringify(this.scheduledPayments))
    localStorage.setItem("bankActivityLog", JSON.stringify(this.activityLog))
  }

  // Real-time Clock
  initializeClock() {
    this.updateClock()
    setInterval(() => this.updateClock(), 1000)
  }

  updateClock() {
    const clockElement = document.getElementById("realTimeClock")
    const dateElement = document.getElementById("clockDate")

    if (!clockElement || !dateElement) return

    const now = new Date()

    // Format time (12-hour format with AM/PM)
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }

    // Format date
    const dateOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    }

    const timeString = now.toLocaleTimeString("en-US", timeOptions)
    const dateString = now.toLocaleDateString("en-US", dateOptions)

    // Add tick animation
    clockElement.classList.add("clock-tick")
    setTimeout(() => clockElement.classList.remove("clock-tick"), 100)

    clockElement.textContent = timeString
    dateElement.textContent = dateString
  }
}

// Initialize the banking system when the page loads
let bankSystem
document.addEventListener("DOMContentLoaded", () => {
  window.bankSystem = new BankingSystem()

  // Add event listeners for form calculations
  document.getElementById("transferAmount")?.addEventListener("input", () => {
    bankSystem.calculateTransferFee()
  })

  document.getElementById("fdrAmount")?.addEventListener("input", () => {
    bankSystem.calculateFdr()
  })

  document.getElementById("fdrDuration")?.addEventListener("change", () => {
    bankSystem.calculateFdr()
  })

  document.getElementById("dpsMonthlyAmount")?.addEventListener("input", () => {
    bankSystem.calculateDps()
  })

  document.getElementById("dpsDuration")?.addEventListener("change", () => {
    bankSystem.calculateDps()
  })

  document.getElementById("loanType")?.addEventListener("change", () => {
    bankSystem.updateLoanTypeDetails()
  })

  document.getElementById("loanPrincipal")?.addEventListener("input", () => {
    bankSystem.calculateLoan()
  })

  document.getElementById("loanInterestRate")?.addEventListener("input", () => {
    bankSystem.calculateLoan()
  })

  document.getElementById("loanDuration")?.addEventListener("input", () => {
    bankSystem.calculateLoan()
  })
})

// Export for global access
window.bankSystem = bankSystem
