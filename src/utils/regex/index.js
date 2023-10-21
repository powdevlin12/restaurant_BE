const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const regexPhoneVN = /^\d{10}$/

module.exports = {
  regexPassword,
  regexEmail,
  regexPhoneVN
}