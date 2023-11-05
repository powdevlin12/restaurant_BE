const { Reservation } = require("../models");

class ReservationService {
  findReservationById = async (reservation_id) => {
    const reservation = await Reservation.findOne({
      where: {
        reservationId: reservation_id
      }
    })

    return reservation;
  }

  updateReservation = async (reservationId, dataUpdate) => {
    await Reservation.update(dataUpdate, {
      where: {
        reservationId
      }
    })

    const dataAfterUpdate = await this.findReservationById(reservationId)

    return dataAfterUpdate
  }

  cancelReservation = async (reservation_id, user) => {
    const reservation = await this.findReservationById(reservation_id);
    const { preFee, schedule, status, userId } = reservation

    // check user make reservation
    if (userId !== user.userId) {
      throw new Error("User is not make this reservation")
    }

    if (status === -1) {
      throw new Error("Reservation is cancelled before")
    }

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
      const newReservation = await this.updateReservation(reservation_id, { status: -1 })
      console.log("🚀 ~ file: reservation.service.js:48 ~ ReservationService ~ cancelReservation= ~ newReservation:", newReservation)

      return {
        message: 'Cancel reservation successfully',
        isSuccess: true
      }
    }
  }

}

const reservationService = new ReservationService();
module.exports = {
  reservationService
} 