const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/
const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const regexPhoneVN = /^\d{10}$/

module.exports = {
  regexPassword,
  regexEmail,
  regexPhoneVN
}