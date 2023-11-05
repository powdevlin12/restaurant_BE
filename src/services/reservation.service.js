const { Reservation } = require("../models");

class ReservationService {
  findReservationById = async (reservation_id) => {
    const reservation = await Reservation.findOne({
      where: {
        reservation_id
      }
    })

    return reservation;
  }

  cancelReservation = async (reservation_id) => {
    const reservation = await this.findReservationById(reservation_id);
    const { preFee, schedule } = reservation

    // check hiện tại cách thời gian đã đặt bao nhiêu giờ. Nếu như trên 12 tiếng thì sẽ hoàn lại 50% tiền cọc, nếu trên 4 tiếng dưới 12 tiếng thì sẽ hoàn lại 30% tiền cọc   
    let newReservation = null
    if (preFee !== 0) {
      const refundFee = preFre > 0 ? preFre * 0.5 : 0
      newReservation = await Reservation.update({
        reservation_id
      },
        {
          status: -1,
          refundFee
        })
    } else {
      newReservation = await Reservation.update(
        {
          reservation_id
        },
        {
          status: -1
        }
      )

      return {
        message: 'Cancel reservation successfully',
        isSuccess: true
      }
    }
  }

}

const reservationService = ReservationService();
export default reservationService;