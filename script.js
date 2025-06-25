/**
 * Personal Banking Management System with Loan Management
 * Enhanced JavaScript Implementation with localStorage
 */

class PersonalBankingSystem {
  constructor() {
    // Initialize data structures
    this.accounts = this.loadFromStorage("bankAccounts") || []
    this.transactions = this.loadFromStorage("bankTransactions") || []
    this.usedCheckNumbers = this.loadFromStorage("usedCheckNumbers") || []
    this.loans = this.loadFromStorage("bankLoans") || []
    this.loanRepayments = this.loadFromStorage("loanRepayments") || []

    // Current selected account for operations
    this.currentAccount = null
    this.currentLoan = null

    // Initialize the application
    this.init()

    // Add these properties to the constructor
    this.pendingTransaction = null
    this.pendingLoan = null
    this.pendingLoanRepayment = null
    this.currentDeleteAccountId = null
    this.currentStatementPage = 1
    this.transactionsPerPage = 10
    this.currentManageAccount = null
    this.currentStatementAccount = null
    this.currentEditAccount = null

    // Initialize theme and clock
    this.initializeTheme()
    this.initializeClock()
  }

  /**
   * Initialize the application
   */
  init() {
    this.setupNavigation()
    this.setupEventListeners()
    this.setupTransactionConfirmation()
    this.setupLoanEventListeners()
    this.loadDashboard()
    this.loadCustomerTable()
    this.setupModals()
    this.setupFormValidation()

    const today = new Date().toISOString().split("T")[0]
    document.getElementById("dateTo").value = today

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    document.getElementById("dateFrom").value = thirtyDaysAgo.toISOString().split("T")[0]
  }

  /**
   * Initialize theme system
   */
  initializeTheme() {
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem("bankingAppTheme") || "light"
    this.setTheme(savedTheme)

    // Setup theme toggle button
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme()
      })
    }
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("bankingAppTheme", theme)

    // Update toggle button icon
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      const icon = themeToggle.querySelector("i")
      if (theme === "dark") {
        icon.className = "fas fa-sun"
      } else {
        icon.className = "fas fa-moon"
      }
    }
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    this.setTheme(newTheme)
  }

  /**
   * Initialize real-time clock
   */
  initializeClock() {
    this.updateClock()
    // Update every second
    setInterval(() => {
      this.updateClock()
    }, 1000)
  }

  /**
   * Update clock display
   */
  updateClock() {
    const now = new Date()

    // Format time (HH:MM:SS)
    const timeString = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    // Format date
    const dateString = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })

    // Update DOM elements
    const timeElement = document.getElementById("current-time")
    const dateElement = document.getElementById("current-date")

    if (timeElement) timeElement.textContent = timeString
    if (dateElement) dateElement.textContent = dateString
  }

  /**
   * Setup navigation functionality
   */
  setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item")
    const pages = document.querySelectorAll(".page")
    const pageTitle = document.getElementById("page-title")

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const targetPage = item.getAttribute("data-page")
        this.showPage(targetPage)
      })
    })
  }

  /**
   * Show specific page
   */
  showPage(targetPage) {
    const navItems = document.querySelectorAll(".nav-item")
    const pages = document.querySelectorAll(".page")
    const pageTitle = document.getElementById("page-title")

    // Update active nav item
    navItems.forEach((nav) => nav.classList.remove("active"))
    document.querySelector(`[data-page="${targetPage}"]`).classList.add("active")

    // Show target page
    pages.forEach((page) => page.classList.remove("active"))
    document.getElementById(targetPage).classList.add("active")

    // Update page title
    const titles = {
      dashboard: "Dashboard",
      register: "Add Customer",
      "cash-in": "Cash In",
      "cash-out": "Cash Out",
      "loan-dashboard": "Loan Management",
      "loan-issue": "Issue Loan",
      "loan-repay": "Loan Repayment",
      "loan-statement": "Loan Statement",
      customers: "Customer Management",
      reports: "Transaction Reports",
    }
    pageTitle.textContent = titles[targetPage] || "Dashboard"

    // Refresh data for specific pages
    if (targetPage === "dashboard") {
      this.loadDashboard()
    } else if (targetPage === "customers") {
      this.loadCustomerTable()
    } else if (targetPage === "reports") {
      this.loadReports()
    } else if (targetPage === "loan-dashboard") {
      this.loadLoanDashboard()
    }
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Register form
    document.getElementById("registerForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleRegister()
    })

    // Cash In form and search
    document.getElementById("cashInForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleCashIn()
    })

    document.getElementById("searchCashInBtn").addEventListener("click", () => {
      this.searchCustomer("cashIn")
    })

    // Cash Out form and search
    document.getElementById("cashOutForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleCashOut()
    })

    document.getElementById("searchCashOutBtn").addEventListener("click", () => {
      this.searchCustomer("cashOut")
    })

    // Add checkbook form
    document.getElementById("addCheckbookForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleAddCheckbook()
    })

    // Report filters
    document.getElementById("filterReports").addEventListener("click", () => {
      this.loadReports()
    })

    // PDF download
    document.getElementById("downloadPDF").addEventListener("click", () => {
      this.downloadStatementPDF()
    })

    // Edit account form
    document.getElementById("editAccountForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleEditAccount()
    })

    document.getElementById("cancelEditAccount").addEventListener("click", () => {
      document.getElementById("editAccountModal").style.display = "none"
      this.currentEditAccount = null
    })
  }

  /**
   * Setup loan-specific event listeners
   */
  setupLoanEventListeners() {
    // Loan issue form
    document.getElementById("loanIssueForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleLoanIssue()
    })

    // Loan customer search
    document.getElementById("searchLoanCustomerBtn").addEventListener("click", () => {
      this.searchLoanCustomer()
    })

    // Loan repayment form
    document.getElementById("loanRepayForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleLoanRepayment()
    })

    // Loan search for repayment
    document.getElementById("searchLoanBtn").addEventListener("click", () => {
      this.searchLoan()
    })

    // Loan statement search
    document.getElementById("searchStatementLoanBtn").addEventListener("click", () => {
      this.searchLoanForStatement()
    })

    // Loan statement PDF download
    document.getElementById("downloadLoanStatementPDF").addEventListener("click", () => {
      this.downloadLoanStatementPDF()
    })

    // Loan confirmation modals
    document.getElementById("cancelLoanConfirm").addEventListener("click", () => {
      document.getElementById("loanConfirmModal").style.display = "none"
      this.pendingLoan = null
    })

    document.getElementById("confirmLoanIssue").addEventListener("click", () => {
      if (this.pendingLoan) {
        this.executeLoanIssue()
      }
      document.getElementById("loanConfirmModal").style.display = "none"
    })

    document.getElementById("cancelLoanRepayConfirm").addEventListener("click", () => {
      document.getElementById("loanRepayConfirmModal").style.display = "none"
      this.pendingLoanRepayment = null
    })

    document.getElementById("confirmLoanRepayment").addEventListener("click", () => {
      if (this.pendingLoanRepayment) {
        this.executeLoanRepayment()
      }
      document.getElementById("loanRepayConfirmModal").style.display = "none"
    })
  }

  /**
   * Setup modal functionality
   */
  setupModals() {
    const modals = document.querySelectorAll(".modal")
    const closeButtons = document.querySelectorAll(
      ".close, #cancelAddCheckbook, #closeStatement, #cancelManageCheckbooks, #cancelEditAccount",
    )

    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        modals.forEach((modal) => (modal.style.display = "none"))
      })
    })

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      modals.forEach((modal) => {
        if (e.target === modal) {
          modal.style.display = "none"
        }
      })
    })

    // Add confirmation modal setup to setupModals method
    this.setupTransactionConfirmation()
  }

  /**
   * Setup transaction confirmation
   */
  setupTransactionConfirmation() {
    // Transaction confirmation
    document.getElementById("cancelTransaction").addEventListener("click", () => {
      document.getElementById("transactionConfirmModal").style.display = "none"
      this.pendingTransaction = null
    })

    document.getElementById("confirmTransaction").addEventListener("click", () => {
      if (this.pendingTransaction) {
        this.executePendingTransaction()
      }
      document.getElementById("transactionConfirmModal").style.display = "none"
    })

    // Account deletion confirmation
    document.getElementById("cancelDeleteAccount").addEventListener("click", () => {
      document.getElementById("deleteAccountModal").style.display = "none"
      this.currentDeleteAccountId = null
    })

    document.getElementById("confirmDeleteAccount").addEventListener("click", () => {
      if (this.currentDeleteAccountId) {
        this.executeAccountDeletion()
      }
      document.getElementById("deleteAccountModal").style.display = "none"
    })

    // Wipe data confirmations
    this.setupWipeDataConfirmations()
  }

  setupWipeDataConfirmations() {
    // First confirmation
    document.getElementById("wipeAllDataBtn").addEventListener("click", () => {
      document.getElementById("wipeDataModal1").style.display = "block"
    })

    document.getElementById("cancelWipe1").addEventListener("click", () => {
      document.getElementById("wipeDataModal1").style.display = "none"
    })

    document.getElementById("continueWipe1").addEventListener("click", () => {
      document.getElementById("wipeDataModal1").style.display = "none"
      document.getElementById("wipeDataModal2").style.display = "block"
    })

    // Second confirmation
    document.getElementById("cancelWipe2").addEventListener("click", () => {
      document.getElementById("wipeDataModal2").style.display = "none"
    })

    document.getElementById("continueWipe2").addEventListener("click", () => {
      document.getElementById("wipeDataModal2").style.display = "none"
      document.getElementById("wipeDataModal3").style.display = "block"
    })

    // Final confirmation
    document.getElementById("cancelWipe3").addEventListener("click", () => {
      document.getElementById("wipeDataModal3").style.display = "none"
    })

    document.getElementById("confirmWipe3").addEventListener("click", () => {
      this.wipeAllData()
      document.getElementById("wipeDataModal3").style.display = "none"
    })
  }

  /**
   * Load and save data from/to localStorage
   */
  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error)
      // Clear corrupted data
      localStorage.removeItem(key)
      return null
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error)
      // Handle quota exceeded or other storage errors
      if (error.name === "QuotaExceededError") {
        alert("Storage quota exceeded. Please clear some data.")
      }
      return false
    }
  }

  /**
   * Parse checkbook input (supports ranges and comma-separated)
   */
  parseCheckbooks(input) {
    const checkbooks = []
    const parts = input.split(",").map((part) => part.trim())

    parts.forEach((part) => {
      if (part.includes("-")) {
        // Handle range (e.g., 1001-1010)
        const [start, end] = part.split("-").map((num) => Number.parseInt(num.trim()))
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            checkbooks.push(i.toString())
          }
        }
      } else {
        // Handle single number
        const num = part.trim()
        if (num && !isNaN(num)) {
          checkbooks.push(num)
        }
      }
    })

    return [...new Set(checkbooks)] // Remove duplicates
  }

  /**
   * Generate automatic Account ID in format YYYYMMDDXXX (without dash)
   */
  generateAccountId() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const datePrefix = `${year}${month}${day}`

    // Find all accounts created today
    const todayAccounts = this.accounts.filter((account) => {
      if (!account.accountId) return false
      return account.accountId.startsWith(datePrefix)
    })

    // Calculate next serial number
    let maxSerial = 0
    todayAccounts.forEach((account) => {
      const serial = Number.parseInt(account.accountId.slice(-3))
      if (serial > maxSerial) {
        maxSerial = serial
      }
    })

    const nextSerial = String(maxSerial + 1).padStart(3, "0")
    return `${datePrefix}${nextSerial}`
  }

  /**
   * Generate automatic Loan ID in format LYYYYMMDDXXX
   */
  generateLoanId() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const datePrefix = `L${year}${month}${day}`

    // Find all loans created today
    const todayLoans = this.loans.filter((loan) => {
      if (!loan.loanId) return false
      return loan.loanId.startsWith(datePrefix)
    })

    // Calculate next serial number
    let maxSerial = 0
    todayLoans.forEach((loan) => {
      const serial = Number.parseInt(loan.loanId.slice(-3))
      if (serial > maxSerial) {
        maxSerial = serial
      }
    })

    const nextSerial = String(maxSerial + 1).padStart(3, "0")
    return `${datePrefix}${nextSerial}`
  }

  /**
   * Calculate total bank balance
   */
  getTotalBankBalance() {
    return this.accounts.reduce((sum, acc) => sum + acc.balance, 0)
  }

  /**
   * Search customer by name, Account ID, or checkbook number
   */
  searchCustomer(formType) {
    const searchInput = document.getElementById(`search${formType === "cashIn" ? "CashIn" : "CashOut"}`)
    const searchTerm = searchInput.value.trim().toLowerCase()

    if (!searchTerm) {
      this.showMessage(`${formType}Message`, "Please enter a search term.", "warning")
      return
    }

    // Search in accounts
    const account = this.accounts.find(
      (acc) =>
        acc.name.toLowerCase().includes(searchTerm) ||
        (acc.accountId && acc.accountId.toLowerCase() === searchTerm) ||
        (formType === "cashOut" && acc.checkbooks.some((cb) => cb.toLowerCase() === searchTerm)),
    )

    if (account) {
      this.fillCustomerForm(account, formType)
      this.showMessage(`${formType}Message`, "Customer found and details filled.", "success")
    } else {
      this.showMessage(`${formType}Message`, "Customer not found.", "error")
    }
  }

  /**
   * Search customer for loan operations
   */
  searchLoanCustomer() {
    const searchInput = document.getElementById("searchLoanCustomer")
    const searchTerm = searchInput.value.trim().toLowerCase()

    if (!searchTerm) {
      this.showMessage("loanIssueMessage", "Please enter a search term.", "warning")
      return
    }

    // Check if customer already has an active loan
    const existingLoan = this.loans.find((loan) => {
      const account = this.accounts.find(
        (acc) =>
          acc.name.toLowerCase().includes(searchTerm) || (acc.accountId && acc.accountId.toLowerCase() === searchTerm),
      )
      return account && loan.customerId === account.id && loan.status === "active"
    })

    if (existingLoan) {
      this.showMessage(
        "loanIssueMessage",
        "❌ You have an active loan. Please repay it first before applying again.",
        "error",
      )
      return
    }

    // Search in accounts
    const account = this.accounts.find(
      (acc) =>
        acc.name.toLowerCase().includes(searchTerm) || (acc.accountId && acc.accountId.toLowerCase() === searchTerm),
    )

    if (account) {
      this.fillLoanCustomerForm(account)
      this.updateBankBalance()
      this.showMessage("loanIssueMessage", "Customer found and details filled.", "success")
    } else {
      this.showMessage("loanIssueMessage", "Customer not found.", "error")
    }
  }

  /**
   * Fill loan customer form with account details
   */
  fillLoanCustomerForm(account) {
    document.getElementById("loanCustomerName").value = account.name
    document.getElementById("loanCustomerId").value = account.accountId || "N/A"
    document.getElementById("customerCurrentBalance").value = this.formatCurrency(account.balance)

    this.currentAccount = account
  }

  /**
   * Update bank balance display
   */
  updateBankBalance() {
    const totalBalance = this.getTotalBankBalance()
    const totalLoansIssued = this.loans
      .filter((loan) => loan.status === "active")
      .reduce((sum, loan) => sum + loan.principalAmount, 0)

    const availableCapital = totalBalance - totalLoansIssued
    document.getElementById("bankBalance").value = this.formatCurrency(availableCapital)
  }

  /**
   * Calculate loan details
   */
  calculateLoan() {
    const principal = Number.parseFloat(document.getElementById("loanPrincipal").value) || 0
    const interestRate = Number.parseFloat(document.getElementById("loanInterestRate").value) || 0
    const duration = Number.parseInt(document.getElementById("loanDuration").value) || 0

    if (principal > 0 && interestRate > 0 && duration > 0) {
      // Simple interest calculation
      const totalInterest = (principal * interestRate * duration) / (12 * 100)
      const totalPayable = principal + totalInterest
      const monthlyInstallment = totalPayable / duration

      document.getElementById("monthlyInstallment").textContent = this.formatCurrency(monthlyInstallment)
      document.getElementById("totalInterest").textContent = this.formatCurrency(totalInterest)
      document.getElementById("totalPayable").textContent = this.formatCurrency(totalPayable)
    } else {
      document.getElementById("monthlyInstallment").textContent = "৳0.00"
      document.getElementById("totalInterest").textContent = "৳0.00"
      document.getElementById("totalPayable").textContent = "৳0.00"
    }
  }

  /**
   * Handle loan issue
   */
  handleLoanIssue() {
    if (!this.currentAccount) {
      this.showMessage("loanIssueMessage", "Please search and select a customer first.", "error")
      return
    }

    // Check if customer already has an active loan
    const existingLoan = this.loans.find(
      (loan) => loan.customerId === this.currentAccount.id && loan.status === "active",
    )

    if (existingLoan) {
      this.showMessage(
        "loanIssueMessage",
        "❌ You have an active loan. Please repay it first before applying again.",
        "error",
      )
      return
    }

    const principal = Number.parseFloat(document.getElementById("loanPrincipal").value)
    const interestRate = Number.parseFloat(document.getElementById("loanInterestRate").value)
    const duration = Number.parseInt(document.getElementById("loanDuration").value)

    // Validation
    if (isNaN(principal) || principal < 1000) {
      this.showMessage("loanIssueMessage", "Principal amount must be at least ৳1,000.", "error")
      return
    }

    if (isNaN(interestRate) || interestRate < 1 || interestRate > 50) {
      this.showMessage("loanIssueMessage", "Interest rate must be between 1% and 50%.", "error")
      return
    }

    if (isNaN(duration) || duration < 1 || duration > 360) {
      this.showMessage("loanIssueMessage", "Duration must be between 1 and 360 months.", "error")
      return
    }

    // Check available capital (Bank Balance - Active Loans)
    const totalBankBalance = this.getTotalBankBalance()
    const totalActiveLoans = this.loans
      .filter((loan) => loan.status === "active")
      .reduce((sum, loan) => sum + loan.principalAmount, 0)

    const availableCapital = totalBankBalance - totalActiveLoans

    if (availableCapital < principal) {
      this.showMessage("loanIssueMessage", "Insufficient Bank Available Capital – Unable to Issue Loan.", "error")
      return
    }

    // Calculate loan details
    const totalInterest = (principal * interestRate * duration) / (12 * 100)
    const totalPayable = principal + totalInterest
    const monthlyInstallment = totalPayable / duration

    // Store pending loan and show confirmation
    this.pendingLoan = {
      account: this.currentAccount,
      principal: principal,
      interestRate: interestRate,
      duration: duration,
      totalInterest: totalInterest,
      totalPayable: totalPayable,
      monthlyInstallment: monthlyInstallment,
    }

    this.showLoanConfirmation()
  }

  /**
   * Show loan confirmation modal
   */
  showLoanConfirmation() {
    const modal = document.getElementById("loanConfirmModal")
    const detailsDiv = document.getElementById("loanConfirmDetails")

    detailsDiv.innerHTML = `
      <h4>Loan Details:</h4>
      <p><strong>Customer:</strong> ${this.pendingLoan.account.name}</p>
      <p><strong>Account ID:</strong> ${this.pendingLoan.account.accountId}</p>
      <p><strong>Principal Amount:</strong> ${this.formatCurrency(this.pendingLoan.principal)}</p>
      <p><strong>Interest Rate:</strong> ${this.pendingLoan.interestRate}%</p>
      <p><strong>Duration:</strong> ${this.pendingLoan.duration} months</p>
      <p><strong>Total Payable:</strong> ${this.formatCurrency(this.pendingLoan.totalPayable)}</p>
      <p><strong>Monthly Installment:</strong> ${this.formatCurrency(this.pendingLoan.monthlyInstallment)}</p>
    `

    modal.style.display = "block"
  }

  /**
   * Execute loan issue
   */
  executeLoanIssue() {
    const loanId = this.generateLoanId()

    // Create loan record
    const loan = {
      id: Date.now().toString(),
      loanId: loanId,
      customerId: this.pendingLoan.account.id,
      customerName: this.pendingLoan.account.name,
      customerAccountId: this.pendingLoan.account.accountId,
      principalAmount: this.pendingLoan.principal,
      interestRate: this.pendingLoan.interestRate,
      duration: this.pendingLoan.duration,
      issueDate: new Date().toISOString(),
      monthlyInstallment: this.pendingLoan.monthlyInstallment,
      totalPayable: this.pendingLoan.totalPayable,
      paidAmount: 0,
      remainingAmount: this.pendingLoan.totalPayable,
      status: "active",
    }

    // Add loan amount to customer's account balance (Capital Locking Logic)
    this.pendingLoan.account.balance += this.pendingLoan.principal

    // Save loan and update account
    this.loans.push(loan)
    this.saveToStorage("bankLoans", this.loans)
    this.saveToStorage("bankAccounts", this.accounts)

    // Create transaction record for loan disbursement
    const transaction = {
      id: Date.now().toString() + "_loan",
      accountId: this.pendingLoan.account.id,
      customerName: this.pendingLoan.account.name,
      type: "loan_disbursement",
      amount: this.pendingLoan.principal,
      description: `Loan disbursement - ${loanId}`,
      balanceAfter: this.pendingLoan.account.balance,
      date: new Date().toISOString(),
      loanId: loanId,
    }

    this.transactions.push(transaction)
    this.saveToStorage("bankTransactions", this.transactions)

    // Clear form and show success
    document.getElementById("loanIssueForm").reset()
    this.currentAccount = null
    this.pendingLoan = null

    this.showMessage("loanIssueMessage", `Loan issued successfully! Loan ID: ${loanId}`, "success")
    this.loadDashboard()
    this.loadLoanDashboard()
  }

  /**
   * Search loan for repayment
   */
  searchLoan() {
    const searchInput = document.getElementById("searchLoan")
    const searchTerm = searchInput.value.trim().toLowerCase()

    if (!searchTerm) {
      this.showMessage("loanRepayMessage", "Please enter a search term.", "warning")
      return
    }

    // Search in loans
    const loan = this.loans.find(
      (loan) =>
        loan.loanId.toLowerCase().includes(searchTerm) ||
        loan.customerName.toLowerCase().includes(searchTerm) ||
        (loan.customerAccountId && loan.customerAccountId.toLowerCase() === searchTerm),
    )

    if (loan && loan.status === "active") {
      this.fillLoanRepaymentForm(loan)
      this.showMessage("loanRepayMessage", "Loan found and details filled.", "success")
    } else if (loan && loan.status !== "active") {
      this.showMessage("loanRepayMessage", "This loan is not active for repayment.", "error")
    } else {
      this.showMessage("loanRepayMessage", "Active loan not found.", "error")
    }
  }

  /**
   * Fill loan repayment form
   */
  fillLoanRepaymentForm(loan) {
    const customer = this.accounts.find((acc) => acc.id === loan.customerId)

    // Calculate daily interest for current repayment
    const issueDate = new Date(loan.issueDate)
    const currentDate = new Date()
    const daysPassed = Math.floor((currentDate - issueDate) / (1000 * 60 * 60 * 24))
    const dailyInterest = (loan.principalAmount * loan.interestRate) / (365 * 100)
    const totalInterestAccrued = dailyInterest * daysPassed
    const totalCurrentPayable = loan.principalAmount + totalInterestAccrued

    document.getElementById("repayLoanId").value = loan.loanId
    document.getElementById("repayCustomerName").value = loan.customerName
    document.getElementById("repayPrincipal").value = this.formatCurrency(loan.principalAmount)
    document.getElementById("repayTotalPayable").value = this.formatCurrency(totalCurrentPayable)
    document.getElementById("repayPaidAmount").value = this.formatCurrency(loan.paidAmount)
    document.getElementById("repayRemainingAmount").value = this.formatCurrency(
      Math.max(0, totalCurrentPayable - loan.paidAmount),
    )

    if (customer) {
      document.getElementById("repayCustomerBalance").value = this.formatCurrency(customer.balance)
    }

    this.currentLoan = loan
    this.currentAccount = customer
  }

  /**
   * Handle loan repayment
   */
  handleLoanRepayment() {
    if (!this.currentLoan || !this.currentAccount) {
      this.showMessage("loanRepayMessage", "Please search and select a loan first.", "error")
      return
    }

    const repayAmount = Number.parseFloat(document.getElementById("repayAmount").value)
    const paymentMethod = document.getElementById("repayMethod").value

    // Calculate current payable with daily interest
    const issueDate = new Date(this.currentLoan.issueDate)
    const currentDate = new Date()
    const daysPassed = Math.floor((currentDate - issueDate) / (1000 * 60 * 60 * 24))
    const dailyInterest = (this.currentLoan.principalAmount * this.currentLoan.interestRate) / (365 * 100)
    const totalInterestAccrued = dailyInterest * daysPassed
    const totalCurrentPayable = this.currentLoan.principalAmount + totalInterestAccrued
    const remainingAmount = Math.max(0, totalCurrentPayable - this.currentLoan.paidAmount)

    // Validation
    if (isNaN(repayAmount) || repayAmount <= 0) {
      this.showMessage("loanRepayMessage", "Please enter a valid repayment amount.", "error")
      return
    }

    if (!paymentMethod) {
      this.showMessage("loanRepayMessage", "Please select a payment method.", "error")
      return
    }

    if (repayAmount > remainingAmount) {
      this.showMessage("loanRepayMessage", "Repayment amount cannot exceed remaining loan amount.", "error")
      return
    }

    if (this.currentAccount.balance < repayAmount) {
      this.showMessage("loanRepayMessage", "Insufficient Account Balance to Repay Loan.", "error")
      return
    }

    // Store pending repayment and show confirmation
    this.pendingLoanRepayment = {
      loan: this.currentLoan,
      account: this.currentAccount,
      amount: repayAmount,
      method: paymentMethod,
      remainingAfterPayment: remainingAmount - repayAmount,
      totalCurrentPayable: totalCurrentPayable,
    }

    this.showLoanRepaymentConfirmation()
  }

  /**
   * Show loan repayment confirmation
   */
  showLoanRepaymentConfirmation() {
    const modal = document.getElementById("loanRepayConfirmModal")
    const detailsDiv = document.getElementById("loanRepayConfirmDetails")

    detailsDiv.innerHTML = `
      <h4>Repayment Details:</h4>
      <p><strong>Loan ID:</strong> ${this.pendingLoanRepayment.loan.loanId}</p>
      <p><strong>Customer:</strong> ${this.pendingLoanRepayment.account.name}</p>
      <p><strong>Repayment Amount:</strong> ${this.formatCurrency(this.pendingLoanRepayment.amount)}</p>
      <p><strong>Payment Method:</strong> ${this.pendingLoanRepayment.method}</p>
      <p><strong>Remaining After Payment:</strong> ${this.formatCurrency(this.pendingLoanRepayment.remainingAfterPayment)}</p>
    `

    modal.style.display = "block"
  }

  /**
   * Execute loan repayment
   */
  executeLoanRepayment() {
    // Deduct amount from customer's account
    this.pendingLoanRepayment.account.balance -= this.pendingLoanRepayment.amount

    // Update loan details
    this.pendingLoanRepayment.loan.paidAmount += this.pendingLoanRepayment.amount

    // Check if loan is fully paid
    if (this.pendingLoanRepayment.remainingAfterPayment <= 0) {
      this.pendingLoanRepayment.loan.status = "paid"
      // Return principal to bank capital when loan is fully paid
      this.pendingLoanRepayment.loan.remainingAmount = 0
    } else {
      this.pendingLoanRepayment.loan.remainingAmount = this.pendingLoanRepayment.remainingAfterPayment
    }

    // Create repayment record
    const repayment = {
      id: Date.now().toString(),
      loanId: this.pendingLoanRepayment.loan.loanId,
      customerId: this.pendingLoanRepayment.account.id,
      amount: this.pendingLoanRepayment.amount,
      method: this.pendingLoanRepayment.method,
      date: new Date().toISOString(),
      balanceAfter: this.pendingLoanRepayment.account.balance,
    }

    this.loanRepayments.push(repayment)

    // Create transaction record
    const transaction = {
      id: Date.now().toString() + "_repay",
      accountId: this.pendingLoanRepayment.account.id,
      customerName: this.pendingLoanRepayment.account.name,
      type: "loan_repayment",
      amount: this.pendingLoanRepayment.amount,
      description: `Loan repayment - ${this.pendingLoanRepayment.loan.loanId} (${this.pendingLoanRepayment.method})`,
      balanceAfter: this.pendingLoanRepayment.account.balance,
      date: new Date().toISOString(),
      loanId: this.pendingLoanRepayment.loan.loanId,
    }

    this.transactions.push(transaction)

    // Save all data
    this.saveToStorage("bankLoans", this.loans)
    this.saveToStorage("loanRepayments", this.loanRepayments)
    this.saveToStorage("bankAccounts", this.accounts)
    this.saveToStorage("bankTransactions", this.transactions)

    // Clear form and show success
    document.getElementById("loanRepayForm").reset()
    const statusMessage = this.pendingLoanRepayment.remainingAfterPayment <= 0 ? " - Loan fully paid!" : ""
    this.showMessage("loanRepayMessage", `Repayment processed successfully!${statusMessage}`, "success")

    this.currentLoan = null
    this.currentAccount = null
    this.pendingLoanRepayment = null

    this.loadDashboard()
    this.loadLoanDashboard()
  }

  /**
   * Load loan dashboard
   */
  loadLoanDashboard() {
    // Calculate loan statistics
    const totalLoansIssued = this.loans.reduce((sum, loan) => sum + loan.principalAmount, 0)
    const totalLoansPaid = this.loans.reduce((sum, loan) => sum + loan.paidAmount, 0)
    const totalLoansRemaining = this.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
    const activeLoansCount = this.loans.filter((loan) => loan.status === "active").length

    // Update dashboard stats
    document.getElementById("total-loans-issued").textContent = this.formatCurrency(totalLoansIssued)
    document.getElementById("total-loans-paid").textContent = this.formatCurrency(totalLoansPaid)
    document.getElementById("total-loans-remaining").textContent = this.formatCurrency(totalLoansRemaining)
    document.getElementById("active-loans-count").textContent = activeLoansCount

    // Load loans table
    this.loadLoansTable()
  }

  /**
   * Load loans table
   */
  loadLoansTable() {
    const tbody = document.getElementById("loansTableBody")
    if (!tbody) return

    if (this.loans.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted">No loans found</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = this.loans
      .map((loan) => {
        const statusClass = loan.status === "active" ? "active" : loan.status === "paid" ? "paid" : "overdue"

        return `
          <tr>
            <td><strong>${loan.loanId}</strong></td>
            <td>${loan.customerName}</td>
            <td><strong>${this.formatCurrency(loan.principalAmount)}</strong></td>
            <td><strong>${this.formatCurrency(loan.totalPayable)}</strong></td>
            <td><strong>${this.formatCurrency(loan.paidAmount)}</strong></td>
            <td><strong>${this.formatCurrency(loan.remainingAmount)}</strong></td>
            <td><span class="loan-status ${statusClass}">${loan.status}</span></td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="bankSystem.showLoanStatement('${loan.id}')">
                <i class="fas fa-file-alt"></i> Statement
              </button>
            </td>
          </tr>
        `
      })
      .join("")
  }

  /**
   * Filter loans by status
   */
  filterLoans() {
    const filter = document.getElementById("loanStatusFilter").value
    let filteredLoans = this.loans

    if (filter !== "all") {
      filteredLoans = this.loans.filter((loan) => loan.status === filter)
    }

    const tbody = document.getElementById("loansTableBody")
    if (filteredLoans.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted">No loans found for selected filter</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = filteredLoans
      .map((loan) => {
        const statusClass = loan.status === "active" ? "active" : loan.status === "paid" ? "paid" : "overdue"

        return `
          <tr>
            <td><strong>${loan.loanId}</strong></td>
            <td>${loan.customerName}</td>
            <td><strong>${this.formatCurrency(loan.principalAmount)}</strong></td>
            <td><strong>${this.formatCurrency(loan.totalPayable)}</strong></td>
            <td><strong>${this.formatCurrency(loan.paidAmount)}</strong></td>
            <td><strong>${this.formatCurrency(loan.remainingAmount)}</strong></td>
            <td><span class="loan-status ${statusClass}">${loan.status}</span></td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="bankSystem.showLoanStatement('${loan.id}')">
                <i class="fas fa-file-alt"></i> Statement
              </button>
            </td>
          </tr>
        `
      })
      .join("")
  }

  /**
   * Search loan for statement
   */
  searchLoanForStatement() {
    const searchInput = document.getElementById("searchStatementLoan")
    const searchTerm = searchInput.value.trim().toLowerCase()

    if (!searchTerm) {
      this.showMessage("loanStatementMessage", "Please enter a search term.", "warning")
      return
    }

    // Search in loans
    const loan = this.loans.find(
      (loan) =>
        loan.loanId.toLowerCase().includes(searchTerm) ||
        loan.customerName.toLowerCase().includes(searchTerm) ||
        (loan.customerAccountId && loan.customerAccountId.toLowerCase() === searchTerm),
    )

    if (loan) {
      this.displayLoanStatement(loan)
      this.showMessage("loanStatementMessage", "Loan found and statement generated.", "success")
    } else {
      this.showMessage("loanStatementMessage", "Loan not found.", "error")
      document.getElementById("loanStatementDisplay").style.display = "none"
    }
  }

  /**
   * Display loan statement
   */
  displayLoanStatement(loan) {
    const repayments = this.loanRepayments.filter((repay) => repay.loanId === loan.loanId)

    let repaymentsHtml = ""
    if (repayments.length === 0) {
      repaymentsHtml = `
        <tr>
          <td colspan="4" class="text-center text-muted">No repayments made yet</td>
        </tr>
      `
    } else {
      repaymentsHtml = repayments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(
          (repay) => `
          <tr>
            <td>${new Date(repay.date).toLocaleDateString()}</td>
            <td><strong>${this.formatCurrency(repay.amount)}</strong></td>
            <td>${repay.method}</td>
            <td><strong>${this.formatCurrency(repay.balanceAfter)}</strong></td>
          </tr>
        `,
        )
        .join("")
    }

    const statementContent = `
      <div class="loan-statement-content">
        <div class="statement-header">
          <h2>Loan Statement</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="loan-summary-grid">
          <div class="loan-summary-item">
            <h4>Loan ID</h4>
            <div class="value">${loan.loanId}</div>
          </div>
          <div class="loan-summary-item">
            <h4>Customer</h4>
            <div class="value">${loan.customerName}</div>
          </div>
          <div class="loan-summary-item">
            <h4>Principal Amount</h4>
            <div class="value">${this.formatCurrency(loan.principalAmount)}</div>
          </div>
          <div class="loan-summary-item">
            <h4>Interest Rate</h4>
            <div class="value">${loan.interestRate}%</div>
          </div>
          <div class="loan-summary-item">
            <h4>Duration</h4>
            <div class="value">${loan.duration} months</div>
          </div>
          <div class="loan-summary-item">
            <h4>Total Payable</h4>
            <div class="value">${this.formatCurrency(loan.totalPayable)}</div>
          </div>
          <div class="loan-summary-item">
            <h4>Paid Amount</h4>
            <div class="value">${this.formatCurrency(loan.paidAmount)}</div>
          </div>
          <div class="loan-summary-item">
            <h4>Remaining</h4>
            <div class="value">${this.formatCurrency(loan.remainingAmount)}</div>
          </div>
          <div class="loan-summary-item">
            <h4>Status</h4>
            <div class="value">
              <span class="loan-status ${loan.status}">${loan.status}</span>
            </div>
          </div>
        </div>
        
        <h3>Repayment History</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Account Balance After</th>
              </tr>
            </thead>
            <tbody>
              ${repaymentsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `

    document.getElementById("loanStatementContent").innerHTML = statementContent
    document.getElementById("loanStatementDisplay").style.display = "block"
    this.currentLoan = loan
  }

  /**
   * Download loan statement as PDF
   */
  downloadLoanStatementPDF() {
    if (!this.currentLoan) return

    const loan = this.currentLoan
    const repayments = this.loanRepayments.filter((repay) => repay.loanId === loan.loanId)

    let repaymentsHtml = ""
    if (repayments.length === 0) {
      repaymentsHtml = `
        <tr>
          <td colspan="4" style="text-align: center; color: #64748b;">No repayments made yet</td>
        </tr>
      `
    } else {
      repaymentsHtml = repayments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(
          (repay) => `
          <tr>
            <td>${new Date(repay.date).toLocaleDateString()}</td>
            <td style="font-weight: bold;">${this.formatCurrency(repay.amount)}</td>
            <td>${repay.method}</td>
            <td style="font-weight: bold;">${this.formatCurrency(repay.balanceAfter)}</td>
          </tr>
        `,
        )
        .join("")
    }

    // Create a temporary element with complete statement
    const tempElement = document.createElement("div")
    tempElement.innerHTML = `
      <div style="font-family: 'Inter', Arial, sans-serif; padding: 20px; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">Durgapur City Bank - Loan Statement</h1>
          <p style="color: #64748b;">আপনার বিশ্বস্ত ব্যাংক</p>
          <p style="color: #64748b;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px;">
          <div>
            <div style="margin-bottom: 10px;"><strong>Loan ID:</strong> ${loan.loanId}</div>
            <div style="margin-bottom: 10px;"><strong>Customer:</strong> ${loan.customerName}</div>
            <div style="margin-bottom: 10px;"><strong>Account ID:</strong> ${loan.customerAccountId}</div>
          </div>
          <div>
            <div style="margin-bottom: 10px;"><strong>Principal:</strong> ${this.formatCurrency(loan.principalAmount)}</div>
            <div style="margin-bottom: 10px;"><strong>Interest Rate:</strong> ${loan.interestRate}%</div>
            <div style="margin-bottom: 10px;"><strong>Duration:</strong> ${loan.duration} months</div>
          </div>
          <div>
            <div style="margin-bottom: 10px;"><strong>Total Payable:</strong> ${this.formatCurrency(loan.totalPayable)}</div>
            <div style="margin-bottom: 10px;"><strong>Paid Amount:</strong> ${this.formatCurrency(loan.paidAmount)}</div>
            <div style="margin-bottom: 10px;"><strong>Remaining:</strong> ${this.formatCurrency(loan.remainingAmount)}</div>
          </div>
        </div>
        
        <h3 style="margin-bottom: 15px;">Repayment History</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Date</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Amount</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Method</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Account Balance After</th>
            </tr>
          </thead>
          <tbody>
            ${repaymentsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 12px;">
          <p>This statement contains ${repayments.length} repayment(s)</p>
          <p>Generated by Durgapur City Bank Loan Management System</p>
        </div>
      </div>
    `

    const opt = {
      margin: 0.5,
      filename: `loan_statement_${loan.loanId}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    }

    // Check if html2pdf is available
    if (typeof html2pdf !== "undefined") {
      html2pdf()
        .set(opt)
        .from(tempElement)
        .save()
        .then(() => {
          console.log("Loan statement PDF generated successfully")
        })
        .catch((error) => {
          console.error("Error generating loan statement PDF:", error)
          alert("Error generating PDF. Please try again.")
        })
    } else {
      console.error("html2pdf library not loaded")
      alert("PDF generation library not available. Please ensure the library is loaded.")
    }
  }

  /**
   * Show loan statement by ID
   */
  showLoanStatement(loanId) {
    const loan = this.loans.find((l) => l.id === loanId)
    if (loan) {
      this.displayLoanStatement(loan)
      this.showPage("loan-statement")
      document.getElementById("searchStatementLoan").value = loan.loanId
      document.getElementById("loanStatementDisplay").style.display = "block"
    }
  }

  /**
   * Fill customer form with account details
   */
  fillCustomerForm(account, formType) {
    const prefix = formType === "cashIn" ? "cashIn" : "cashOut"

    document.getElementById(`${prefix}Name`).value = account.name
    document.getElementById(`${prefix}Id`).value = account.accountId || "N/A"

    // For cash out, populate checkbook dropdown
    if (formType === "cashOut") {
      const checkbookSelect = document.getElementById(`${prefix}Checkbook`)
      checkbookSelect.innerHTML = '<option value="">Select Checkbook</option>'

      account.checkbooks.forEach((checkbook) => {
        // Only show unused checkbooks
        if (this.usedCheckNumbers.includes(checkbook)) {
          return // Skip used checkbooks
        }

        const option = document.createElement("option")
        option.value = checkbook
        option.textContent = checkbook
        checkbookSelect.appendChild(option)
      })

      // Update balance display
      document.getElementById("currentBalance").textContent = this.formatCurrency(account.balance)
    }

    this.currentAccount = account
  }

  /**
   * Handle account registration with enhanced validation
   */
  handleRegister() {
    const name = document.getElementById("accountName").value.trim()
    const checkbooksInput = document.getElementById("checkbooks").value.trim()
    const initialBalance = Number.parseFloat(document.getElementById("initialBalance").value)

    let isValid = true

    // Clear previous feedback
    this.clearInputFeedback(document.getElementById("nameError"), document.getElementById("accountName"))
    this.clearInputFeedback(document.getElementById("checkbooksError"), document.getElementById("checkbooks"))
    this.clearInputFeedback(document.getElementById("balanceError"), document.getElementById("initialBalance"))

    // Validate customer name
    if (!this.validateCustomerName(name, "nameError")) {
      isValid = false
    }

    // Validate checkbooks
    if (!this.validateCheckbooks(checkbooksInput, "checkbooksError")) {
      isValid = false
    }

    // Validate initial balance
    if (!this.validateInitialBalance(initialBalance, "balanceError")) {
      isValid = false
    }

    if (!isValid) {
      return
    }

    // Parse checkbooks
    const checkbooks = this.parseCheckbooks(checkbooksInput)

    // Check for duplicate checkbooks across all accounts
    const existingCheckbooks = this.accounts.flatMap((acc) => acc.checkbooks)
    const duplicateCheckbooks = checkbooks.filter((cb) => existingCheckbooks.includes(cb))

    if (duplicateCheckbooks.length > 0) {
      this.setInputFeedback(
        "checkbooksError",
        document.getElementById("checkbooks"),
        `Checkbook numbers already exist: ${duplicateCheckbooks.join(", ")}`,
        "error",
      )
      return
    }

    // Generate Account ID
    const accountId = this.generateAccountId()

    // Create account
    const account = {
      id: Date.now().toString(),
      accountId: accountId,
      name: name,
      balance: initialBalance,
      checkbooks: checkbooks,
      createdDate: new Date().toISOString(),
    }

    // Add to accounts array
    this.accounts.push(account)

    // Create initial transaction if balance > 0
    if (initialBalance > 0) {
      const transaction = {
        id: Date.now().toString() + "_initial",
        accountId: account.id,
        customerName: name,
        type: "initial_deposit",
        amount: initialBalance,
        description: "Initial account opening deposit",
        balanceAfter: initialBalance,
        date: new Date().toISOString(),
      }
      this.transactions.push(transaction)
      this.saveToStorage("bankTransactions", this.transactions)
    }

    // Save to localStorage
    this.saveToStorage("bankAccounts", this.accounts)

    // Clear form and show success
    document.getElementById("registerForm").reset()
    this.showMessage("registerMessage", `Account created successfully! Account ID: ${accountId}`, "success")

    // Update dashboard
    this.loadDashboard()
  }

  /**
   * Validate customer name
   */
  validateCustomerName(name, errorElementId) {
    if (!name) {
      this.setInputFeedback(
        errorElementId,
        document.getElementById("accountName"),
        "Customer name is required.",
        "error",
      )
      return false
    }

    if (name.length < 2) {
      this.setInputFeedback(
        errorElementId,
        document.getElementById("accountName"),
        "Name must be at least 2 characters long.",
        "error",
      )
      return false
    }

    if (name.length > 50) {
      this.setInputFeedback(
        errorElementId,
        document.getElementById("accountName"),
        "Name must not exceed 50 characters.",
        "error",
      )
      return false
    }

    // Check for duplicate names
    const existingAccount = this.accounts.find((acc) => acc.name.toLowerCase() === name.toLowerCase())
    if (existingAccount) {
      this.setInputFeedback(
        errorElementId,
        document.getElementById("accountName"),
        "Customer with this name already exists.",
        "error",
      )
      return false
    }

    this.setInputFeedback(errorElementId, document.getElementById("accountName"), "Valid customer name.", "success")
    return true
  }

  /**
   * Validate checkbooks
   */
  validateCheckbooks(checkbooksInput, errorElementId) {
    if (!checkbooksInput) {
      this.setInputFeedback(
        errorElementId,
        document.getElementById("checkbooks"),
        "Checkbook numbers are required.",
        "error",
      )
      return false
    }

    try {
      const checkbooks = this.parseCheckbooks(checkbooksInput)

      if (checkbooks.length === 0) {
        this.setInputFeedback(
          errorElementId,
          document.getElementById("checkbooks"),
          "Please enter valid checkbook numbers.",
          "error",
        )
        return false
      }

      if (checkbooks.length > 50) {
        this.setInputFeedback(
          errorElementId,
          document.getElementById("checkbooks"),
          "Maximum 50 checkbook numbers allowed.",
          "error",
        )
        return false
      }

      this.setInputFeedback(
        errorElementId,
        document.getElementById("checkbooks"),
        `${checkbooks.length} checkbook(s) will be assigned.`,
        "success",
      )
      return true
    } catch (error) {
      this.setInputFeedback(
        errorElementId,
        document.getElementById("checkbooks"),
        "Invalid checkbook format. Use ranges (1001-1010) or comma-separated numbers.",
        "error",
      )
      return false
    }
  }

  /**
   * Validate initial balance
   */
  validateInitialBalance(balance, errorElementId) {
    if (isNaN(balance) || balance < 0) {
      this.setInputFeedback(
        errorElementId,
        document.getElementById("initialBalance"),
        "Please enter a valid balance amount.",
        "error",
      )
      return false
    }

    if (balance > 999999999) {
      this.setInputFeedback(
        errorElementId,
        document.getElementById("initialBalance"),
        "Balance amount is too large.",
        "error",
      )
      return false
    }

    this.setInputFeedback(
      errorElementId,
      document.getElementById("initialBalance"),
      `Initial balance: ${this.formatCurrency(balance)}`,
      "success",
    )
    return true
  }

  /**
   * Set input feedback
   */
  setInputFeedback(errorElementId, inputElement, message, type) {
    const errorElement = document.getElementById(errorElementId)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.className = `input-feedback ${type}`
    }

    if (inputElement) {
      inputElement.classList.remove("error", "success")
      if (type === "error") {
        inputElement.classList.add("error")
      } else if (type === "success") {
        inputElement.classList.add("success")
      }
    }
  }

  /**
   * Clear input feedback
   */
  clearInputFeedback(errorElement, inputElement) {
    if (errorElement) {
      errorElement.textContent = ""
      errorElement.className = "input-feedback"
    }

    if (inputElement) {
      inputElement.classList.remove("error", "success")
    }
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
    // Real-time validation for register form
    document.getElementById("accountName").addEventListener("input", (e) => {
      this.validateCustomerName(e.target.value.trim(), "nameError")
    })

    document.getElementById("checkbooks").addEventListener("input", (e) => {
      this.validateCheckbooks(e.target.value.trim(), "checkbooksError")
    })

    document.getElementById("initialBalance").addEventListener("input", (e) => {
      this.validateInitialBalance(Number.parseFloat(e.target.value), "balanceError")
    })
  }

  /**
   * Handle cash in transaction
   */
  handleCashIn() {
    if (!this.currentAccount) {
      this.showMessage("cashInMessage", "Please search and select a customer first.", "error")
      return
    }

    const amount = Number.parseFloat(document.getElementById("cashInAmount").value)
    const description = document.getElementById("cashInDescription").value.trim() || "Cash deposit"

    if (isNaN(amount) || amount <= 0) {
      this.showMessage("cashInMessage", "Please enter a valid amount.", "error")
      return
    }

    if (amount > 999999999) {
      this.showMessage("cashInMessage", "Amount is too large.", "error")
      return
    }

    // Store pending transaction and show confirmation
    this.pendingTransaction = {
      type: "cash_in",
      account: this.currentAccount,
      amount: amount,
      description: description,
    }

    this.showTransactionConfirmation()
  }

  /**
   * Handle cash out transaction
   */
  handleCashOut() {
    if (!this.currentAccount) {
      this.showMessage("cashOutMessage", "Please search and select a customer first.", "error")
      return
    }

    const amount = Number.parseFloat(document.getElementById("cashOutAmount").value)
    const checkbookNumber = document.getElementById("cashOutCheckbook").value

    if (isNaN(amount) || amount <= 0) {
      this.showMessage("cashOutMessage", "Please enter a valid amount.", "error")
      return
    }

    if (!checkbookNumber) {
      this.showMessage("cashOutMessage", "Please select a checkbook number.", "error")
      return
    }

    if (amount > this.currentAccount.balance) {
      this.showMessage("cashOutMessage", "Insufficient balance.", "error")
      return
    }

    if (this.usedCheckNumbers.includes(checkbookNumber)) {
      this.showMessage("cashOutMessage", "This checkbook number has already been used.", "error")
      return
    }

    // Store pending transaction and show confirmation
    this.pendingTransaction = {
      type: "cash_out",
      account: this.currentAccount,
      amount: amount,
      checkbookNumber: checkbookNumber,
      description: `Cash withdrawal using checkbook ${checkbookNumber}`,
    }

    this.showTransactionConfirmation()
  }

  /**
   * Show transaction confirmation modal
   */
  showTransactionConfirmation() {
    const modal = document.getElementById("transactionConfirmModal")
    const confirmText = document.getElementById("transactionConfirmText")
    const detailsDiv = document.getElementById("transactionDetails")

    const transaction = this.pendingTransaction
    const actionText = transaction.type === "cash_in" ? "deposit" : "withdraw"
    const balanceAfter =
      transaction.type === "cash_in"
        ? transaction.account.balance + transaction.amount
        : transaction.account.balance - transaction.amount

    confirmText.textContent = `Are you sure you want to ${actionText} ${this.formatCurrency(transaction.amount)}?`

    let detailsHtml = `
      <h4>Transaction Details:</h4>
      <p><strong>Customer:</strong> ${transaction.account.name}</p>
      <p><strong>Account ID:</strong> ${transaction.account.accountId}</p>
      <p><strong>Current Balance:</strong> ${this.formatCurrency(transaction.account.balance)}</p>
      <p><strong>Transaction Amount:</strong> ${this.formatCurrency(transaction.amount)}</p>
      <p><strong>Balance After:</strong> ${this.formatCurrency(balanceAfter)}</p>
    `

    if (transaction.type === "cash_out") {
      detailsHtml += `<p><strong>Checkbook Number:</strong> ${transaction.checkbookNumber}</p>`
    }

    detailsDiv.innerHTML = detailsHtml
    modal.style.display = "block"
  }

  /**
   * Execute pending transaction
   */
  executePendingTransaction() {
    const transaction = this.pendingTransaction

    if (transaction.type === "cash_in") {
      // Add amount to balance
      transaction.account.balance += transaction.amount

      // Create transaction record
      const transactionRecord = {
        id: Date.now().toString(),
        accountId: transaction.account.id,
        customerName: transaction.account.name,
        type: "cash_in",
        amount: transaction.amount,
        description: transaction.description,
        balanceAfter: transaction.account.balance,
        date: new Date().toISOString(),
      }

      this.transactions.push(transactionRecord)
      this.showMessage("cashInMessage", "Cash deposit successful!", "success")
      document.getElementById("cashInForm").reset()
    } else if (transaction.type === "cash_out") {
      // Deduct amount from balance
      transaction.account.balance -= transaction.amount

      // Mark checkbook as used
      this.usedCheckNumbers.push(transaction.checkbookNumber)

      // Create transaction record
      const transactionRecord = {
        id: Date.now().toString(),
        accountId: transaction.account.id,
        customerName: transaction.account.name,
        type: "cash_out",
        amount: transaction.amount,
        description: transaction.description,
        balanceAfter: transaction.account.balance,
        date: new Date().toISOString(),
        checkbookNumber: transaction.checkbookNumber,
      }

      this.transactions.push(transactionRecord)
      this.showMessage("cashOutMessage", "Cash withdrawal successful!", "success")
      document.getElementById("cashOutForm").reset()

      // Save used checkbook numbers
      this.saveToStorage("usedCheckNumbers", this.usedCheckNumbers)
    }

    // Save updated data
    this.saveToStorage("bankAccounts", this.accounts)
    this.saveToStorage("bankTransactions", this.transactions)

    // Clear current account and pending transaction
    this.currentAccount = null
    this.pendingTransaction = null

    // Update dashboard
    this.loadDashboard()
  }

  /**
   * Load dashboard data
   */
  loadDashboard() {
    // Calculate totals
    const totalCashIn = this.transactions
      .filter((t) => t.type === "cash_in" || t.type === "initial_deposit" || t.type === "loan_disbursement")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalCashOut = this.transactions
      .filter((t) => t.type === "cash_out" || t.type === "loan_repayment")
      .reduce((sum, t) => sum + t.amount, 0)

    const currentBalance = this.getTotalBankBalance()
    const totalCustomers = this.accounts.length

    // Update dashboard stats
    document.getElementById("total-cash-in").textContent = this.formatCurrency(totalCashIn)
    document.getElementById("total-cash-out").textContent = this.formatCurrency(totalCashOut)
    document.getElementById("current-balance").textContent = this.formatCurrency(currentBalance)
    document.getElementById("total-customers").textContent = totalCustomers

    // Load today's activity
    this.loadTodaysActivity()

    // Load account summary
    this.loadAccountSummary()
  }

  /**
   * Load today's activity
   */
  loadTodaysActivity() {
    const today = new Date().toDateString()
    const todayTransactions = this.transactions.filter((t) => new Date(t.date).toDateString() === today)

    const todayDeposits = todayTransactions
      .filter((t) => t.type === "cash_in" || t.type === "initial_deposit" || t.type === "loan_disbursement")
      .reduce((sum, t) => sum + t.amount, 0)

    const todayWithdrawals = todayTransactions
      .filter((t) => t.type === "cash_out" || t.type === "loan_repayment")
      .reduce((sum, t) => sum + t.amount, 0)

    const todayTransactionCount = todayTransactions.length

    document.getElementById("today-deposits").textContent = this.formatCurrency(todayDeposits)
    document.getElementById("today-withdrawals").textContent = this.formatCurrency(todayWithdrawals)
    document.getElementById("today-transactions").textContent = todayTransactionCount
  }

  /**
   * Load account summary for dashboard
   */
  loadAccountSummary() {
    const tbody = document.getElementById("accountSummaryBody")
    if (!tbody) return

    if (this.accounts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">No accounts available</td>
        </tr>
      `
      return
    }

    // Show recent accounts (last 5)
    const recentAccounts = this.accounts.slice(-5).reverse()

    tbody.innerHTML = recentAccounts
      .map((account) => {
        const status = account.balance > 1000 ? "active" : account.balance > 0 ? "low-balance" : "inactive"
        const statusText = account.balance > 1000 ? "Active" : account.balance > 0 ? "Low Balance" : "Inactive"

        // Get last transaction date
        const lastTransaction = this.transactions
          .filter((t) => t.accountId === account.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0]

        const lastActivity = lastTransaction
          ? new Date(lastTransaction.date).toLocaleDateString()
          : new Date(account.createdDate).toLocaleDateString()

        return `
          <tr>
            <td>
              <div>
                <strong>${account.name}</strong><br>
                <small class="text-muted">ID: ${account.accountId}</small>
              </div>
            </td>
            <td><strong>${this.formatCurrency(account.balance)}</strong></td>
            <td><span class="status-badge ${status}">${statusText}</span></td>
            <td>${lastActivity}</td>
          </tr>
        `
      })
      .join("")
  }

  /**
   * Load customer table
   */
  loadCustomerTable() {
    const tbody = document.getElementById("customerTableBody")
    if (!tbody) return

    if (this.accounts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">No customers found</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = this.accounts
      .map((account) => {
        const checkbookTags = account.checkbooks
          .map((cb) => {
            const isUsed = this.usedCheckNumbers.includes(cb)
            return `<span class="checkbook-tag ${isUsed ? "used" : ""}">${cb}</span>`
          })
          .join("")

        return `
          <tr class="customer-row">
            <td><strong>${account.name}</strong></td>
            <td><strong>${account.accountId}</strong></td>
            <td><strong>${this.formatCurrency(account.balance)}</strong></td>
            <td>
              <div class="checkbook-tags">
                ${checkbookTags}
              </div>
            </td>
            <td class="actions-cell">
              <button class="customer-details-btn" onclick="bankSystem.toggleCustomerDetails(this, '${account.id}')">
                <i class="fas fa-ellipsis-v"></i>
                Actions
              </button>
              <div class="customer-details-dropdown">
                <button class="dropdown-item" onclick="bankSystem.showStatement('${account.id}')">
                  <i class="fas fa-file-alt"></i>
                  View Statement
                </button>
                <button class="dropdown-item" onclick="bankSystem.showEditAccount('${account.id}')">
                  <i class="fas fa-edit"></i>
                  Edit Account
                </button>
                <button class="dropdown-item" onclick="bankSystem.showAddCheckbook('${account.id}')">
                  <i class="fas fa-plus"></i>
                  Add Checkbooks
                </button>
                <button class="dropdown-item" onclick="bankSystem.showManageCheckbooks('${account.id}')">
                  <i class="fas fa-cog"></i>
                  Manage Checkbooks
                </button>
                <button class="dropdown-item danger" onclick="bankSystem.showDeleteAccount('${account.id}')">
                  <i class="fas fa-trash"></i>
                  Delete Account
                </button>
              </div>
            </td>
          </tr>
        `
      })
      .join("")
  }

  /**
   * Toggle customer details dropdown
   */
  toggleCustomerDetails(button, accountId) {
    // Close all other dropdowns
    document.querySelectorAll(".customer-details-dropdown").forEach((dropdown) => {
      if (dropdown !== button.nextElementSibling) {
        dropdown.classList.remove("show")
      }
    })

    document.querySelectorAll(".customer-details-btn").forEach((btn) => {
      if (btn !== button) {
        btn.classList.remove("active")
      }
    })

    // Toggle current dropdown
    const dropdown = button.nextElementSibling
    dropdown.classList.toggle("show")
    button.classList.toggle("active")
  }

  /**
   * Show edit account modal
   */
  showEditAccount(accountId) {
    const account = this.accounts.find((acc) => acc.id === accountId)
    if (!account) return

    document.getElementById("editAccountName").value = account.name
    document.getElementById("editAccountId").value = account.accountId
    document.getElementById("editAccountModal").style.display = "block"

    this.currentEditAccount = account
    this.closeAllDropdowns()
  }

  /**
   * Handle edit account
   */
  handleEditAccount() {
    if (!this.currentEditAccount) return

    const newName = document.getElementById("editAccountName").value.trim()

    // Validate name
    if (!newName) {
      this.setInputFeedback("editNameError", document.getElementById("editAccountName"), "Name is required.", "error")
      return
    }

    if (newName.length < 2) {
      this.setInputFeedback(
        "editNameError",
        document.getElementById("editAccountName"),
        "Name must be at least 2 characters.",
        "error",
      )
      return
    }

    // Check for duplicate names (excluding current account)
    const existingAccount = this.accounts.find(
      (acc) => acc.id !== this.currentEditAccount.id && acc.name.toLowerCase() === newName.toLowerCase(),
    )

    if (existingAccount) {
      this.setInputFeedback(
        "editNameError",
        document.getElementById("editAccountName"),
        "Customer with this name already exists.",
        "error",
      )
      return
    }

    // Update account name
    this.currentEditAccount.name = newName

    // Update all related transactions
    this.transactions.forEach((transaction) => {
      if (transaction.accountId === this.currentEditAccount.id) {
        transaction.customerName = newName
      }
    })

    // Update all related loans
    this.loans.forEach((loan) => {
      if (loan.customerId === this.currentEditAccount.id) {
        loan.customerName = newName
      }
    })

    // Save data
    this.saveToStorage("bankAccounts", this.accounts)
    this.saveToStorage("bankTransactions", this.transactions)
    this.saveToStorage("bankLoans", this.loans)

    // Close modal and refresh
    document.getElementById("editAccountModal").style.display = "none"
    this.currentEditAccount = null
    this.loadCustomerTable()
    this.loadDashboard()

    this.showMessage("customerMessage", "Account updated successfully!", "success")
  }

  /**
   * Close all dropdowns
   */
  closeAllDropdowns() {
    document.querySelectorAll(".customer-details-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("show")
    })
    document.querySelectorAll(".customer-details-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
  }

  /**
   * Show add checkbook modal
   */
  showAddCheckbook(accountId) {
    const account = this.accounts.find((acc) => acc.id === accountId)
    if (!account) return

    document.getElementById("addCheckbookModal").style.display = "block"
    this.currentManageAccount = account
    this.closeAllDropdowns()
  }

  /**
   * Handle add checkbook
   */
  handleAddCheckbook() {
    if (!this.currentManageAccount) return

    const checkbooksInput = document.getElementById("newCheckbooks").value.trim()

    if (!checkbooksInput) {
      alert("Please enter checkbook numbers.")
      return
    }

    try {
      const newCheckbooks = this.parseCheckbooks(checkbooksInput)

      if (newCheckbooks.length === 0) {
        alert("Please enter valid checkbook numbers.")
        return
      }

      // Check for duplicates across all accounts
      const allExistingCheckbooks = this.accounts.flatMap((acc) => acc.checkbooks)
      const duplicates = newCheckbooks.filter((cb) => allExistingCheckbooks.includes(cb))

      if (duplicates.length > 0) {
        alert(`These checkbook numbers already exist: ${duplicates.join(", ")}`)
        return
      }

      // Add new checkbooks to account
      this.currentManageAccount.checkbooks.push(...newCheckbooks)

      // Save data
      this.saveToStorage("bankAccounts", this.accounts)

      // Close modal and refresh
      document.getElementById("addCheckbookModal").style.display = "none"
      document.getElementById("addCheckbookForm").reset()
      this.currentManageAccount = null
      this.loadCustomerTable()

      this.showMessage("customerMessage", `${newCheckbooks.length} checkbook(s) added successfully!`, "success")
    } catch (error) {
      alert("Invalid checkbook format. Use ranges (1001-1010) or comma-separated numbers.")
    }
  }

  /**
   * Show manage checkbooks modal
   */
  showManageCheckbooks(accountId) {
    const account = this.accounts.find((acc) => acc.id === accountId)
    if (!account) return

    const checkbooksList = document.getElementById("checkbooksList")
    checkbooksList.innerHTML = account.checkbooks
      .map((checkbook) => {
        const isUsed = this.usedCheckNumbers.includes(checkbook)
        const statusClass = isUsed ? "used" : "available"
        const statusText = isUsed ? "Used" : "Available"

        return `
          <div class="checkbook-item">
            <div>
              <span class="checkbook-number">${checkbook}</span>
            </div>
            <div class="checkbook-actions">
              <span class="checkbook-status ${statusClass}">${statusText}</span>
              ${
                !isUsed
                  ? `<button class="btn btn-xs btn-danger" onclick="bankSystem.removeCheckbook('${accountId}', '${checkbook}')">
                       <i class="fas fa-trash"></i>
                     </button>`
                  : ""
              }
            </div>
          </div>
        `
      })
      .join("")

    document.getElementById("manageCheckbooksModal").style.display = "block"
    this.currentManageAccount = account
    this.closeAllDropdowns()
  }

  /**
   * Remove checkbook
   */
  removeCheckbook(accountId, checkbookNumber) {
    const account = this.accounts.find((acc) => acc.id === accountId)
    if (!account) return

    // Check if checkbook is used
    if (this.usedCheckNumbers.includes(checkbookNumber)) {
      alert("Cannot remove used checkbook.")
      return
    }

    if (confirm(`Are you sure you want to remove checkbook ${checkbookNumber}?`)) {
      // Remove checkbook from account
      account.checkbooks = account.checkbooks.filter((cb) => cb !== checkbookNumber)

      // Save data
      this.saveToStorage("bankAccounts", this.accounts)

      // Refresh modal content
      this.showManageCheckbooks(accountId)
      this.loadCustomerTable()

      this.showMessage("customerMessage", `Checkbook ${checkbookNumber} removed successfully!`, "success")
    }
  }

  /**
   * Show delete account confirmation
   */
  showDeleteAccount(accountId) {
    const account = this.accounts.find((acc) => acc.id === accountId)
    if (!account) return

    const detailsDiv = document.getElementById("deleteAccountDetails")
    detailsDiv.innerHTML = `
      <h4>Account to be deleted:</h4>
      <p><strong>Name:</strong> ${account.name}</p>
      <p><strong>Account ID:</strong> ${account.accountId}</p>
      <p><strong>Balance:</strong> ${this.formatCurrency(account.balance)}</p>
      <p><strong>Checkbooks:</strong> ${account.checkbooks.length}</p>
    `

    document.getElementById("deleteAccountModal").style.display = "block"
    this.currentDeleteAccountId = accountId
    this.closeAllDropdowns()
  }

  /**
   * Execute account deletion
   */
  executeAccountDeletion() {
    const accountId = this.currentDeleteAccountId
    const account = this.accounts.find((acc) => acc.id === accountId)

    if (!account) return

    // Check if account has active loans
    const activeLoans = this.loans.filter((loan) => loan.customerId === accountId && loan.status === "active")
    if (activeLoans.length > 0) {
      alert("Cannot delete account with active loans. Please settle all loans first.")
      return
    }

    // Remove account
    this.accounts = this.accounts.filter((acc) => acc.id !== accountId)

    // Remove account's checkbooks from used list
    account.checkbooks.forEach((checkbook) => {
      const index = this.usedCheckNumbers.indexOf(checkbook)
      if (index > -1) {
        this.usedCheckNumbers.splice(index, 1)
      }
    })

    // Keep transactions for audit trail but mark them
    this.transactions.forEach((transaction) => {
      if (transaction.accountId === accountId) {
        transaction.accountDeleted = true
      }
    })

    // Save data
    this.saveToStorage("bankAccounts", this.accounts)
    this.saveToStorage("usedCheckNumbers", this.usedCheckNumbers)
    this.saveToStorage("bankTransactions", this.transactions)

    // Refresh UI
    this.loadCustomerTable()
    this.loadDashboard()
    this.currentDeleteAccountId = null

    this.showMessage("customerMessage", "Account deleted successfully!", "success")
  }

  /**
   * Show account statement
   */
  showStatement(accountId) {
    const account = this.accounts.find((acc) => acc.id === accountId)
    if (!account) return

    this.currentStatementAccount = account
    this.currentStatementPage = 1
    this.generateStatement()
    document.getElementById("statementModal").style.display = "block"
    this.closeAllDropdowns()
  }

  /**
   * Generate account statement
   */
  generateStatement() {
    if (!this.currentStatementAccount) return

    const account = this.currentStatementAccount
    const accountTransactions = this.transactions
      .filter((t) => t.accountId === account.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    // Pagination
    const totalTransactions = accountTransactions.length
    const totalPages = Math.ceil(totalTransactions / this.transactionsPerPage)
    const startIndex = (this.currentStatementPage - 1) * this.transactionsPerPage
    const endIndex = startIndex + this.transactionsPerPage
    const pageTransactions = accountTransactions.slice(startIndex, endIndex)

    let transactionsHtml = ""
    if (pageTransactions.length === 0) {
      transactionsHtml = `
        <tr>
          <td colspan="5" class="text-center text-muted">No transactions found</td>
        </tr>
      `
    } else {
      transactionsHtml = pageTransactions
        .map((transaction) => {
          const typeIcon = this.getTransactionIcon(transaction.type)
          const typeText = this.getTransactionTypeText(transaction.type)

          return `
            <tr>
              <td>${new Date(transaction.date).toLocaleDateString()}</td>
              <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <i class="${typeIcon}"></i>
                  ${typeText}
                </div>
              </td>
              <td><strong>${this.formatCurrency(transaction.amount)}</strong></td>
              <td>${transaction.description}</td>
              <td><strong>${this.formatCurrency(transaction.balanceAfter)}</strong></td>
            </tr>
          `
        })
        .join("")
    }

    const statementContent = `
      <div class="statement-header">
        <h2>Account Statement</h2>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="statement-info">
        <div>
          <div class="info-row">
            <span class="info-label">Customer Name:</span>
            <span class="info-value">${account.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Account ID:</span>
            <span class="info-value">${account.accountId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Current Balance:</span>
            <span class="info-value">${this.formatCurrency(account.balance)}</span>
          </div>
        </div>
        <div>
          <div class="info-row">
            <span class="info-label">Total Checkbooks:</span>
            <span class="info-value">${account.checkbooks.length}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Used Checkbooks:</span>
            <span class="info-value">${account.checkbooks.filter((cb) => this.usedCheckNumbers.includes(cb)).length}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Account Created:</span>
            <span class="info-value">${new Date(account.createdDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <h3>Transaction History</h3>
      <div class="statement-transactions">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Balance After</th>
            </tr>
          </thead>
          <tbody>
            ${transactionsHtml}
          </tbody>
        </table>
      </div>
      
      ${
        totalPages > 1
          ? `
        <div class="statement-pagination">
          <button class="pagination-btn" onclick="bankSystem.changeStatementPage(${this.currentStatementPage - 1})" ${this.currentStatementPage === 1 ? "disabled" : ""}>
            <i class="fas fa-chevron-left"></i> Previous
          </button>
          <span class="pagination-info">Page ${this.currentStatementPage} of ${totalPages}</span>
          <button class="pagination-btn" onclick="bankSystem.changeStatementPage(${this.currentStatementPage + 1})" ${this.currentStatementPage === totalPages ? "disabled" : ""}>
            Next <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      `
          : ""
      }
    `

    document.getElementById("statementContent").innerHTML = statementContent
  }

  /**
   * Change statement page
   */
  changeStatementPage(newPage) {
    if (!this.currentStatementAccount) return

    const accountTransactions = this.transactions.filter((t) => t.accountId === this.currentStatementAccount.id)
    const totalPages = Math.ceil(accountTransactions.length / this.transactionsPerPage)

    if (newPage >= 1 && newPage <= totalPages) {
      this.currentStatementPage = newPage
      this.generateStatement()
    }
  }

  /**
   * Get transaction icon
   */
  getTransactionIcon(type) {
    const icons = {
      cash_in: "fas fa-arrow-down text-success",
      cash_out: "fas fa-arrow-up text-danger",
      initial_deposit: "fas fa-plus-circle text-info",
      loan_disbursement: "fas fa-hand-holding-usd text-warning",
      loan_repayment: "fas fa-credit-card text-primary",
    }
    return icons[type] || "fas fa-exchange-alt"
  }

  /**
   * Get transaction type text
   */
  getTransactionTypeText(type) {
    const types = {
      cash_in: "Cash In",
      cash_out: "Cash Out",
      initial_deposit: "Initial Deposit",
      loan_disbursement: "Loan Disbursement",
      loan_repayment: "Loan Repayment",
    }
    return types[type] || "Transaction"
  }

  /**
   * Download statement as PDF
   */
  downloadStatementPDF() {
    if (!this.currentStatementAccount) return

    const account = this.currentStatementAccount
    const accountTransactions = this.transactions
      .filter((t) => t.accountId === account.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    let transactionsHtml = ""
    if (accountTransactions.length === 0) {
      transactionsHtml = `
        <tr>
          <td colspan="5" style="text-align: center; color: #64748b;">No transactions found</td>
        </tr>
      `
    } else {
      transactionsHtml = accountTransactions
        .map(
          (transaction) => `
          <tr>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${this.getTransactionTypeText(transaction.type)}</td>
            <td style="font-weight: bold;">${this.formatCurrency(transaction.amount)}</td>
            <td>${transaction.description}</td>
            <td style="font-weight: bold;">${this.formatCurrency(transaction.balanceAfter)}</td>
          </tr>
        `,
        )
        .join("")
    }

    // Create a temporary element with complete statement
    const tempElement = document.createElement("div")
    tempElement.innerHTML = `
      <div style="font-family: 'Inter', Arial, sans-serif; padding: 20px; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">Durgapur City Bank - Account Statement</h1>
          <p style="color: #64748b;">আপনার বিশ্বস্ত ব্যাংক</p>
          <p style="color: #64748b;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px;">
          <div>
            <div style="margin-bottom: 10px;"><strong>Customer Name:</strong> ${account.name}</div>
            <div style="margin-bottom: 10px;"><strong>Account ID:</strong> ${account.accountId}</div>
            <div style="margin-bottom: 10px;"><strong>Current Balance:</strong> ${this.formatCurrency(account.balance)}</div>
          </div>
          <div>
            <div style="margin-bottom: 10px;"><strong>Total Checkbooks:</strong> ${account.checkbooks.length}</div>
            <div style="margin-bottom: 10px;"><strong>Used Checkbooks:</strong> ${account.checkbooks.filter((cb) => this.usedCheckNumbers.includes(cb)).length}</div>
            <div style="margin-bottom: 10px;"><strong>Account Created:</strong> ${new Date(account.createdDate).toLocaleDateString()}</div>
          </div>
        </div>
        
        <h3 style="margin-bottom: 15px;">Transaction History</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Date</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Type</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Amount</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Description</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">Balance After</th>
            </tr>
          </thead>
          <tbody>
            ${transactionsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 12px;">
          <p>This statement contains ${accountTransactions.length} transaction(s)</p>
          <p>Generated by Durgapur City Bank Management System</p>
        </div>
      </div>
    `

    const opt = {
      margin: 0.5,
      filename: `account_statement_${account.accountId}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    }

    // Check if html2pdf is available
    if (typeof html2pdf !== "undefined") {
      html2pdf()
        .set(opt)
        .from(tempElement)
        .save()
        .then(() => {
          console.log("Statement PDF generated successfully")
        })
        .catch((error) => {
          console.error("Error generating PDF:", error)
          alert("Error generating PDF. Please try again.")
        })
    } else {
      console.error("html2pdf library not loaded")
      alert("PDF generation library not available. Please ensure the library is loaded.")
    }
  }

  /**
   * Load reports
   */
  loadReports() {
    const fromDate = document.getElementById("dateFrom").value
    const toDate = document.getElementById("dateTo").value

    let filteredTransactions = this.transactions

    if (fromDate) {
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) >= new Date(fromDate))
    }

    if (toDate) {
      const endDate = new Date(toDate)
      endDate.setHours(23, 59, 59, 999) // Include the entire end date
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) <= endDate)
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))

    const tbody = document.getElementById("reportsTableBody")
    if (filteredTransactions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">No transactions found for the selected date range</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = filteredTransactions
      .map((transaction) => {
        const typeIcon = this.getTransactionIcon(transaction.type)
        const typeText = this.getTransactionTypeText(transaction.type)

        return `
          <tr>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td><strong>${transaction.customerName}</strong></td>
            <td>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="${typeIcon}"></i>
                ${typeText}
              </div>
            </td>
            <td><strong>${this.formatCurrency(transaction.amount)}</strong></td>
            <td>${transaction.description}</td>
            <td><strong>${this.formatCurrency(transaction.balanceAfter)}</strong></td>
          </tr>
        `
      })
      .join("")
  }

  /**
   * Wipe all data
   */
  wipeAllData() {
    // Clear all data
    this.accounts = []
    this.transactions = []
    this.usedCheckNumbers = []
    this.loans = []
    this.loanRepayments = []

    // Clear localStorage
    localStorage.removeItem("bankAccounts")
    localStorage.removeItem("bankTransactions")
    localStorage.removeItem("usedCheckNumbers")
    localStorage.removeItem("bankLoans")
    localStorage.removeItem("loanRepayments")

    // Reset current selections
    this.currentAccount = null
    this.currentLoan = null
    this.pendingTransaction = null
    this.pendingLoan = null
    this.pendingLoanRepayment = null

    // Refresh all displays
    this.loadDashboard()
    this.loadCustomerTable()
    this.loadLoanDashboard()

    alert("All data has been permanently deleted!")
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return `৳${Number.parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  /**
   * Show message
   */
  showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId)
    if (messageElement) {
      messageElement.textContent = message
      messageElement.className = `message ${type}`
      messageElement.style.display = "block"

      // Auto-hide success messages after 5 seconds
      if (type === "success") {
        setTimeout(() => {
          messageElement.style.display = "none"
        }, 5000)
      }
    }
  }
}

// Initialize the banking system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.bankSystem = new PersonalBankingSystem()
})

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".actions-cell")) {
    document.querySelectorAll(".customer-details-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("show")
    })
    document.querySelectorAll(".customer-details-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
  }
})
