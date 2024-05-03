document.querySelector(".modal-modern-header-button").addEventListener("click", () => {
    window.location.replace("/")
})

document.getElementById("two-step-verification-code-input").addEventListener("input", (input) => {
    if (input.target.value.length === 6) {
        document.querySelector(".modal-modern-footer-button").disabled = false
    } else document.querySelector(".modal-modern-footer-button").disabled = true
})