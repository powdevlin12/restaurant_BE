const ERROR_SERVER = "Lỗi từ server"
const ERROR_NOT_FOUND = "Không tìm thấy dữ liệu"
const ERROR_CREATE = "Tạo thất bại, vui lòng thử lại"
const ERROR_UPDATE = "Sửa thất bại, vui lòng thử lại"
const ERROR_DELETE = "Xoá thất bại, vui lòng thử lại"


const VALIDATE_LOGIN_E001 = "Vui lòng nhập email hoặc số điện thoại"
const VALIDATE_LOGIN_E002 = "Email hoặc số điện thoại không đúng định dạng"
const VALIDATE_PASSWORD_E001 = "Vui lòng nhập mật khẩu"
const VALIDATE_PASSWORD_E002 = "Mật khẩu tối thiểu 6 kí tự, có chứa chữ hoa, chữ thường và kí tự số"
const VALIDATE_CONFIRMPASSWORD_E001 = "Vui lòng nhập xác nhận mật khẩu"
const VALIDATE_CONFIRMPASSWORD_E002 = "Mật khẩu và xác nhận mật khẩu không trùng nhau"
const VALIDATE_PEOPLE_E001 = "Vui lòng nhập số người!"
const VALIDATE_PEOPLE_E002 = "Số người >= 0"
const VALIDATE_NUMBER_E001 = "Chỉ được nhập số"
const LOGIN_SUCCESS = "Đăng nhập thành công"
const LOGIN_E001 = "Tài khoản không tồn tại"
const VALIDATE_DATE_E001 = "Không được chọn ngày trong quá khứ"
const VALIDATE_TIME_E001 = "Không được chọn thời gian trong quá khứ"
const MENU_EMPTY_E001 = "Menu của bạn đang trống"
const VALIDATE_EMAIL_E001 = "Vui lòng nhập email"
const VALIDATE_EMAIL_E002 = "Email không đúng định dạng"
const VALIDATE_PHONE_E001 = "Vui lòng nhập số điện thoại"
const VALIDATE_PHONE_E002 = "Số điện thoại chỉ chứa 10 chữ số"
const VALIDATE_USERNAME_E001 = "Vui lòng nhập họ và tên"
const VALIDATE_ADDRESS_E001 = "Vui lòng nhập địa chỉ"
const CONVERSATION_NOT_FOUND = "Chưa có đoạn tin nhắn nào"

module.exports = {
  ERROR_CREATE,
  ERROR_DELETE,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  ERROR_UPDATE,
  LOGIN_E001,
  VALIDATE_ADDRESS_E001,
  VALIDATE_USERNAME_E001,
  VALIDATE_PHONE_E002,
  VALIDATE_PHONE_E001,
  VALIDATE_EMAIL_E002,
  VALIDATE_EMAIL_E001,
  MENU_EMPTY_E001,
  VALIDATE_TIME_E001,
  VALIDATE_DATE_E001,
  LOGIN_SUCCESS,
  VALIDATE_NUMBER_E001,
  VALIDATE_PEOPLE_E002,
  VALIDATE_PEOPLE_E001,
  VALIDATE_CONFIRMPASSWORD_E002,
  VALIDATE_CONFIRMPASSWORD_E001,
  VALIDATE_PASSWORD_E002,
  VALIDATE_PASSWORD_E001,
  VALIDATE_LOGIN_E002,
  VALIDATE_LOGIN_E001,
  CONVERSATION_NOT_FOUND
};